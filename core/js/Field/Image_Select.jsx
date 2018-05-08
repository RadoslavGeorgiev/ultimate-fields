import React from 'react';
import _ from 'lodash';
import Select from './Select.jsx';

export default class Image_Select extends Select {
    renderInput() {
        const { options } = this.props;
        const id = this.id;
        const value = this.getValue();

        return <div className="uf-image-select">
            { _.map( options, ( option, key ) =>
                <label key={ key } className={ key === value ? 'uf-selected' : null }>
                    <input type="radio" value={ key } name={ id } onChange={ this.radioChanged.bind( this ) } />
                    <span><img src={ option.image } alt={ option.label } label={ option.title } /></span>
                </label>
            )}
        </div>
    }

    radioChanged( e ) {
        const { name, onValueChanged } = this.props;
        onValueChanged( name, e.target.value );
    }

    static prepareValue( value, field ) {
        const { options } = field.props;

		if( value in options ) {
			return value;
		}

		value = null;
		_.map( options, ( label, key ) => {
			if( null === value ) {
				value = key;
			}
		});

		return value;
	}
}
