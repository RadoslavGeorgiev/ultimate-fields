import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = ({ validation }, ownProps ) => ({
	invalidFieldMessage: validation[ ownProps.source + '_' + ownProps.name ]
});

const mapDispatchToProps = dispatch => ({

});

class FieldWrapper extends React.Component {
	render() {
		const { children, id, label, width, invalidFieldMessage } = this.props;
		const required = 'required' in this.props;

		return <div className="field" style={{ width: width !== 100 ? width + '%' : null }}>
			<div className="field__details">
				<label htmlFor={ id }>
					{ label }
					{ required && <span className="field__required">*</span> }
				</label>
			</div>

			<div className="field__inputs">
				{ children }

				{
					invalidFieldMessage &&
					<div className="field__message">{ invalidFieldMessage }</div>
				}
			</div>
		</div>
	}
}

export default connect( mapStateToProps, mapDispatchToProps )( FieldWrapper );
