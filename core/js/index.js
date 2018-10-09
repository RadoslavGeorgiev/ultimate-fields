/**
 * External dependencies
 */
import _ from 'lodash';

/**
 * Internal dependencies
 */
// import defaultFields from 'field/default-fields';
import API from './api';

// Force styles to be loaded
import styles from './../sass/ultimate-fields.scss';

// Ensure that lodash is not conflicting with underscore.js
_.noConflict();

/**
 * Star the top-level API.
 */
window.UltimateFields = new API();
