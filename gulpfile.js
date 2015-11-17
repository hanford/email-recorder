var gulp = require('gulp')
var browserSync = require('browser-sync').create()

var source = require('vinyl-source-stream')
var browserify = require('browserify')

var $ = require('gulp-load-plugins')()

var paths = {
  'js': {
    all: './src/app.js',
    output: './dist/js/'
  },
  'index': {
    all: './src/index.html',
    output: './dist/'
  }
}

gulp.task('move-index', function () {
  return gulp.src(paths.index.all)
    .pipe(gulp.dest(paths.index.output))
})

gulp.task('build-js', function () {
  return browserify()
    .add(paths.js.all)
    .bundle()
    .pipe(source('app.min.js'))
    .pipe($.streamify($.uglify()))
    .pipe(gulp.dest(paths.js.output))
})

gulp.task('watch', ['default'], function () {
  // gulp.watch(paths.style.watch, ['build-css'])
  browserSync.init({
    server: {
      baseDir: './dist/'
    }
  })

  gulp.watch(paths.index.all, ['move-index'])
  gulp.watch(paths.js.all, ['build-js'])
})

gulp.task('default', ['build-js', 'move-index'])
