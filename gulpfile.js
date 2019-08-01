'use strict';

var gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    rigger = require('gulp-rigger'),
    htmlbeautify = require('gulp-html-beautify'),
    pug = require('gulp-pug'),
    browserSync = require('browser-sync'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');

//Значения: (переключение между обычным html и шаблонизатором pag)
// html - будет гульпить из папки html
// pug - будет гульпить из папки pug используя шаблонизатор pug
var html = 'html';

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
    },
    src: { //Пути откуда брать исходники
        html: 'src/html/*.html',
        pug: 'src/pug/*.pug',
        js: 'src/js/*.js',
        style: 'src/less/*.less',
        img: 'src/img/*.*',
        fonts: 'src/fonts/*.*',
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/html/blocks/*.html',
        pug: 'src/pug/**/*.pug',
        js: 'src/js/blocks/*.js',
        style: 'src/less/**/*.less',
        img: 'src/img/*.*',
        fonts: 'src/fonts/*.*',
    }
};

if(html == "html"){
    gulp.task('html', function () {
        gulp.src(path.src.html)
            .pipe(rigger())
            .pipe(gulp.dest(path.build.html));
    });
}

if(html == "pug") {
    gulp.task('pug', function () {
        var options = {
            indentSize: 2,
            unformatted: [
                // https://www.w3.org/TR/html5/dom.html#phrasing-content
                'abbr', 'area', 'b', 'bdi', 'bdo', 'br', 'cite',
                'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'ins', 'kbd', 'keygen', 'map', 'mark', 'math', 'meter', 'noscript',
                'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'small',
                'strong', 'sub', 'sup', 'template', 'time', 'u', 'var', 'wbr', 'text',
                'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt'
            ]

        };

        return gulp.src(path.src.pug)
            .pipe(pug({
                locals: 'src/pug/**/**/*.pug'
            }))
            .pipe(htmlbeautify(options))
            .pipe(gulp.dest(path.build.html));
    });
}

gulp.task('js', function(){
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js));

});

gulp.task('less',function(){
    return gulp.src(path.src.style)
    .pipe(autoprefixer(['last 15 versions', '>1%', 'ie 8', 'ie 7'], {cascade: true}))
    .pipe(less())
    .pipe(prefixer())
    .pipe(cssnano())
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('img', function(){
    return gulp.src(path.src.img)
    .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    })))
    .pipe(gulp.dest(path.build.img));
});

gulp.task('fonts', function(){
    gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts));
});

gulp.task('browser-sync', function(){
    browserSync({
        server: {
            baseDir: 'build',
        },
        notify: false
    });
});

gulp.task('clean', function(){
    return del.sync('build/*');
});

gulp.task('watch', ['browser-sync', 'js', 'less', 'fonts', 'img', html], function(){
    gulp.watch(path.src.style,['less']);
    gulp.watch(path.watch.style,['less']);
    if(html == 'pug'){
        gulp.watch(path.src.pug,['pug']);
        gulp.watch(path.watch.pug,['pug']);
    }else{
        gulp.watch(path.src.html,['html']);
        gulp.watch(path.watch.html,['html']);
    }
    gulp.watch(path.src.js,['js']);
    gulp.watch(path.watch.js,['js']);
    gulp.watch(path.watch.fonts,['fonts']);
    gulp.watch(path.watch.img,['img']);
    gulp.watch('build/css/*.css', browserSync.reload);
    gulp.watch('build/js/*.js', browserSync.reload);
    gulp.watch('build/*.html', browserSync.reload);
});

gulp.task('default', [
    html,
    'js',
    'less',
    'img',
    'fonts'
]);