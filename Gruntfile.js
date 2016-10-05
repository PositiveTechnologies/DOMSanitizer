/* global module:true, require:true */
/* eslint-disable disable-line global-require */
/* eslint-disable object-curly-newline */
module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        fixturesPath: 'test/fixtures',
        concat: {
            dist: {
                src: [
                    'node_modules/dompurify/src/*.js',
                    'node_modules/acorn/dist/acorn.js',
                    'src/sanitizer.js'
                ],
                dest: 'dist/sanitizer.js'
            }
        },
        htmlbuild: {
            commonTests: {
                src: [
                    'test/fixtures/*.html'
                ],
                dest: 'tmp/samples/',
                options: {
                    beautify: true,
                    relative: true,
                    scripts: {
                        bundle: [
                            'dist/sanitizer.js'
                        ]
                    },
                    styles: {
                        bundle: [
                        ]
                    }
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 9000,
                    hostname: '*',
                    keepalive: false
                }
            }
        },
        casper: {
            dist: {
                options: {
                    args: ['--web-security=no'],
                    test: true,
                    concise: true
                },
                files: {
                    'xunit/casper-results.xml': ['test/run.js']
                }
            }
        },
        eslint: {
            target: {
                src: ['src/*.js', 'Gruntfile.js', 'test/**/*.js']
            }
        },
        jsvalidate: {
            options: {
                globals: {},
                esprimaOptions: {},
                verbose: true
            },
            targetName: {
                files: {
                    src: ['Gruntfile.js', 'src/*.js', 'test/**/*.js']
                }
            }
        },
        clean: ['tmp/']
    });
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-jsvalidate');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-html-build');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-casper');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Building.
    grunt.registerTask('build', [
        'jsvalidate',
        'eslint',
        'concat'
    ]);

    // Testing.
    grunt.registerTask('test', [
        'htmlbuild',
        'connect',
        'casper:dist',
        'clean'
    ]);

    // Default task.
    grunt.registerTask('default', [
        'build', 'test'
    ]);
};
