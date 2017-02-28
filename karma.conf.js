'use strict';

var path = require('path');
var conf = require('./gulp/conf');

var _ = require('lodash');
var wiredep = require('wiredep');

function listFiles() {
    var wiredepOptions = _.extend({}, conf.wiredep, {
        dependencies: true,
        devDependencies: true
    });

    return wiredep(wiredepOptions).js
        .concat([
            path.join(conf.paths.tmp, '/serve/app/index.module.js'),
            path.join(conf.paths.src, '/**/*.spec.js'),
            path.join(conf.paths.src, '/**/*.html')
        ]);
}

function generateWebpackConfig() {
    return {
        files: listFiles(),

        singleRun: true,

        autoWatch: false,

        frameworks: ['jasmine'],

        ngHtml2JsPreprocessor: {
            stripPrefix: 'src/',
            moduleName: 'tinyhandsFrontend'
        },

        browsers : ['PhantomJS'],

        plugins : [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-ng-html2js-preprocessor',
            'karma-webpack'
        ],

        preprocessors: {
            'src/**/*.html': ['ng-html2js'],
            'src/**/*.spec.js': ['webpack']
        },

        webpack: {
            watch: false,
            module: {
                rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}]
            },
        },

        webpackMiddleware: {
           noInfo: true,
        }
    };
}

module.exports = function(config) {
    config.set(generateWebpackConfig());
};

