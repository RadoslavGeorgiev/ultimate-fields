import React from 'react';
import ConnectedFieldWrapper from './ConnectedFieldWrapper.jsx';

export default class FieldErrorBoundary extends React.Component {
	state = {
		hasErrors: false
	}

	componentDidCatch( error, info ) {
		// console.log(error, info);

		this.setState({
			hasErrors: true
		});
	}

    render() {
        return this.state.hasErrors
            ? this.renderErrorMessage()
            : this.props.children;
    }

	renderErrorMessage() {
		return <ConnectedFieldWrapper { ...this.props.fieldProps }>
            <p className="uf-field__error">
                <span className="dashicons dashicons-warning" />
                There was an error while rendering this field.
            </p>
        </ConnectedFieldWrapper>
	}

    componentDidUpdate() {
        if( this.state.hasErrors ) {
            jQuery( document ).trigger( 'uf-grid-resize' );
        }
    }
}
