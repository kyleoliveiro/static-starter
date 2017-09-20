const path        = require('path');
const pump        = require('pump');
const runSequence = require('run-sequence');
const gulp        = require('gulp');
const gutil       = require('gulp-util');
const plumber     = require('gulp-plumber');
const rename      = require('gulp-rename');
const size        = require('gulp-size');
const sourcemaps  = require('gulp-sourcemaps');
const rollup      = require('gulp-rollup');
const babel       = require('gulp-babel');
const uglify      = require('gulp-uglify');
const jshint      = require('gulp-jshint');

const config = require('../config');



/**
 * Compile scripts with babel
 * 
 * @param {string} srcPath Path to source file
 * @param {string} destPath Path to destination folder
 * @param {function} cb Callback function
 * @return {stream}
 */
const compileScripts = (srcPath, destPath, cb) => {
  gutil.log(`\n🤖  ${gutil.colors.yellow('Compiling')} ${gutil.colors.blue(srcPath)} → ${gutil.colors.blue(destPath+'/')}\n`);

  return gulp.src(path.join(config.path.src.js, '**/*'))
    .pipe(plumber())
    .pipe(config.sourcemaps ? sourcemaps.init() : gutil.noop())
    .pipe(rollup(Object.assign(config.options.rollup(), {
      input: srcPath
    })))
    .pipe(babel(config.options.babel()))
    .pipe(config.sourcemaps ? sourcemaps.write() : gutil.noop())
    .pipe(gulp.dest(destPath))
    .on('end', () => {
      gutil.log(`\n${gutil.colors.green('Compiled')} ${gutil.colors.blue(srcPath)}\n`);
      cb();
    });
}

/**
 * Minify scripts
 * 
 * @param  {string|array} srcPath Path to unminified scripts
 * @param  {string} destPath Path to destination folder
 * @param  {function} cb Callback function
 */
const minifyScripts = (srcPath, destPath, cb) => {
  gutil.log(`\n🤖  ${gutil.colors.yellow('Minifying')} ${gutil.colors.blue(srcPath)} → ${gutil.colors.blue(destPath+'/')}\n`);

  pump([ // gulp-uglify recommends using pump
    gulp.src(srcPath),
    uglify(),
    rename({suffix: '.min'}),
    size({
      showFiles: true
    }),
    size({
      showFiles: true,
      gzip: true
    }),
    gulp.dest(destPath)
  ], () => {
    gutil.log(`\n${gutil.colors.green('Minified')} ${gutil.colors.blue(srcPath)}\n`)
    cb();
  });
}

/**
 * Lint scripts
 * 
 * @param  {string|array} srcPath Path to unminified scripts
 * @param  {string} destPath Path to destination folder
 * @param  {function} cb Callback function
 * @return {stream}
 */
const lintScripts = (srcPath, destPath, cb) => {
  gutil.log(`\n🤖  ${gutil.colors.yellow('Linting')} ${gutil.colors.blue(srcPath)} → ${gutil.colors.blue(destPath+'/')}\n`);

  return gulp.src(srcPath)
    .pipe(plumber())
    .pipe(jshint(config.options.jshint()))
    .pipe(jshint.reporter('jshint-stylish'))
    .on('end', () => {
      gutil.log(`\n${gutil.colors.green('Linted')} ${gutil.colors.blue(srcPath)}\n`);
      cb();
    });
}



// Register gulp tasks for each entry in config.path.src.scripts
const compileTasks = [];
const minifyTasks  = [];
const lintTasks  = [];

// 'compile' tasks
Object.keys(config.path.src.scripts).forEach((scriptName) => {
  let taskName = `scripts:${scriptName}:compile`;
  compileTasks.push(taskName);

  gulp.task(taskName, (cb) => {
    let srcPath  = config.path.src.scripts[scriptName];
    let destPath = config.path.dest.scripts;

    compileScripts(srcPath, destPath, cb);
  });
});

gulp.task('scripts:all:compile', (done) => {  
  runSequence([...compileTasks], () => {
    done();
  });
});

// 'minify' tasks
Object.keys(config.path.src.scripts).forEach((scriptName) => {
  let taskName = `scripts:${scriptName}:minify`;
  minifyTasks.push(taskName);

  gulp.task(taskName, (cb) => {
    let srcPath = path.join(
      config.path.dest.scripts,
      path.basename(config.path.src.scripts[scriptName])
    );

    let destPath = config.path.dest.scripts;

    minifyScripts(srcPath, destPath, cb);
  });
});

gulp.task('scripts:all:minify', (done) => {  
  runSequence([...minifyTasks], () => {
    done();
  });
});

// 'lint' tasks
Object.keys(config.path.src.scripts).forEach((scriptName) => {
  let taskName = `scripts:${scriptName}:lint`;
  lintTasks.push(taskName);

  gulp.task(taskName, (cb) => {
    let srcPath  = config.path.src.scripts[scriptName];
    let destPath = config.path.dest.scripts;

    lintScripts(srcPath, destPath, cb);
  });
});

gulp.task('scripts:all:lint', (done) => {  
  runSequence([...lintTasks], () => {
    done();
  });
});

// 'all' tasks
Object.keys(config.path.src.scripts).forEach((scriptName) => {
  let taskName = `scripts:${scriptName}`;

  gulp.task(taskName, (done) => {
    runSequence(`scripts:${scriptName}:compile`, `scripts:${scriptName}:minify`, () => {
      done();
    });
  });
});

gulp.task('scripts:all', (done) => {
  runSequence('scripts:all:compile', 'scripts:all:minify', () => {
    done();
  });
});

// Register 'scripts' task as alias for 'scripts:all'
gulp.task('scripts', (done) => {
  runSequence('scripts:all', () => {
    done();
  });
});
