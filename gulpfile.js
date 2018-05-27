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
  gulp.src(config.JS_SOURCES)
  .pipe(webpackStream(webpackConfig, webpack))
  .pipe(gulp.dest(config.JS_OUT_DIR));
});

gulp.task('watch:js', () => {
  webpackConfig.watch = true;
  gulp.src(config.JS_SOURCES)
      .pipe(webpackStream(webpackConfig, webpack))
      .pipe(gulp.dest(config.JS_OUT_DIR));
});

gulp.task('build:sass', () => {
  gulp.src(config.SASS_SOURCES)
      .pipe(sass({
        outputStyle: 'compressed',
      })).on('error', sass.logError)
      .pipe(rename(((path) => {
        path.basename += '.min';
      })))
      .pipe(autoprefixer({
        browsers: [
          'last 1 version',
          'last 2 iOS versions',
        ],
      }))
      .pipe(gulp.dest(config.SASS_OUT_DIR));
});

gulp.task('watch:sass', () => {
  gulp.watch(config.SASS_SOURCES, ['build:sass']);
});

gulp.task('build', ['build:js', 'build:sass']);
gulp.task('dev', ['build:sass', 'watch:js', 'watch:sass']);
