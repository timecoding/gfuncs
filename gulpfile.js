const gulp = require('gulp');
const jsdoc = require('gulp-jsdoc3');
const gfuncs = require('./gfuncs');

function doc (cb) {
  gfuncs.clean('docs/');
  gulp.src(['README.md', 'gfuncs.js'], { read: false })
    .pipe(jsdoc(cb));
}

exports.doc = doc;
