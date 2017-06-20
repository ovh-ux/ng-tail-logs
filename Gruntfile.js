// Generated on 2016-05-04 using generator-ovh-angular-component 0.1.0
module.exports = function (grunt) {
    "use strict";
    require("matchdep").filterAll("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg      : grunt.file.readJSON("package.json"),
        bower    : grunt.file.readJSON("bower.json"),
        distdir  : "dist",
        srcdir   : "src",
        builddir : ".work/.tmp",
        name     : grunt.file.readJSON("package.json").name || "ovh-tail-logs",   // module name

        // Clean
        clean      : {
            dist : {
                src : [
                    "<%= builddir %>",
                    "<%= distdir %>"
                ]
            }
        },

        // Copy files
        copy : {
            // Copy concatened JS file from builddir to dist/
            dist : {
                files : [{
                    "<%= distdir %>/ovh-tail-logs.js" : "<%= builddir %>/ovh-tail-logs.js"
                }, {
                    expand : true,
                    cwd : "<%= srcdir %>",
                    dest: "<%= distdir %>",
                    src : [
                        "**/translations/*.json"
                    ]
                }]
            }
        },

        // Concatenation
        concat     : {
            dist : {
                files : {
                    "<%= builddir %>/ovh-tail-logs.js" : [
                        "<%= srcdir %>/ovh-tail-logs.js",
                        "<%= srcdir %>/**/*.js",
                        "<%=builddir%>/templates.js",
                        "!<%= srcdir %>/**/*.spec.js",
                        "!<%= srcdir %>/**/*.mock.js"
                    ]
                }
            }
        },

        // ngMin
        ngAnnotate: {
            dist: {
                files: {
                    "<%= builddir %>/ovh-tail-logs.js" : ["<%= builddir %>/ovh-tail-logs.js"]
                }
            }
        },

        // Obfuscate
        uglify   : {
            js : {
                options : {
                    banner : "/*! ovh-tail-logs - <%= pkg.version %> - <%= grunt.template.today('yyyy-mm-dd') %> */\n"
                },
                files   : {
                    "<%= distdir %>/ovh-tail-logs.min.js" : ["<%= builddir %>/ovh-tail-logs.js"]
                }
            }
        },

        // Create CSS from LESS
        less : {
            dist : {
                options: {
                    compress : false
                },
                files : {
                    "<%= builddir %>/<%= name %>.css" : ["less/<%= name %>.less"]
                }
            }
        },

        // ... and its prefixed vendor styles
        postcss: {
            options: {
                processors: [
                    require('autoprefixer-core')({browsers: ['last 3 versions', 'ie >= 9', '> 5%']})
                ]
            },
            dist: {
                files: {
                    '<%= distdir %>/<%= name %>.css' : ['<%= builddir %>/<%= name %>.css']
                }
            }
        },

        // ... and now minify it
        cssmin : {
            options: {},
            dist : {
                files: {
                    '<%= distdir %>/<%= name %>.min.css' : ['<%= distdir %>/<%= name %>.css']
                }
            }
        },

        // JS Check
        jshint     : {
            options : {
                jshintrc : ".jshintrc",
                reporter: require("jshint-stylish")
            },
            js      : [
                "<%= srcdir %>/*.js",
                "<%= srcdir %>/*/*.js",
                "!<%= srcdir %>/**/*.spec.js"
            ]
        },

        // Check complexity
        complexity : {
            generic : {
                src     : [
                    "<%= srcdir %>/**/*.js",
                    "!<%= srcdir %>/**/*.spec.js"
                ],
                options : {
                    errorsOnly      : false,
                    cyclomatic      : 12,
                    halstead        : 45,
                    maintainability : 82
                }
            }
        },

        // Watch
        delta : {
            dist: {
                files : ["<%= srcdir %>/**/*", "!<%= srcdir %>/**/*.spec.js"],
                tasks: ["buildProd"]
            },
            test: {
                files : ["<%= srcdir %>/**/*.spec.js"],
                tasks: ["test"]
            }
        },

        // To release
        bump       : {
            options : {
                pushTo        : "origin",
                files         : [
                    "package.json",
                    "bower.json"
                ],
                updateConfigs : ["pkg", "bower"],
                commitFiles   : ["-a"]
            }
        },

        // Testing
        karma: {
            unit: {
                configFile: "karma.conf.js",
                singleRun: true
            }
        },

        jscs: {
            src: [
                "<%= srcdir %>/*.js",
                "<%= srcdir %>/*/*.js",
                "!<%= srcdir %>/**/*.spec.js"
            ],
            options: {
                config: ".jscsrc",
                verbose: true
            }
        },

        // Documentation
        ngdocs: {
            options: {
                dest: "docs",
                html5Mode: false,
                title: "Manager tail logs",
                startPage: "docs/ovhTailLogs"
            },
            docs: {
                src: ["src/**/*.js"],
                title: "API",
                api: true
            }
        },

        // DOCS connect
        connect : {
           docs : {
               options : {
                   port : 9090,
                   base : "docs/",
                   keepalive : true
               }
           }
        },

        // Package all the html partials into a single javascript payload
        ngtemplates: {
            options: {
                // This should be the name of your apps angular module
                module: "ovh-tail-logs",
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                }
            },
            main: {
                cwd: "<%=srcdir%>",
                src: ["**/*.html"],
                dest: "<%=builddir%>/templates.js"
            }
        },

        // translation
        ovhTranslation: {
            dev: {
                files: [{
                    expand: true,
                    src: ["<%= srcdir %>/**/translations/*.xml"],
                    // dest: "<%= srcdir %>",
                    filter: "isFile",
                    extendFrom: ["en_GB", "fr_FR"]
                }]
            }
        },

        wiredep: {
            test: {
                src: "./karma.conf.js",
                devDependencies: true
            }
        }
    });

    grunt.registerTask("buildProd", [
        "clean",
        "ovhTranslation",
        "ngtemplates",
        "jshint",
        "complexity",
        "concat:dist",
        "ngAnnotate",
        "uglify",
        "less",
        "postcss",
        "cssmin",
        "copy:dist",
        "ngdocs"
    ]);

    grunt.registerTask("default", ["buildProd"]);

    grunt.task.renameTask("watch", "delta");
    grunt.registerTask("watch", ["buildProd", "delta"]);

    grunt.registerTask("test", ["wiredep", "jshint", "jscs", "karma"]);

    // Increase version number. Type = minor|major|patch
    grunt.registerTask("release", "Release", function () {
        var type = grunt.option("type");

        if (type && ~["patch", "minor", "major"].indexOf(type)) {
            grunt.task.run(["bump-only:" + type]);
        } else {
            grunt.verbose.or.write("You try to release in a weird version type [" + type + "]").error();
            grunt.fail.warn("Please try with --type=patch|minor|major");
        }
    });

};
