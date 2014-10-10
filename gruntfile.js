module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.initConfig({
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    'public/app/app.js',
                    'public/app/directives/*.js',
                    'public/app/common/*.js',
                    'public/app/gamemodels/*.js',
                    'public/app/account/*.js',
                    'public/app/utilities/*.js',
                    'public/app/resources/*.js',
                    'public/app/**/*.js',
                ],
                dest: 'public/all.js'
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: 'results.txt',
                    quiet: false
                },
                src: ['server/tests/**/*.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

// register at least this one task
    grunt.registerTask('default', [ 'concat' ]);
    grunt.registerTask('test', 'mochaTest');
};