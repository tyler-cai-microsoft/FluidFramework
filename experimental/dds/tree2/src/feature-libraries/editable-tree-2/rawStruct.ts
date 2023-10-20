/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { SessionSpaceCompressedId } from "@fluidframework/runtime-definitions";
import { FieldKey, TreeNodeSchemaIdentifier } from "../../core";
import { BrandedType, capitalize } from "../../util";
import { ObjectNodeSchema, TreeNodeSchema } from "../typed-schema";
import { EditableTreeEvents } from "../untypedTree";
import { TreeContext } from "./context";
import {
	FlexibleNodeContent,
	ObjectNode,
	ObjectNodeTyped,
	TreeField,
	TreeStatus,
	TypedNode,
	boxedIterator,
} from "./editableTreeTypes";

/**
 * Used to acquire the content of a raw struct
 */
export const nodeContent = Symbol();

/**
 * Creates a node that falsely pretends to satisfy the given schema while wrapping the given node content.
 * Retrieve the node content via {@link nodeContent}.
 *
 * @remarks This is useful for creating "raw" nodes: nodes which capture data about a pending insertion but are not yet inserted.
 * These raw nodes can be then used on the right-hand side of an assignment (via `=`) to the tree.
 * However, their properties and methods should not be inspected (other than `schema` and `type`) since they are not implemented; they will error.
 *
 * @privateRemarks TODO: Generate these from schema, and use them to support `=`.
 */
export function createRawStruct<TSchema extends ObjectNodeSchema>(
	schema: TSchema,
	content: FlexibleNodeContent<[TSchema]>,
): RawStruct<TSchema> & ObjectNodeTyped<TSchema> {
	const node = new RawStruct(schema, content);
	for (const [key] of schema.objectNodeFields) {
		Object.defineProperty(node, key, {
			get: () => rawStructError(),
			set: () => rawStructError(),
			enumerable: true,
		});
		Object.defineProperty(node, `boxed${capitalize(key)}`, {
			get: () => rawStructError(),
			set: () => rawStructError(),
			enumerable: false,
		});
	}
	return node as RawStruct<TSchema> & ObjectNodeTyped<TSchema>;
}

class RawStruct<TSchema extends ObjectNodeSchema> implements ObjectNode {
	public constructor(
		public readonly schema: TSchema,
		content: FlexibleNodeContent<[TSchema]>,
	) {
		this[nodeContent] = content;
	}

	// Use a symbol here so that it will never collide with a field name
	public readonly [nodeContent]: FlexibleNodeContent<[TSchema]>;

	public get type(): TreeNodeSchemaIdentifier {
		return this.schema.name;
	}

	public get context(): TreeContext {
		return rawStructError();
	}

	public get parentField(): { readonly parent: TreeField; readonly index: number } {
		return rawStructError();
	}

	public tryGetField(key: FieldKey): TreeField | undefined {
		return rawStructError();
	}

	public [boxedIterator](): IterableIterator<TreeField> {
		return rawStructError();
	}

	public on<K extends keyof EditableTreeEvents>(
		eventName: K,
		listener: EditableTreeEvents[K],
	): () => void {
		return rawStructError();
	}

	public is<TSchemaCheck extends TreeNodeSchema>(
		schema: TSchemaCheck,
	): this is TypedNode<TSchemaCheck> {
		return rawStructError();
	}

	public treeStatus(): TreeStatus {
		return rawStructError();
	}

	public get localNodeKey(): BrandedType<SessionSpaceCompressedId, "Local Node Key"> | undefined {
		return rawStructError();
	}
}

function rawStructError(): never {
	throw new Error(rawStructErrorMessage);
}

export const rawStructErrorMessage =
	"Newly created node must be inserted into the tree before being queried";
