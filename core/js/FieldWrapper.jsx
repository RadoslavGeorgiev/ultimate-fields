import React from 'react';

export default class FieldWrapper extends React.Component {
	static defaultProps = {
		invalidFieldMessage: false
	}

	render() {
		const {
			children,
			id,
			label,
			width,
			description,
			description_position,
			invalidFieldMessage,
			layout,
			type
		} = this.props;

		const required = 'required' in this.props;
		const styles = { width: width !== 100 ? width + '%' : null };

		const descriptionEl = ( description && description.length )
			? <div className="uf-field__description" dangerouslySetInnerHTML={{ __html: description }} />
			: null;

		return <div className={ 'uf-field uf-field--' + layout + ' uf-field--' + type.toLowerCase() } style={ styles }>
			<div className="uf-field__details">
				<label htmlFor={ id }>
					{ label }
					{ required && <span className="uf-field__required">*</span> }
				</label>

				{ 'label' == description_position && descriptionEl }
			</div>

			<div className={ 'uf-field__inputs uf-field--' + type.toLowerCase() }>
				{ children }

				{
					invalidFieldMessage &&
					<div className="uf-field__message">{ invalidFieldMessage }</div>
				}

				{ 'input' == description_position && descriptionEl }
			</div>
		</div>
	}
}
