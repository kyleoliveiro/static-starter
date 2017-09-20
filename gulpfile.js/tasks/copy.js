const path        = require('path');
const gulp        = require('gulp');
const gutil       = require('gulp-util');
const size        = require('gulp-size');

const config = require('../config');



/**
 * Copy static assets
 * 
 * @param {string|array} srcPath Path to static asset files
 * @param {string} destPath Path to destination folder
 * @param {function} cb Callback function
 * @return {stream}
 */
const copyStaticAssets = (srcPath, destPath, cb) => {
  gutil.log(`\n📦  ${gutil.colors.yellow('Copying')} ${gutil.colors.blue(srcPath)} → ${gutil.colors.blue(destPath)}\n`);

  return gulp.src(srcPath)
    .pipe(size({
      showFiles: true
    }))
    .pipe(size({
      showFiles: true,
      gzip: true
    }))
    .pipe(gulp.dest(destPath))
    .on('end', () => {
      gutil.log(`\n${gutil.colors.green('Copied')} ${gutil.colors.blue(srcPath)}\n`);
      cb();
    })
}



// Register gulp tasks
gulp.task('copy', (cb) => {
  const srcPath  = path.join(config.path.src.static, '**/*');
  const destPath = config.path.dest.static;

  copyStaticAssets(srcPath, destPath, cb);
});
