const path    = require('path');
const del     = require('del');
const gulp    = require('gulp');
const gutil   = require('gulp-util');
const plumber = require('gulp-plumber');

const config = require('../config');



/**
 * Delete specified files and folders
 * 
 * @param {array} destPaths Array of paths to delete
 * @param {function} cb Callback function
 */

const clean = (destPaths, cb) => {
  gutil.log(`\n🗑  ${gutil.colors.yellow('Cleaning')} ${gutil.colors.blue(destPaths)}\n`);

  del(destPaths).then((paths) => {
    if(paths.length > 0) {
      gutil.log(`\n${gutil.colors.green('Deleted')} ${gutil.colors.blue(paths.join('\n'))}\n`)
    }

    cb();
  });
}



// Register gulp tasks
gulp.task('clean:templates', (cb) => {
  clean(path.join(config.path.dest.templates, '**/*.html'), cb)
});

gulp.task('clean:styles', (cb) => {
  clean(config.path.dest.styles, cb)
});

gulp.task('clean:scripts', (cb) => {
  clean(config.path.dest.scripts, cb)
});

gulp.task('clean:images', (cb) => {
  clean(config.path.dest.images, cb)
});

gulp.task('clean:all', (cb) => {
  clean(config.path.dest.base, cb)
});

gulp.task('clean', ['clean:all']);
