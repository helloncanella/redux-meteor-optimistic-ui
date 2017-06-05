var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var browserify = require("gulp-browserify")

gulp.task('babel', compileBabel);
gulp.task('browser-sync', initServer);
gulp.task('watch', watch);
gulp.task('default', ['browser-sync', 'babel', 'watch']);

function watch() {
	const reload = browserSync.reload

	gulp.watch("./src/**/*.js", ['browserify']).on('change', reload)
	gulp.watch("./build/index.html").on('change', reload)
}

function compileBabel() {
	return gulp.src("src/**/*.js")
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(babel({ presets: ["es2015", "react"] }))
		.pipe(concat("build.js"))
		.pipe(browserify({
			transform:['babelify']
		}))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("build"));
}

function initServer() {
	browserSync.init({
		server: {
			baseDir: "./build",
			port: 8080
		}
	});
}






