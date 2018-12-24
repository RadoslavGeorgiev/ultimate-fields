/**
 * External dependencies
 */
import React, { Component, Fragment } from 'react';

/**
 * Internal dependencies
 */
import translate from 'utils/l10n';
import Button from 'components/button';
import Spinner from 'components/spinner';
import Chooser from './components/chooser';

/**
 * Handles the input of the WP Object field.
 */
export default class WPObjectField extends Component {
	state = {
		loading: false,
		chooserIsVisible: false,
	};

	/**
	 * Renders the field.
	 * 
	 * If there is a selected object, the full UI will be rendered,
	 * but if there is none, the field will only render a button.
	 */
    render() {
		const { value, chooserProps } = this.props;
		const { chooserIsVisible } = this.state;

		return <Fragment>
			{ value
				? this.renderFullUI()
				: this.renderButton()
			}

			<br />

			{ chooserIsVisible && <Chooser
				{ ...chooserProps }
				onLoad={ this.onChooserLoad }
				onClose={ this.onChooserClose }
				onSelect={ this.onChooserSelect }
			/> }
		</Fragment>
	}
	
	/**
	 * Renders a file selection buton that is only used when there is no selection.
	 * 
	 * @return {Element}
	 */
    renderButton() {
		const { button_text } = this.props;
		const { loading } = this.state;

		const button = <Button
			icon="search"
			onClick={ this.toggleChooser }
			children={ button_text }
			disabled={ loading }
		/>;

		if ( ! loading ) {
			return button;
		}

		return <Fragment>
			{ button }
			<Spinner className="uf-object__spinner" />
		</Fragment>;
	}

	/**
	 * Renders the full UI of the field when a file is selected.
	 * 
	 * @return {Element}
	 */
	renderFullUI() {
		const { loading, chooserIsVisible } = this.state;
		const { object } = this.props;

		return <div className="uf-object-ui">
			<div
				className={ `uf-object-ui__preview uf-object-ui__preview--${object.type}` }
				dangerouslySetInnerHTML={{ __html: object.html }}
			/>
		
			<div className="uf-object-ui__buttons">
				<Button
					type="secondary"
					icon={ 'arrow-' + ( chooserIsVisible ? 'up' : 'down' ) }
					disabled={ loading }
					onClick={ this.toggleChooser }
				/>

				{ loading &&
					<Spinner className="uf-object-ui__spinner" /> }

				<Button
					icon="no"
					className="uf-button--right"
					onClick={ this.clearSelection }
				>
					{ translate( 'remove' ) }
				</Button>
			</div>
		</div>;
	}
	
	/**
	 * Toggles the object chooser.
	 */
	toggleChooser = () => {
		const { chooserIsVisible } = this.state;

		if ( chooserIsVisible ) {
			return this.onChooserClose();
		}

		this.setState( {
			loading: true,
			chooserIsVisible: true,
		} );
	}

	/**
	 * Mark the field as loaded once the chooser initially loads.
	 * Follow-up spinners will be only displayed in the chooser.
	 */
	onChooserLoad = () => {
		this.setState( {
			loading: false,
		} );
	}

	/**
	 * When the chooser is closed, reset internal states.
	 */
	onChooserClose = () => {
		this.setState( {
			loading: false,
			chooserIsVisible: false,
		} );
	}

	/**
	 * Handles the selection of items in the chooser.
	 */
	onChooserSelect = ( items ) => {
		const { onChange } = this.props;

		onChange( items );

		this.setState( {
			loading: false,
			chooserIsVisible: false,
		} );
	}

	/**
	 * Clears the selected value and closes the chooser.
	 */
	clearSelection = () => {
		const { onChange } = this.props;

		this.setState( {
			loading: false,
			chooserIsVisible: false,
		} );

		onChange( false );
	}
}