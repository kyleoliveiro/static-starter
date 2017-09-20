const path     = require('path');
const gulp    = require('gulp');
const gutil   = require('gulp-util');
const sitemap = require('gulp-sitemap');

const config = require('../config');



/**
 * Generate an xml sitemap
 * 
 * @param {string|array} srcPath Path to .html files
 * @param {string} destPath Path to destination folder
 * @param {function} cb Callback function
 * @return {stream}
 */
const generateSitemap = (srcPath, destPath, cb) => {
  gutil.log(`\n🗺  ${gutil.colors.yellow('Generating sitemap')} ${gutil.colors.blue(srcPath)} → ${gutil.colors.blue(destPath)}\n`);

  gulp.src(srcPath, {read: false})
    .pipe(sitemap(config.options.sitemap()))
    .pipe(gulp.dest(destPath))
    .on('end', () => {
      gutil.log(`\n${gutil.colors.green('Sitemap generated')} ${gutil.colors.blue(srcPath)}\n`);
      cb();
    })
}



// Register gulp tasks
const srcPath  = path.join(config.path.dest.templates, '**/*.html');
const destPath = config.path.dest.templates;

gulp.task('sitemap', (cb) => {
  generateSitemap(srcPath, destPath, cb);
});
