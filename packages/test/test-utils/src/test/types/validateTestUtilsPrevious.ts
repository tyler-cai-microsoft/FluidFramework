/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-validator in @fluidframework/build-tools.
 */
import * as old from "@fluidframework/test-utils-previous";
import * as current from "../../index";

type TypeOnly<T> = {
    [P in keyof T]: TypeOnly<T[P]>;
};

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_ChannelFactoryRegistry": {"forwardCompat": false}
*/
declare function get_old_TypeAliasDeclaration_ChannelFactoryRegistry():
    TypeOnly<old.ChannelFactoryRegistry>;
declare function use_current_TypeAliasDeclaration_ChannelFactoryRegistry(
    use: TypeOnly<current.ChannelFactoryRegistry>);
use_current_TypeAliasDeclaration_ChannelFactoryRegistry(
    get_old_TypeAliasDeclaration_ChannelFactoryRegistry());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_ChannelFactoryRegistry": {"backCompat": false}
*/
declare function get_current_TypeAliasDeclaration_ChannelFactoryRegistry():
    TypeOnly<current.ChannelFactoryRegistry>;
declare function use_old_TypeAliasDeclaration_ChannelFactoryRegistry(
    use: TypeOnly<old.ChannelFactoryRegistry>);
use_old_TypeAliasDeclaration_ChannelFactoryRegistry(
    get_current_TypeAliasDeclaration_ChannelFactoryRegistry());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_createAndAttachContainer": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_createAndAttachContainer():
    TypeOnly<typeof old.createAndAttachContainer>;
declare function use_current_FunctionDeclaration_createAndAttachContainer(
    use: TypeOnly<typeof current.createAndAttachContainer>);
use_current_FunctionDeclaration_createAndAttachContainer(
    get_old_FunctionDeclaration_createAndAttachContainer());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_createAndAttachContainer": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_createAndAttachContainer():
    TypeOnly<typeof current.createAndAttachContainer>;
declare function use_old_FunctionDeclaration_createAndAttachContainer(
    use: TypeOnly<typeof old.createAndAttachContainer>);
use_old_FunctionDeclaration_createAndAttachContainer(
    get_current_FunctionDeclaration_createAndAttachContainer());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_createDocumentId": {"forwardCompat": false}
*/
declare function get_old_VariableDeclaration_createDocumentId():
    TypeOnly<typeof old.createDocumentId>;
declare function use_current_VariableDeclaration_createDocumentId(
    use: TypeOnly<typeof current.createDocumentId>);
use_current_VariableDeclaration_createDocumentId(
    get_old_VariableDeclaration_createDocumentId());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_createDocumentId": {"backCompat": false}
*/
declare function get_current_VariableDeclaration_createDocumentId():
    TypeOnly<typeof current.createDocumentId>;
declare function use_old_VariableDeclaration_createDocumentId(
    use: TypeOnly<typeof old.createDocumentId>);
use_old_VariableDeclaration_createDocumentId(
    get_current_VariableDeclaration_createDocumentId());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_createLoader": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_createLoader():
    TypeOnly<typeof old.createLoader>;
declare function use_current_FunctionDeclaration_createLoader(
    use: TypeOnly<typeof current.createLoader>);
use_current_FunctionDeclaration_createLoader(
    get_old_FunctionDeclaration_createLoader());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_createLoader": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_createLoader():
    TypeOnly<typeof current.createLoader>;
declare function use_old_FunctionDeclaration_createLoader(
    use: TypeOnly<typeof old.createLoader>);
use_old_FunctionDeclaration_createLoader(
    get_current_FunctionDeclaration_createLoader());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_createTestContainerRuntimeFactory": {"forwardCompat": false}
*/
declare function get_old_VariableDeclaration_createTestContainerRuntimeFactory():
    TypeOnly<typeof old.createTestContainerRuntimeFactory>;
declare function use_current_VariableDeclaration_createTestContainerRuntimeFactory(
    use: TypeOnly<typeof current.createTestContainerRuntimeFactory>);
use_current_VariableDeclaration_createTestContainerRuntimeFactory(
    get_old_VariableDeclaration_createTestContainerRuntimeFactory());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_createTestContainerRuntimeFactory": {"backCompat": false}
*/
declare function get_current_VariableDeclaration_createTestContainerRuntimeFactory():
    TypeOnly<typeof current.createTestContainerRuntimeFactory>;
declare function use_old_VariableDeclaration_createTestContainerRuntimeFactory(
    use: TypeOnly<typeof old.createTestContainerRuntimeFactory>);
use_old_VariableDeclaration_createTestContainerRuntimeFactory(
    get_current_VariableDeclaration_createTestContainerRuntimeFactory());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_DataObjectFactoryType": {"forwardCompat": false}
*/
declare function get_old_EnumDeclaration_DataObjectFactoryType():
    TypeOnly<old.DataObjectFactoryType>;
declare function use_current_EnumDeclaration_DataObjectFactoryType(
    use: TypeOnly<current.DataObjectFactoryType>);
use_current_EnumDeclaration_DataObjectFactoryType(
    get_old_EnumDeclaration_DataObjectFactoryType());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_DataObjectFactoryType": {"backCompat": false}
*/
declare function get_current_EnumDeclaration_DataObjectFactoryType():
    TypeOnly<current.DataObjectFactoryType>;
declare function use_old_EnumDeclaration_DataObjectFactoryType(
    use: TypeOnly<old.DataObjectFactoryType>);
use_old_EnumDeclaration_DataObjectFactoryType(
    get_current_EnumDeclaration_DataObjectFactoryType());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_defaultTimeoutDurationMs": {"forwardCompat": false}
*/
declare function get_old_VariableDeclaration_defaultTimeoutDurationMs():
    TypeOnly<typeof old.defaultTimeoutDurationMs>;
declare function use_current_VariableDeclaration_defaultTimeoutDurationMs(
    use: TypeOnly<typeof current.defaultTimeoutDurationMs>);
use_current_VariableDeclaration_defaultTimeoutDurationMs(
    get_old_VariableDeclaration_defaultTimeoutDurationMs());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_defaultTimeoutDurationMs": {"backCompat": false}
*/
declare function get_current_VariableDeclaration_defaultTimeoutDurationMs():
    TypeOnly<typeof current.defaultTimeoutDurationMs>;
declare function use_old_VariableDeclaration_defaultTimeoutDurationMs(
    use: TypeOnly<typeof old.defaultTimeoutDurationMs>);
use_old_VariableDeclaration_defaultTimeoutDurationMs(
    get_current_VariableDeclaration_defaultTimeoutDurationMs());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_EventAndErrorTrackingLogger": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_EventAndErrorTrackingLogger():
    TypeOnly<old.EventAndErrorTrackingLogger>;
declare function use_current_ClassDeclaration_EventAndErrorTrackingLogger(
    use: TypeOnly<current.EventAndErrorTrackingLogger>);
use_current_ClassDeclaration_EventAndErrorTrackingLogger(
    get_old_ClassDeclaration_EventAndErrorTrackingLogger());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_EventAndErrorTrackingLogger": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_EventAndErrorTrackingLogger():
    TypeOnly<current.EventAndErrorTrackingLogger>;
declare function use_old_ClassDeclaration_EventAndErrorTrackingLogger(
    use: TypeOnly<old.EventAndErrorTrackingLogger>);
use_old_ClassDeclaration_EventAndErrorTrackingLogger(
    get_current_ClassDeclaration_EventAndErrorTrackingLogger());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_fluidEntryPoint": {"forwardCompat": false}
*/
declare function get_old_TypeAliasDeclaration_fluidEntryPoint():
    TypeOnly<old.fluidEntryPoint>;
declare function use_current_TypeAliasDeclaration_fluidEntryPoint(
    use: TypeOnly<current.fluidEntryPoint>);
use_current_TypeAliasDeclaration_fluidEntryPoint(
    get_old_TypeAliasDeclaration_fluidEntryPoint());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_fluidEntryPoint": {"backCompat": false}
*/
declare function get_current_TypeAliasDeclaration_fluidEntryPoint():
    TypeOnly<current.fluidEntryPoint>;
declare function use_old_TypeAliasDeclaration_fluidEntryPoint(
    use: TypeOnly<old.fluidEntryPoint>);
use_old_TypeAliasDeclaration_fluidEntryPoint(
    get_current_TypeAliasDeclaration_fluidEntryPoint());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_getUnexpectedLogErrorException": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_getUnexpectedLogErrorException():
    TypeOnly<typeof old.getUnexpectedLogErrorException>;
declare function use_current_FunctionDeclaration_getUnexpectedLogErrorException(
    use: TypeOnly<typeof current.getUnexpectedLogErrorException>);
use_current_FunctionDeclaration_getUnexpectedLogErrorException(
    get_old_FunctionDeclaration_getUnexpectedLogErrorException());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_getUnexpectedLogErrorException": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_getUnexpectedLogErrorException():
    TypeOnly<typeof current.getUnexpectedLogErrorException>;
declare function use_old_FunctionDeclaration_getUnexpectedLogErrorException(
    use: TypeOnly<typeof old.getUnexpectedLogErrorException>);
use_old_FunctionDeclaration_getUnexpectedLogErrorException(
    get_current_FunctionDeclaration_getUnexpectedLogErrorException());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IOpProcessingController": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IOpProcessingController():
    TypeOnly<old.IOpProcessingController>;
declare function use_current_InterfaceDeclaration_IOpProcessingController(
    use: TypeOnly<current.IOpProcessingController>);
use_current_InterfaceDeclaration_IOpProcessingController(
    get_old_InterfaceDeclaration_IOpProcessingController());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IOpProcessingController": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IOpProcessingController():
    TypeOnly<current.IOpProcessingController>;
declare function use_old_InterfaceDeclaration_IOpProcessingController(
    use: TypeOnly<old.IOpProcessingController>);
use_old_InterfaceDeclaration_IOpProcessingController(
    get_current_InterfaceDeclaration_IOpProcessingController());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IProvideTestFluidObject": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IProvideTestFluidObject():
    TypeOnly<old.IProvideTestFluidObject>;
declare function use_current_InterfaceDeclaration_IProvideTestFluidObject(
    use: TypeOnly<current.IProvideTestFluidObject>);
use_current_InterfaceDeclaration_IProvideTestFluidObject(
    get_old_InterfaceDeclaration_IProvideTestFluidObject());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IProvideTestFluidObject": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IProvideTestFluidObject():
    TypeOnly<current.IProvideTestFluidObject>;
declare function use_old_InterfaceDeclaration_IProvideTestFluidObject(
    use: TypeOnly<old.IProvideTestFluidObject>);
use_old_InterfaceDeclaration_IProvideTestFluidObject(
    get_current_InterfaceDeclaration_IProvideTestFluidObject());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ITestContainerConfig": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ITestContainerConfig():
    TypeOnly<old.ITestContainerConfig>;
declare function use_current_InterfaceDeclaration_ITestContainerConfig(
    use: TypeOnly<current.ITestContainerConfig>);
use_current_InterfaceDeclaration_ITestContainerConfig(
    get_old_InterfaceDeclaration_ITestContainerConfig());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ITestContainerConfig": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ITestContainerConfig():
    TypeOnly<current.ITestContainerConfig>;
declare function use_old_InterfaceDeclaration_ITestContainerConfig(
    use: TypeOnly<old.ITestContainerConfig>);
use_old_InterfaceDeclaration_ITestContainerConfig(
    get_current_InterfaceDeclaration_ITestContainerConfig());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ITestFluidObject": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ITestFluidObject():
    TypeOnly<old.ITestFluidObject>;
declare function use_current_InterfaceDeclaration_ITestFluidObject(
    use: TypeOnly<current.ITestFluidObject>);
use_current_InterfaceDeclaration_ITestFluidObject(
    get_old_InterfaceDeclaration_ITestFluidObject());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ITestFluidObject": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ITestFluidObject():
    TypeOnly<current.ITestFluidObject>;
declare function use_old_InterfaceDeclaration_ITestFluidObject(
    use: TypeOnly<old.ITestFluidObject>);
use_old_InterfaceDeclaration_ITestFluidObject(
    get_current_InterfaceDeclaration_ITestFluidObject());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ITestObjectProvider": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ITestObjectProvider():
    TypeOnly<old.ITestObjectProvider>;
declare function use_current_InterfaceDeclaration_ITestObjectProvider(
    use: TypeOnly<current.ITestObjectProvider>);
use_current_InterfaceDeclaration_ITestObjectProvider(
    // @ts-expect-error compatibility expected to be broken
    get_old_InterfaceDeclaration_ITestObjectProvider());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ITestObjectProvider": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ITestObjectProvider():
    TypeOnly<current.ITestObjectProvider>;
declare function use_old_InterfaceDeclaration_ITestObjectProvider(
    use: TypeOnly<old.ITestObjectProvider>);
use_old_InterfaceDeclaration_ITestObjectProvider(
    get_current_InterfaceDeclaration_ITestObjectProvider());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_LoaderContainerTracker": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_LoaderContainerTracker():
    TypeOnly<old.LoaderContainerTracker>;
declare function use_current_ClassDeclaration_LoaderContainerTracker(
    use: TypeOnly<current.LoaderContainerTracker>);
use_current_ClassDeclaration_LoaderContainerTracker(
    get_old_ClassDeclaration_LoaderContainerTracker());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_LoaderContainerTracker": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_LoaderContainerTracker():
    TypeOnly<current.LoaderContainerTracker>;
declare function use_old_ClassDeclaration_LoaderContainerTracker(
    use: TypeOnly<old.LoaderContainerTracker>);
use_old_ClassDeclaration_LoaderContainerTracker(
    get_current_ClassDeclaration_LoaderContainerTracker());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_LocalCodeLoader": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_LocalCodeLoader():
    TypeOnly<old.LocalCodeLoader>;
declare function use_current_ClassDeclaration_LocalCodeLoader(
    use: TypeOnly<current.LocalCodeLoader>);
use_current_ClassDeclaration_LocalCodeLoader(
    get_old_ClassDeclaration_LocalCodeLoader());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_LocalCodeLoader": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_LocalCodeLoader():
    TypeOnly<current.LocalCodeLoader>;
declare function use_old_ClassDeclaration_LocalCodeLoader(
    use: TypeOnly<old.LocalCodeLoader>);
use_old_ClassDeclaration_LocalCodeLoader(
    get_current_ClassDeclaration_LocalCodeLoader());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_retryWithEventualValue": {"forwardCompat": false}
*/
declare function get_old_VariableDeclaration_retryWithEventualValue():
    TypeOnly<typeof old.retryWithEventualValue>;
declare function use_current_VariableDeclaration_retryWithEventualValue(
    use: TypeOnly<typeof current.retryWithEventualValue>);
use_current_VariableDeclaration_retryWithEventualValue(
    get_old_VariableDeclaration_retryWithEventualValue());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_retryWithEventualValue": {"backCompat": false}
*/
declare function get_current_VariableDeclaration_retryWithEventualValue():
    TypeOnly<typeof current.retryWithEventualValue>;
declare function use_old_VariableDeclaration_retryWithEventualValue(
    use: TypeOnly<typeof old.retryWithEventualValue>);
use_old_VariableDeclaration_retryWithEventualValue(
    get_current_VariableDeclaration_retryWithEventualValue());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_SupportedExportInterfaces": {"forwardCompat": false}
*/
declare function get_old_TypeAliasDeclaration_SupportedExportInterfaces():
    TypeOnly<old.SupportedExportInterfaces>;
declare function use_current_TypeAliasDeclaration_SupportedExportInterfaces(
    use: TypeOnly<current.SupportedExportInterfaces>);
use_current_TypeAliasDeclaration_SupportedExportInterfaces(
    get_old_TypeAliasDeclaration_SupportedExportInterfaces());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_SupportedExportInterfaces": {"backCompat": false}
*/
declare function get_current_TypeAliasDeclaration_SupportedExportInterfaces():
    TypeOnly<current.SupportedExportInterfaces>;
declare function use_old_TypeAliasDeclaration_SupportedExportInterfaces(
    use: TypeOnly<old.SupportedExportInterfaces>);
use_old_TypeAliasDeclaration_SupportedExportInterfaces(
    get_current_TypeAliasDeclaration_SupportedExportInterfaces());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_TestContainerRuntimeFactory": {"forwardCompat": false}
*/
declare function get_old_VariableDeclaration_TestContainerRuntimeFactory():
    TypeOnly<typeof old.TestContainerRuntimeFactory>;
declare function use_current_VariableDeclaration_TestContainerRuntimeFactory(
    use: TypeOnly<typeof current.TestContainerRuntimeFactory>);
use_current_VariableDeclaration_TestContainerRuntimeFactory(
    get_old_VariableDeclaration_TestContainerRuntimeFactory());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_TestContainerRuntimeFactory": {"backCompat": false}
*/
declare function get_current_VariableDeclaration_TestContainerRuntimeFactory():
    TypeOnly<typeof current.TestContainerRuntimeFactory>;
declare function use_old_VariableDeclaration_TestContainerRuntimeFactory(
    use: TypeOnly<typeof old.TestContainerRuntimeFactory>);
use_old_VariableDeclaration_TestContainerRuntimeFactory(
    get_current_VariableDeclaration_TestContainerRuntimeFactory());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TestFluidObject": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_TestFluidObject():
    TypeOnly<old.TestFluidObject>;
declare function use_current_ClassDeclaration_TestFluidObject(
    use: TypeOnly<current.TestFluidObject>);
use_current_ClassDeclaration_TestFluidObject(
    get_old_ClassDeclaration_TestFluidObject());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TestFluidObject": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_TestFluidObject():
    TypeOnly<current.TestFluidObject>;
declare function use_old_ClassDeclaration_TestFluidObject(
    use: TypeOnly<old.TestFluidObject>);
use_old_ClassDeclaration_TestFluidObject(
    get_current_ClassDeclaration_TestFluidObject());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TestFluidObjectFactory": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_TestFluidObjectFactory():
    TypeOnly<old.TestFluidObjectFactory>;
declare function use_current_ClassDeclaration_TestFluidObjectFactory(
    use: TypeOnly<current.TestFluidObjectFactory>);
use_current_ClassDeclaration_TestFluidObjectFactory(
    get_old_ClassDeclaration_TestFluidObjectFactory());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TestFluidObjectFactory": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_TestFluidObjectFactory():
    TypeOnly<current.TestFluidObjectFactory>;
declare function use_old_ClassDeclaration_TestFluidObjectFactory(
    use: TypeOnly<old.TestFluidObjectFactory>);
use_old_ClassDeclaration_TestFluidObjectFactory(
    get_current_ClassDeclaration_TestFluidObjectFactory());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TestObjectProvider": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_TestObjectProvider():
    TypeOnly<old.TestObjectProvider>;
declare function use_current_ClassDeclaration_TestObjectProvider(
    use: TypeOnly<current.TestObjectProvider>);
use_current_ClassDeclaration_TestObjectProvider(
    // @ts-expect-error compatibility expected to be broken
    get_old_ClassDeclaration_TestObjectProvider());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TestObjectProvider": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_TestObjectProvider():
    TypeOnly<current.TestObjectProvider>;
declare function use_old_ClassDeclaration_TestObjectProvider(
    use: TypeOnly<old.TestObjectProvider>);
use_old_ClassDeclaration_TestObjectProvider(
    get_current_ClassDeclaration_TestObjectProvider());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_timeoutAwait": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_timeoutAwait():
    TypeOnly<typeof old.timeoutAwait>;
declare function use_current_FunctionDeclaration_timeoutAwait(
    use: TypeOnly<typeof current.timeoutAwait>);
use_current_FunctionDeclaration_timeoutAwait(
    get_old_FunctionDeclaration_timeoutAwait());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_timeoutAwait": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_timeoutAwait():
    TypeOnly<typeof current.timeoutAwait>;
declare function use_old_FunctionDeclaration_timeoutAwait(
    use: TypeOnly<typeof old.timeoutAwait>);
use_old_FunctionDeclaration_timeoutAwait(
    get_current_FunctionDeclaration_timeoutAwait());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_timeoutPromise": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_timeoutPromise():
    TypeOnly<typeof old.timeoutPromise>;
declare function use_current_FunctionDeclaration_timeoutPromise(
    use: TypeOnly<typeof current.timeoutPromise>);
use_current_FunctionDeclaration_timeoutPromise(
    get_old_FunctionDeclaration_timeoutPromise());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_timeoutPromise": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_timeoutPromise():
    TypeOnly<typeof current.timeoutPromise>;
declare function use_old_FunctionDeclaration_timeoutPromise(
    use: TypeOnly<typeof old.timeoutPromise>);
use_old_FunctionDeclaration_timeoutPromise(
    get_current_FunctionDeclaration_timeoutPromise());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_TimeoutWithError": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_TimeoutWithError():
    TypeOnly<old.TimeoutWithError>;
declare function use_current_InterfaceDeclaration_TimeoutWithError(
    use: TypeOnly<current.TimeoutWithError>);
use_current_InterfaceDeclaration_TimeoutWithError(
    get_old_InterfaceDeclaration_TimeoutWithError());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_TimeoutWithError": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_TimeoutWithError():
    TypeOnly<current.TimeoutWithError>;
declare function use_old_InterfaceDeclaration_TimeoutWithError(
    use: TypeOnly<old.TimeoutWithError>);
use_old_InterfaceDeclaration_TimeoutWithError(
    get_current_InterfaceDeclaration_TimeoutWithError());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_TimeoutWithValue": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_TimeoutWithValue():
    TypeOnly<old.TimeoutWithValue>;
declare function use_current_InterfaceDeclaration_TimeoutWithValue(
    use: TypeOnly<current.TimeoutWithValue>);
use_current_InterfaceDeclaration_TimeoutWithValue(
    get_old_InterfaceDeclaration_TimeoutWithValue());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_TimeoutWithValue": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_TimeoutWithValue():
    TypeOnly<current.TimeoutWithValue>;
declare function use_old_InterfaceDeclaration_TimeoutWithValue(
    use: TypeOnly<old.TimeoutWithValue>);
use_old_InterfaceDeclaration_TimeoutWithValue(
    get_current_InterfaceDeclaration_TimeoutWithValue());
