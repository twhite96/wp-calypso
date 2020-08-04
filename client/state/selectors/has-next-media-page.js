import { isNil } from 'lodash';
/**
 * Internal dependencies
 */
import getNextPageHandle from 'state/selectors/get-next-page-handle';

export default function hasNextMediaPage( state, siteId ) {
	if (
		! ( siteId in state.media.fetching ) ||
		! ( 'nextPageHandle' in state.media.fetching[ siteId ] )
	) {
		return true;
	}

	const nextPageHandle = getNextPageHandle( state, siteId );

	return nextPageHandle !== null;

	if ( nextPageHandle === undefined ) {
		// we don't haven't set it yet
		return false;
	} else if ( nextPageHandle === null ) {
		return false;
	}
	return !! nextPageHandle;
}
