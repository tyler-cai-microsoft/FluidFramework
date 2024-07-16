/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by flub generate:typetests in @fluid-tools/build-cli.
 */

import type { TypeOnly, MinimalType, FullType, requireAssignableTo } from "@fluidframework/build-tools";
import type * as old from "@fluidframework/fluid-static-previous/internal";

import type * as current from "../../index.js";

declare type MakeUnusedImportErrorsGoAway<T> = TypeOnly<T> | MinimalType<T> | FullType<T> | typeof old | typeof current | requireAssignableTo<true, true>;

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_CompatibilityMode": {"forwardCompat": false}
 */
declare type old_as_current_for_TypeAliasDeclaration_CompatibilityMode = requireAssignableTo<TypeOnly<old.CompatibilityMode>, TypeOnly<current.CompatibilityMode>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_CompatibilityMode": {"backCompat": false}
 */
declare type current_as_old_for_TypeAliasDeclaration_CompatibilityMode = requireAssignableTo<TypeOnly<current.CompatibilityMode>, TypeOnly<old.CompatibilityMode>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_ContainerAttachProps": {"forwardCompat": false}
 */
declare type old_as_current_for_TypeAliasDeclaration_ContainerAttachProps = requireAssignableTo<TypeOnly<old.ContainerAttachProps>, TypeOnly<current.ContainerAttachProps>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_ContainerAttachProps": {"backCompat": false}
 */
declare type current_as_old_for_TypeAliasDeclaration_ContainerAttachProps = requireAssignableTo<TypeOnly<current.ContainerAttachProps>, TypeOnly<old.ContainerAttachProps>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ContainerSchema": {"forwardCompat": false}
 */
// @ts-expect-error compatibility expected to be broken
declare type old_as_current_for_InterfaceDeclaration_ContainerSchema = requireAssignableTo<TypeOnly<old.ContainerSchema>, TypeOnly<current.ContainerSchema>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ContainerSchema": {"backCompat": false}
 */
declare type current_as_old_for_InterfaceDeclaration_ContainerSchema = requireAssignableTo<TypeOnly<current.ContainerSchema>, TypeOnly<old.ContainerSchema>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IConnection": {"forwardCompat": false}
 */
declare type old_as_current_for_InterfaceDeclaration_IConnection = requireAssignableTo<TypeOnly<old.IConnection>, TypeOnly<current.IConnection>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IConnection": {"backCompat": false}
 */
declare type current_as_old_for_InterfaceDeclaration_IConnection = requireAssignableTo<TypeOnly<current.IConnection>, TypeOnly<old.IConnection>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IFluidContainer": {"backCompat": false}
 */
declare type current_as_old_for_InterfaceDeclaration_IFluidContainer = requireAssignableTo<TypeOnly<current.IFluidContainer>, TypeOnly<old.IFluidContainer>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IFluidContainerEvents": {"backCompat": false}
 */
declare type current_as_old_for_InterfaceDeclaration_IFluidContainerEvents = requireAssignableTo<TypeOnly<current.IFluidContainerEvents>, TypeOnly<old.IFluidContainerEvents>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IMember": {"forwardCompat": false}
 */
declare type old_as_current_for_InterfaceDeclaration_IMember = requireAssignableTo<TypeOnly<old.IMember>, TypeOnly<current.IMember>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IMember": {"backCompat": false}
 */
declare type current_as_old_for_InterfaceDeclaration_IMember = requireAssignableTo<TypeOnly<current.IMember>, TypeOnly<old.IMember>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IProvideRootDataObject": {"forwardCompat": false}
 */
declare type old_as_current_for_InterfaceDeclaration_IProvideRootDataObject = requireAssignableTo<TypeOnly<old.IProvideRootDataObject>, TypeOnly<current.IProvideRootDataObject>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IProvideRootDataObject": {"backCompat": false}
 */
declare type current_as_old_for_InterfaceDeclaration_IProvideRootDataObject = requireAssignableTo<TypeOnly<current.IProvideRootDataObject>, TypeOnly<old.IProvideRootDataObject>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IRootDataObject": {"forwardCompat": false}
 */
declare type old_as_current_for_InterfaceDeclaration_IRootDataObject = requireAssignableTo<TypeOnly<old.IRootDataObject>, TypeOnly<current.IRootDataObject>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IRootDataObject": {"backCompat": false}
 */
declare type current_as_old_for_InterfaceDeclaration_IRootDataObject = requireAssignableTo<TypeOnly<current.IRootDataObject>, TypeOnly<old.IRootDataObject>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IServiceAudience": {"forwardCompat": false}
 */
declare type old_as_current_for_InterfaceDeclaration_IServiceAudience = requireAssignableTo<TypeOnly<old.IServiceAudience<any>>, TypeOnly<current.IServiceAudience<any>>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IServiceAudience": {"backCompat": false}
 */
declare type current_as_old_for_InterfaceDeclaration_IServiceAudience = requireAssignableTo<TypeOnly<current.IServiceAudience<any>>, TypeOnly<old.IServiceAudience<any>>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IServiceAudienceEvents": {"forwardCompat": false}
 */
declare type old_as_current_for_InterfaceDeclaration_IServiceAudienceEvents = requireAssignableTo<TypeOnly<old.IServiceAudienceEvents<any>>, TypeOnly<current.IServiceAudienceEvents<any>>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IServiceAudienceEvents": {"backCompat": false}
 */
declare type current_as_old_for_InterfaceDeclaration_IServiceAudienceEvents = requireAssignableTo<TypeOnly<current.IServiceAudienceEvents<any>>, TypeOnly<old.IServiceAudienceEvents<any>>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_InitialObjects": {"forwardCompat": false}
 */
declare type old_as_current_for_TypeAliasDeclaration_InitialObjects = requireAssignableTo<TypeOnly<old.InitialObjects<any>>, TypeOnly<current.InitialObjects<any>>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_InitialObjects": {"backCompat": false}
 */
declare type current_as_old_for_TypeAliasDeclaration_InitialObjects = requireAssignableTo<TypeOnly<current.InitialObjects<any>>, TypeOnly<old.InitialObjects<any>>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_LoadableObjectRecord": {"forwardCompat": false}
 */
declare type old_as_current_for_TypeAliasDeclaration_LoadableObjectRecord = requireAssignableTo<TypeOnly<old.LoadableObjectRecord>, TypeOnly<current.LoadableObjectRecord>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_LoadableObjectRecord": {"backCompat": false}
 */
declare type current_as_old_for_TypeAliasDeclaration_LoadableObjectRecord = requireAssignableTo<TypeOnly<current.LoadableObjectRecord>, TypeOnly<old.LoadableObjectRecord>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_MemberChangedListener": {"forwardCompat": false}
 */
declare type old_as_current_for_TypeAliasDeclaration_MemberChangedListener = requireAssignableTo<TypeOnly<old.MemberChangedListener<any>>, TypeOnly<current.MemberChangedListener<any>>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_MemberChangedListener": {"backCompat": false}
 */
declare type current_as_old_for_TypeAliasDeclaration_MemberChangedListener = requireAssignableTo<TypeOnly<current.MemberChangedListener<any>>, TypeOnly<old.MemberChangedListener<any>>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_Myself": {"forwardCompat": false}
 */
declare type old_as_current_for_TypeAliasDeclaration_Myself = requireAssignableTo<TypeOnly<old.Myself>, TypeOnly<current.Myself>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_Myself": {"backCompat": false}
 */
declare type current_as_old_for_TypeAliasDeclaration_Myself = requireAssignableTo<TypeOnly<current.Myself>, TypeOnly<old.Myself>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "FunctionDeclaration_createDOProviderContainerRuntimeFactory": {"forwardCompat": false}
 */
declare type old_as_current_for_FunctionDeclaration_createDOProviderContainerRuntimeFactory = requireAssignableTo<TypeOnly<typeof old.createDOProviderContainerRuntimeFactory>, TypeOnly<typeof current.createDOProviderContainerRuntimeFactory>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "FunctionDeclaration_createDOProviderContainerRuntimeFactory": {"backCompat": false}
 */
declare type current_as_old_for_FunctionDeclaration_createDOProviderContainerRuntimeFactory = requireAssignableTo<TypeOnly<typeof current.createDOProviderContainerRuntimeFactory>, TypeOnly<typeof old.createDOProviderContainerRuntimeFactory>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "FunctionDeclaration_createFluidContainer": {"forwardCompat": false}
 */
declare type old_as_current_for_FunctionDeclaration_createFluidContainer = requireAssignableTo<TypeOnly<typeof old.createFluidContainer>, TypeOnly<typeof current.createFluidContainer>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "FunctionDeclaration_createFluidContainer": {"backCompat": false}
 */
declare type current_as_old_for_FunctionDeclaration_createFluidContainer = requireAssignableTo<TypeOnly<typeof current.createFluidContainer>, TypeOnly<typeof old.createFluidContainer>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "FunctionDeclaration_createServiceAudience": {"forwardCompat": false}
 */
declare type old_as_current_for_FunctionDeclaration_createServiceAudience = requireAssignableTo<TypeOnly<typeof old.createServiceAudience>, TypeOnly<typeof current.createServiceAudience>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "FunctionDeclaration_createServiceAudience": {"backCompat": false}
 */
declare type current_as_old_for_FunctionDeclaration_createServiceAudience = requireAssignableTo<TypeOnly<typeof current.createServiceAudience>, TypeOnly<typeof old.createServiceAudience>>
