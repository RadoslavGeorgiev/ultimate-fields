<?php
use Ultimate_Fields\Container;
use Ultimate_Fields\Field;

add_action( 'uf.init', function() {
	Container::create( 'Page Stuff' )
		->add_location( 'post_type', 'page' )
		->add_fields([
			Field::create( 'text', 'test' )
				->required()
		]);
});

add_action( 'init', function() {
	remove_post_type_support( 'page', 'editor' );
});
