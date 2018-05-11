import React from 'react';
import Preview from './../Preview.jsx';
import TabButton from './../../TabButton.jsx';

export default class Tab extends Preview {
	renderPreview() {
		const { label, tab_icon } = this.props.field;

		return <div className="uf-fields uf-fields--boxed" style={{ paddingBottom: '5px' }}>
			<div className="uf-tabs uf-tabs--boxed uf-tabs--grid">
				<TabButton title={ label } icon={ 'dashicons ' + tab_icon } active={ true } />
			</div>
		</div>
	}

	static canBeUsedForConditionalLogic() {
		return false;
	}
}
