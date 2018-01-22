// https://css-tricks.com/gulp-for-beginners/


// creating a variable for each gulp-plugin
var gulp        = require ('gulp'),
    sass        = require ('gulp-ruby-sass'),
    useref      = require ('gulp-useref'),
    uglify      = require ('gulp-uglify'),
    cssnano     = require ('gulp-cssnano'),
    gulpIf      = require ('gulp-if'),
    imagemin    = require ('gulp-imagemin'),
    cache       = require ('gulp-cache'),
    del         = require ('del'),
    browserSync = require ('browser-sync').create(),
    runSequence = require ('run-sequence');


// Development Tasks 
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  })
});

gulp.task('sass', function () {
  return sass('app/scss/**/*.scss',{ // Gets all files ending with .scss in app/scss and children dirs
            style: 'expanded'
      })
    .on('error', function (err) { console.log(err.message); })
    .pipe(gulp.dest('app/css/'))
    .pipe(browserSync.stream());

});

// Watchers
gulp.task('watch', function() {
  gulp.watch('app/scss/**/*', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

// Optimization Tasks 
// ------------------

// Optimizing CSS and JavaScript 
gulp.task('useref', function() {

  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

// Optimizing Images 
gulp.task('images', function() {
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('dist/images'))
});


// Cleaning 
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
});

gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/images/**/*']);
});

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence(
    'watch',
    ['sass', 'browserSync'], 
    callback
  )
});

gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    'sass',
    ['useref', 'images'],
    callback
  )
});