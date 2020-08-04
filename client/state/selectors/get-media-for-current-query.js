/**
 * Internal dependencies
 */
import getCurrentMediaQuery from 'state/selectors/get-current-media-query';
import getMedia from 'state/selectors/get-media';

/**
 * Gets a list of media items for a site based on the current query.
 *
 * @param {object} state The current state.
 * @param {number} siteId The ID of the site for which to retrieve the media items.
 */
export default function getMediaForCurrentQuery( state, siteId ) {
	return getMedia( state, siteId, getCurrentMediaQuery( state, siteId ) ) ?? [];
}
