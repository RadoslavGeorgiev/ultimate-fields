import { find, map } from 'lodash';

import FieldModel from './../field/model';
import RepeaterGroupModel from './group-model';

export default class RepeaterFieldModel extends FieldModel {
	getEmptyValue() {
		return [];
	}

	findGroup( type ) {
		const { groups } = this.props;
		return find( groups, { id: type } );
	}

	importValue( value ) {
		return value.map( row => {
			const group = this.findGroup( row.__type );

			const model = new RepeaterGroupModel( {
				...group,
				data: row,
			} );

			return model.loadData();
		} );
	}

	mapStateToProps() {
		return state => {
			const { name, groups, datastore } = this.props;

			const children = map( this.getValueFromState( state ), ( row, i ) => {
				const model = new RepeaterGroupModel( {
					...this.findGroup( row.__type )
				} );

				return model.getComponent( {
					key: i,
					datastore: [ ...datastore, name, i ],
				} );
			} );

			return {
				renderedGroups: children,
			}
		};
	}
}
