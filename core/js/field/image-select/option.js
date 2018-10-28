/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Renders individual options for the Image Select field.
 */
export default class ImageSelectOption extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
        image: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        onSelect: PropTypes.func.isRequired,
    };

    /**
     * Generates the option.
     * 
     * @return {React.Element}
     */
    render() {
        const { name, value, image, label, selected } = this.props;
        const className = selected ? 'uf-selected' : null;

        return (
            <label key={ value } className={ className }>
                <input
                    type="radio"
                    value={ value }
                    name={ name }
                    onChange={ this.changed }
                />
    
                <span>
                    <img src={ image } alt={ label } label={ label } />
                </span>
            </label>
        );
    }

    /**
     * Handles changes of the radio field.
     * 
     * @param {Event} e The event that just occured.
     */
    changed = ( { target: { checked } } ) => {
        if ( ! checked ) {
            return;
        }

        const { value, onSelect } = this.props;
        onSelect( value );
    }
}