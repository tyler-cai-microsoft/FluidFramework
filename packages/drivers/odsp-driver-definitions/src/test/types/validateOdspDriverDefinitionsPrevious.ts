/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-validator in @fluidframework/build-tools.
 */
/* eslint-disable max-lines */
import * as old from "@fluidframework/odsp-driver-definitions-previous";
import * as current from "../../index";

type TypeOnly<T> = {
    [P in keyof T]: TypeOnly<T[P]>;
};

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_CacheContentType": {"forwardCompat": false}
*/
declare function get_old_TypeAliasDeclaration_CacheContentType():
    TypeOnly<old.CacheContentType>;
declare function use_current_TypeAliasDeclaration_CacheContentType(
    use: TypeOnly<current.CacheContentType>);
use_current_TypeAliasDeclaration_CacheContentType(
    get_old_TypeAliasDeclaration_CacheContentType());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_CacheContentType": {"backCompat": false}
*/
declare function get_current_TypeAliasDeclaration_CacheContentType():
    TypeOnly<current.CacheContentType>;
declare function use_old_TypeAliasDeclaration_CacheContentType(
    use: TypeOnly<old.CacheContentType>);
use_old_TypeAliasDeclaration_CacheContentType(
    get_current_TypeAliasDeclaration_CacheContentType());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_HostStoragePolicy": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_HostStoragePolicy():
    TypeOnly<old.HostStoragePolicy>;
declare function use_current_InterfaceDeclaration_HostStoragePolicy(
    use: TypeOnly<current.HostStoragePolicy>);
use_current_InterfaceDeclaration_HostStoragePolicy(
    get_old_InterfaceDeclaration_HostStoragePolicy());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_HostStoragePolicy": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_HostStoragePolicy():
    TypeOnly<current.HostStoragePolicy>;
declare function use_old_InterfaceDeclaration_HostStoragePolicy(
    use: TypeOnly<old.HostStoragePolicy>);
use_old_InterfaceDeclaration_HostStoragePolicy(
    get_current_InterfaceDeclaration_HostStoragePolicy());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ICacheEntry": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ICacheEntry():
    TypeOnly<old.ICacheEntry>;
declare function use_current_InterfaceDeclaration_ICacheEntry(
    use: TypeOnly<current.ICacheEntry>);
use_current_InterfaceDeclaration_ICacheEntry(
    get_old_InterfaceDeclaration_ICacheEntry());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ICacheEntry": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ICacheEntry():
    TypeOnly<current.ICacheEntry>;
declare function use_old_InterfaceDeclaration_ICacheEntry(
    use: TypeOnly<old.ICacheEntry>);
use_old_InterfaceDeclaration_ICacheEntry(
    get_current_InterfaceDeclaration_ICacheEntry());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ICollabSessionOptions": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ICollabSessionOptions():
    TypeOnly<old.ICollabSessionOptions>;
declare function use_current_InterfaceDeclaration_ICollabSessionOptions(
    use: TypeOnly<current.ICollabSessionOptions>);
use_current_InterfaceDeclaration_ICollabSessionOptions(
    get_old_InterfaceDeclaration_ICollabSessionOptions());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ICollabSessionOptions": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ICollabSessionOptions():
    TypeOnly<current.ICollabSessionOptions>;
declare function use_old_InterfaceDeclaration_ICollabSessionOptions(
    use: TypeOnly<old.ICollabSessionOptions>);
use_old_InterfaceDeclaration_ICollabSessionOptions(
    get_current_InterfaceDeclaration_ICollabSessionOptions());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_IdentityType": {"forwardCompat": false}
*/
declare function get_old_TypeAliasDeclaration_IdentityType():
    TypeOnly<old.IdentityType>;
declare function use_current_TypeAliasDeclaration_IdentityType(
    use: TypeOnly<current.IdentityType>);
use_current_TypeAliasDeclaration_IdentityType(
    get_old_TypeAliasDeclaration_IdentityType());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_IdentityType": {"backCompat": false}
*/
declare function get_current_TypeAliasDeclaration_IdentityType():
    TypeOnly<current.IdentityType>;
declare function use_old_TypeAliasDeclaration_IdentityType(
    use: TypeOnly<old.IdentityType>);
use_old_TypeAliasDeclaration_IdentityType(
    get_current_TypeAliasDeclaration_IdentityType());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IEntry": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IEntry():
    TypeOnly<old.IEntry>;
declare function use_current_InterfaceDeclaration_IEntry(
    use: TypeOnly<current.IEntry>);
use_current_InterfaceDeclaration_IEntry(
    get_old_InterfaceDeclaration_IEntry());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IEntry": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IEntry():
    TypeOnly<current.IEntry>;
declare function use_old_InterfaceDeclaration_IEntry(
    use: TypeOnly<old.IEntry>);
use_old_InterfaceDeclaration_IEntry(
    get_current_InterfaceDeclaration_IEntry());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IFileEntry": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IFileEntry():
    TypeOnly<old.IFileEntry>;
declare function use_current_InterfaceDeclaration_IFileEntry(
    use: TypeOnly<current.IFileEntry>);
use_current_InterfaceDeclaration_IFileEntry(
    get_old_InterfaceDeclaration_IFileEntry());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IFileEntry": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IFileEntry():
    TypeOnly<current.IFileEntry>;
declare function use_old_InterfaceDeclaration_IFileEntry(
    use: TypeOnly<old.IFileEntry>);
use_old_InterfaceDeclaration_IFileEntry(
    get_current_InterfaceDeclaration_IFileEntry());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_InstrumentedStorageTokenFetcher": {"forwardCompat": false}
*/
declare function get_old_TypeAliasDeclaration_InstrumentedStorageTokenFetcher():
    TypeOnly<old.InstrumentedStorageTokenFetcher>;
declare function use_current_TypeAliasDeclaration_InstrumentedStorageTokenFetcher(
    use: TypeOnly<current.InstrumentedStorageTokenFetcher>);
use_current_TypeAliasDeclaration_InstrumentedStorageTokenFetcher(
    get_old_TypeAliasDeclaration_InstrumentedStorageTokenFetcher());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_InstrumentedStorageTokenFetcher": {"backCompat": false}
*/
declare function get_current_TypeAliasDeclaration_InstrumentedStorageTokenFetcher():
    TypeOnly<current.InstrumentedStorageTokenFetcher>;
declare function use_old_TypeAliasDeclaration_InstrumentedStorageTokenFetcher(
    use: TypeOnly<old.InstrumentedStorageTokenFetcher>);
use_old_TypeAliasDeclaration_InstrumentedStorageTokenFetcher(
    get_current_TypeAliasDeclaration_InstrumentedStorageTokenFetcher());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IOdspError": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IOdspError():
    TypeOnly<old.IOdspError>;
declare function use_current_InterfaceDeclaration_IOdspError(
    use: TypeOnly<current.IOdspError>);
use_current_InterfaceDeclaration_IOdspError(
    get_old_InterfaceDeclaration_IOdspError());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IOdspError": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IOdspError():
    TypeOnly<current.IOdspError>;
declare function use_old_InterfaceDeclaration_IOdspError(
    use: TypeOnly<old.IOdspError>);
use_old_InterfaceDeclaration_IOdspError(
    get_current_InterfaceDeclaration_IOdspError());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IOdspResolvedUrl": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IOdspResolvedUrl():
    TypeOnly<old.IOdspResolvedUrl>;
declare function use_current_InterfaceDeclaration_IOdspResolvedUrl(
    use: TypeOnly<current.IOdspResolvedUrl>);
use_current_InterfaceDeclaration_IOdspResolvedUrl(
    get_old_InterfaceDeclaration_IOdspResolvedUrl());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IOdspResolvedUrl": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IOdspResolvedUrl():
    TypeOnly<current.IOdspResolvedUrl>;
declare function use_old_InterfaceDeclaration_IOdspResolvedUrl(
    use: TypeOnly<old.IOdspResolvedUrl>);
use_old_InterfaceDeclaration_IOdspResolvedUrl(
    get_current_InterfaceDeclaration_IOdspResolvedUrl());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IOdspUrlParts": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IOdspUrlParts():
    TypeOnly<old.IOdspUrlParts>;
declare function use_current_InterfaceDeclaration_IOdspUrlParts(
    use: TypeOnly<current.IOdspUrlParts>);
use_current_InterfaceDeclaration_IOdspUrlParts(
    get_old_InterfaceDeclaration_IOdspUrlParts());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IOdspUrlParts": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IOdspUrlParts():
    TypeOnly<current.IOdspUrlParts>;
declare function use_old_InterfaceDeclaration_IOdspUrlParts(
    use: TypeOnly<old.IOdspUrlParts>);
use_old_InterfaceDeclaration_IOdspUrlParts(
    get_current_InterfaceDeclaration_IOdspUrlParts());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IOpsCachingPolicy": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IOpsCachingPolicy():
    TypeOnly<old.IOpsCachingPolicy>;
declare function use_current_InterfaceDeclaration_IOpsCachingPolicy(
    use: TypeOnly<current.IOpsCachingPolicy>);
use_current_InterfaceDeclaration_IOpsCachingPolicy(
    get_old_InterfaceDeclaration_IOpsCachingPolicy());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IOpsCachingPolicy": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IOpsCachingPolicy():
    TypeOnly<current.IOpsCachingPolicy>;
declare function use_old_InterfaceDeclaration_IOpsCachingPolicy(
    use: TypeOnly<old.IOpsCachingPolicy>);
use_old_InterfaceDeclaration_IOpsCachingPolicy(
    get_current_InterfaceDeclaration_IOpsCachingPolicy());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IPersistedCache": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IPersistedCache():
    TypeOnly<old.IPersistedCache>;
declare function use_current_InterfaceDeclaration_IPersistedCache(
    use: TypeOnly<current.IPersistedCache>);
use_current_InterfaceDeclaration_IPersistedCache(
    get_old_InterfaceDeclaration_IPersistedCache());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IPersistedCache": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IPersistedCache():
    TypeOnly<current.IPersistedCache>;
declare function use_old_InterfaceDeclaration_IPersistedCache(
    use: TypeOnly<old.IPersistedCache>);
use_old_InterfaceDeclaration_IPersistedCache(
    get_current_InterfaceDeclaration_IPersistedCache());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ISnapshotOptions": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ISnapshotOptions():
    TypeOnly<old.ISnapshotOptions>;
declare function use_current_InterfaceDeclaration_ISnapshotOptions(
    use: TypeOnly<current.ISnapshotOptions>);
use_current_InterfaceDeclaration_ISnapshotOptions(
    get_old_InterfaceDeclaration_ISnapshotOptions());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ISnapshotOptions": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ISnapshotOptions():
    TypeOnly<current.ISnapshotOptions>;
declare function use_old_InterfaceDeclaration_ISnapshotOptions(
    use: TypeOnly<old.ISnapshotOptions>);
use_old_InterfaceDeclaration_ISnapshotOptions(
    get_current_InterfaceDeclaration_ISnapshotOptions());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_isTokenFromCache": {"forwardCompat": false}
*/
declare function get_old_VariableDeclaration_isTokenFromCache():
    TypeOnly<typeof old.isTokenFromCache>;
declare function use_current_VariableDeclaration_isTokenFromCache(
    use: TypeOnly<typeof current.isTokenFromCache>);
use_current_VariableDeclaration_isTokenFromCache(
    get_old_VariableDeclaration_isTokenFromCache());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_isTokenFromCache": {"backCompat": false}
*/
declare function get_current_VariableDeclaration_isTokenFromCache():
    TypeOnly<typeof current.isTokenFromCache>;
declare function use_old_VariableDeclaration_isTokenFromCache(
    use: TypeOnly<typeof old.isTokenFromCache>);
use_old_VariableDeclaration_isTokenFromCache(
    get_current_VariableDeclaration_isTokenFromCache());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_OdspError": {"forwardCompat": false}
*/
declare function get_old_TypeAliasDeclaration_OdspError():
    TypeOnly<old.OdspError>;
declare function use_current_TypeAliasDeclaration_OdspError(
    use: TypeOnly<current.OdspError>);
use_current_TypeAliasDeclaration_OdspError(
    get_old_TypeAliasDeclaration_OdspError());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_OdspError": {"backCompat": false}
*/
declare function get_current_TypeAliasDeclaration_OdspError():
    TypeOnly<current.OdspError>;
declare function use_old_TypeAliasDeclaration_OdspError(
    use: TypeOnly<old.OdspError>);
use_old_TypeAliasDeclaration_OdspError(
    get_current_TypeAliasDeclaration_OdspError());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_OdspErrorType": {"forwardCompat": false}
*/
declare function get_old_EnumDeclaration_OdspErrorType():
    TypeOnly<old.OdspErrorType>;
declare function use_current_EnumDeclaration_OdspErrorType(
    use: TypeOnly<current.OdspErrorType>);
use_current_EnumDeclaration_OdspErrorType(
    get_old_EnumDeclaration_OdspErrorType());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_OdspErrorType": {"backCompat": false}
*/
declare function get_current_EnumDeclaration_OdspErrorType():
    TypeOnly<current.OdspErrorType>;
declare function use_old_EnumDeclaration_OdspErrorType(
    use: TypeOnly<old.OdspErrorType>);
use_old_EnumDeclaration_OdspErrorType(
    get_current_EnumDeclaration_OdspErrorType());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_OdspResourceTokenFetchOptions": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_OdspResourceTokenFetchOptions():
    TypeOnly<old.OdspResourceTokenFetchOptions>;
declare function use_current_InterfaceDeclaration_OdspResourceTokenFetchOptions(
    use: TypeOnly<current.OdspResourceTokenFetchOptions>);
use_current_InterfaceDeclaration_OdspResourceTokenFetchOptions(
    get_old_InterfaceDeclaration_OdspResourceTokenFetchOptions());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_OdspResourceTokenFetchOptions": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_OdspResourceTokenFetchOptions():
    TypeOnly<current.OdspResourceTokenFetchOptions>;
declare function use_old_InterfaceDeclaration_OdspResourceTokenFetchOptions(
    use: TypeOnly<old.OdspResourceTokenFetchOptions>);
use_old_InterfaceDeclaration_OdspResourceTokenFetchOptions(
    get_current_InterfaceDeclaration_OdspResourceTokenFetchOptions());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ShareLinkInfoType": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ShareLinkInfoType():
    TypeOnly<old.ShareLinkInfoType>;
declare function use_current_InterfaceDeclaration_ShareLinkInfoType(
    use: TypeOnly<current.ShareLinkInfoType>);
use_current_InterfaceDeclaration_ShareLinkInfoType(
    get_old_InterfaceDeclaration_ShareLinkInfoType());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ShareLinkInfoType": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ShareLinkInfoType():
    TypeOnly<current.ShareLinkInfoType>;
declare function use_old_InterfaceDeclaration_ShareLinkInfoType(
    use: TypeOnly<old.ShareLinkInfoType>);
use_old_InterfaceDeclaration_ShareLinkInfoType(
    get_current_InterfaceDeclaration_ShareLinkInfoType());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_ShareLinkTypes": {"forwardCompat": false}
*/
declare function get_old_EnumDeclaration_ShareLinkTypes():
    TypeOnly<old.ShareLinkTypes>;
declare function use_current_EnumDeclaration_ShareLinkTypes(
    use: TypeOnly<current.ShareLinkTypes>);
use_current_EnumDeclaration_ShareLinkTypes(
    get_old_EnumDeclaration_ShareLinkTypes());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_ShareLinkTypes": {"backCompat": false}
*/
declare function get_current_EnumDeclaration_ShareLinkTypes():
    TypeOnly<current.ShareLinkTypes>;
declare function use_old_EnumDeclaration_ShareLinkTypes(
    use: TypeOnly<old.ShareLinkTypes>);
use_old_EnumDeclaration_ShareLinkTypes(
    get_current_EnumDeclaration_ShareLinkTypes());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_snapshotKey": {"forwardCompat": false}
*/
declare function get_old_VariableDeclaration_snapshotKey():
    TypeOnly<typeof old.snapshotKey>;
declare function use_current_VariableDeclaration_snapshotKey(
    use: TypeOnly<typeof current.snapshotKey>);
use_current_VariableDeclaration_snapshotKey(
    get_old_VariableDeclaration_snapshotKey());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_snapshotKey": {"backCompat": false}
*/
declare function get_current_VariableDeclaration_snapshotKey():
    TypeOnly<typeof current.snapshotKey>;
declare function use_old_VariableDeclaration_snapshotKey(
    use: TypeOnly<typeof old.snapshotKey>);
use_old_VariableDeclaration_snapshotKey(
    get_current_VariableDeclaration_snapshotKey());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_TokenFetcher": {"forwardCompat": false}
*/
declare function get_old_TypeAliasDeclaration_TokenFetcher():
    TypeOnly<old.TokenFetcher<any>>;
declare function use_current_TypeAliasDeclaration_TokenFetcher(
    use: TypeOnly<current.TokenFetcher<any>>);
use_current_TypeAliasDeclaration_TokenFetcher(
    get_old_TypeAliasDeclaration_TokenFetcher());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_TokenFetcher": {"backCompat": false}
*/
declare function get_current_TypeAliasDeclaration_TokenFetcher():
    TypeOnly<current.TokenFetcher<any>>;
declare function use_old_TypeAliasDeclaration_TokenFetcher(
    use: TypeOnly<old.TokenFetcher<any>>);
use_old_TypeAliasDeclaration_TokenFetcher(
    get_current_TypeAliasDeclaration_TokenFetcher());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_TokenFetchOptions": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_TokenFetchOptions():
    TypeOnly<old.TokenFetchOptions>;
declare function use_current_InterfaceDeclaration_TokenFetchOptions(
    use: TypeOnly<current.TokenFetchOptions>);
use_current_InterfaceDeclaration_TokenFetchOptions(
    get_old_InterfaceDeclaration_TokenFetchOptions());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_TokenFetchOptions": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_TokenFetchOptions():
    TypeOnly<current.TokenFetchOptions>;
declare function use_old_InterfaceDeclaration_TokenFetchOptions(
    use: TypeOnly<old.TokenFetchOptions>);
use_old_InterfaceDeclaration_TokenFetchOptions(
    get_current_InterfaceDeclaration_TokenFetchOptions());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_tokenFromResponse": {"forwardCompat": false}
*/
declare function get_old_VariableDeclaration_tokenFromResponse():
    TypeOnly<typeof old.tokenFromResponse>;
declare function use_current_VariableDeclaration_tokenFromResponse(
    use: TypeOnly<typeof current.tokenFromResponse>);
use_current_VariableDeclaration_tokenFromResponse(
    get_old_VariableDeclaration_tokenFromResponse());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_tokenFromResponse": {"backCompat": false}
*/
declare function get_current_VariableDeclaration_tokenFromResponse():
    TypeOnly<typeof current.tokenFromResponse>;
declare function use_old_VariableDeclaration_tokenFromResponse(
    use: TypeOnly<typeof old.tokenFromResponse>);
use_old_VariableDeclaration_tokenFromResponse(
    get_current_VariableDeclaration_tokenFromResponse());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_TokenResponse": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_TokenResponse():
    TypeOnly<old.TokenResponse>;
declare function use_current_InterfaceDeclaration_TokenResponse(
    use: TypeOnly<current.TokenResponse>);
use_current_InterfaceDeclaration_TokenResponse(
    get_old_InterfaceDeclaration_TokenResponse());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_TokenResponse": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_TokenResponse():
    TypeOnly<current.TokenResponse>;
declare function use_old_InterfaceDeclaration_TokenResponse(
    use: TypeOnly<old.TokenResponse>);
use_old_InterfaceDeclaration_TokenResponse(
    get_current_InterfaceDeclaration_TokenResponse());
