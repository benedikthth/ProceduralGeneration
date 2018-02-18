
/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    gp_concat = require('gulp-concat'),
    gp_uglify = require('gulp-uglify'),
    dest = '../html/procedural/scripts';

gulp.watch('*.js', ['minify']);
// create a default task and just log a message

gulp.task('minify', ['spaceDivision', 'gameMap', 'cave']);

gulp.task('gameMap', function(){
  return gulp.src(['cave.js', 'irregularRegion.js', 'spaceDivision.js', 'gameMap.js'])
            .pipe(gp_concat('gamemap.min.js'))
            .pipe(gp_uglify())
            .pipe(gulp.dest(dest));
});

gulp.task('spaceDivision', function(){
  return gulp.src(['irregularRegion.js', 'spaceDivision.js', 'gameMap.js'])
            .pipe(gp_concat('spacedivision.min.js'))
            .pipe(gp_uglify())
            .pipe(gulp.dest(dest));
});

gulp.task('cave', function(){
  return gulp.src(['cave.js'])
            .pipe(gp_concat('cave.min.js'))
            .pipe(gp_uglify())
            .pipe(gulp.dest(dest));
});

gulp.task('default', ['minify']);
