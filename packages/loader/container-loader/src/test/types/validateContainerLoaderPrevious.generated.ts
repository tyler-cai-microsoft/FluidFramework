/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-test-generator in @fluidframework/build-tools.
 */

import type * as old from "@fluidframework/container-loader-previous/internal";
import type * as current from "../../index.js";

// See 'build-tools/src/type-test-generator/compatibility.ts' for more information.
type TypeOnly<T> = T extends number
	? number
	: T extends string
	? string
	: T extends boolean | bigint | symbol
	? T
	: {
			[P in keyof T]: TypeOnly<T[P]>;
	  };

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "EnumDeclaration_ConnectionState": {"forwardCompat": false}
 */
declare function get_old_EnumDeclaration_ConnectionState():
    TypeOnly<old.ConnectionState>;
declare function use_current_EnumDeclaration_ConnectionState(
    use: TypeOnly<current.ConnectionState>): void;
use_current_EnumDeclaration_ConnectionState(
    get_old_EnumDeclaration_ConnectionState());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "EnumDeclaration_ConnectionState": {"backCompat": false}
 */
declare function get_current_EnumDeclaration_ConnectionState():
    TypeOnly<current.ConnectionState>;
declare function use_old_EnumDeclaration_ConnectionState(
    use: TypeOnly<old.ConnectionState>): void;
use_old_EnumDeclaration_ConnectionState(
    get_current_EnumDeclaration_ConnectionState());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ICodeDetailsLoader": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_ICodeDetailsLoader():
    TypeOnly<old.ICodeDetailsLoader>;
declare function use_current_InterfaceDeclaration_ICodeDetailsLoader(
    use: TypeOnly<current.ICodeDetailsLoader>): void;
use_current_InterfaceDeclaration_ICodeDetailsLoader(
    get_old_InterfaceDeclaration_ICodeDetailsLoader());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ICodeDetailsLoader": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_ICodeDetailsLoader():
    TypeOnly<current.ICodeDetailsLoader>;
declare function use_old_InterfaceDeclaration_ICodeDetailsLoader(
    use: TypeOnly<old.ICodeDetailsLoader>): void;
use_old_InterfaceDeclaration_ICodeDetailsLoader(
    get_current_InterfaceDeclaration_ICodeDetailsLoader());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IContainerExperimental": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_IContainerExperimental():
    TypeOnly<old.IContainerExperimental>;
declare function use_current_InterfaceDeclaration_IContainerExperimental(
    use: TypeOnly<current.IContainerExperimental>): void;
use_current_InterfaceDeclaration_IContainerExperimental(
    // @ts-expect-error compatibility expected to be broken
    get_old_InterfaceDeclaration_IContainerExperimental());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IContainerExperimental": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_IContainerExperimental():
    TypeOnly<current.IContainerExperimental>;
declare function use_old_InterfaceDeclaration_IContainerExperimental(
    use: TypeOnly<old.IContainerExperimental>): void;
use_old_InterfaceDeclaration_IContainerExperimental(
    // @ts-expect-error compatibility expected to be broken
    get_current_InterfaceDeclaration_IContainerExperimental());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_IDetachedBlobStorage": {"forwardCompat": false}
 */
declare function get_old_TypeAliasDeclaration_IDetachedBlobStorage():
    TypeOnly<old.IDetachedBlobStorage>;
declare function use_current_TypeAliasDeclaration_IDetachedBlobStorage(
    use: TypeOnly<current.IDetachedBlobStorage>): void;
use_current_TypeAliasDeclaration_IDetachedBlobStorage(
    get_old_TypeAliasDeclaration_IDetachedBlobStorage());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_IDetachedBlobStorage": {"backCompat": false}
 */
declare function get_current_TypeAliasDeclaration_IDetachedBlobStorage():
    TypeOnly<current.IDetachedBlobStorage>;
declare function use_old_TypeAliasDeclaration_IDetachedBlobStorage(
    use: TypeOnly<old.IDetachedBlobStorage>): void;
use_old_TypeAliasDeclaration_IDetachedBlobStorage(
    get_current_TypeAliasDeclaration_IDetachedBlobStorage());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IFluidModuleWithDetails": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_IFluidModuleWithDetails():
    TypeOnly<old.IFluidModuleWithDetails>;
declare function use_current_InterfaceDeclaration_IFluidModuleWithDetails(
    use: TypeOnly<current.IFluidModuleWithDetails>): void;
use_current_InterfaceDeclaration_IFluidModuleWithDetails(
    get_old_InterfaceDeclaration_IFluidModuleWithDetails());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IFluidModuleWithDetails": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_IFluidModuleWithDetails():
    TypeOnly<current.IFluidModuleWithDetails>;
declare function use_old_InterfaceDeclaration_IFluidModuleWithDetails(
    use: TypeOnly<old.IFluidModuleWithDetails>): void;
use_old_InterfaceDeclaration_IFluidModuleWithDetails(
    get_current_InterfaceDeclaration_IFluidModuleWithDetails());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ILoaderOptions": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_ILoaderOptions():
    TypeOnly<old.ILoaderOptions>;
declare function use_current_InterfaceDeclaration_ILoaderOptions(
    use: TypeOnly<current.ILoaderOptions>): void;
use_current_InterfaceDeclaration_ILoaderOptions(
    get_old_InterfaceDeclaration_ILoaderOptions());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ILoaderOptions": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_ILoaderOptions():
    TypeOnly<current.ILoaderOptions>;
declare function use_old_InterfaceDeclaration_ILoaderOptions(
    use: TypeOnly<old.ILoaderOptions>): void;
use_old_InterfaceDeclaration_ILoaderOptions(
    get_current_InterfaceDeclaration_ILoaderOptions());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ILoaderProps": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_ILoaderProps():
    TypeOnly<old.ILoaderProps>;
declare function use_current_InterfaceDeclaration_ILoaderProps(
    use: TypeOnly<current.ILoaderProps>): void;
use_current_InterfaceDeclaration_ILoaderProps(
    get_old_InterfaceDeclaration_ILoaderProps());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ILoaderProps": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_ILoaderProps():
    TypeOnly<current.ILoaderProps>;
declare function use_old_InterfaceDeclaration_ILoaderProps(
    use: TypeOnly<old.ILoaderProps>): void;
use_old_InterfaceDeclaration_ILoaderProps(
    get_current_InterfaceDeclaration_ILoaderProps());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ILoaderServices": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_ILoaderServices():
    TypeOnly<old.ILoaderServices>;
declare function use_current_InterfaceDeclaration_ILoaderServices(
    use: TypeOnly<current.ILoaderServices>): void;
use_current_InterfaceDeclaration_ILoaderServices(
    get_old_InterfaceDeclaration_ILoaderServices());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_ILoaderServices": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_ILoaderServices():
    TypeOnly<current.ILoaderServices>;
declare function use_old_InterfaceDeclaration_ILoaderServices(
    use: TypeOnly<old.ILoaderServices>): void;
use_old_InterfaceDeclaration_ILoaderServices(
    get_current_InterfaceDeclaration_ILoaderServices());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IParsedUrl": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_IParsedUrl():
    TypeOnly<old.IParsedUrl>;
declare function use_current_InterfaceDeclaration_IParsedUrl(
    use: TypeOnly<current.IParsedUrl>): void;
use_current_InterfaceDeclaration_IParsedUrl(
    get_old_InterfaceDeclaration_IParsedUrl());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IParsedUrl": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_IParsedUrl():
    TypeOnly<current.IParsedUrl>;
declare function use_old_InterfaceDeclaration_IParsedUrl(
    use: TypeOnly<old.IParsedUrl>): void;
use_old_InterfaceDeclaration_IParsedUrl(
    get_current_InterfaceDeclaration_IParsedUrl());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IProtocolHandler": {"forwardCompat": false}
 */
declare function get_old_InterfaceDeclaration_IProtocolHandler():
    TypeOnly<old.IProtocolHandler>;
declare function use_current_InterfaceDeclaration_IProtocolHandler(
    use: TypeOnly<current.IProtocolHandler>): void;
use_current_InterfaceDeclaration_IProtocolHandler(
    // @ts-expect-error compatibility expected to be broken
    get_old_InterfaceDeclaration_IProtocolHandler());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "InterfaceDeclaration_IProtocolHandler": {"backCompat": false}
 */
declare function get_current_InterfaceDeclaration_IProtocolHandler():
    TypeOnly<current.IProtocolHandler>;
declare function use_old_InterfaceDeclaration_IProtocolHandler(
    use: TypeOnly<old.IProtocolHandler>): void;
use_old_InterfaceDeclaration_IProtocolHandler(
    // @ts-expect-error compatibility expected to be broken
    get_current_InterfaceDeclaration_IProtocolHandler());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassDeclaration_Loader": {"forwardCompat": false}
 */
declare function get_old_ClassDeclaration_Loader():
    TypeOnly<old.Loader>;
declare function use_current_ClassDeclaration_Loader(
    use: TypeOnly<current.Loader>): void;
use_current_ClassDeclaration_Loader(
    get_old_ClassDeclaration_Loader());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassDeclaration_Loader": {"backCompat": false}
 */
declare function get_current_ClassDeclaration_Loader():
    TypeOnly<current.Loader>;
declare function use_old_ClassDeclaration_Loader(
    use: TypeOnly<old.Loader>): void;
use_old_ClassDeclaration_Loader(
    get_current_ClassDeclaration_Loader());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_ProtocolHandlerBuilder": {"forwardCompat": false}
 */
declare function get_old_TypeAliasDeclaration_ProtocolHandlerBuilder():
    TypeOnly<old.ProtocolHandlerBuilder>;
declare function use_current_TypeAliasDeclaration_ProtocolHandlerBuilder(
    use: TypeOnly<current.ProtocolHandlerBuilder>): void;
use_current_TypeAliasDeclaration_ProtocolHandlerBuilder(
    get_old_TypeAliasDeclaration_ProtocolHandlerBuilder());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAliasDeclaration_ProtocolHandlerBuilder": {"backCompat": false}
 */
declare function get_current_TypeAliasDeclaration_ProtocolHandlerBuilder():
    TypeOnly<current.ProtocolHandlerBuilder>;
declare function use_old_TypeAliasDeclaration_ProtocolHandlerBuilder(
    use: TypeOnly<old.ProtocolHandlerBuilder>): void;
use_old_TypeAliasDeclaration_ProtocolHandlerBuilder(
    get_current_TypeAliasDeclaration_ProtocolHandlerBuilder());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "FunctionDeclaration_isLocationRedirectionError": {"forwardCompat": false}
 */
declare function get_old_FunctionDeclaration_isLocationRedirectionError():
    TypeOnly<typeof old.isLocationRedirectionError>;
declare function use_current_FunctionDeclaration_isLocationRedirectionError(
    use: TypeOnly<typeof current.isLocationRedirectionError>): void;
use_current_FunctionDeclaration_isLocationRedirectionError(
    get_old_FunctionDeclaration_isLocationRedirectionError());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "FunctionDeclaration_isLocationRedirectionError": {"backCompat": false}
 */
declare function get_current_FunctionDeclaration_isLocationRedirectionError():
    TypeOnly<typeof current.isLocationRedirectionError>;
declare function use_old_FunctionDeclaration_isLocationRedirectionError(
    use: TypeOnly<typeof old.isLocationRedirectionError>): void;
use_old_FunctionDeclaration_isLocationRedirectionError(
    get_current_FunctionDeclaration_isLocationRedirectionError());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "FunctionDeclaration_resolveWithLocationRedirectionHandling": {"forwardCompat": false}
 */
declare function get_old_FunctionDeclaration_resolveWithLocationRedirectionHandling():
    TypeOnly<typeof old.resolveWithLocationRedirectionHandling>;
declare function use_current_FunctionDeclaration_resolveWithLocationRedirectionHandling(
    use: TypeOnly<typeof current.resolveWithLocationRedirectionHandling>): void;
use_current_FunctionDeclaration_resolveWithLocationRedirectionHandling(
    get_old_FunctionDeclaration_resolveWithLocationRedirectionHandling());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "FunctionDeclaration_resolveWithLocationRedirectionHandling": {"backCompat": false}
 */
declare function get_current_FunctionDeclaration_resolveWithLocationRedirectionHandling():
    TypeOnly<typeof current.resolveWithLocationRedirectionHandling>;
declare function use_old_FunctionDeclaration_resolveWithLocationRedirectionHandling(
    use: TypeOnly<typeof old.resolveWithLocationRedirectionHandling>): void;
use_old_FunctionDeclaration_resolveWithLocationRedirectionHandling(
    get_current_FunctionDeclaration_resolveWithLocationRedirectionHandling());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "FunctionDeclaration_tryParseCompatibleResolvedUrl": {"forwardCompat": false}
 */
declare function get_old_FunctionDeclaration_tryParseCompatibleResolvedUrl():
    TypeOnly<typeof old.tryParseCompatibleResolvedUrl>;
declare function use_current_FunctionDeclaration_tryParseCompatibleResolvedUrl(
    use: TypeOnly<typeof current.tryParseCompatibleResolvedUrl>): void;
use_current_FunctionDeclaration_tryParseCompatibleResolvedUrl(
    get_old_FunctionDeclaration_tryParseCompatibleResolvedUrl());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "FunctionDeclaration_tryParseCompatibleResolvedUrl": {"backCompat": false}
 */
declare function get_current_FunctionDeclaration_tryParseCompatibleResolvedUrl():
    TypeOnly<typeof current.tryParseCompatibleResolvedUrl>;
declare function use_old_FunctionDeclaration_tryParseCompatibleResolvedUrl(
    use: TypeOnly<typeof old.tryParseCompatibleResolvedUrl>): void;
use_old_FunctionDeclaration_tryParseCompatibleResolvedUrl(
    get_current_FunctionDeclaration_tryParseCompatibleResolvedUrl());

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "FunctionDeclaration_waitContainerToCatchUp": {"forwardCompat": false}
 */
declare function get_old_FunctionDeclaration_waitContainerToCatchUp():
    TypeOnly<typeof old.waitContainerToCatchUp>;
declare function use_current_FunctionDeclaration_waitContainerToCatchUp(
    use: TypeOnly<typeof current.waitContainerToCatchUp>): void;
use_current_FunctionDeclaration_waitContainerToCatchUp(
    get_old_FunctionDeclaration_waitContainerToCatchUp());

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "FunctionDeclaration_waitContainerToCatchUp": {"backCompat": false}
 */
declare function get_current_FunctionDeclaration_waitContainerToCatchUp():
    TypeOnly<typeof current.waitContainerToCatchUp>;
declare function use_old_FunctionDeclaration_waitContainerToCatchUp(
    use: TypeOnly<typeof old.waitContainerToCatchUp>): void;
use_old_FunctionDeclaration_waitContainerToCatchUp(
    get_current_FunctionDeclaration_waitContainerToCatchUp());
