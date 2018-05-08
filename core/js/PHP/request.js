export default function request( { url, body } ) {
	const data = new FormData();

	if( body ) {
		for( let key in body ) {
			data.append( key, body[key] );
		}
	}

	return new Promise( ( resolve, reject ) => {
		const xhr = new XMLHttpRequest();

		xhr.open( 'POST', url || window.location.href );
		xhr.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' );

		xhr.onload = () => {
			let response;

			try {
				response = JSON.parse( xhr.response );
				resolve( response );
			} catch( e ) {
				reject();
				return;
			}
		}

		xhr.send( data );
	})
}
