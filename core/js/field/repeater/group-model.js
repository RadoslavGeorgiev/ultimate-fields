import React from 'react';

import ContainerModel from './../../container/model';
import RepeaterGroup from './group';

export default class RepeaterGroupModel extends ContainerModel {
	getComponent( props ) {
		return <RepeaterGroup
			fields={ this.fields }
			{ ...props }
		/>;
	}
}
