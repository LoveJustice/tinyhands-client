var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var NgAnnotatePlugin = require('ng-annotate-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

function getOutputFileName(env) {
    var  addHash = env.production || env.staging;
    return `js/[name]${addHash ? '.[chunkhash]' : ''}.js`;
}

function getServerApiUrl(env) {
    if(env.production) {
        return '"https://tinyhandsdreamsuite.org/"';
    }
    else if(env.staging) {
        return '"https://staging.tinyhandsdreamsuite.org/"';
    }
    else {
        return '"http://localhost/"';
    }
}

function getOutputPath(env) {
    var outputPath = 'build';
    if(env.production || env.staging) {
        outputPath = "dist";
    }
    return path.resolve(__dirname, outputPath);
}

module.exports = function(env) {
    return {
        context: __dirname + '/src',
        entry: {
            app: './app/index.module.js'
        },
        module: {
            rules: [
                {test: /\.js$/, exclude: /node_modules/, enforce: 'pre', loader: 'jshint-loader'},
                {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
                {
                    test: /src[\/|\\]app[\/|\\].*\.html$/,
                    use: [
                        {loader: 'ngtemplate-loader?relativeTo=/src/app/'},
                        {loader: 'html-loader'}
                    ]
                },
                {
                    test: /.index.html$/,
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
                API_URL: getServerApiUrl(env)
            }),
            new NgAnnotatePlugin(),
            new CopyWebpackPlugin([
                {from: 'assets/images/', to: 'assets/images/'},
                {from: 'favicon.ico'}
            ]),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: function (module) {
                    return module.context && module.context.indexOf('node_modules') !== -1;
                }
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest',
                minChunks: Infinity
            }),
            new HtmlWebpackPlugin({
                template: 'index.html'
            })
        ],
        output: {
            path: getOutputPath(env),
            publicPath: "/",
            filename: getOutputFileName(env)
        }
    };
};