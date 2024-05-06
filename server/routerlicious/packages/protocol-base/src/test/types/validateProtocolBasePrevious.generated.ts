/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-test-generator in @fluidframework/build-tools.
 */

import type * as old from "@fluidframework/protocol-base-previous";
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
* "InterfaceDeclaration_IProtocolHandler": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IProtocolHandler():
    TypeOnly<old.IProtocolHandler>;
declare function use_current_InterfaceDeclaration_IProtocolHandler(
    use: TypeOnly<current.IProtocolHandler>): void;
use_current_InterfaceDeclaration_IProtocolHandler(
    get_old_InterfaceDeclaration_IProtocolHandler());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IProtocolHandler": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IProtocolHandler():
    TypeOnly<current.IProtocolHandler>;
declare function use_old_InterfaceDeclaration_IProtocolHandler(
    use: TypeOnly<old.IProtocolHandler>): void;
use_old_InterfaceDeclaration_IProtocolHandler(
    get_current_InterfaceDeclaration_IProtocolHandler());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IQuorumSnapshot": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IQuorumSnapshot():
    TypeOnly<old.IQuorumSnapshot>;
declare function use_current_InterfaceDeclaration_IQuorumSnapshot(
    use: TypeOnly<current.IQuorumSnapshot>): void;
use_current_InterfaceDeclaration_IQuorumSnapshot(
    get_old_InterfaceDeclaration_IQuorumSnapshot());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IQuorumSnapshot": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IQuorumSnapshot():
    TypeOnly<current.IQuorumSnapshot>;
declare function use_old_InterfaceDeclaration_IQuorumSnapshot(
    use: TypeOnly<old.IQuorumSnapshot>): void;
use_old_InterfaceDeclaration_IQuorumSnapshot(
    get_current_InterfaceDeclaration_IQuorumSnapshot());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IScribeProtocolState": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IScribeProtocolState():
    TypeOnly<old.IScribeProtocolState>;
declare function use_current_InterfaceDeclaration_IScribeProtocolState(
    use: TypeOnly<current.IScribeProtocolState>): void;
use_current_InterfaceDeclaration_IScribeProtocolState(
    get_old_InterfaceDeclaration_IScribeProtocolState());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IScribeProtocolState": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IScribeProtocolState():
    TypeOnly<current.IScribeProtocolState>;
declare function use_old_InterfaceDeclaration_IScribeProtocolState(
    use: TypeOnly<old.IScribeProtocolState>): void;
use_old_InterfaceDeclaration_IScribeProtocolState(
    get_current_InterfaceDeclaration_IScribeProtocolState());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_ProtocolOpHandler": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_ProtocolOpHandler():
    TypeOnly<old.ProtocolOpHandler>;
declare function use_current_ClassDeclaration_ProtocolOpHandler(
    use: TypeOnly<current.ProtocolOpHandler>): void;
use_current_ClassDeclaration_ProtocolOpHandler(
    get_old_ClassDeclaration_ProtocolOpHandler());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_ProtocolOpHandler": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_ProtocolOpHandler():
    TypeOnly<current.ProtocolOpHandler>;
declare function use_old_ClassDeclaration_ProtocolOpHandler(
    use: TypeOnly<old.ProtocolOpHandler>): void;
use_old_ClassDeclaration_ProtocolOpHandler(
    get_current_ClassDeclaration_ProtocolOpHandler());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_Quorum": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_Quorum():
    TypeOnly<old.Quorum>;
declare function use_current_ClassDeclaration_Quorum(
    use: TypeOnly<current.Quorum>): void;
use_current_ClassDeclaration_Quorum(
    get_old_ClassDeclaration_Quorum());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_Quorum": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_Quorum():
    TypeOnly<current.Quorum>;
declare function use_old_ClassDeclaration_Quorum(
    use: TypeOnly<old.Quorum>): void;
use_old_ClassDeclaration_Quorum(
    get_current_ClassDeclaration_Quorum());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_QuorumClients": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_QuorumClients():
    TypeOnly<old.QuorumClients>;
declare function use_current_ClassDeclaration_QuorumClients(
    use: TypeOnly<current.QuorumClients>): void;
use_current_ClassDeclaration_QuorumClients(
    get_old_ClassDeclaration_QuorumClients());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_QuorumClients": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_QuorumClients():
    TypeOnly<current.QuorumClients>;
declare function use_old_ClassDeclaration_QuorumClients(
    use: TypeOnly<old.QuorumClients>): void;
use_old_ClassDeclaration_QuorumClients(
    get_current_ClassDeclaration_QuorumClients());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_QuorumClientsSnapshot": {"forwardCompat": false}
*/
declare function get_old_TypeAliasDeclaration_QuorumClientsSnapshot():
    TypeOnly<old.QuorumClientsSnapshot>;
declare function use_current_TypeAliasDeclaration_QuorumClientsSnapshot(
    use: TypeOnly<current.QuorumClientsSnapshot>): void;
use_current_TypeAliasDeclaration_QuorumClientsSnapshot(
    get_old_TypeAliasDeclaration_QuorumClientsSnapshot());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_QuorumClientsSnapshot": {"backCompat": false}
*/
declare function get_current_TypeAliasDeclaration_QuorumClientsSnapshot():
    TypeOnly<current.QuorumClientsSnapshot>;
declare function use_old_TypeAliasDeclaration_QuorumClientsSnapshot(
    use: TypeOnly<old.QuorumClientsSnapshot>): void;
use_old_TypeAliasDeclaration_QuorumClientsSnapshot(
    get_current_TypeAliasDeclaration_QuorumClientsSnapshot());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_QuorumProposals": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_QuorumProposals():
    TypeOnly<old.QuorumProposals>;
declare function use_current_ClassDeclaration_QuorumProposals(
    use: TypeOnly<current.QuorumProposals>): void;
use_current_ClassDeclaration_QuorumProposals(
    get_old_ClassDeclaration_QuorumProposals());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_QuorumProposals": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_QuorumProposals():
    TypeOnly<current.QuorumProposals>;
declare function use_old_ClassDeclaration_QuorumProposals(
    use: TypeOnly<old.QuorumProposals>): void;
use_old_ClassDeclaration_QuorumProposals(
    get_current_ClassDeclaration_QuorumProposals());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_QuorumProposalsSnapshot": {"forwardCompat": false}
*/
declare function get_old_TypeAliasDeclaration_QuorumProposalsSnapshot():
    TypeOnly<old.QuorumProposalsSnapshot>;
declare function use_current_TypeAliasDeclaration_QuorumProposalsSnapshot(
    use: TypeOnly<current.QuorumProposalsSnapshot>): void;
use_current_TypeAliasDeclaration_QuorumProposalsSnapshot(
    get_old_TypeAliasDeclaration_QuorumProposalsSnapshot());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_QuorumProposalsSnapshot": {"backCompat": false}
*/
declare function get_current_TypeAliasDeclaration_QuorumProposalsSnapshot():
    TypeOnly<current.QuorumProposalsSnapshot>;
declare function use_old_TypeAliasDeclaration_QuorumProposalsSnapshot(
    use: TypeOnly<old.QuorumProposalsSnapshot>): void;
use_old_TypeAliasDeclaration_QuorumProposalsSnapshot(
    get_current_TypeAliasDeclaration_QuorumProposalsSnapshot());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_buildGitTreeHierarchy": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_buildGitTreeHierarchy():
    TypeOnly<typeof old.buildGitTreeHierarchy>;
declare function use_current_FunctionDeclaration_buildGitTreeHierarchy(
    use: TypeOnly<typeof current.buildGitTreeHierarchy>): void;
use_current_FunctionDeclaration_buildGitTreeHierarchy(
    get_old_FunctionDeclaration_buildGitTreeHierarchy());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_buildGitTreeHierarchy": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_buildGitTreeHierarchy():
    TypeOnly<typeof current.buildGitTreeHierarchy>;
declare function use_old_FunctionDeclaration_buildGitTreeHierarchy(
    use: TypeOnly<typeof old.buildGitTreeHierarchy>): void;
use_old_FunctionDeclaration_buildGitTreeHierarchy(
    get_current_FunctionDeclaration_buildGitTreeHierarchy());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_getGitMode": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_getGitMode():
    TypeOnly<typeof old.getGitMode>;
declare function use_current_FunctionDeclaration_getGitMode(
    use: TypeOnly<typeof current.getGitMode>): void;
use_current_FunctionDeclaration_getGitMode(
    get_old_FunctionDeclaration_getGitMode());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_getGitMode": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_getGitMode():
    TypeOnly<typeof current.getGitMode>;
declare function use_old_FunctionDeclaration_getGitMode(
    use: TypeOnly<typeof old.getGitMode>): void;
use_old_FunctionDeclaration_getGitMode(
    get_current_FunctionDeclaration_getGitMode());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_getGitType": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_getGitType():
    TypeOnly<typeof old.getGitType>;
declare function use_current_FunctionDeclaration_getGitType(
    use: TypeOnly<typeof current.getGitType>): void;
use_current_FunctionDeclaration_getGitType(
    get_old_FunctionDeclaration_getGitType());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_getGitType": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_getGitType():
    TypeOnly<typeof current.getGitType>;
declare function use_old_FunctionDeclaration_getGitType(
    use: TypeOnly<typeof old.getGitType>): void;
use_old_FunctionDeclaration_getGitType(
    get_current_FunctionDeclaration_getGitType());
