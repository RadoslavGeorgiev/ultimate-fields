const webpack = require( 'webpack' );
const path = require( 'path' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

module.exports = {
	entry: [
		path.resolve( __dirname, 'js' ),
	],
	output: {
		path: path.resolve( __dirname, 'assets' ),
		filename: 'js/ultimate-fields.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
			{
	            test: /\.scss$/,
	            use: [
	                MiniCssExtractPlugin.loader,
	                "css-loader",
	                "sass-loader"
	            ]
	        },
		],
	},
	externals: {
		jquery: 'jQuery'
	},
	plugins: [
		new webpack.ProvidePlugin( {
			_: 'lodash'
		} ),
		new MiniCssExtractPlugin( {
            filename: "css/ultimate-fields.css",
        } )
	],
	resolve: {
		alias: {
			components: path.resolve( __dirname, 'js/components/' ),
			container: path.resolve( __dirname, 'js/container/' ),
			field: path.resolve( __dirname, 'js/field/' ),
			state: path.resolve( __dirname, 'js/state/' ),
		}
	}
};
