export default function request( action, data ) {
	return new Promise( ( resolve, reject ) => {
		jQuery.ajax({
			url:      window.location.href,
			type:     'post',
			dataType: 'json',
			success:  resolve,
			error:    reject,
			data:     {
				uf_ajax: true,
				uf_action: action,
				...data
			},
		});
	} );
}