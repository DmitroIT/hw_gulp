const gulp = require("gulp");
// html
const fileinclude = require("gulp-file-include");
const htmlclean = require("gulp-htmlclean");
const webpHTML = require("gulp-webp-html");

// sass
const sass = require("gulp-sass")(require("sass"));
const sassGlob = require("gulp-sass-glob");
const autoprefixer = require("gulp-autoprefixer");
let webpCss = require("gulp-webp-css");

const clean = require("gulp-clean");
const fs = require("fs");
const sourceMaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");

// images
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");

const changed = require("gulp-changed");
const cleanCSS = require("gulp-clean-css");
const browserSync = require("browser-sync").create();
// eslint-disable-next-line no-undef
const webpack = require("webpack-stream");
//----------------------------


const plumberNotify = (title) => {
    return {
        errorHandler: notify.onError({
            title: title,
            message: "Error <%= error.message %>",
            sound: false
        })
    };
};

// таски для компиляции html
gulp.task("html", () => {
    return gulp.src("./src/html/*.html")
        .pipe(changed("./build/", {hasChanged: changed.compareContents}))
        .pipe(plumber(plumberNotify("HTML")))
        .pipe(fileinclude({
            prefix: "@@",
            basepath: "@file"
        }))
        .pipe(webpHTML())
        .pipe(htmlclean())
        .pipe(gulp.dest("./build/"))
        .pipe(browserSync.reload({ stream: true }));
});

// таска для css
gulp.task("sass", () => {
    return gulp.src("./src/scss/*.scss")
        .pipe(changed("./build/css/"))
        .pipe(plumber(plumberNotify("SASS")))
        .pipe(sourceMaps.init())
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(webpCss())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest("./build/css/"))
        .pipe(cleanCSS())
        .pipe(autoprefixer())
        .pipe(gulp.dest("./build/css/"))
        .pipe(browserSync.reload({ stream: true }));
});

// копирование изображений
gulp.task("images", () => {
    return gulp.src("./src/img/**/*")
        .pipe(changed("./build/img/"))
        .pipe(webp())
        .pipe(gulp.dest("./build/img/"))

        .pipe(gulp.src("./src/img/**/*"))
        .pipe(changed("./build/img/"))
        .pipe(imagemin({ verbose: true }))
        .pipe(gulp.dest("./build/img/"))
        .pipe(browserSync.reload({ stream: true }));
});

// копирование шрифтов
gulp.task("fonts", () => {
    return gulp.src("./src/fonts/**/*")
        .pipe(changed("./build/fonts/"))
        .pipe(gulp.dest("./build/fonts/"))
        .pipe(browserSync.reload({ stream: true }));
});

// копирование файлов
gulp.task("files", () => {
    return gulp.src("./src/files/**/*")
        .pipe(changed("./build/files/"))
        .pipe(gulp.dest("./build/files/"))
        .pipe(browserSync.reload({ stream: true }));
});

// js
gulp.task("js", () => {
    return gulp.src("./src/js/*.js")
        .pipe(changed("./build/js"))
        .pipe(webpack(require("./webpack.config.js")))
        .pipe(gulp.dest("./build/js"))
        .pipe(browserSync.reload({ stream: true }));
});

// // задачи для сервера
gulp.task("server", () => {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });
});

// задача для поддержания папки build в актуальном состоянии
gulp.task("clean", (done) => {
    if (fs.existsSync("./build")) {
        return gulp.src("./build", { read: false })
            .pipe(clean({ force: true }));
    }
    done();
});

// слежение за изменениями
gulp.task("watch", () => {
    gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass"));
    gulp.watch("./src/html/**/*.html", gulp.parallel("html"));
    gulp.watch("./src/img/**/*", gulp.parallel("images"));
    gulp.watch("./src/fonts/**/*", gulp.parallel("fonts"));
    gulp.watch("./src/files/**/*", gulp.parallel("files"));
    gulp.watch("./src/js/**/*.js", gulp.parallel("js"));

});

gulp.task("default", gulp.series(
    "clean",
    gulp.parallel("html", "sass", "images", "fonts", "files", "js"),
    gulp.parallel("watch", "server")
));
