var gulpNgConfig = require('gulp-ng-config');
var addStream = require('add-stream');
var concat = require('gulp-concat');
var gulp = require('gulp');

var replace = require('gulp-replace');

gulp.task('templates', function(){
  gulp.src(['src/app/base.service.template.js'])
    .pipe(replace('<-- BASE_URL -->', 'http://edwards.cse.taylor.edu:80/'))
    .pipe(gulp.dest('src/app/'));
});