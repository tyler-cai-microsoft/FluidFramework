/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-test-generator in @fluidframework/build-tools.
 */
import type * as old from "@fluidframework/map-previous";
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
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_DirectoryFactory": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_DirectoryFactory():
    TypeOnly<old.DirectoryFactory>;
declare function use_current_ClassDeclaration_DirectoryFactory(
    use: TypeOnly<current.DirectoryFactory>): void;
use_current_ClassDeclaration_DirectoryFactory(
    get_old_ClassDeclaration_DirectoryFactory());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_DirectoryFactory": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_DirectoryFactory():
    TypeOnly<current.DirectoryFactory>;
declare function use_old_ClassDeclaration_DirectoryFactory(
    use: TypeOnly<old.DirectoryFactory>): void;
use_old_ClassDeclaration_DirectoryFactory(
    get_current_ClassDeclaration_DirectoryFactory());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_ICreateInfo": {"forwardCompat": false}
*/

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_ICreateInfo": {"backCompat": false}
*/

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IDirectory": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IDirectory():
    TypeOnly<old.IDirectory>;
declare function use_current_InterfaceDeclaration_IDirectory(
    use: TypeOnly<current.IDirectory>): void;
use_current_InterfaceDeclaration_IDirectory(
    get_old_InterfaceDeclaration_IDirectory());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IDirectory": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IDirectory():
    TypeOnly<current.IDirectory>;
declare function use_old_InterfaceDeclaration_IDirectory(
    use: TypeOnly<old.IDirectory>): void;
use_old_InterfaceDeclaration_IDirectory(
    get_current_InterfaceDeclaration_IDirectory());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_IDirectoryClearOperation": {"forwardCompat": false}
*/

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_IDirectoryClearOperation": {"backCompat": false}
*/

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_IDirectoryCreateSubDirectoryOperation": {"forwardCompat": false}
*/

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_IDirectoryCreateSubDirectoryOperation": {"backCompat": false}
*/

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_IDirectoryDataObject": {"forwardCompat": false}
*/

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_IDirectoryDataObject": {"backCompat": false}
*/

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_IDirectoryDeleteOperation": {"forwardCompat": false}
*/

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_IDirectoryDeleteOperation": {"backCompat": false}
*/

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_IDirectoryDeleteSubDirectoryOperation": {"forwardCompat": false}
*/

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_IDirectoryDeleteSubDirectoryOperation": {"backCompat": false}
*/

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IDirectoryEvents": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IDirectoryEvents():
    TypeOnly<old.IDirectoryEvents>;
declare function use_current_InterfaceDeclaration_IDirectoryEvents(
    use: TypeOnly<current.IDirectoryEvents>): void;
use_current_InterfaceDeclaration_IDirectoryEvents(
    get_old_InterfaceDeclaration_IDirectoryEvents());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IDirectoryEvents": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IDirectoryEvents():
    TypeOnly<current.IDirectoryEvents>;
declare function use_old_InterfaceDeclaration_IDirectoryEvents(
    use: TypeOnly<old.IDirectoryEvents>): void;
use_old_InterfaceDeclaration_IDirectoryEvents(
    get_current_InterfaceDeclaration_IDirectoryEvents());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedTypeAliasDeclaration_IDirectoryKeyOperation": {"forwardCompat": false}
*/

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedTypeAliasDeclaration_IDirectoryKeyOperation": {"backCompat": false}
*/

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_IDirectoryNewStorageFormat": {"forwardCompat": false}
*/

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_IDirectoryNewStorageFormat": {"backCompat": false}
*/

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedTypeAliasDeclaration_IDirectoryOperation": {"forwardCompat": false}
*/

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedTypeAliasDeclaration_IDirectoryOperation": {"backCompat": false}
*/

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_IDirectorySetOperation": {"forwardCompat": false}
*/

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_IDirectorySetOperation": {"backCompat": false}
*/

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedTypeAliasDeclaration_IDirectoryStorageOperation": {"forwardCompat": false}
*/

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedTypeAliasDeclaration_IDirectoryStorageOperation": {"backCompat": false}
*/

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedTypeAliasDeclaration_IDirectorySubDirectoryOperation": {"forwardCompat": false}
*/

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedTypeAliasDeclaration_IDirectorySubDirectoryOperation": {"backCompat": false}
*/

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IDirectoryValueChanged": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IDirectoryValueChanged():
    TypeOnly<old.IDirectoryValueChanged>;
declare function use_current_InterfaceDeclaration_IDirectoryValueChanged(
    use: TypeOnly<current.IDirectoryValueChanged>): void;
use_current_InterfaceDeclaration_IDirectoryValueChanged(
    get_old_InterfaceDeclaration_IDirectoryValueChanged());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IDirectoryValueChanged": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IDirectoryValueChanged():
    TypeOnly<current.IDirectoryValueChanged>;
declare function use_old_InterfaceDeclaration_IDirectoryValueChanged(
    use: TypeOnly<old.IDirectoryValueChanged>): void;
use_old_InterfaceDeclaration_IDirectoryValueChanged(
    get_current_InterfaceDeclaration_IDirectoryValueChanged());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_ILocalValue": {"forwardCompat": false}
*/

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_ILocalValue": {"backCompat": false}
*/

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_ISerializableValue": {"forwardCompat": false}
*/

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_ISerializableValue": {"backCompat": false}
*/

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_ISerializedValue": {"forwardCompat": false}
*/

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedInterfaceDeclaration_ISerializedValue": {"backCompat": false}
*/

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ISharedDirectory": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ISharedDirectory():
    TypeOnly<old.ISharedDirectory>;
declare function use_current_InterfaceDeclaration_ISharedDirectory(
    use: TypeOnly<current.ISharedDirectory>): void;
use_current_InterfaceDeclaration_ISharedDirectory(
    get_old_InterfaceDeclaration_ISharedDirectory());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ISharedDirectory": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ISharedDirectory():
    TypeOnly<current.ISharedDirectory>;
declare function use_old_InterfaceDeclaration_ISharedDirectory(
    use: TypeOnly<old.ISharedDirectory>): void;
use_old_InterfaceDeclaration_ISharedDirectory(
    get_current_InterfaceDeclaration_ISharedDirectory());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ISharedDirectoryEvents": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ISharedDirectoryEvents():
    TypeOnly<old.ISharedDirectoryEvents>;
declare function use_current_InterfaceDeclaration_ISharedDirectoryEvents(
    use: TypeOnly<current.ISharedDirectoryEvents>): void;
use_current_InterfaceDeclaration_ISharedDirectoryEvents(
    get_old_InterfaceDeclaration_ISharedDirectoryEvents());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ISharedDirectoryEvents": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ISharedDirectoryEvents():
    TypeOnly<current.ISharedDirectoryEvents>;
declare function use_old_InterfaceDeclaration_ISharedDirectoryEvents(
    use: TypeOnly<old.ISharedDirectoryEvents>): void;
use_old_InterfaceDeclaration_ISharedDirectoryEvents(
    get_current_InterfaceDeclaration_ISharedDirectoryEvents());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ISharedMap": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ISharedMap():
    TypeOnly<old.ISharedMap>;
declare function use_current_InterfaceDeclaration_ISharedMap(
    use: TypeOnly<current.ISharedMap>): void;
use_current_InterfaceDeclaration_ISharedMap(
    get_old_InterfaceDeclaration_ISharedMap());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ISharedMap": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ISharedMap():
    TypeOnly<current.ISharedMap>;
declare function use_old_InterfaceDeclaration_ISharedMap(
    use: TypeOnly<old.ISharedMap>): void;
use_old_InterfaceDeclaration_ISharedMap(
    get_current_InterfaceDeclaration_ISharedMap());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ISharedMapEvents": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ISharedMapEvents():
    TypeOnly<old.ISharedMapEvents>;
declare function use_current_InterfaceDeclaration_ISharedMapEvents(
    use: TypeOnly<current.ISharedMapEvents>): void;
use_current_InterfaceDeclaration_ISharedMapEvents(
    get_old_InterfaceDeclaration_ISharedMapEvents());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ISharedMapEvents": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ISharedMapEvents():
    TypeOnly<current.ISharedMapEvents>;
declare function use_old_InterfaceDeclaration_ISharedMapEvents(
    use: TypeOnly<old.ISharedMapEvents>): void;
use_old_InterfaceDeclaration_ISharedMapEvents(
    get_current_InterfaceDeclaration_ISharedMapEvents());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IValueChanged": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IValueChanged():
    TypeOnly<old.IValueChanged>;
declare function use_current_InterfaceDeclaration_IValueChanged(
    use: TypeOnly<current.IValueChanged>): void;
use_current_InterfaceDeclaration_IValueChanged(
    get_old_InterfaceDeclaration_IValueChanged());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IValueChanged": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IValueChanged():
    TypeOnly<current.IValueChanged>;
declare function use_old_InterfaceDeclaration_IValueChanged(
    use: TypeOnly<old.IValueChanged>): void;
use_old_InterfaceDeclaration_IValueChanged(
    get_current_InterfaceDeclaration_IValueChanged());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedClassDeclaration_LocalValueMaker": {"forwardCompat": false}
*/

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedClassDeclaration_LocalValueMaker": {"backCompat": false}
*/

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_MapFactory": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_MapFactory():
    TypeOnly<old.MapFactory>;
declare function use_current_ClassDeclaration_MapFactory(
    use: TypeOnly<current.MapFactory>): void;
use_current_ClassDeclaration_MapFactory(
    get_old_ClassDeclaration_MapFactory());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_MapFactory": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_MapFactory():
    TypeOnly<current.MapFactory>;
declare function use_old_ClassDeclaration_MapFactory(
    use: TypeOnly<old.MapFactory>): void;
use_old_ClassDeclaration_MapFactory(
    get_current_ClassDeclaration_MapFactory());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedClassDeclaration_SharedDirectory": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_SharedDirectory():
    TypeOnly<old.SharedDirectory>;
declare function use_current_RemovedClassDeclaration_SharedDirectory(
    use: TypeOnly<current.SharedDirectory>): void;
use_current_RemovedClassDeclaration_SharedDirectory(
    get_old_ClassDeclaration_SharedDirectory());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedClassDeclaration_SharedDirectory": {"backCompat": false}
*/

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedClassDeclaration_SharedMap": {"forwardCompat": false}
*/

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedClassDeclaration_SharedMap": {"backCompat": false}
*/
