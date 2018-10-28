/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';

/**
 * Internal dependencies
 */
import Option from './option.js';

/**
 * Generates the input of the image select field.
 * 
 * @param {Object} props All props, as defined in propTypes.
 * @return {React.Element}
 */
function ImageSelect( { name, options, value, containerPath, onChange } ) {
    const inputName = containerPath.join( '-' ) + '-' + name;

    return <div className="uf-image-select">
        { map( options, ( { image, label }, key ) => {
            return <Option
                key={ key }
                name={ inputName }
                value={ key }
                image={ image }
                label={ label }
                selected={ value === key }
                onSelect={ onChange }
            />;
        } ) }
    </div>;
}

ImageSelect.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired,
    value: PropTypes.any.isRequired,
    containerPath: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default ImageSelect;