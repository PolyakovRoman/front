'use strict';

var gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    less = require('gulp-less'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    flatten = require('gulp-flatten');

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        other_image: 'build/tmp/',
    },
    src: { //Пути откуда брать исходники
        html: 'src/blocks/*.html',
        js: 'src/blocks/*.js',
        style: 'src/blocks/*.less',
        img: 'src/blocks/**/img/*.*',
        other_image: 'src/blocks/other-image/*.*',
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/blocks/*/*.html',
        js: 'src/blocks/*.js',
        all_js: 'src/blocks/*/*.js',
        style: 'src/blocks/*.less',
        all_style: 'src/blocks/*/*.less',
        img: 'src/blocks/**/img/*.*',
        other_image: 'src/blocks/other-image/*.*',
    },
    clean: './build'
};

gulp.task('html', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html));
});

gulp.task('js', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js));
});

gulp.task('style', function () {
    gulp.src(path.src.style)
        .pipe(less())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.css));
});

gulp.task('images', function () {
    gulp.src(path.src.img)
        .pipe(flatten({ includeParents: 0 }))
        .pipe(gulp.dest(path.build.img));
    //карнтинки, которые не относятся к макету
    gulp.src(path.src.other_image)
        .pipe(flatten({ includeParents: 0 }))
        .pipe(gulp.dest(path.build.other_image));
});

gulp.task('default', [
    'html',
    'js',
    'style',
    'images'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.run('html');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.run('style');
    });
    watch([path.watch.all_style], function(event, cb) {
        gulp.run('style');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.run('js');
    });
    watch([path.watch.all_js], function(event, cb) {
        gulp.run('js');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.run('images');
    });
    watch([path.watch.other_image], function(event, cb) {
        gulp.run('images');
    });
});