/* global DOMSanitizer */
var tests = [
    {
        'name': 'Safe JSON should not be sanitized',
        'payload': '{"foo":{"bar":1}}',
        'expected': '%7B%22foo%22:%7B%22bar%22:1%7D%7D'
    },
    {
        'name': 'Unsafe JSON should be sanitized',
        'payload': '{"<script>alert(1)<\/script>111111":1111111111}',
        'expected': ''
    },
    {
        'name': 'HTML context #1',
        'payload': '{{alert(1)}}',
        'expected': ''
    },
    {
        'name': 'HTML context #2',
        'payload': '<% alert(1) %>',
        'expected': ''
    },
    {
        'name': 'HTML context #3',
        'payload': '{{12345}}<% 123456 %>',
        'expected': ''
    },
    {
        'name': 'HTML context #4',
        'payload': '<a>123</a><option><style><img src=x onerror=alert(1)>',
        'expected': ''
    },
    {
        'name': 'HTML context #5',
        'payload': '<script>alert(1)<\/script>',
        'expected': ''
    },
    {
        'name': 'HTML context #6',
        'payload': '<\/script><script>alert(1)<\/script>',
        'expected': ''
    },
    {
        'name': 'HTML context #7',
        'payload': '<img src=xx: onerror=alert(1)>',
        'expected': ''
    },
    {
        'name': 'HTML context #8',
        'payload': '<form name="window">',
        'expected': ''
    },
    {
        'name': 'HTML context #9',
        'payload': '<img src="x" name="implementation">',
        'expected': ''
    },
    {
        'name': 'HTML context #10',
        'payload': '<svg onload=alert(1)>',
        'expected': ''
    },
    {
        'name': 'HTML context #11',
        'payload': '<a href="javascript:alert(1)>click me</a>">',
        'expected': ''
    },
    {
        'name': 'HTML context #12',
        'payload': '<a href="vbscript:alert(1)>click me</a>">',
        'expected': ''
    },
    {
        'name': 'HTML context #13',
        'payload': '<a href="barbazfoo://evil.com">click me</a>',
        'expected': ''
    },
    {
        'name': 'HTML context #14',
        'payload': '<a href="http://evil.com">click me</a>',
        'expected': ''
    },
    {
        'name': 'HTML context #15',
        'payload': '<svg><a xlink:href="http://evil.com/"><circle r=40></a></svg>',
        'expected': ''
    },
    {
        'name': 'HTML context #16',
        'payload': '<math href="http://evil.com/">CLICKME</math>',
        'expected': ''
    },
    {
        'name': 'HTML context #17',
        'payload': '<form action="http://evil.com/"><input type="submit"></form>',
        'expected': ''
    },
    {
        'name': 'HTML context #18',
        'payload': '<map name="test"><area href="http://evil.com/" shape="rect" coords="0,0,200,200"></area></map>',
        'expected': ''
    },
    {
        'name': 'HTML context #19',
        'payload': '<a>123{{456}}<b><style></style>456</b></a>',
        'expected': ''
    },
    {
        'name': 'HTML context #20',
        'payload': '<a>123{{<b>456}}</b><style></style>456</a>',
        'expected': ''
    },
    {
        'name': 'HTML context #21',
        'payload': '<a>123{{456}}<b><style><% alert(1) %></style>456</b></a>',
        'expected': ''
    },
    {
        'name': 'HTML context #22',
        'payload': '<a>123{{<b>456}}</b><style><% alert(1) %></style>456</a>',
        'expected': ''
    }
];

var sanitizer = function() {
    var dirty = location.hash.substring(1);
    return DOMSanitizer.sanitize(dirty, {CONTEXTS: ['dom']});
};

module.exports = {tests: tests, sanitizer: sanitizer};
