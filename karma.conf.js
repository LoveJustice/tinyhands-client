'use strict';

var path = require('path');
var _ = require('lodash');
var webpack = require('webpack');
var config = require('./webpack.config');
var NgAnnotatePlugin = require('ng-annotate-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

function generateWebpackConfig() {
    return {
        files: ['test.webpack.js'],

        singleRun: true,

        autoWatch: false,

        frameworks: ['jasmine'],

        browsers : ['PhantomJS'],

        plugins : [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-webpack'
        ],

        preprocessors: {
            'test.webpack.js': ['webpack']
        },

        webpack: {
            context: __dirname + '/src',
            module: {
                rules: [
                    {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
                    {
                        test: /src\/app\/.*\.html$/,
                        use: [
                            {loader: 'ngtemplate-loader?relativeTo=/src/app/'},
                            {loader: 'html-loader'}
                        ]
                    },
                    {
                        test: /.*\/index.html$/,
                        loader: 'html-loader'
                    },
                    {
                        test: /\.less$/,
                        use: [
                            'style-loader',
                            {loader: 'css-loader', options: {importLoaders: 1}},
                            'less-loader'
                        ]
                    },
                    {
                        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                        loader: 'url-loader?limit=100000&minetype=application/font-woff&publicPath=assets/&outputPath=/assets/'
                    },
                    {
                        test: /\.woff2(\?v=\d+\.\d+\.\d+)?/,
                        loader: 'url-loader?limit=100000&minetype=application/font-woff&publicPath=assets/&outputPath=/assets/'
                    },
                    {
                        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                        loader: 'url-loader?limit=100000&minetype=application/octet-stream&publicPath=assets/&outputPath=/assets/'
                    },
                    {
                        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                        loader: 'file-loader?publicPath=assets/&outputPath=/assets/'
                    },
                    {
                        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                        loader: 'url-loader?limit=100000&minetype=image/svg+xml&publicPath=assets/&outputPath=/assets/'
                    }
                ]
            },
            plugins: [
                new webpack.ProvidePlugin({
                    '_': 'lodash',
                    '$': 'jquery',
                    'jQuery': 'jquery',
                    'window.jQuery': 'jquery',
                    'moment': 'moment',
                    'window.moment': 'moment',
                }),
                new webpack.DefinePlugin({
                    API_URL: '"http://localhost/"'
                }),
                new NgAnnotatePlugin(),
                new HtmlWebpackPlugin({
                    template: 'index.html'
                })
            ],
            output: {
                path: path.resolve(__dirname, './build'),
                publicPath: "/",
                filename: "js/bundle.js"
            }
        },

        webpackMiddleware: {
           noInfo: true,
        }
    };
}

module.exports = function(config) {
    config.set(generateWebpackConfig());
};

