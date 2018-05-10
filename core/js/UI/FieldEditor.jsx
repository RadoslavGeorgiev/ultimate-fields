import React from 'react';

export default class FieldEditor extends React.Component {
	static defaultProps = {
		fields: []
	}

	componentWillMount() {
        const { data, fields, onChange } = this.props;
		const parser = new StoreParser;

		const store = this.store = window.theLastForm = createStore(
			combineReducers( reducers ),
			{
				values: parser.prepareDataForStore( data, fields, '__' )
			}
		);

		this.unsubscribe = store.subscribe( () => {
			const extracted = parser.extractDataFromState( store.getState().values, children, '__' );
			onChange( extracted );
		});
    }

	render() {
		return
		<Container children={ fields } source="__" layout="rows" description_position="label" className="uf-fields--boxed" display_tabs_wrapper={ true } />
	}
}
