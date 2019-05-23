import { FlowDocument } from "@chaincode/flow-document";
import { ICommand, KeyCode, randomId, Scheduler, Template, View } from "@prague/flow-util";
import { debug } from "../debug";
import { SearchMenuView } from "../searchmenu";
import { Viewport } from "../viewport";
import * as style from "./index.css";

// tslint:disable-next-line:no-empty-interface
interface IHostConfig {
    scheduler: Scheduler;
    doc: FlowDocument;
}

const template = new Template(
    { tag: "div", props: { className: style.host }, children: [
        { tag: "div", ref: "viewport", props: { type: "text", className: style.viewport }},
        { tag: "div", ref: "search", props: { type: "text", className: style.search }},
    ]});

export class HostView extends View<IHostConfig> {
    private state?: {
        viewport: Viewport;
        searchMenu: SearchMenuView;
        previouslyFocused?: HTMLOrSVGElement;
    };

    protected onAttach(init: Readonly<IHostConfig>) {
        const root = template.clone();

        const viewport = new Viewport();
        viewport.attach(template.get(root, "viewport"), { scheduler: init.scheduler, doc: init.doc });

        const searchMenu = new SearchMenuView();

        const hasSelection = () => {
            const editor = viewport.editor;
            if (editor === undefined) {
                return false;
            }

            const { start, end } = editor.selection;

            return start < end;
        };

        const insertComponent = (type: string) => {
            const position = viewport.editor.cursorPosition;
            init.doc.insertInclusionComponent(position, randomId(), type);
        };

        const toggleSelection = (className: string) => {
            const { start, end } = viewport.editor.selection;
            init.doc.toggleCssClass(start, end, className);
        };

        searchMenu.attach(template.get(root, "search"), {
            commands: [
                { name: "bold", enabled: hasSelection, exec: () => toggleSelection(style.bold) },
                { name: "insert math", enabled: () => true, exec: () => insertComponent("@chaincode/math") },
            ],
            onComplete: this.onComplete,
         });

        this.onDom(root, "keydown", this.onKeyDown);

        this.state = { viewport, searchMenu };

        return root;
    }

    protected onUpdate(): void {
        // do nothing;
    }

    protected onDetach(): void {
        // tslint:disable-next-line:no-this-assignment
        const { state } = this;
        state.viewport.detach();
        state.searchMenu.detach();
        this.state = undefined;
    }

    private readonly onKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.code === KeyCode.space) {
            this.state.previouslyFocused = document.activeElement as unknown as HTMLOrSVGElement;
            this.state.searchMenu.show();
        }
    }

    private readonly onComplete = (command?: ICommand) => {
        if (command) {
            debug(`Execute Command: ${command.name}`);
            command.exec();
        }

        this.state.previouslyFocused.focus();
    }
}
