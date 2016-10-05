/* global casper */
var fs = require('fs');
var url = 'http:/localhost:9000/tmp/samples/page.html';


casper.test.begin('DOM XSS in JavaScript context tests', function suite(test) {
    casper.start();
    // eslint-disable-next-line no-unused-vars
    var dir = [fs.workingDirectory, 'test', 'spec'].join('/');
    var paths = fs.list(dir);
    
    paths.forEach(function(filename) {
        if (filename === '.' || filename === '..') {
            return;
        }
        var suite = require(dir + '/' + filename);
        suite.tests.forEach(function(ctest) {
            casper.thenOpen(url + '#' + ctest.payload, function() {
                test.assertEquals(this.evaluate(suite.sanitizer), ctest.expected, ctest.name);
            });
        });
    });

    casper.run(function() {
        test.done();
    });
});
