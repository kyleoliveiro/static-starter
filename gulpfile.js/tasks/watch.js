const path        = require('path');
const runSequence = require('run-sequence');
const gulp        = require('gulp');
const gutil       = require('gulp-util');
const watch       = require('gulp-watch');

const config = require('../config');



// Register gulp tasks for each entry in config.path.src.styles
const styleTasks = [];
Object.keys(config.path.src.styles).forEach((stylesheetName) => {
  let taskName = `watch:styles:${stylesheetName}`;
  styleTasks.push(taskName);

  gulp.task(taskName, () => {
    gulp.watch(path.join(config.path.src.scss, '/**/*'), [`styles:${stylesheetName}`])
  });
});

// Register 'watch:styles:all' task for all entry points
gulp.task('watch:styles:all', (done) => {
  runSequence([...styleTasks], () => {
    done();
  });
});

// Register 'watch:styles' task as alias for 'watch:styles:all'
gulp.task('watch:styles', (done) => {
  runSequence('watch:styles:all', () => {
    done();
  });
});



// Register gulp tasks for each entry in config.path.src.scripts
const scriptTasks = [];
Object.keys(config.path.src.scripts).forEach((scriptName) => {
  let taskName = `watch:scripts:${scriptName}`;
  scriptTasks.push(taskName);

  gulp.task(taskName, () => {
    gulp.watch(path.join(config.path.src.js, '/**/*'), [`scripts:${scriptName}`])
  });
});

// Register 'watch:scripts:all' task for all entry points
gulp.task('watch:scripts:all', (done) => {
  runSequence([...scriptTasks], () => {
    done();
  });
});

// Register 'watch:scripts' task as alias for 'watch:scripts:all'
gulp.task('watch:scripts', (done) => {
  runSequence('watch:scripts:all', () => {
    done();
  });
});



// Register 'watch:templates' task
gulp.task('watch:templates', (done) => {
  gulp.watch(path.join(config.path.src.templates, '**/*'), ['templates']);
});

// Register 'watch:images' task
gulp.task('watch:images', (done) => {
  gulp.watch(path.join(config.path.src.images, '**/*'), ['images']);
});

// Register 'watch:fonts' task
gulp.task('watch:fonts', (done) => {
  gulp.watch(path.join(config.path.src.fonts, '**/*'), ['fonts']);
});

// Register 'watch:static' task
gulp.task('watch:static', (done) => {
  gulp.watch(path.join(config.path.src.static, '**/*'), ['copy']);
});

// Watch everything
gulp.task('watch', (done) => {
  runSequence(['watch:templates', 'watch:styles', 'watch:scripts', 'watch:images', 'watch:fonts', 'watch:static'], () => {
    done();
  });
});
