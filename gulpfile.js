const gulp = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

gulp.task('dev', () => {
  webpackConfig.watch = true;
  gulp.src(['./src/js/*.js'])
      .pipe(webpackStream(webpackConfig, webpack))
      .pipe(gulp.dest('./dist/js/'));
});
