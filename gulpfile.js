"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var posthtml = require("gulp-posthtml");
var webp = require("gulp-webp");
var del = require("del");
var server = require("browser-sync").create();
var run = require("run-sequence");


gulp.task("style", function () {
  gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    //    .pipe(gulp.dest("build/source/css"))
    //    .pipe(minify())
    //    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/source/css"))
    .pipe(server.stream());

});

gulp.task("html", function () {
  return gulp.src("source/*.html")
//    .pipe(posthtml([
//    include()
//  ]))
    .pipe(gulp.dest("build"));
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true}),
    imagemin.svgo()
 ]))
    .pipe(gulp.dest("build/source/img"))
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({
      quality: 90
    }))
    .pipe(gulp.dest("build/source/img"));
});

gulp.task("serve", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", ["style"]).on("change", server.reload);
  gulp.watch("*.html").on("change", server.reload);
});

gulp.task("copy", function () {
  return gulp.src([
  "fonts/**/*.{woff,woff2}",
  "img/**",
  "js/**",
  "*.html"
  ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("build", function (done) {
  run(
    "clean",
    "copy",
    "style",
    "images",
    "webp",
    "html",
    done
  )
});
