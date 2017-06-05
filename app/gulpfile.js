var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var browserify = require("browserify")
var source = require('vinyl-source-stream'),
	rename = require('gulp-rename'),
	browserify = require('browserify'),
	glob = require('glob'),
	es = require('event-stream');

gulp.task('babel', done => compileBabel(done));
gulp.task('browser-sync', initServer);
gulp.task('watch', watch);
gulp.task('default', ['browser-sync', 'babel', 'watch']);

function watch() {
	const reload = browserSync.reload

	gulp.watch("./src/**/*.js", ['babel']).on('change', reload)
	gulp.watch("./build/index.html").on('change', reload)
}


function initServer() {
	browserSync.init({
		server: {
			baseDir: "./build",
			port: 8080
		}
	});
}



function compileBabel(done) {
	glob('./src/**/*.js', function (err, files) {
		if (err) done(err);

		const tasks = files.map(function (entry) {
			return browserify({ entries: [entry] })
				.transform("babelify", { presets: ["es2015", "react"] })
				.bundle()
				.pipe(source(entry))
				.pipe(gulp.dest('./build'));
		});

		es.merge(tasks).on('end', done);
	})
}





