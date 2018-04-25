const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'core/assets/js');
const APP_DIR = path.resolve(__dirname, 'core/js');

const config = {
	entry: [
		APP_DIR + '/app.jsx'
	],
	output: {
		path: BUILD_DIR,
		filename: 'ultimate-fields.js'
	},
	// mode: 'development',
	module : {
		rules : [
			{
				test : /\.jsx?/,
				include : APP_DIR,
				loader : 'babel-loader'
			}
		]
	}
}

module.exports = config;
