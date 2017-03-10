var path = require('path');
var webpack = require('webpack');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin')
var uglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, './src/app/index.module.js'),
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
                test: /\.woff$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: /\.woff2$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: /\.ttf$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: /\.eot$/,
                loader: 'file'
            },
            {
                test: /\.svg$/,
                loader: 'url-loader?limit=100000'
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
        //new uglifyJsPlugin({sourceMap: false, mangle: false})
    ],
    output: { path: path.resolve(__dirname, "./build"), publicPath: "/assets/", filename: 'bundle.js' }
}