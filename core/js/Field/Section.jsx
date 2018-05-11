import React from 'react';
import Field from './../Field.jsx';

export default class Section extends Field {
    static defaultProps = Object.assign( {
        icon: false,
		color: false
    }, Field.defaultProps )

    render() {
        const { label, description, color, icon } =this.props;

        return <div className={ 'uf-section' + ( color ? ' uf-section--' + color : '' ) }>
            <h4>
                { icon && <span className={ icon }></span> }
                { label }
            </h4>

            { description && description.length && <div dangerouslySetInnerHTML={{ __html: description }} /> }
        </div>
    }

    static getStores( type, field, data, source ) {
        return {}
    }
}
