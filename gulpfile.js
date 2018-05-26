const gulp = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

const config = {
  JS_SOURCES: ['./src/js/*.js'],
  JS_OUT_DIR: './dist/js/',
};

gulp.task('dev', () => {
  webpackConfig.watch = true;
  gulp.src(config.JS_SOURCES)
      .pipe(webpackStream(webpackConfig, webpack))
      .pipe(gulp.dest(config.JS_OUT_DIR));
});

gulp.task('build', () => {
  gulp.src(config.JS_SOURCES)
      .pipe(webpackStream(webpackConfig, webpack))
      .pipe(gulp.dest(config.JS_OUT_DIR));
});
