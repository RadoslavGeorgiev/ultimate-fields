import React from 'react';
import { connect } from 'react-redux';
import FieldWrapper from './FieldWrapper.jsx';

const mapStateToProps = ({ validation }, ownProps ) => ({
	invalidFieldMessage: validation[ ownProps.source + '_' + ownProps.name ]
});

class ConnectedFieldWrapper extends FieldWrapper {

}

export default connect( mapStateToProps )( FieldWrapper );
