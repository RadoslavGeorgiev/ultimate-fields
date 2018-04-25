export default class StoreParser {
	prepareDataForStore( data, prefix, index ) {
		const stores = {}

		const createSubStore = () => {
			if( ! stores[ prefix ] ) {
				stores[ prefix ] = {};

				if( 'number' == typeof index ) {
					stores[ prefix ][ '__index' ] = index;
				}
			}
		};

		for( let key in data ) {
			if( 'object' === typeof data[ key ] ) {
				Object.assign( stores, this.prepareDataForStore(
					data[ key ],
					prefix + '_' + key, parseInt( key )
				));

				if( 'function' == typeof data[ key ].indexOf ) {
					stores[ prefix + '_' + key ] = data[ key ].map( ( value, index ) => index );
				}
			} else {
				createSubStore();
				stores[ prefix ][ key ] = data[ key ];
			}
		}

		return stores;
	}

	extractDataFromState( store, prefix ) {
		const data = {};
		const ignored = [ '__tab' ];
		let lastKey = false;

		Object.keys( store ).sort().forEach( key => {
			if( 0 !== key.indexOf( prefix ) || ( lastKey && 0 === key.indexOf( lastKey ) ) ) {
				return;
			}

			if( key === prefix ) {
				const diff = {}

				for( let subKey in store[ key ] ) {
					if( -1 == ignored.indexOf( subKey ) ) {
						diff[ subKey ] = store[ key ][ subKey ];
					}
				}

				Object.assign( data, diff );
			} else {
				if( 'function' === typeof store[ key ].indexOf ) {
					lastKey = key;
					data[ key.replace( prefix + '_', '' ) ] = this.extractArrayFromState( store, key );
				}
			}
		});

		return data;
	}

	extractArrayFromState( store, prefix ) {
		const data = [];
		const indexes = store[ prefix ];

		return store[ prefix ].map( index => {
			return this.extractDataFromState( store, prefix + '_' + index  );
		});
	}

	test() {
		const demoData = {
			name: 'My blog name',
			social_networks: [
				{
					network: 'Twitter'
				},
				{
					network: 'Facebook'
				}
			],
			slides: [
				{
					images: [
						{
							image: 'image-1.png'
						},
						{
							image: 'image-2.png'
						}
					]
				}
			]
		};

		const prepared = this.prepareDataForStore( demoData, '__' );
		const parsed = this.extractDataFromState( prepared, '__' );

		console.log( isEqual( demoData, parsed ), demoData, parsed );
	}
}
