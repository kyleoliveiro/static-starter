const gulp        = require('gulp');
const taskListing = require('gulp-task-listing');
const requireDir  = require('require-dir');
const browserSync = require('browser-sync').create();

// Load gulp tasks from ./tasks folder
requireDir('./tasks', {recurse: false});

// Register 'default' task
gulp.task('default', taskListing);
