/**
 * Created by sergey on 2/16/15.
 */
var gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task('lint', function () {
  return gulp.src(['./**/*.js', '!oz.public/libs/**/*', '!node_modules/**/*', '!design/**/*'])
    .pipe(eslint())
    .pipe(eslint.format());
        //.pipe(eslint.failOnError());
});

gulp.task('default', ['lint'], function () {

});
