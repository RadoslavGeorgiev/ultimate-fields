/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import FileField from 'field/file/component';

/**
 * Handles the input of the image field.
 */
export default class ImageField extends FileField {
    /**
     * This is the file type that will be passed to the media popup.
     *
     * To extend the field for specific formats, change this value.
     * Can be all/image/video/audio.
     *
     * @return {string}
     */
    getFileType() {
        return 'image';
    }
}