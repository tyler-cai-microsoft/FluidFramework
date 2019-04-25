(window["webpackJsonp_name_"] = window["webpackJsonp_name_"] || []).push([[16],{

/***/ "./node_modules/monaco-editor/esm/vs/basic-languages/msdax/msdax.js":
/*!**************************************************************************!*\
  !*** ./node_modules/monaco-editor/esm/vs/basic-languages/msdax/msdax.js ***!
  \**************************************************************************/
/*! exports provided: conf, language */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "conf", function() { return conf; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "language", function() { return language; });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

var conf = {
    comments: {
        lineComment: '//',
        blockComment: ['/*', '*/'],
    },
    brackets: [['[', ']'], ['(', ')'], ['{', '}']],
    autoClosingPairs: [
        { open: '"', close: '"', notIn: ['string', 'comment'] },
        { open: '\'', close: '\'', notIn: ['string', 'comment'] },
        { open: '[', close: ']', notIn: ['string', 'comment'] },
        { open: '(', close: ')', notIn: ['string', 'comment'] },
        { open: '{', close: '}', notIn: ['string', 'comment'] },
    ]
};
var language = {
    defaultToken: '',
    tokenPostfix: '.msdax',
    ignoreCase: true,
    brackets: [
        { open: '[', close: ']', token: 'delimiter.square' },
        { open: '{', close: '}', token: 'delimiter.brackets' },
        { open: '(', close: ')', token: 'delimiter.parenthesis' }
    ],
    keywords: [
        // Query keywords
        'VAR',
        'RETURN',
        'NOT',
        'EVALUATE',
        'DATATABLE',
        'ORDER',
        'BY',
        'START',
        'AT',
        'DEFINE',
        'MEASURE',
        'ASC',
        'DESC',
        'IN',
        // Datatable types
        'BOOLEAN',
        'DOUBLE',
        'INTEGER',
        'DATETIME',
        'CURRENCY',
        'STRING'
    ],
    functions: [
        // Relational
        'CLOSINGBALANCEMONTH', 'CLOSINGBALANCEQUARTER', 'CLOSINGBALANCEYEAR', 'DATEADD', 'DATESBETWEEN',
        'DATESINPERIOD', 'DATESMTD', 'DATESQTD', 'DATESYTD', 'ENDOFMONTH',
        'ENDOFQUARTER', 'ENDOFYEAR', 'FIRSTDATE', 'FIRSTNONBLANK', 'LASTDATE',
        'LASTNONBLANK', 'NEXTDAY', 'NEXTMONTH', 'NEXTQUARTER', 'NEXTYEAR',
        'OPENINGBALANCEMONTH', 'OPENINGBALANCEQUARTER', 'OPENINGBALANCEYEAR', 'PARALLELPERIOD', 'PREVIOUSDAY',
        'PREVIOUSMONTH', 'PREVIOUSQUARTER', 'PREVIOUSYEAR', 'SAMEPERIODLASTYEAR', 'STARTOFMONTH',
        'STARTOFQUARTER', 'STARTOFYEAR', 'TOTALMTD', 'TOTALQTD', 'TOTALYTD',
        'ADDCOLUMNS', 'ADDMISSINGITEMS', 'ALL', 'ALLEXCEPT', 'ALLNOBLANKROW',
        'ALLSELECTED', 'CALCULATE', 'CALCULATETABLE', 'CALENDAR', 'CALENDARAUTO',
        'CROSSFILTER', 'CROSSJOIN', 'CURRENTGROUP', 'DATATABLE', 'DETAILROWS',
        'DISTINCT', 'EARLIER', 'EARLIEST', 'EXCEPT', 'FILTER',
        'FILTERS', 'GENERATE', 'GENERATEALL', 'GROUPBY', 'IGNORE',
        'INTERSECT', 'ISONORAFTER', 'KEEPFILTERS', 'LOOKUPVALUE', 'NATURALINNERJOIN',
        'NATURALLEFTOUTERJOIN', 'RELATED', 'RELATEDTABLE', 'ROLLUP', 'ROLLUPADDISSUBTOTAL',
        'ROLLUPGROUP', 'ROLLUPISSUBTOTAL', 'ROW', 'SAMPLE', 'SELECTCOLUMNS',
        'SUBSTITUTEWITHINDEX', 'SUMMARIZE', 'SUMMARIZECOLUMNS', 'TOPN', 'TREATAS',
        'UNION', 'USERELATIONSHIP', 'VALUES', 'SUM', 'SUMX',
        'PATH', 'PATHCONTAINS', 'PATHITEM', 'PATHITEMREVERSE', 'PATHLENGTH',
        'AVERAGE', 'AVERAGEA', 'AVERAGEX', 'COUNT', 'COUNTA',
        'COUNTAX', 'COUNTBLANK', 'COUNTROWS', 'COUNTX', 'DISTINCTCOUNT',
        'DIVIDE', 'GEOMEAN', 'GEOMEANX', 'MAX', 'MAXA',
        'MAXX', 'MEDIAN', 'MEDIANX', 'MIN', 'MINA',
        'MINX', 'PERCENTILE.EXC', 'PERCENTILE.INC', 'PERCENTILEX.EXC', 'PERCENTILEX.INC',
        'PRODUCT', 'PRODUCTX', 'RANK.EQ', 'RANKX', 'STDEV.P',
        'STDEV.S', 'STDEVX.P', 'STDEVX.S', 'VAR.P', 'VAR.S',
        'VARX.P', 'VARX.S', 'XIRR', 'XNPV',
        // Scalar
        'DATE', 'DATEDIFF', 'DATEVALUE', 'DAY', 'EDATE',
        'EOMONTH', 'HOUR', 'MINUTE', 'MONTH', 'NOW',
        'SECOND', 'TIME', 'TIMEVALUE', 'TODAY', 'WEEKDAY',
        'WEEKNUM', 'YEAR', 'YEARFRAC', 'CONTAINS', 'CONTAINSROW',
        'CUSTOMDATA', 'ERROR', 'HASONEFILTER', 'HASONEVALUE', 'ISBLANK',
        'ISCROSSFILTERED', 'ISEMPTY', 'ISERROR', 'ISEVEN', 'ISFILTERED',
        'ISLOGICAL', 'ISNONTEXT', 'ISNUMBER', 'ISODD', 'ISSUBTOTAL',
        'ISTEXT', 'USERNAME', 'USERPRINCIPALNAME', 'AND', 'FALSE',
        'IF', 'IFERROR', 'NOT', 'OR', 'SWITCH',
        'TRUE', 'ABS', 'ACOS', 'ACOSH', 'ACOT',
        'ACOTH', 'ASIN', 'ASINH', 'ATAN', 'ATANH',
        'BETA.DIST', 'BETA.INV', 'CEILING', 'CHISQ.DIST', 'CHISQ.DIST.RT',
        'CHISQ.INV', 'CHISQ.INV.RT', 'COMBIN', 'COMBINA', 'CONFIDENCE.NORM',
        'CONFIDENCE.T', 'COS', 'COSH', 'COT', 'COTH',
        'CURRENCY', 'DEGREES', 'EVEN', 'EXP', 'EXPON.DIST',
        'FACT', 'FLOOR', 'GCD', 'INT', 'ISO.CEILING',
        'LCM', 'LN', 'LOG', 'LOG10', 'MOD',
        'MROUND', 'ODD', 'PERMUT', 'PI', 'POISSON.DIST',
        'POWER', 'QUOTIENT', 'RADIANS', 'RAND', 'RANDBETWEEN',
        'ROUND', 'ROUNDDOWN', 'ROUNDUP', 'SIGN', 'SIN',
        'SINH', 'SQRT', 'SQRTPI', 'TAN', 'TANH',
        'TRUNC', 'BLANK', 'CONCATENATE', 'CONCATENATEX', 'EXACT',
        'FIND', 'FIXED', 'FORMAT', 'LEFT', 'LEN',
        'LOWER', 'MID', 'REPLACE', 'REPT', 'RIGHT',
        'SEARCH', 'SUBSTITUTE', 'TRIM', 'UNICHAR', 'UNICODE',
        'UPPER', 'VALUE'
    ],
    tokenizer: {
        root: [
            { include: '@comments' },
            { include: '@whitespace' },
            { include: '@numbers' },
            { include: '@strings' },
            { include: '@complexIdentifiers' },
            [/[;,.]/, 'delimiter'],
            [/[({})]/, '@brackets'],
            [/[a-z_][a-zA-Z0-9_]*/, {
                    cases: {
                        '@keywords': 'keyword',
                        '@functions': 'keyword',
                        '@default': 'identifier'
                    }
                }],
            [/[<>=!%&+\-*/|~^]/, 'operator'],
        ],
        whitespace: [
            [/\s+/, 'white']
        ],
        comments: [
            [/\/\/+.*/, 'comment'],
            [/\/\*/, { token: 'comment.quote', next: '@comment' }]
        ],
        comment: [
            [/[^*/]+/, 'comment'],
            [/\*\//, { token: 'comment.quote', next: '@pop' }],
            [/./, 'comment']
        ],
        numbers: [
            [/0[xX][0-9a-fA-F]*/, 'number'],
            [/[$][+-]*\d*(\.\d*)?/, 'number'],
            [/((\d+(\.\d*)?)|(\.\d+))([eE][\-+]?\d+)?/, 'number']
        ],
        strings: [
            [/N"/, { token: 'string', next: '@string' }],
            [/"/, { token: 'string', next: '@string' }]
        ],
        string: [
            [/[^"]+/, 'string'],
            [/""/, 'string'],
            [/"/, { token: 'string', next: '@pop' }]
        ],
        complexIdentifiers: [
            [/\[/, { token: 'identifier.quote', next: '@bracketedIdentifier' }],
            [/'/, { token: 'identifier.quote', next: '@quotedIdentifier' }]
        ],
        bracketedIdentifier: [
            [/[^\]]+/, 'identifier'],
            [/]]/, 'identifier'],
            [/]/, { token: 'identifier.quote', next: '@pop' }]
        ],
        quotedIdentifier: [
            [/[^']+/, 'identifier'],
            [/''/, 'identifier'],
            [/'/, { token: 'identifier.quote', next: '@pop' }]
        ]
    }
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaGFpbmNvZGUvY291bnRlci8uL25vZGVfbW9kdWxlcy9tb25hY28tZWRpdG9yL2VzbS92cy9iYXNpYy1sYW5ndWFnZXMvbXNkYXgvbXNkYXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ2E7QUFDTjtBQUNQO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCwwQ0FBMEMsS0FBSztBQUMvQztBQUNBLFNBQVMsc0RBQXNEO0FBQy9ELFNBQVMsd0RBQXdEO0FBQ2pFLFNBQVMsc0RBQXNEO0FBQy9ELFNBQVMsc0RBQXNEO0FBQy9ELFNBQVMsU0FBUyxZQUFZLGlDQUFpQztBQUMvRDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsbURBQW1EO0FBQzVELFNBQVMsU0FBUyxZQUFZLGdDQUFnQztBQUM5RCxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsdUJBQXVCO0FBQ3BDLGFBQWEseUJBQXlCO0FBQ3RDLGFBQWEsc0JBQXNCO0FBQ25DLGFBQWEsc0JBQXNCO0FBQ25DLGFBQWEsaUNBQWlDO0FBQzlDLGdCQUFnQjtBQUNoQixrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLDJDQUEyQztBQUNqRTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsdUNBQXVDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsbUNBQW1DO0FBQ3ZELG1CQUFtQixtQ0FBbUM7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsZ0NBQWdDO0FBQ25EO0FBQ0E7QUFDQSxvQkFBb0IsMERBQTBEO0FBQzlFLG1CQUFtQix1REFBdUQ7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsMENBQTBDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLDBDQUEwQztBQUM3RDtBQUNBO0FBQ0EiLCJmaWxlIjoiMTYuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLiBTZWUgTGljZW5zZS50eHQgaW4gdGhlIHByb2plY3Qgcm9vdCBmb3IgbGljZW5zZSBpbmZvcm1hdGlvbi5cclxuICotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbid1c2Ugc3RyaWN0JztcclxuZXhwb3J0IHZhciBjb25mID0ge1xyXG4gICAgY29tbWVudHM6IHtcclxuICAgICAgICBsaW5lQ29tbWVudDogJy8vJyxcclxuICAgICAgICBibG9ja0NvbW1lbnQ6IFsnLyonLCAnKi8nXSxcclxuICAgIH0sXHJcbiAgICBicmFja2V0czogW1snWycsICddJ10sIFsnKCcsICcpJ10sIFsneycsICd9J11dLFxyXG4gICAgYXV0b0Nsb3NpbmdQYWlyczogW1xyXG4gICAgICAgIHsgb3BlbjogJ1wiJywgY2xvc2U6ICdcIicsIG5vdEluOiBbJ3N0cmluZycsICdjb21tZW50J10gfSxcclxuICAgICAgICB7IG9wZW46ICdcXCcnLCBjbG9zZTogJ1xcJycsIG5vdEluOiBbJ3N0cmluZycsICdjb21tZW50J10gfSxcclxuICAgICAgICB7IG9wZW46ICdbJywgY2xvc2U6ICddJywgbm90SW46IFsnc3RyaW5nJywgJ2NvbW1lbnQnXSB9LFxyXG4gICAgICAgIHsgb3BlbjogJygnLCBjbG9zZTogJyknLCBub3RJbjogWydzdHJpbmcnLCAnY29tbWVudCddIH0sXHJcbiAgICAgICAgeyBvcGVuOiAneycsIGNsb3NlOiAnfScsIG5vdEluOiBbJ3N0cmluZycsICdjb21tZW50J10gfSxcclxuICAgIF1cclxufTtcclxuZXhwb3J0IHZhciBsYW5ndWFnZSA9IHtcclxuICAgIGRlZmF1bHRUb2tlbjogJycsXHJcbiAgICB0b2tlblBvc3RmaXg6ICcubXNkYXgnLFxyXG4gICAgaWdub3JlQ2FzZTogdHJ1ZSxcclxuICAgIGJyYWNrZXRzOiBbXHJcbiAgICAgICAgeyBvcGVuOiAnWycsIGNsb3NlOiAnXScsIHRva2VuOiAnZGVsaW1pdGVyLnNxdWFyZScgfSxcclxuICAgICAgICB7IG9wZW46ICd7JywgY2xvc2U6ICd9JywgdG9rZW46ICdkZWxpbWl0ZXIuYnJhY2tldHMnIH0sXHJcbiAgICAgICAgeyBvcGVuOiAnKCcsIGNsb3NlOiAnKScsIHRva2VuOiAnZGVsaW1pdGVyLnBhcmVudGhlc2lzJyB9XHJcbiAgICBdLFxyXG4gICAga2V5d29yZHM6IFtcclxuICAgICAgICAvLyBRdWVyeSBrZXl3b3Jkc1xyXG4gICAgICAgICdWQVInLFxyXG4gICAgICAgICdSRVRVUk4nLFxyXG4gICAgICAgICdOT1QnLFxyXG4gICAgICAgICdFVkFMVUFURScsXHJcbiAgICAgICAgJ0RBVEFUQUJMRScsXHJcbiAgICAgICAgJ09SREVSJyxcclxuICAgICAgICAnQlknLFxyXG4gICAgICAgICdTVEFSVCcsXHJcbiAgICAgICAgJ0FUJyxcclxuICAgICAgICAnREVGSU5FJyxcclxuICAgICAgICAnTUVBU1VSRScsXHJcbiAgICAgICAgJ0FTQycsXHJcbiAgICAgICAgJ0RFU0MnLFxyXG4gICAgICAgICdJTicsXHJcbiAgICAgICAgLy8gRGF0YXRhYmxlIHR5cGVzXHJcbiAgICAgICAgJ0JPT0xFQU4nLFxyXG4gICAgICAgICdET1VCTEUnLFxyXG4gICAgICAgICdJTlRFR0VSJyxcclxuICAgICAgICAnREFURVRJTUUnLFxyXG4gICAgICAgICdDVVJSRU5DWScsXHJcbiAgICAgICAgJ1NUUklORydcclxuICAgIF0sXHJcbiAgICBmdW5jdGlvbnM6IFtcclxuICAgICAgICAvLyBSZWxhdGlvbmFsXHJcbiAgICAgICAgJ0NMT1NJTkdCQUxBTkNFTU9OVEgnLCAnQ0xPU0lOR0JBTEFOQ0VRVUFSVEVSJywgJ0NMT1NJTkdCQUxBTkNFWUVBUicsICdEQVRFQUREJywgJ0RBVEVTQkVUV0VFTicsXHJcbiAgICAgICAgJ0RBVEVTSU5QRVJJT0QnLCAnREFURVNNVEQnLCAnREFURVNRVEQnLCAnREFURVNZVEQnLCAnRU5ET0ZNT05USCcsXHJcbiAgICAgICAgJ0VORE9GUVVBUlRFUicsICdFTkRPRllFQVInLCAnRklSU1REQVRFJywgJ0ZJUlNUTk9OQkxBTksnLCAnTEFTVERBVEUnLFxyXG4gICAgICAgICdMQVNUTk9OQkxBTksnLCAnTkVYVERBWScsICdORVhUTU9OVEgnLCAnTkVYVFFVQVJURVInLCAnTkVYVFlFQVInLFxyXG4gICAgICAgICdPUEVOSU5HQkFMQU5DRU1PTlRIJywgJ09QRU5JTkdCQUxBTkNFUVVBUlRFUicsICdPUEVOSU5HQkFMQU5DRVlFQVInLCAnUEFSQUxMRUxQRVJJT0QnLCAnUFJFVklPVVNEQVknLFxyXG4gICAgICAgICdQUkVWSU9VU01PTlRIJywgJ1BSRVZJT1VTUVVBUlRFUicsICdQUkVWSU9VU1lFQVInLCAnU0FNRVBFUklPRExBU1RZRUFSJywgJ1NUQVJUT0ZNT05USCcsXHJcbiAgICAgICAgJ1NUQVJUT0ZRVUFSVEVSJywgJ1NUQVJUT0ZZRUFSJywgJ1RPVEFMTVREJywgJ1RPVEFMUVREJywgJ1RPVEFMWVREJyxcclxuICAgICAgICAnQUREQ09MVU1OUycsICdBRERNSVNTSU5HSVRFTVMnLCAnQUxMJywgJ0FMTEVYQ0VQVCcsICdBTExOT0JMQU5LUk9XJyxcclxuICAgICAgICAnQUxMU0VMRUNURUQnLCAnQ0FMQ1VMQVRFJywgJ0NBTENVTEFURVRBQkxFJywgJ0NBTEVOREFSJywgJ0NBTEVOREFSQVVUTycsXHJcbiAgICAgICAgJ0NST1NTRklMVEVSJywgJ0NST1NTSk9JTicsICdDVVJSRU5UR1JPVVAnLCAnREFUQVRBQkxFJywgJ0RFVEFJTFJPV1MnLFxyXG4gICAgICAgICdESVNUSU5DVCcsICdFQVJMSUVSJywgJ0VBUkxJRVNUJywgJ0VYQ0VQVCcsICdGSUxURVInLFxyXG4gICAgICAgICdGSUxURVJTJywgJ0dFTkVSQVRFJywgJ0dFTkVSQVRFQUxMJywgJ0dST1VQQlknLCAnSUdOT1JFJyxcclxuICAgICAgICAnSU5URVJTRUNUJywgJ0lTT05PUkFGVEVSJywgJ0tFRVBGSUxURVJTJywgJ0xPT0tVUFZBTFVFJywgJ05BVFVSQUxJTk5FUkpPSU4nLFxyXG4gICAgICAgICdOQVRVUkFMTEVGVE9VVEVSSk9JTicsICdSRUxBVEVEJywgJ1JFTEFURURUQUJMRScsICdST0xMVVAnLCAnUk9MTFVQQURESVNTVUJUT1RBTCcsXHJcbiAgICAgICAgJ1JPTExVUEdST1VQJywgJ1JPTExVUElTU1VCVE9UQUwnLCAnUk9XJywgJ1NBTVBMRScsICdTRUxFQ1RDT0xVTU5TJyxcclxuICAgICAgICAnU1VCU1RJVFVURVdJVEhJTkRFWCcsICdTVU1NQVJJWkUnLCAnU1VNTUFSSVpFQ09MVU1OUycsICdUT1BOJywgJ1RSRUFUQVMnLFxyXG4gICAgICAgICdVTklPTicsICdVU0VSRUxBVElPTlNISVAnLCAnVkFMVUVTJywgJ1NVTScsICdTVU1YJyxcclxuICAgICAgICAnUEFUSCcsICdQQVRIQ09OVEFJTlMnLCAnUEFUSElURU0nLCAnUEFUSElURU1SRVZFUlNFJywgJ1BBVEhMRU5HVEgnLFxyXG4gICAgICAgICdBVkVSQUdFJywgJ0FWRVJBR0VBJywgJ0FWRVJBR0VYJywgJ0NPVU5UJywgJ0NPVU5UQScsXHJcbiAgICAgICAgJ0NPVU5UQVgnLCAnQ09VTlRCTEFOSycsICdDT1VOVFJPV1MnLCAnQ09VTlRYJywgJ0RJU1RJTkNUQ09VTlQnLFxyXG4gICAgICAgICdESVZJREUnLCAnR0VPTUVBTicsICdHRU9NRUFOWCcsICdNQVgnLCAnTUFYQScsXHJcbiAgICAgICAgJ01BWFgnLCAnTUVESUFOJywgJ01FRElBTlgnLCAnTUlOJywgJ01JTkEnLFxyXG4gICAgICAgICdNSU5YJywgJ1BFUkNFTlRJTEUuRVhDJywgJ1BFUkNFTlRJTEUuSU5DJywgJ1BFUkNFTlRJTEVYLkVYQycsICdQRVJDRU5USUxFWC5JTkMnLFxyXG4gICAgICAgICdQUk9EVUNUJywgJ1BST0RVQ1RYJywgJ1JBTksuRVEnLCAnUkFOS1gnLCAnU1RERVYuUCcsXHJcbiAgICAgICAgJ1NUREVWLlMnLCAnU1RERVZYLlAnLCAnU1RERVZYLlMnLCAnVkFSLlAnLCAnVkFSLlMnLFxyXG4gICAgICAgICdWQVJYLlAnLCAnVkFSWC5TJywgJ1hJUlInLCAnWE5QVicsXHJcbiAgICAgICAgLy8gU2NhbGFyXHJcbiAgICAgICAgJ0RBVEUnLCAnREFURURJRkYnLCAnREFURVZBTFVFJywgJ0RBWScsICdFREFURScsXHJcbiAgICAgICAgJ0VPTU9OVEgnLCAnSE9VUicsICdNSU5VVEUnLCAnTU9OVEgnLCAnTk9XJyxcclxuICAgICAgICAnU0VDT05EJywgJ1RJTUUnLCAnVElNRVZBTFVFJywgJ1RPREFZJywgJ1dFRUtEQVknLFxyXG4gICAgICAgICdXRUVLTlVNJywgJ1lFQVInLCAnWUVBUkZSQUMnLCAnQ09OVEFJTlMnLCAnQ09OVEFJTlNST1cnLFxyXG4gICAgICAgICdDVVNUT01EQVRBJywgJ0VSUk9SJywgJ0hBU09ORUZJTFRFUicsICdIQVNPTkVWQUxVRScsICdJU0JMQU5LJyxcclxuICAgICAgICAnSVNDUk9TU0ZJTFRFUkVEJywgJ0lTRU1QVFknLCAnSVNFUlJPUicsICdJU0VWRU4nLCAnSVNGSUxURVJFRCcsXHJcbiAgICAgICAgJ0lTTE9HSUNBTCcsICdJU05PTlRFWFQnLCAnSVNOVU1CRVInLCAnSVNPREQnLCAnSVNTVUJUT1RBTCcsXHJcbiAgICAgICAgJ0lTVEVYVCcsICdVU0VSTkFNRScsICdVU0VSUFJJTkNJUEFMTkFNRScsICdBTkQnLCAnRkFMU0UnLFxyXG4gICAgICAgICdJRicsICdJRkVSUk9SJywgJ05PVCcsICdPUicsICdTV0lUQ0gnLFxyXG4gICAgICAgICdUUlVFJywgJ0FCUycsICdBQ09TJywgJ0FDT1NIJywgJ0FDT1QnLFxyXG4gICAgICAgICdBQ09USCcsICdBU0lOJywgJ0FTSU5IJywgJ0FUQU4nLCAnQVRBTkgnLFxyXG4gICAgICAgICdCRVRBLkRJU1QnLCAnQkVUQS5JTlYnLCAnQ0VJTElORycsICdDSElTUS5ESVNUJywgJ0NISVNRLkRJU1QuUlQnLFxyXG4gICAgICAgICdDSElTUS5JTlYnLCAnQ0hJU1EuSU5WLlJUJywgJ0NPTUJJTicsICdDT01CSU5BJywgJ0NPTkZJREVOQ0UuTk9STScsXHJcbiAgICAgICAgJ0NPTkZJREVOQ0UuVCcsICdDT1MnLCAnQ09TSCcsICdDT1QnLCAnQ09USCcsXHJcbiAgICAgICAgJ0NVUlJFTkNZJywgJ0RFR1JFRVMnLCAnRVZFTicsICdFWFAnLCAnRVhQT04uRElTVCcsXHJcbiAgICAgICAgJ0ZBQ1QnLCAnRkxPT1InLCAnR0NEJywgJ0lOVCcsICdJU08uQ0VJTElORycsXHJcbiAgICAgICAgJ0xDTScsICdMTicsICdMT0cnLCAnTE9HMTAnLCAnTU9EJyxcclxuICAgICAgICAnTVJPVU5EJywgJ09ERCcsICdQRVJNVVQnLCAnUEknLCAnUE9JU1NPTi5ESVNUJyxcclxuICAgICAgICAnUE9XRVInLCAnUVVPVElFTlQnLCAnUkFESUFOUycsICdSQU5EJywgJ1JBTkRCRVRXRUVOJyxcclxuICAgICAgICAnUk9VTkQnLCAnUk9VTkRET1dOJywgJ1JPVU5EVVAnLCAnU0lHTicsICdTSU4nLFxyXG4gICAgICAgICdTSU5IJywgJ1NRUlQnLCAnU1FSVFBJJywgJ1RBTicsICdUQU5IJyxcclxuICAgICAgICAnVFJVTkMnLCAnQkxBTksnLCAnQ09OQ0FURU5BVEUnLCAnQ09OQ0FURU5BVEVYJywgJ0VYQUNUJyxcclxuICAgICAgICAnRklORCcsICdGSVhFRCcsICdGT1JNQVQnLCAnTEVGVCcsICdMRU4nLFxyXG4gICAgICAgICdMT1dFUicsICdNSUQnLCAnUkVQTEFDRScsICdSRVBUJywgJ1JJR0hUJyxcclxuICAgICAgICAnU0VBUkNIJywgJ1NVQlNUSVRVVEUnLCAnVFJJTScsICdVTklDSEFSJywgJ1VOSUNPREUnLFxyXG4gICAgICAgICdVUFBFUicsICdWQUxVRSdcclxuICAgIF0sXHJcbiAgICB0b2tlbml6ZXI6IHtcclxuICAgICAgICByb290OiBbXHJcbiAgICAgICAgICAgIHsgaW5jbHVkZTogJ0Bjb21tZW50cycgfSxcclxuICAgICAgICAgICAgeyBpbmNsdWRlOiAnQHdoaXRlc3BhY2UnIH0sXHJcbiAgICAgICAgICAgIHsgaW5jbHVkZTogJ0BudW1iZXJzJyB9LFxyXG4gICAgICAgICAgICB7IGluY2x1ZGU6ICdAc3RyaW5ncycgfSxcclxuICAgICAgICAgICAgeyBpbmNsdWRlOiAnQGNvbXBsZXhJZGVudGlmaWVycycgfSxcclxuICAgICAgICAgICAgWy9bOywuXS8sICdkZWxpbWl0ZXInXSxcclxuICAgICAgICAgICAgWy9bKHt9KV0vLCAnQGJyYWNrZXRzJ10sXHJcbiAgICAgICAgICAgIFsvW2Etel9dW2EtekEtWjAtOV9dKi8sIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnQGtleXdvcmRzJzogJ2tleXdvcmQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnQGZ1bmN0aW9ucyc6ICdrZXl3b3JkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ0BkZWZhdWx0JzogJ2lkZW50aWZpZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgIFsvWzw+PSElJitcXC0qL3x+Xl0vLCAnb3BlcmF0b3InXSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIHdoaXRlc3BhY2U6IFtcclxuICAgICAgICAgICAgWy9cXHMrLywgJ3doaXRlJ11cclxuICAgICAgICBdLFxyXG4gICAgICAgIGNvbW1lbnRzOiBbXHJcbiAgICAgICAgICAgIFsvXFwvXFwvKy4qLywgJ2NvbW1lbnQnXSxcclxuICAgICAgICAgICAgWy9cXC9cXCovLCB7IHRva2VuOiAnY29tbWVudC5xdW90ZScsIG5leHQ6ICdAY29tbWVudCcgfV1cclxuICAgICAgICBdLFxyXG4gICAgICAgIGNvbW1lbnQ6IFtcclxuICAgICAgICAgICAgWy9bXiovXSsvLCAnY29tbWVudCddLFxyXG4gICAgICAgICAgICBbL1xcKlxcLy8sIHsgdG9rZW46ICdjb21tZW50LnF1b3RlJywgbmV4dDogJ0Bwb3AnIH1dLFxyXG4gICAgICAgICAgICBbLy4vLCAnY29tbWVudCddXHJcbiAgICAgICAgXSxcclxuICAgICAgICBudW1iZXJzOiBbXHJcbiAgICAgICAgICAgIFsvMFt4WF1bMC05YS1mQS1GXSovLCAnbnVtYmVyJ10sXHJcbiAgICAgICAgICAgIFsvWyRdWystXSpcXGQqKFxcLlxcZCopPy8sICdudW1iZXInXSxcclxuICAgICAgICAgICAgWy8oKFxcZCsoXFwuXFxkKik/KXwoXFwuXFxkKykpKFtlRV1bXFwtK10/XFxkKyk/LywgJ251bWJlciddXHJcbiAgICAgICAgXSxcclxuICAgICAgICBzdHJpbmdzOiBbXHJcbiAgICAgICAgICAgIFsvTlwiLywgeyB0b2tlbjogJ3N0cmluZycsIG5leHQ6ICdAc3RyaW5nJyB9XSxcclxuICAgICAgICAgICAgWy9cIi8sIHsgdG9rZW46ICdzdHJpbmcnLCBuZXh0OiAnQHN0cmluZycgfV1cclxuICAgICAgICBdLFxyXG4gICAgICAgIHN0cmluZzogW1xyXG4gICAgICAgICAgICBbL1teXCJdKy8sICdzdHJpbmcnXSxcclxuICAgICAgICAgICAgWy9cIlwiLywgJ3N0cmluZyddLFxyXG4gICAgICAgICAgICBbL1wiLywgeyB0b2tlbjogJ3N0cmluZycsIG5leHQ6ICdAcG9wJyB9XVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgY29tcGxleElkZW50aWZpZXJzOiBbXHJcbiAgICAgICAgICAgIFsvXFxbLywgeyB0b2tlbjogJ2lkZW50aWZpZXIucXVvdGUnLCBuZXh0OiAnQGJyYWNrZXRlZElkZW50aWZpZXInIH1dLFxyXG4gICAgICAgICAgICBbLycvLCB7IHRva2VuOiAnaWRlbnRpZmllci5xdW90ZScsIG5leHQ6ICdAcXVvdGVkSWRlbnRpZmllcicgfV1cclxuICAgICAgICBdLFxyXG4gICAgICAgIGJyYWNrZXRlZElkZW50aWZpZXI6IFtcclxuICAgICAgICAgICAgWy9bXlxcXV0rLywgJ2lkZW50aWZpZXInXSxcclxuICAgICAgICAgICAgWy9dXS8sICdpZGVudGlmaWVyJ10sXHJcbiAgICAgICAgICAgIFsvXS8sIHsgdG9rZW46ICdpZGVudGlmaWVyLnF1b3RlJywgbmV4dDogJ0Bwb3AnIH1dXHJcbiAgICAgICAgXSxcclxuICAgICAgICBxdW90ZWRJZGVudGlmaWVyOiBbXHJcbiAgICAgICAgICAgIFsvW14nXSsvLCAnaWRlbnRpZmllciddLFxyXG4gICAgICAgICAgICBbLycnLywgJ2lkZW50aWZpZXInXSxcclxuICAgICAgICAgICAgWy8nLywgeyB0b2tlbjogJ2lkZW50aWZpZXIucXVvdGUnLCBuZXh0OiAnQHBvcCcgfV1cclxuICAgICAgICBdXHJcbiAgICB9XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=