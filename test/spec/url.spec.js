/* global DOMSanitizer */
/* eslint-disable no-script-url */
'use strict';

var tests = [
    {
        'name': 'URL-based context #1',
        'payload': 'javascript:alert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context #2',
        'payload': ' javascript:alert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context #3',
        'payload': 'javascript&colon;alert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context #4',
        'payload': 'javascript&#x3A;alert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context #5',
        'payload': 'j&#x61;v&#x41;sc&#x52;ipt&#x3A;alert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context #6',
        'payload': 'j&#x61;v&#x41;sc&#x52;ipt&#x3A;al&#x65;rt&lpar;1&rpar;',
        'expected': ''
    },
    {
        'name': 'URL-based context #7',
        'payload': 'feed:javascript:alert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context #8',
        'payload': 'feed:javascript&colon;alert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context #9',
        'payload': 'feed:data:text/html,%3cscript%3ealert%281%29%3c/script%3e',
        'expected': ''
    },
    {
        'name': 'URL-based context #10',
        'payload': 'feed:data:text/html,%3csvg%20onload=alert%281%29%3e',
        'expected': ''
    },
    {
        'name': 'URL-based context #11',
        'payload': 'data:text/html,%3Cscript%3Ealert(1)%3C/script%3E',
        'expected': ''
    },
    {
        'name': 'URL-based context #12',
        'payload': 'd&#x61;t&#x61;&colon;text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
        'expected': ''
    },
    {
        'name': 'URL-based context #13',
        'payload': 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
        'expected': ''
    },
    {
        'name': 'URL-based context #14',
        'payload': 'javascript:',
        'expected': ''
    },
    {
        'name': 'URL-based context #15',
        'payload': 'javascript%26amp%3Bamp%3Bcolon%3Balert(2)',
        'expected': ''
    },
    {
        'name': 'URL-based context #16',
        'payload': 'javascript%3A\u0061lert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context #17',
        'payload': 'vbscript%3A\u0061lert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context #18',
        'payload': 'javascript:&NewLine;alert(39)',
        'expected': ''
    },
    {
        'name': 'URL-based context #19',
        'payload': 'data:image/svg+xml;base64,PHN2ZyBpZD0icmVjdGFuZ2xlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiAgICB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+DQo8YSB4bGluazpocmVmPSJqYXZhc2NyaXB0OmFsZXJ0KGxvY2F0aW9uKSI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIC8+PC9hPg0KPC9zdmc+',
        'expected': ''
    },
    {
        'name': 'URL-based context #20',
        'payload': 'javascript:javascript:alert(41)',
        'expected': ''
    },
    {
        'name': 'URL-based context #21',
        'payload': 'javascript&colon;a&#x6C;&#101rt(42)',
        'expected': ''
    },
    {
        'name': 'URL-based context #22',
        'payload': 'javascript&colon;a&#x6C;&#101rt(43)> ',
        'expected': ''
    },
    {
        'name': 'URL-based context #23',
        'payload': 'jav&#x09;as&#x0A;cript&#x0D;:alert(44)',
        'expected': ''
    },
    {
        'name': 'URL-based context #24',
        'payload': 'jav&#x000009;as&#x00000A;cript&#x00000D;:alert(45)',
        'expected': ''
    },
    {
        'name': 'URL-based context #25',
        'payload': '&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;:alert(46)',
        'expected': ''
    },
    {
        'name': 'URL-based context #26',
        'payload': '&#106&#97&#118&#97&#115&#99&#114&#105&#112&#116:alert(47)',
        'expected': ''
    },
    {
        'name': 'URL-based context #27',
        'payload': '&#0000106&#000097&#0000118&#000097&#0000115&#000099&#0000114&#0000105&#0000112&#0000116:alert(48)',
        'expected': ''
    },
    {
        'name': 'URL-based context #28',
        'payload': 'data:text/html;base64,PHNjcmlwdD5hbGVydChkb2N1bWVudC5kb21haW4pOzwvc2NyaXB0Pg==',
        'expected': ''
    },
    {
        'name': 'URL-based context #29',
        'payload': '&#1&#2&#3&#4&#5&#6&#7&#8&#11&#12&NewLine;javascript:alert(50)',
        'expected': ''
    },
    {
        'name': 'URL-based context #30',
        'payload': 'data:,alert(51)',
        'expected': ''
    },
    {
        'name': 'URL-based context #31',
        'payload': 'data:text/plain,PHNjcmlwdD5hbGVydChkb2N1bWVudC5kb21haW4pOzwvc2NyaXB0Pg==',
        'expected': 'data:text/plain,PHNjcmlwdD5hbGVydChkb2N1bWVudC5kb21haW4pOzwvc2NyaXB0Pg=='
    },
    {
        'name': 'URL-based context #32',
        'payload': 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
        'expected': ''
    },
    {
        'name': 'URL-based context #33',
        'payload': 'd&#x61;t&#x61;&colon;text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
        'expected': ''
    },
    {
        'name': 'URL-based context #34',
        'payload': 'data:text/html;base64wakemeupbeforeyougogo,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
        'expected': ''
    },
    {
        'name': 'URL-based context #35',
        'payload': 'data:text/html:       ;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
        'expected': ''
    },
    {
        'name': 'URL-based context #36',
        'payload': 'data:text/html;base64,,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
        'expected': ''
    }
];

var sanitizer = function() {
    var dirty = location.hash.substring(1);
    return DOMSanitizer.sanitize(dirty, {CONTEXTS: ['url']});
};

module.exports = {tests: tests, sanitizer: sanitizer};
