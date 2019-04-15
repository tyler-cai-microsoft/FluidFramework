import { RoundTrip } from "@prague/client-api";
import {
    IContentMessage,
    IDocumentMessage,
    ISignalMessage,
    ITokenClaims,
} from "@prague/container-definitions";
import {
    LocalNodeFactory,
    LocalOrderer,
    LocalOrderManager,
    NodeManager,
    ReservationManager,
} from "@prague/memory-orderer";
import * as socketStorage from "@prague/routerlicious-socket-storage";
import {
    ICollection,
    IDatabaseManager,
    IOrderer,
    IOrdererConnection,
    IOrdererManager,
    ITenantManager,
    IWebSocket,
    IWebSocketServer,
    MongoDatabaseManager,
    MongoManager,
} from "@prague/services-core";
import {
    TestCollection,
    TestDbFactory,
    TestDocumentStorage,
    TestTaskMessageSender,
    TestTenantManager,
    TestWebSocketServer,
} from "@prague/test-utils";
import * as jwt from "jsonwebtoken";

export interface ITestDeltaConnectionServer {
    webSocketServer: IWebSocketServer;
    databaseManager: IDatabaseManager;

    hasPendingWork(): Promise<boolean>;
}

class TestOrderManager implements IOrdererManager {
    private readonly orderersP = new Array<Promise<IOrderer>>();

    constructor(private orderer: LocalOrderManager) {
    }

    public getOrderer(tenantId: string, documentId: string): Promise<IOrderer> {
        const p = this.orderer.get(tenantId, documentId);
        this.orderersP.push(p);
        return p;
    }

    public async hasPendingWork(): Promise<boolean> {
        return Promise.all(this.orderersP).then((orderers) => {
            for (const orderer of orderers) {
                // We know that it ia LocalOrderer, break the abstraction
                if ((orderer as LocalOrderer).hasPendingWork()) {
                    return true;
                }
            }
            return false;
        });
    }
}

export class TestDeltaConnectionServer implements ITestDeltaConnectionServer {
    public static Create(): ITestDeltaConnectionServer {
        const nodesCollectionName = "nodes";
        const documentsCollectionName = "documents";
        const deltasCollectionName = "deltas";
        const reservationsCollectionName = "reservations";
        const testData: { [key: string]: any[] } = {};

        const webSocketServer = new TestWebSocketServer();
        const testDbFactory = new TestDbFactory(testData);
        const mongoManager = new MongoManager(testDbFactory);
        const testTenantManager = new TestTenantManager();

        const databaseManager = new MongoDatabaseManager(
            mongoManager,
            nodesCollectionName,
            documentsCollectionName,
            deltasCollectionName);

        const testStorage = new TestDocumentStorage(
            databaseManager,
            testTenantManager);

        const nodeManager = new NodeManager(mongoManager, nodesCollectionName);
        const reservationManager = new ReservationManager(
            nodeManager,
            mongoManager,
            reservationsCollectionName);

        const nodeFactory = new LocalNodeFactory(
            "os",
            "http://localhost:4000", // unused placeholder url
            testStorage,
            databaseManager,
            60000,
            () => webSocketServer,
            new TestTaskMessageSender(),
            testTenantManager,
            {},
            16 * 1024);
        const localOrderManager = new LocalOrderManager(nodeFactory, reservationManager);
        const testOrderer = new TestOrderManager(localOrderManager);
        const testCollection = new TestCollection([]);

        register(
            webSocketServer,
            testOrderer,
            testTenantManager,
            testCollection);

        return new TestDeltaConnectionServer(webSocketServer, databaseManager, testOrderer);
    }

    private constructor(
        public webSocketServer: IWebSocketServer,
        public databaseManager: IDatabaseManager,
        private testOrdererManager: TestOrderManager) { }

    public async hasPendingWork(): Promise<boolean> {
        return this.testOrdererManager.hasPendingWork();
    }
}

// Forked from io.ts in alfred, which has service dependencies and cannot run in a browser.
// Further simplifications are likely possible.
// tslint:disable:no-unsafe-any
export function register(
    webSocketServer: IWebSocketServer,
    orderManager: IOrdererManager,
    tenantManager: ITenantManager,
    contentCollection: ICollection<any>) {

    webSocketServer.on("connection", (socket: IWebSocket) => {
        // Map from client IDs on this connection to the object ID and user info.
        const connectionsMap = new Map<string, IOrdererConnection>();
        // Map from client IDs to room.
        const roomMap = new Map<string, string>();

        async function connectDocument(message: socketStorage.IConnect): Promise<socketStorage.IConnected> {

            // Validate token signature and claims
            const token = message.token;
            const claims = jwt.decode(token) as ITokenClaims;
            if (claims.documentId !== message.id || claims.tenantId !== message.tenantId) {
                return Promise.reject("Invalid claims");
            }
            await tenantManager.verifyToken(claims.tenantId, token);

            // And then connect to the orderer
            const orderer = await orderManager.getOrderer(claims.tenantId, claims.documentId);
            const connection = await orderer.connect(socket, message.client);
            connectionsMap.set(connection.clientId, connection);
            roomMap.set(connection.clientId, `${claims.tenantId}/${claims.documentId}`);

            // And return the connection information to the client
            const connectedMessage: socketStorage.IConnected = {
                clientId: connection.clientId,
                existing: connection.existing,
                maxMessageSize: connection.maxMessageSize,
                parentBranch: connection.parentBranch,
            };

            return connectedMessage;
        }

        // todo: remove this handler once clients onboard "connect_document"
        // Note connect is a reserved socket.io word so we use connectDocument to represent the connect request
        socket.on("connectDocument", async (message: socketStorage.IConnect, response) => {
            connectDocument(message).then(
                (connectedMessage) => {
                    response(null, connectedMessage);
                },
                (error) => {
                    response(error, null);
                });
        });

        // Note connect is a reserved socket.io word so we use connect_document to represent the connect request
        socket.on("connect_document", async (message: socketStorage.IConnect) => {
            connectDocument(message).then(
                (connectedMessage) => {
                    socket.emit("connect_document_success", connectedMessage);
                },
                (error) => {
                    socket.emit("connect_document_error", error);
                });
        });

        // Message sent when a new operation is submitted to the router
        socket.on("submitOp", (clientId: string, messages: IDocumentMessage[], response) => {
            // Verify the user has connected on this object id
            if (!connectionsMap.has(clientId)) {
                return response("Invalid client ID", null);
            }

            const connection = connectionsMap.get(clientId);
            for (const message of messages) {
                if (message.type === RoundTrip) {
                    // do nothing
                } else {
                    // need to sanitize message?
                    connection.order(message);
                }
            }

            response(null);
        });

        // Message sent when a new splitted operation is submitted to the router
        socket.on("submitContent", (clientId: string, message: IDocumentMessage, response) => {
            // Verify the user has connected on this object id
            if (!connectionsMap.has(clientId) || !roomMap.has(clientId)) {
                return response("Invalid client ID", null);
            }

            const broadCastMessage: IContentMessage = {
                clientId,
                clientSequenceNumber: message.clientSequenceNumber,
                contents: message.contents,
            };

            const connection = connectionsMap.get(clientId);

            const dbMessage = {
                clientId,
                documentId: connection.documentId,
                op: broadCastMessage,
                tenantId: connection.tenantId,
            };

            contentCollection.insertOne(dbMessage).then(() => {
                socket.broadcastToRoom(roomMap.get(clientId), "op-content", broadCastMessage);
                return response(null);
            }, (error) => {
                if (error.code !== 11000) {
                    return response("Could not write to DB", null);
                }
            });
        });

        // Message sent when a new signal is submitted to the router
        socket.on("submitSignal", (clientId: string, contents: any[], response) => {
            // Verify the user has connected on this object id
            if (!roomMap.has(clientId)) {
                return response("Invalid client ID", null);
            }

            const roomId = roomMap.get(clientId);

            for (const content of contents) {
                const signalMessage: ISignalMessage = {
                    clientId,
                    content,
                };

                socket.emitToRoom(roomId, "signal", signalMessage);
            }

            response(null);
        });

        socket.on("disconnect", () => {
            // Send notification messages for all client IDs in the connection map
            for (const connection of connectionsMap.values()) {
                connection.disconnect();
            }
        });
    });
}
