/**
 * External Dependencies
 */
const TerserPlugin = require( 'terser-webpack-plugin' );
const browserslist = require( 'browserslist' );
const caniuse = require( 'caniuse-api' );

const supportedBrowsers = browserslist( null, { env: process.env.BROWSERSLIST_ENV || 'defaults' } );

/**
 * Auxiliary method to help in picking an ECMAScript version based on a list
 * of supported browser versions.
 *
 * @param {Array<string>} browsers The list of supported browsers.
 *
 * @returns {number} The maximum supported ECMAScript version.
 */
function chooseTerserEcmaVersion( browsers ) {
	if ( ! caniuse.isSupported( 'arrow-functions', browsers ) ) {
		return 5;
	}
	if ( ! caniuse.isSupported( 'es6-class', browsers ) ) {
		return 5;
	}
	if ( ! caniuse.isSupported( 'array-includes', browsers ) ) {
		return 2015;
	}
	if ( ! caniuse.isSupported( 'object-entries', browsers ) ) {
		return 2016;
	}

	return 2017;
}

/**
 * Returns an array containing a Terser plugin object to be used in Webpack minification.
 *
 * @see https://github.com/webpack-contrib/terser-webpack-plugin for complete descriptions of options.
 *
 * @param {object} options Options passed to the terser plugin
 * @returns {object[]}     Terser plugin object to be used in Webpack minification.
 */
module.exports = ( options ) => {
	let terserOptions = options.terserOptions || {};
	const isDesktop = options.isDesktop || false;
	const browsers = isDesktop ? [ 'last 2 Chrome versions' ] : supportedBrowsers;
	terserOptions = {
		ecma: chooseTerserEcmaVersion( browsers ),
		ie8: false,
		mangle: true,
		compress: ! isDesktop,
		safari10: isDesktop
			? false
			: browsers.some(
					( browser ) => browser.includes( 'safari 10' ) || browser.includes( 'ios_saf 10' )
			  ),
		...terserOptions,
	};

	// ensure we don't initialize Terser with convenience params
	delete options.isDesktop;

	return [ new TerserPlugin( { ...options, terserOptions } ) ];
};
