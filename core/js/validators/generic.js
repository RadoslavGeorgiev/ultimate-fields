export default function genericValidator( store, field, source ) {
	const { name, label, required } = field.props;
	let message;

	if( ! required ) {
		return [];
	}

	const state   = store.getState();
	const context = state.values[ source ];
	const value   = context ? context[ name ] : null;

	if( ( ! value ) || ( ( 'string' == typeof value ) && ! value.length ) ) {
		message = label + ' does not contain a valid value.';
	}

	store.dispatch({
		type: 'SET_VALIDATION_MESSAGE',
		name: source + '_' + name,
		message
	});

	return message ? [ message ] : [];
}
