'use strict';

const gulp = require( 'gulp' );
const sass = require( 'gulp-sass' );
const sourcemaps = require( 'gulp-sourcemaps' );
const webpack = require( 'webpack-stream' );
const rename = require( 'gulp-rename' );

var webpackWatch = false;

// Compilable directories
const dirs = [
	'core',
	'ui',
];

// Prepares the GULP task for a stylesheet
function prepareStylesheet( path ) {
	return gulp.src( './' + path + '/assets/sass/*.scss' )
		.pipe( sourcemaps.init() )
		.pipe( sass().on( 'error', sass.logError ) )
		.pipe( sourcemaps.write( '.' ) )
		.pipe( gulp.dest( './' + path + '/assets/css' ) );
}

function prepareScript( path ) {
	return gulp.src( './' + path + '/js/app.jsx' )
		.pipe( webpack( Object.assign( require('./webpack.config.js'), { watch: webpackWatch } ) ) )
		.pipe( rename( 'ultimate-fields.js' ))
		.pipe( gulp.dest( './' + path + '/assets/js/' ) );
}

// Create a task for every stylesheet
dirs.forEach(function( path ) {
	gulp.task( path, () => {
		return prepareStylesheet( path );
	});
});

// Create a default task, which depends on the rest
gulp.task( 'default', dirs, function () {
	// Nothing to do here, everything is in the dependency
	// Available as "npm run build"
	prepareScript( 'core' );
});

// Monitors
gulp.task( 'watch', function () {
	webpackWatch = true;
	prepareScript( 'core' );

	// Available as "npm run watch"
	dirs.forEach( path => {
		gulp.watch( './' + path + '/assets/sass/*.scss', [ path ] );
		gulp.watch( './' + path + '/assets/sass/**/*.scss', [ path ] );
	});
});
