'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var angularTemplatecache = require('gulp-angular-templatecache');
var csso = require('gulp-csso');
var del = require('del');
var filter = require('gulp-filter');
var flatten = require('gulp-flatten');
var inject = require('gulp-inject');
var mainBowerFiles = require('main-bower-files');
var minifyHtml = require('gulp-minify-html');
var ngAnnotate = require('gulp-ng-annotate');
var replace = require('gulp-replace');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var size = require('gulp-size');
var useref = require('gulp-useref');

gulp.task('partials', function () {
  return gulp.src([
    path.join(conf.paths.src, '/app/**/*.html'),
    path.join(conf.paths.tmp, '/serve/app/**/*.html')
  ])
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(angularTemplatecache('templateCacheHtml.js', {
      module: 'tinyhandsFrontend',
      root: 'app'
    }))
    .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(conf.paths.tmp, '/partials'),
    addRootSlash: false
  };

  var htmlFilter = filter('*.html', {restore: true});
  var jsFilter = filter('**/*.js', {restore: true});
  var cssFilter = filter('**/*.css', {restore: true});
  var assets;

  return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
    .pipe(inject(partialsInjectFile, partialsInjectOptions))
    .pipe(rev())
    .pipe(jsFilter)
    .pipe(ngAnnotate())
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(replace('../../bower_components/bootstrap/fonts/', '../fonts/'))
    .pipe(csso())
    .pipe(cssFilter.restore)
    .pipe(useref())
    .pipe(revReplace())
    .pipe(htmlFilter)
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true,
      conditionals: true
    }))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe(size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
  return gulp.src(mainBowerFiles().concat('bower_components/bootstrap/fonts/*'))
    .pipe(filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe(flatten())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

gulp.task('other', function () {
  var fileFilter = filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
    path.join(conf.paths.src, '/**/*'),
    path.join('!' + conf.paths.src, '/**/*.{html,css,js,less}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('clean', function (done) {
  del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')], done);
});

gulp.task('api:local', function () {
    changeBaseUrl(conf.apiUrls.local);
});

gulp.task('api:develop', function () {
    changeBaseUrl(conf.apiUrls.develop);
});

gulp.task('api:master', function () {
    changeBaseUrl(conf.apiUrls.master);
});

function changeBaseUrl(url) {
    var config = path.join(conf.paths.src, 'app/constants.js');
    gulp.src([config])
        .pipe(replace(/BaseUrl:\s'http.+'/i, "BaseUrl: '" + url + "'"))
        .pipe(gulp.dest(path.join(conf.paths.src, 'app')));
}



gulp.task('build:local', ['api:local', 'build']);

gulp.task('build:develop', ['api:develop', 'build']);

gulp.task('build:master', ['api:master', 'build']);

gulp.task('build', ['html', 'fonts', 'other']);
