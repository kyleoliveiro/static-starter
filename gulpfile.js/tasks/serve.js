const path        = require('path');
const gulp        = require('gulp');
const gutil       = require('gulp-util');
const browserSync = require('browser-sync').create();

const config = require('../config');



/**
 * Serve files from dist folder,
 * Perform live reload when files change
 */
const serve = () => {
  gutil.log(`\n🍦  ${gutil.colors.yellow('Serving')} from ${gutil.colors.blue(config.options.browserSync().server.baseDir)}\n`);

  browserSync.init(config.options.browserSync());

  gulp.watch(path.join(config.path.dest.base, '/**/*')).on('change', () => {
    browserSync.reload();
  });
}



// Register gulp tasks
gulp.task('serve', serve);
