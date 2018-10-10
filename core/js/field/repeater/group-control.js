/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default function GroupControl( { children: title, icon, onClick } ) {
	return (
		<a
			href="#"
			title={ title }
			className={ 'uf-group__control' + ( 'trash' === icon ? ' uf-group__control--remove' : '' ) }
			onClick={ e => { e.preventDefault(); onClick() } }
		>
			<span className={ `dashicons dashicons-${ icon }` }></span>
		</a>
	);
}

GroupControl.propTypes = {
	children: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
}
