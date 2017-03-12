var path = require('path');
var webpack = require('webpack');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    context: __dirname + '/src',
    entry: './app/index.module.js',
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, enforce: 'pre', loader: 'jshint-loader'},
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},                                    
            { 
                test: /\.html$/,
                use: [
                    {loader: 'ngtemplate-loader?relativeTo=/src/app/'},
                    {loader: 'html-loader'}
                ] 
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'less-loader'
                ]
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=100000&minetype=application/font-woff'
            },
            {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?/,
                loader: 'url-loader?limit=100000&minetype=application/font-woff'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=100000&minetype=application/octet-stream'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=100000&minetype=image/svg+xml'
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
        new ngAnnotatePlugin(),
        new CopyWebpackPlugin([{from: 'assets/images/', to: 'images/'}]),
    ],
    output: { path: path.resolve(__dirname, "./build/assets"), publicPath: "/assets/", filename: 'bundle.js' }
}