const gulp        = require('gulp');
const gutil       = require('gulp-util');
const runSequence = require('run-sequence');

const config = require('../config');



// Register 'build' task
gulp.task('build', (done) => {
  gutil.log(`\n🛠  ${gutil.colors.yellow('Building')} from ${gutil.colors.blue(config.path.src.base)}\n`);

  runSequence(
    'clean:all',
    'templates',
    'scripts',
    ['styles', 'images', 'sitemap', 'copy'],
    () => {
      gutil.log(`\n${gutil.colors.green('Built to')} ${gutil.colors.blue(config.path.dest.base)}\n`);
      done();
    }
  )
});
