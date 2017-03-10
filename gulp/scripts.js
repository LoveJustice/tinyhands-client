'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin')
var uglifyJsPlugin = require('uglifyjs-webpack-plugin');
var util = require('gulp-util');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');

function webpackBuild(watch, callback) {
  var webpackOptions = {
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, enforce: 'pre', loader: 'jshint-loader'},
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
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
    output: { filename: 'index.module.js' }
  };

  if(watch) {
    webpackOptions.devtool = 'inline-source-map';
  }

  var webpackChangeHandler = function(err, stats) {
    if(err) {
      conf.errorHandler('Webpack')(err);
    }
    util.log(stats.toString({
      colors: util.colors.supportsColor,
      chunks: false,
      hash: false,
      version: false
    }));
    browserSync.reload();
    if(watch) {
      watch = false;
      callback();
    }
  };

  return gulp.src(path.join(conf.paths.src, '/app/index.module.js'))
    .pipe(webpackStream(webpackOptions, webpack, webpackChangeHandler))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app')));
}

gulp.task('scripts', function () {
  return webpackBuild(false);
});

gulp.task('scripts:watch', ['scripts'], function (callback) {
  return webpackBuild(true, callback);
});
