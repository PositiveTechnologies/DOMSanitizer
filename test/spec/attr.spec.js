/* global DOMSanitizer */
'use strict';

var tests = [
    {
        'name': 'Attribute-based context #1',
        'payload': '" onload="alert(1)',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #2',
        'payload': '\' onload=\'alert(1)',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #3',
        'payload': 'onload=a;a=1;alert(1)',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #4',
        'payload': 'x%20onload=alert(1)',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #5',
        'payload': 'x"onload=alert(1)"',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #6',
        'payload': 'x" onload="alert(1)',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #7',
        'payload': 'onload=aaa=bbb=alert(1)',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #8',
        'payload': 'onload = "x=alert(1)"',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #9',
        'payload': 'x/onload = "x=alert(1)"',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #10',
        'payload': 'onload=alert(1)',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #11',
        'payload': 'onmssitemodejumplistitemremoved=alert(1)',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #12',
        'payload': 'src=`%00`&NewLine; oncut=alert(1)&NewLine;',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #13',
        'payload': '1111111',
        'expected': '1111111'
    },
    {
        'name': 'Attribute-based context #14',
        'payload': 'inbox',
        'expected': 'inbox'
    },
    {
        'name': 'Attribute-based context #15',
        'payload': 'onerror=alert(1)',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #16',
        'payload': 'onerror=1 onload=alert(1)',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #17',
        'payload': '"onmouseover="scanPage()"a="',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #18',
        'payload': '" onmouseover=scanPage()"',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #19',
        'payload': '            onmouseover            =                 alert(1)',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #20',
        'payload': ' onload="1" onclick="alert(1)"',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #21',
        'payload': 'Foobar" onmouseover=location&#x3d;"javascript:alert\x28document.domain\x29"',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #22',
        'payload': 'onerror=" onmouseover="alert(1)',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #23',
        'payload': 'onerror=" onmouseover="alert(1)"',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #24',
        'payload': 'alert(1)',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #25',
        'payload': 'alert(1);alert(2)',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #26',
        'payload': 'location="//evil.com"',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #27',
        'payload': '\' onLoad="alert(1);//"',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #28',
        'payload': '\' onLoad="alert(1);//',
        'expected': ''
    },
    // https://packetstormsecurity.com/files/139631/wpcalendar-xss.txt
    {
        'name': 'Attribute-based context #29',
        'payload': 'whoeiii\\%22%20accesskey=x%20onclick=alert(1);//',
        'expected': ''
    },

    {
        'name': 'Attribute-based corruption #1',
        'payload': '" onerror="1',
        'expected': ''
    },
    {
        'name': 'Attribute-based corruption #2',
        'payload': 'mc\'donalds',
        'expected': 'mc\'donalds'
    },
    {
        'name': 'Attribute-based corruption #2',
        'payload': 'mc\'donalds',
        'expected': 'mc\'donalds'
    },
    {
        'name': 'Normal test #1',
        'payload': 'onclick=true',
        'expected': 'onclick=true'
    },
    {
        'name': 'Normal test #1',
        'payload': 'onclick=true',
        'expected': 'onclick=true'
    },
    {
        'name': 'Normal test #2',
        'payload': 'onwards=forward',
        'expected': 'onwards=forward'
    }
];

var sanitizer = function() {
    var dirty = location.hash.substring(1);
    return DOMSanitizer.sanitize(dirty, {CONTEXTS: ['attr']});
};

module.exports = {tests: tests, sanitizer: sanitizer};
