const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mediaquery = require('postcss-combine-media-query');
const cssnano = require('cssnano');
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

function css() {
	const plugins = [
    autoprefixer(),
    mediaquery(),
		cssnano()
	];
  return gulp.src('src/blocks/**/*.css')
    .pipe(plumber())
    .pipe(concat('bundle.css'))
		.pipe(postcss(plugins))
    .pipe(gulp.dest('dist/'))
}

exports.css = css;

function scripts() {
  return gulp.src('src/scripts/*.js')
            .pipe(gulp.dest('dist/scripts'))
}

exports.scripts = scripts;

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

function watchFiles() {
  gulp.watch(['src/**/*.pug'], pug);
  gulp.watch(['src/**/*.scss'], scss);
  gulp.watch(['src/scripts/*.js'], scripts);
}

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}

const build = gulp.series(clean, gulp.parallel(pug, scss, scripts));

exports.build = build;

const watchapp = gulp.parallel(build, watchFiles, serve);

exports.default = watchapp;