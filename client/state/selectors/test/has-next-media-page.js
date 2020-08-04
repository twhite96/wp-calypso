/**
 * Internal dependencies
 */
import hasNextMediaPage from 'state/selectors/has-next-media-page';

describe( 'hasNextMediaPage', () => {
	const siteId = 23478323;
	const nextPageHandle = Symbol( 'nextPageHandle' );
	it( 'should be true if the site has a next page handle', () => {
		expect(
			hasNextMediaPage( { media: { fetching: { [ siteId ]: { nextPageHandle } } } }, siteId )
		).toBe( true );
	} );

	it( 'should be false when the handle does not exist', () => {
		expect( hasNextMediaPage( { media: { fetching: {} } }, siteId ) ).toBe( false );
	} );
} );
