const gulp = require('gulp');
const gulpif = require('gulp-if');

const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');

const sass = require('gulp-sass');
const csso = require('gulp-csso');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

sass.compiler = require('node-sass');

const htmlmin = require('gulp-htmlmin');

const del = require('del');
const pipeline = require('readable-stream').pipeline;
const browserSync = require('browser-sync');

const production = process.env.NODE_ENV == 'production';

function js() {
    return pipeline(
        gulp.src('src/js/**/*'),
        gulpif(production, sourcemaps.init()),
        gulpif(production, babel({ presets: ['@babel/env'] })),
        gulpif(production, uglify()),
        gulpif(production, sourcemaps.write('map/js/')),
        gulp.dest('dist/')
    );
}

function scss() {
    return pipeline(
        gulp.src('src/scss/**/*'),
        gulpif(production, sourcemaps.init()),
        sass(),
        gulpif(production, postcss([ autoprefixer() ])),
        gulpif(production, csso()),
        gulpif(production, sourcemaps.write('map/scss/')),
        gulp.dest('dist/'),
        browserSync.stream()
    );
}

function html() {
    return pipeline(
        gulp.src('src/*.html'),
        gulpif(production, htmlmin({ collapseWhitespace: true })),
        gulp.dest('dist/')
    )
}

function assets() {
    return pipeline(
        gulp.src('src/assets/**/*'),
        gulp.dest('dist/')
    )
}

function clean() {
    return del('dist/');
}

function reload(cb) {
    browserSync.reload();
    cb();
}

exports.build = gulp.series(
    clean,
    gulp.parallel(js, scss, html, assets)
);

exports.serve = () => {
    browserSync.init({
        server: './dist'
    });

    gulp.watch('src/js/**/*', gulp.series(js, reload));
    gulp.watch('src/scss/**/*', scss);
    gulp.watch('src/*.html', gulp.series(html, reload));
    gulp.watch('src/assets/**/*', gulp.series(html, reload));
}
