// TODO : Neet to check from vue project
var webpackConfig = require('./webpack.config.js');

module.exports = function (config) {
    config.set({
        // To run in additional browsers:
        // 1. install corresponding karma launcher
        //    http://karma-runner.github.io/0.13/config/browsers.html
        // 2. add it to the `browsers` array below.
        browsers: ['PhantomJS'],
        frameworks: ['mocha', 'sinon-chai'],
        reporters: ['spec', 'coverage'],
        files: [
            './index.js',
            './test/*.spec.js'
        ],
        preprocessors: {
            '**/*.js': ['webpack', 'sourcemap']
        },
        // ** ADD THIS IN ** (vue-cli's webpack template doesn't add it by default)
        plugins: [
            // Launchers
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',

            // Test Libraries
            'karma-mocha',
            'karma-sinon-chai',

            // Preprocessors
            'karma-webpack',
            'karma-sourcemap-loader',

            // Reporters
            'karma-spec-reporter',
            'karma-coverage'
        ],
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        },
        coverageReporter: {
            dir: './coverage',
            reporters: [
                { type: 'lcov', subdir: '.' },
                { type: 'text-summary' }
            ]
        }
    })
}
