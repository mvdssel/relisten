'use strict';

/**
 * Documentation for Gulp with Browserify:
 *  - https://github.com/gulpjs/gulp/tree/master/docs/recipes
 */

var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    uglify     = require('gulp-uglify'),
    notify     = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    concat     = require('gulp-concat'),
    connect    = require('gulp-connect'),
    browserify = require('browserify'),
    source     = require('vinyl-source-stream'),
    buffer     = require('vinyl-buffer');

var paths = {
    html: './app/index.html',
    js: './app/js/**/*.js',
    app: './app/js/browserApp.js',
    dist: './dist',
};

gulp.task('js', function () {
    var b = browserify({
        entries: paths.app, // Entrypoint of Browserify
        debug: true,
        transform: [],
    });

    b.bundle()
        .pipe(source('app.js')) // Result of Browserify
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(uglify())
            .on('error', gutil.log)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist))
        .pipe(notify('Finished browserify compilation'))
        .pipe(connect.reload());
});

gulp.task('style', function() {
    // gulp.src(paths.scss)
    gulp.src(['./node_modules/pickadate/lib/themes/default.css',  './node_modules/pickadate/lib/themes/default.date.css'])
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist))
        .pipe(connect.reload());
});

gulp.task('html', function() {
    gulp.src(paths.html)
        .pipe(gulp.dest(paths.dist))
        .pipe(connect.reload());
});

gulp.task('webserver', function() {
    connect.server({
        root: './dist',
        fallback: './dist/index.html',
        livereload: true
    });
});

gulp.task('install', ['html', 'style', 'js']);
gulp.task('default', ['webserver', 'install', 'watch']);

gulp.task('watch', function() {
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.scss, ['style']);
    gulp.watch(paths.js, ['js']);
});
