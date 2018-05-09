import React from 'react';
import WP_Object from './WP_Object.jsx';
import Button from './../Button.jsx';

export default class Link extends WP_Object {
    isObject( item ) {
        if( ! item ) {
            return false;
        }

        return !! item.match( /^(\w+)_\d+$/ );
    }

    renderInput() {
        const { button_text, getCachedValue } = this.props;
        const { loading, chooserOpen } = this.state;
        let { link } = this.getValue();
        let top;

        if( link && this.isObject( link ) && getCachedValue( 'object_' + link ) ) {
            top = this.getPreview( getCachedValue( 'object_' + link ) );
        } else {
            link = link || '';

            top = <div className="uf-link-chooser">
                <div className="uf-basic-input uf-link-url">
                    <span className="uf-field-prefix">
                        <span className="dashicons dashicons-admin-site"></span>
                    </span>

                    <input type="text" className="uf-link-url-input" value={ link } onChange={ e => this.updateItem( e.target.value ) } />
                </div>

                <span className="uf-link-or">or</span>

                <Button
                    onClick={ this.openChooser.bind( this ) }
                    icon="dashicons-search"
                    className="uf-object__select"
                    children={ button_text || uf_l10n['select-item'] }
                />
            </div>;
        }

        return <div className="uf-link">
            <div className="uf-link__top">
                { top }
            </div>

            { chooserOpen ? this.getChooser() : this.getTargetCheckbox() }
        </div>
    }

    getTargetCheckbox() {
        const { new_tab } = this.getValue();

        return <label className="uf-link-new-tab">
            <input type="checkbox" checked={ new_tab } onChange={ this.updateTarget.bind( this ) } />
            <span>Open link in a new tab</span>
        </label>;
    }

    updateItem( item ) {
		const { name, onValueChanged } = this.props;
        const value = this.getValue();
        value.link = item;
		onValueChanged( name, value );
	}

    updateTarget( e ) {
        const { name, onValueChanged } = this.props;
        const value = this.getValue();

        value.new_tab = e.target.checked;
        onValueChanged( name, value );
    }

    clearValue() {
        this.updateItem( '' );
    }

    static getValidator() {
        return ( store, field, source ) => {
            const { name, label, required } = field.props;

            if( ! required ) {
        		return [];
        	}

        	let message;
        	const state   = store.getState();
        	const context = state.values[ source ];
        	const value   = context ? context[ name ] : null;
            const link    = value ? value.link : false;

        	if( ! link ) {
        		message = label + ' does not contain a valid value.';
        	}

        	store.dispatch({
        		type: 'SET_VALIDATION_MESSAGE',
        		name: source + '_' + name,
        		message
        	});

        	return message ? [ message ] : [];
        }
    }
}
