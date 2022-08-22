const gulp = require("gulp");
const babel = require("gulp-babel");
const rename = require("gulp-rename");
const webp = require("gulp-webp");

// const sass = require("gulp-sass");

var sass = require("gulp-sass")(require("sass"));

const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");
const plumber = require("gulp-plumber"); // エラー時の強制終了を防止
const notify = require("gulp-notify"); // エラー発生時にデスクトップ通知する
const sassglob = require("gulp-sass-glob");

const paths = {
  styles: "./hmh/assets/scss/**/*.scss",
  _styles: "!./hmh/assets/scss/**/_*.scss",
  imgSrcDir: "./hmh/assets/images/",
  imgDstDir: "./hmh/assets/webp-images/",
};

// Styles
function styles() {
  var message = "";
  const message1 = "Sassのコンパイルが正常に完了しました。",
    message2 = "🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈";
  if (getRandomInt(100) == 0) {
    message = message2;
  } else {
    message = message1;
  }
  return (
    gulp
      .src([paths.styles, paths._styles])
      .pipe(sourcemaps.init())
      .pipe(sassglob())
      .pipe(
        plumber({
          errorHandler: notify.onError({
            title: "Sass Error!", // 任意のタイトルを表示させる
            message: "<%= error.message %>", // エラー内容を表示させる
          }),
        })
      )
      .pipe(
        sass({
          // outputStyle: "compressed",
          // outputStyle: 'expanded'
        })
      )
      .pipe(cleancss())
      .pipe(
        autoprefixer({
          grid: true,
        })
      ) // IEは11以上、Androidは4以上残りは、2version
      // .pipe(sourcemaps.write("./hmh/assets/css/"))
      .pipe(sourcemaps.write(""))
      .pipe(gulp.dest("./hmh/assets/css/"))
      .pipe(
        notify({
          title: message,
        })
      )
  );
}

//webp

function webpimg() {
  return gulp
    .src(paths.imgSrcDir + "**/*.{png,jpg,jpeg}")
    .pipe(
      rename(function (path) {
        // path.basename += path.extname;
      })
    )
    .pipe(webp())
    .pipe(gulp.dest(paths.imgDstDir));
}

// Watch
function watch() {
  gulp.watch(paths.styles, styles);
}

gulp.task("default", gulp.series(gulp.parallel(styles, watch)));
gulp.task("build", gulp.series(gulp.parallel(styles, webpimg)));
gulp.task("webp", gulp.series(gulp.parallel(webpimg)));

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
