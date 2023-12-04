/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

export {
	Dependee,
	Dependent,
	NamedComputation,
	ObservingDependent,
	InvalidationToken,
	recordDependency,
	SimpleDependee,
	EmptyKey,
	FieldKey,
	TreeType,
	Value,
	TreeValue,
	AnchorSet,
	DetachedField,
	UpPath,
	Range,
	RangeUpPath,
	PlaceUpPath,
	DetachedRangeUpPath,
	DetachedPlaceUpPath,
	PlaceIndex,
	NodeIndex,
	FieldUpPath,
	Anchor,
	RootField,
	ChildCollection,
	ChildLocation,
	DeltaVisitor,
	AnnouncedVisitor,
	FieldMapObject,
	NodeData,
	GenericTreeNode,
	JsonableTree,
	ProtoNodes,
	DeltaRoot,
	DeltaProtoNode,
	DeltaMark,
	DeltaDetachedNodeId,
	DeltaFieldMap,
	DeltaDetachedNodeChanges,
	DeltaDetachedNodeBuild,
	DeltaDetachedNodeDestruction,
	DeltaDetachedNodeRename,
	DeltaFieldChanges,
	rootFieldKey,
	rootField,
	ITreeCursor,
	CursorLocationType,
	ITreeCursorSynchronous,
	GenericFieldsNode,
	AnchorLocator,
	TreeNavigationResult,
	IEditableForest,
	IForestSubscription,
	TreeLocation,
	FieldLocation,
	ForestLocation,
	ITreeSubscriptionCursor,
	ITreeSubscriptionCursorState,
	TreeNodeSchemaIdentifier,
	TreeFieldStoredSchema,
	ValueSchema,
	TreeNodeStoredSchema,
	StoredSchemaRepository,
	FieldKindIdentifier,
	TreeTypeSet,
	TreeStoredSchema,
	FieldAnchor,
	SchemaEvents,
	ChangesetLocalId,
	ForestEvents,
	PathRootPrefix,
	AnchorSlot,
	AnchorNode,
	anchorSlot,
	UpPathDefault,
	AnchorEvents,
	AnchorSetRootEvents,
	FieldKindSpecifier,
	AllowedUpdateType,
	PathVisitor,
	Adapters,
	TreeAdapter,
	MapTree,
	Revertible,
	RevertibleKind,
	RevertResult,
	DiscardResult,
	forbiddenFieldKindIdentifier,
	StoredSchemaCollection,
} from "./core";

export {
	Brand,
	Opaque,
	extractFromOpaque,
	brand,
	ValueFromBranded,
	NameFromBranded,
	JsonCompatibleReadOnly,
	JsonCompatible,
	JsonCompatibleObject,
	NestedMap,
	fail,
	IdAllocator,
	TransactionResult,
	BrandedKey,
	BrandedMapSubset,
	RangeQueryResult,
	Named,
	oneFromSet,
	disposeSymbol,
	IDisposable,
} from "./util";

export {
	Events,
	IsEvent,
	ISubscribable,
	createEmitter,
	IEmitter,
	NoListenersCallback,
	HasListeners,
} from "./events";

export { leaf } from "./domains";

export {
	FieldKind,
	Multiplicity,
	isNeverField,
	FullSchemaPolicy,
	getPrimaryField,
	typeNameSymbol,
	valueSymbol,
	ContextuallyTypedNodeDataObject,
	ContextuallyTypedNodeData,
	MarkedArrayLike,
	isContextuallyTypedNodeDataObject,
	defaultSchemaPolicy,
	jsonableTreeFromCursor,
	StableNodeKey,
	LocalNodeKey,
	compareLocalNodeKeys,
	IDefaultEditBuilder,
	ValueFieldEditBuilder,
	OptionalFieldEditBuilder,
	SequenceFieldEditBuilder,
	prefixPath,
	prefixFieldPath,
	cursorForJsonableTreeNode as singleTextCursor,
	stackTreeNodeCursor,
	CursorAdapter,
	CursorWithNode,
	EditableTreeEvents,
	InternalTypedSchemaTypes,
	ArrayLikeMut,
	FieldKinds,
	ContextuallyTypedFieldData,
	cursorFromContextualData,
	AllowedTypes,
	TreeNodeSchema as FlexTreeNodeSchema,
	TreeSchema,
	SchemaLibrary,
	SchemaLibraryData,
	TreeFieldSchema,
	Any,
	NewFieldContent,
	NodeExistsConstraint,
	cursorForTypedTreeData,
	LazyTreeNodeSchema,
	FieldGenerator,
	TreeDataContext,
	nodeKeyFieldKey,
	SchemaLintConfiguration,
	TreeStatus,
	FlexTreeFieldNode,
	FlexibleFieldContent,
	FlexibleNodeContent,
	FlexTreeLeafNode,
	FlexTreeMapNode,
	FlexTreeOptionalField,
	FlexTreeRequiredField,
	FlexTreeSequenceField,
	FlexTreeObjectNode,
	FlexTreeObjectNodeTyped,
	AssignableFieldKinds,
	FlexTreeContext as TreeContext,
	FlexTreeTypedField,
	FlexTreeTypedNode,
	FlexTreeTypedNodeUnion,
	FlexTreeEntity,
	FlexTreeField,
	FlexTreeNode,
	TreeNodeSchemaBase,
	FieldNodeSchema,
	LeafNodeSchema,
	MapNodeSchema,
	ObjectNodeSchema,
	CheckTypesOverlap,
	SchemaBuilderBase,
	ImplicitFieldSchema as FlexImplicitFieldSchema,
	ImplicitAllowedTypes,
	Unenforced,
	schemaIsFieldNode,
	schemaIsLeaf,
	schemaIsMap,
	schemaIsObjectNode,
	AllowedTypeSet,
	SchemaBuilderOptions,
	TreeEvent,
	SchemaCollection,
	TreeCompressionStrategy,
	treeSchemaFromStoredSchema,
	encodeTreeSchema,
	stackTreeFieldCursor,
	FlexTreeUnknownUnboxed,
	InsertableFlexNode,
	InsertableFlexField,
	AllowedTypesToFlexInsertableTree,
	ApplyMultiplicity,
	NormalizeObjectNodeFields,
	NormalizeFieldSchema,
	Fields,
	MapFieldSchema,
} from "./feature-libraries";

export { TreeListNode, TreeMapNodeBase, Unhydrated, IterableTreeListContent } from "./simple-tree";

export {
	ISharedTree,
	ITreeCheckout,
	ITransaction,
	runSynchronous,
	SharedTreeFactory,
	SharedTreeOptions,
	ITreeCheckoutFork,
	CheckoutEvents,
	SchematizeConfiguration,
	TreeContent,
	InitializeAndSchematizeConfiguration,
	SchemaConfiguration,
	ForestType,
	SharedTreeContentSnapshot,
	FlexTreeView,
	ITreeViewFork,
	buildTreeConfiguration,
} from "./shared-tree";

export {
	ITree,
	TreeNodeSchema,
	TreeConfiguration,
	TreeView,
	SchemaFactory,
	Tree,
	TreeApi,
	NodeBase,
	ImplicitFieldSchema,
	TreeFieldFromImplicitField,
	TreeNodeEvents,
	NodeFromSchema,

	// test recursive schema for checking that d.ts files handles schema correctly
	test_RecursiveObject,
	test_RecursiveObject_base,
} from "./class-tree";
export { TreeFactory, TreeOptions } from "./treeFactory";

export type { ICodecOptions, JsonValidator, SchemaValidationFunction } from "./codec";
export { noopValidator } from "./codec";
export { typeboxValidator } from "./external-utilities";

// Below here are things that are used by the above, but not part of the desired API surface.
import * as InternalTypes from "./internal";
export { InternalTypes };

// These would be in InternalTypes above but are `@alpha` so they can't be included in the `InternalClassTreeTypes` due to https://github.com/microsoft/rushstack/issues/3639
export {
	Invariant,
	Contravariant,
	Covariant,
	BrandedType,
	ExtractFromOpaque,
	Assume,
	AllowOptional,
	RequiredFields,
	OptionalFields,
	_InlineTrick,
	_RecursiveTrick,
	FlattenKeys,
	AllowOptionalNotFlattened,
	isAny,
	BrandedKeyContent,
} from "./util";

export {
	NormalizeField,
	NormalizeAllowedTypes,
	FlexTreeTypedFieldInner,
	FlexTreeUnboxFieldInner,
	FlexTreeObjectNodeFields,
	FlexTreeUnboxField,
	FlexTreeUnboxNode,
	FlexTreeUnboxNodeUnion,
	FlexTreeNodeKeyField,
	IsArrayOfOne,
	FlexibleNodeSubSequence,
	flexTreeMarker,
	FlexTreeEntityKind,
	NodeKeys,
	CollectOptions,
	TypedFields,
	UnbrandedName,
	EmptyObject,

	// These field kind types really only need to show up via FieldKinds.name, and not as top level names in the package.
	// These names also are collision prone.
	Required,
	Optional,
	NodeKeyFieldKind,
	Forbidden,
	Sequence,
} from "./feature-libraries";
