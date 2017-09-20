const path        = require('path');
const runSequence = require('run-sequence');
const gulp        = require('gulp');
const gutil       = require('gulp-util');
const plumber     = require('gulp-plumber');
const htmlmin     = require('gulp-htmlmin');
const htmlLint    = require('gulp-html-lint');
const template    = require('gulp-template');
const pug         = require('gulp-pug');
const size        = require('gulp-size');

const config = require('../config');


/**
 * Compile templates,
 * Minify HTML
 * 
 * @param {string|array} srcPath Path to template files
 * @param {string} destPath Path to destination folder
 * @param {function} cb Callback function
 * @return {stream}
 */
const compileTemplates = (srcPath, destPath, cb) => {
  gutil.log(`\n📄  ${gutil.colors.yellow('Compiling')} ${gutil.colors.blue(srcPath)} → ${gutil.colors.blue(destPath)}\n`);

  return gulp.src(srcPath)
    .pipe(plumber())
    .pipe(config.templating === 'pug' ? pug(config.options.pug()) : gutil.noop())
    .pipe(config.templating === 'html' ? template(config.options.template()) : gutil.noop())
    .pipe(config.minifyHtml ? htmlmin(config.options.htmlmin()) : gutil.noop())
    .pipe(size({
      showFiles: true
    }))
    .pipe(size({
      showFiles: true,
      gzip: true
    }))
    .pipe(gulp.dest(destPath))
    .on('end', () => {
      gutil.log(`\n${gutil.colors.green('Compiled')} ${gutil.colors.blue(srcPath)}\n`);
      cb();
    })
}

/**
 * Lint HTML
 * 
 * @param {string|array} srcPath Path to .html files
 * @param {function} cb Callback function
 * @return {stream}
 */
const lintTemplates = (srcPath, cb) => {
  gutil.log(`\n📄  ${gutil.colors.yellow('Linting')} ${gutil.colors.blue(srcPath)}\n`);

  return gulp.src(srcPath)
    .pipe(plumber())
    .pipe(htmlLint(config.options.htmlLint()))
    .pipe(htmlLint.format())
    .on('end', () => {
      gutil.log(`\n${gutil.colors.green('Linted')} ${gutil.colors.blue(srcPath)}\n`);
      cb();
    })
}



// Register gulp tasks
gulp.task('templates:compile', (cb) => {
  const srcPath  = [
    path.join(config.path.src.templates, '**/*.{html,pug,jade}'),
    '!' + path.join(config.path.src.templates, '{**/\_*,**/\_*/**}') // Ignore files and folders starting with "_"
  ];
  const destPath = config.path.dest.templates;

  compileTemplates(srcPath, destPath, cb);
});

gulp.task('templates:lint', (cb) => {
  if(!config.linting.templates) return;
  const srcPath  = path.join(config.path.dest.templates, '**/*.html');

  lintTemplates(srcPath, cb);
});

gulp.task('templates', (done) => {
  runSequence('templates:compile', () => {
    done();
  })
});
