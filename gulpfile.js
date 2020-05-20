const gulp = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const sass = require('gulp-sass');


const config = {
  JS_SOURCES: ['./src/js/*.js'],
  JS_OUT_DIR: './dist/js/',
  SASS_SOURCES: ['./src/**/*.sass'],
  SASS_OUT_DIR: './dist/css/',
};

gulp.task('build:js', () => {
  return gulp.src(config.JS_SOURCES)
      .pipe(webpackStream(webpackConfig, webpack))
      .pipe(gulp.dest(config.JS_OUT_DIR));
});

gulp.task('watch:js', () => {
  let webpackDevConfig = Object.assign({}, webpackConfig, {
    // mode: 'development',
    watch: true,
  });
  return gulp.src(config.JS_SOURCES)
      .pipe(webpackStream(webpackDevConfig, webpack))
      .pipe(gulp.dest(config.JS_OUT_DIR));
});

gulp.task('build:sass', () => {
  return gulp.src(config.SASS_SOURCES)
      .pipe(sass({
        outputStyle: 'compressed',
      })).on('error', sass.logError)
      .pipe(rename(((path) => {
        path.basename += '.min';
      })))
      .pipe(autoprefixer())
      .pipe(gulp.dest(config.SASS_OUT_DIR));
});

gulp.task('watch:sass', () => {
  gulp.watch(config.SASS_SOURCES, gulp.series('build:sass'));
});

gulp.task('watch',
    gulp.parallel('watch:js', gulp.series('build:sass', 'watch:sass')));

gulp.task('build', gulp.parallel('build:js', 'build:sass'));
gulp.task('dev', gulp.series('watch'));
