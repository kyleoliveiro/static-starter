const path     = require('path');
const gulp     = require('gulp');
const gutil    = require('gulp-util');
const plumber  = require('gulp-plumber');
const imagemin = require('gulp-imagemin');

const config = require('../config');



/**
 * Minify images
 * 
 * @param {string|array} srcPath Path to template files
 * @param {string} destPath Path to destination folder
 * @param {function} cb Callback function
 * @return {stream}
 */
const minifyImages = (srcPath, destPath, cb) => {
  gutil.log(`\n🖼  ${gutil.colors.yellow('Minifying')} ${gutil.colors.blue(srcPath)} → ${gutil.colors.blue(destPath)}\n`);

  return gulp.src(srcPath)
    .pipe(plumber())
    .pipe(imagemin(config.options.imagemin()))
    .pipe(gulp.dest(destPath))
    .on('end', () => {
      gutil.log(`\n${gutil.colors.green('Minified')} ${gutil.colors.blue(srcPath)}\n`);
      cb();
    })
}



// Register gulp tasks
const srcPath  = path.join(config.path.src.images, '**/*');
const destPath = config.path.dest.images;

gulp.task('images', (cb) => {  
  minifyImages(srcPath, destPath, cb);
});
