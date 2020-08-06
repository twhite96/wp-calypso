/**
 * External dependencies
 */
const path = require( 'path' );
const MiniCssExtractPluginWithRTL = require( '@automattic/mini-css-extract-plugin-with-rtl' );
const WebpackRTLPlugin = require( 'webpack-rtl-plugin' );

/**
 * Internal variables
 */
const defaultCacheDirectory = path.resolve( process.env.HOME, '.cache', 'webpack' );

/**
 * Return a webpack loader object containing our styling (Sass -> CSS) stack.
 *
 * @param  {object}    _                              Options
 * @param  {string[]}  _.includePaths                 Sass files lookup paths
 * @param  {string}    _.prelude                      String to prepend to each Sass file
 * @param  {object}    _.postCssConfig                PostCSS config
 *
 * @returns {object}                                  webpack loader object
 */
module.exports.loader = ( { includePaths, prelude, postCssConfig = {} } ) => ( {
	test: /\.(sc|sa|c)ss$/,
	use: [
		MiniCssExtractPluginWithRTL.loader,
		{
			loader: require.resolve( 'cache-loader' ),
			options: {
				cacheDirectory: process.env.CIRCLECI
					? '/opt/circleci/.cache/webpack'
					: defaultCacheDirectory,
			},
		},
		{
			loader: require.resolve( 'css-loader' ),
			options: {
				importLoaders: 2,
			},
		},
		{
			loader: require.resolve( 'postcss-loader' ),
			options: {
				config: postCssConfig,
			},
		},
		{
			loader: require.resolve( 'sass-loader' ),
			options: {
				prependData: prelude,
				sassOptions: {
					includePaths,
				},
			},
		},
	],
} );

/**
 * Return an array of styling relevant webpack plugin objects.
 *
 * @param  {object}   _                Options
 * @param  {string}   _.chunkFilename  filename pattern to use for CSS files
 * @param  {string}   _.filename       filename pattern to use for CSS chunk files
 * @param  {boolean}  _.minify         whether to minify CSS
 *
 * @returns {object[]}                 styling relevant webpack plugin objects
 */
module.exports.plugins = ( { chunkFilename, filename, minify } ) => [
	new MiniCssExtractPluginWithRTL( {
		chunkFilename,
		filename,
		ignoreOrder: true, // suppress conflicting order warnings from mini-css-extract-plugin
		rtlEnabled: true,
	} ),
	new WebpackRTLPlugin( {
		minify,
	} ),
];
