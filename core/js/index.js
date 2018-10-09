/**
 * External dependencies
 */
import _ from 'lodash';

/**
 * Internal dependencies
 */
import API from './api';

// Import styles (CSS will be generated by Webpack)
import styles from './../sass/ultimate-fields.scss';

// Ensure that lodash is not conflicting with underscore.js
_.noConflict();

// Start the top-level API.
window.UltimateFields = new API();
