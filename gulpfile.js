const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mediaquery = require('postcss-combine-media-query');
const cssnano = require('cssnano');
const cssimport = require('gulp-cssimport');
const htmlMinify = require('html-minifier');
const gulpPug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));

function html() {
	const options = {
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      sortClassName: true,
      useShortDoctype: true,
      collapseWhitespace: true,
      minifyCSS: true,
      keepClosingSlash: true
  };
  return gulp.src('src/**/*.html')
    .pipe(plumber())
		.on('data', function(file) {
      const buferFile = Buffer.from(htmlMinify.minify(file.contents.toString(), options));
      return file.contents = buferFile;
    })
    .pipe(gulp.dest('dist/'))
}

exports.html = html;


function scripts() {
  return gulp.src('src/scripts/*.js')
            .pipe(gulp.dest('dist/scripts'))
}

exports.scripts = scripts;

function fonts() {
  return gulp.src('src/vendor/fonts/*.(woff|woff2|ttf)', {encoding: false})
            .pipe(gulp.dest('dist/fonts'))
}


exports.fonts = fonts;

function clean() {
  return del('dist');
}

exports.clean = clean;

function pug() {
  return gulp.src('src/pages/**/*.pug')
        .pipe(gulpPug({
          pretty: true
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

exports.pug = pug;

function scss() {
  const plugins = [
        autoprefixer(),
        mediaquery(),
        cssnano()
  ];
  return gulp.src('src/layouts/default.scss')
        .pipe(sass())
        .pipe(concat('bundle.css'))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

exports.scss = scss;

function pageScss() {
  const plugins = [
        autoprefixer(),
        mediaquery(),
        cssnano()
  ];
  return gulp.src('src/pages/*.scss')
        .pipe(sass({errLogToConsole: true}))
        .pipe(cssimport())
        .pipe(postcss(plugins))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

exports.pageScss = pageScss;

function watchFiles() {
  gulp.watch(['src/**/*.pug'], pug);
  gulp.watch(['src/layouts/*.scss'], scss);
  gulp.watch(['src/pages/*.scss'], pageScss);
  gulp.watch(['src/components/**/*.scss'], pageScss);
  gulp.watch(['src/vendors/fonts/*.{woff,woff2,ttf}'], fonts);
  gulp.watch(['src/scripts/*.js'], scripts);
}

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}

const build = gulp.series(clean, gulp.parallel(pug, scss, pageScss, fonts, scripts));

exports.build = build;

const watchapp = gulp.parallel(build, watchFiles, serve);

exports.default = watchapp;