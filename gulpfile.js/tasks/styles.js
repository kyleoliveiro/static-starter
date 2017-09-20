const path         = require('path');
const runSequence  = require('run-sequence');
const gulp         = require('gulp');
const gutil        = require('gulp-util');
const plumber      = require('gulp-plumber');
const rename       = require('gulp-rename');
const size         = require('gulp-size');
const sourcemaps   = require('gulp-sourcemaps');
const sass         = require('gulp-sass');
const sassGlob     = require('gulp-sass-glob');
const postcss      = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker     = require('css-mqpacker');
const uncss        = require('postcss-uncss');
const cssnano      = require('gulp-cssnano');
const stylelint    = require('gulp-stylelint')
const stylestats   = require('gulp-stylestats');

const config = require('../config');



/**
 * Lint .scss files,
 * Compile Sass to CSS,
 * Generate sourcemaps,
 * Autoprefix CSS properties
 * 
 * @param {string|array} srcPath Path to .scss files
 * @param {string} destPath Path to destination folder
 * @param {function} cb Callback function
 * @return {stream}
 */
const compileStyles = (srcPath, destPath, cb) => {
  gutil.log(`\n🎨  ${gutil.colors.yellow('Compiling')} ${gutil.colors.blue(srcPath)} → ${gutil.colors.blue(destPath+'/')}\n`);

  return gulp.src(srcPath)
    .pipe(plumber())
    .pipe(config.linting.styles ? stylelint(config.options.stylelint()) : gutil.noop())
    .pipe(config.sourcemaps ? sourcemaps.init() : gutil.noop())
    .pipe(sassGlob(config.options.sassGlob()))
    .pipe(
      sass(config.options.sass()).on('error', sass.logError)
    )
    .pipe(
      postcss([
        autoprefixer(config.options.autoprefixer())
      ])
    )
    .pipe(config.sourcemaps ? sourcemaps.write() : gutil.noop())
    .pipe(gulp.dest(destPath))
    .on('end', () => {
      gutil.log(`\n${gutil.colors.green('Compiled')} ${gutil.colors.blue(srcPath)}\n`);
      cb();
    })
}

/**
 * Sort and pack media queries,
 * Remove unused CSS styles,
 * Minify CSS files
 *
 * @param {string|array} srcPath Path to .css files
 * @param {string} destPath Path to destination folder
 * @param {function} cb Callback function
 * @return {stream}
 */
const minifyStyles = (srcPath, destPath, cb) => {
  gutil.log(`\n🎨  ${gutil.colors.yellow('Minifying')} ${gutil.colors.blue(srcPath)} → ${gutil.colors.blue(destPath+'/')}\n`);

  return gulp.src(srcPath)
    .pipe(plumber())
    .pipe(
      postcss([
        mqpacker(config.options.mqpacker()),
        uncss(config.options.uncss()),
      ])
    )
    .pipe(cssnano(config.options.cssnano()))
    .pipe(rename({suffix: '.min'}))
    .pipe(size({
      showFiles: true
    }))
    .pipe(size({
      showFiles: true,
      gzip: true
    }))
    .pipe(gulp.dest(destPath))
    .on('end', () => {
      gutil.log(`\n${gutil.colors.green('Minified')} ${gutil.colors.blue(srcPath)}\n`)
      cb();
    })
}

/**
 * Report CSS stats
 * 
 * @param {string|array} srcPath Path to .css files
 * @param {function} cb Callback function
 * @return {stream}
 */
const reportStyles = (srcPath) => {
  gutil.log(`\n🎨  ${gutil.colors.yellow('Report')} for ${gutil.colors.blue(srcPath)}\n`);

  return gulp.src(srcPath)
    .pipe(plumber())
    .pipe(stylestats())
    .on('end', () => {
      gutil.log(`\n${gutil.colors.green('Report for')} ${gutil.colors.blue(srcPath)}\n`)
      cb();
    })
}



// Register gulp tasks for each entry in config.path.src.styles
const compileTasks = [];
const minifyTasks  = [];
const reportTasks  = [];

// 'compile' tasks
Object.keys(config.path.src.styles).forEach((stylesheetName) => {
  let taskName = `styles:${stylesheetName}:compile`;
  compileTasks.push(taskName);

  gulp.task(taskName, (cb) => {
    let srcPath  = config.path.src.styles[stylesheetName];
    let destPath = config.path.dest.styles;

    compileStyles(srcPath, destPath, cb);
  });
});

gulp.task('styles:all:compile', (done) => {
  runSequence([...compileTasks], () => {
    done();
  });
});

// 'minify' tasks
Object.keys(config.path.src.styles).forEach((stylesheetName) => {
  let taskName = `styles:${stylesheetName}:minify`;
  minifyTasks.push(taskName);

  gulp.task(taskName, (cb) => {
    let srcPath = path.join(
      config.path.dest.styles,
      path.basename(config.path.src.styles[stylesheetName], '.scss') + '.css'
    );

    let destPath = config.path.dest.styles;

    minifyStyles(srcPath, destPath, cb);
  });
});

gulp.task('styles:all:minify', (done) => {
  runSequence([...minifyTasks], () => {
    done();
  });
});

// 'report' tasks
Object.keys(config.path.src.styles).forEach((stylesheetName) => {
  let taskName = `styles:${stylesheetName}:report`;
  reportTasks.push(taskName);

  gulp.task(taskName, (cb) => {
    let srcPath = path.join(
      config.path.dest.styles,
      path.basename(config.path.src.styles[stylesheetName], '.scss') + '.min.css'
    );

    reportStyles(srcPath, cb)
  });
});

gulp.task('styles:all:report', (done) => {
  runSequence([...reportTasks], () => {
    done();
  });
});

Object.keys(config.path.src.styles).forEach((stylesheetName) => {
  let taskName = `styles:${stylesheetName}`;

  gulp.task(taskName, (done) => {
    runSequence(`styles:${stylesheetName}:compile`, `styles:${stylesheetName}:minify`, () => {
      done();
    });
  });
});

// 'all' tasks
gulp.task('styles:all', (done) => {
  runSequence('styles:all:compile', 'styles:all:minify', () => {
    done();
  });
});

// Register 'styles' task as alias for 'styles:all'
gulp.task('styles', (done) => {
  runSequence('styles:all', () => {
    done();
  });
});
