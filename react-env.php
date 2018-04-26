<?php
use Ultimate_Fields\Container;
use Ultimate_Fields\Field;

add_action( 'uf.init', function() {
	Container::create( 'Page Stuff' )
		->add_location( 'post_type', 'page' )
		->add_fields([
			Field::create( 'checkbox', 'checkbox_test' )
				->set_text( 'Oui' )
				->fancy()
				->set_description( 'This is a field description' ),
			Field::create( 'text', 'test' )
				->set_width( 50 )
				->add_suggestions([
					'Vienna',
					'Varna'
				]),
			Field::create( 'text', 'test_2' )
				->required()
				->set_width( 50 ),
			Field::create( 'select', 'select_test' )
				->add_options([
					'option_a' => 'Option A',
					'option_b' => 'Option B',
					'option_c' => 'Option C',
				])
				->fancy(),
			Field::create( 'textarea', 'test_3' ),
			Field::create( 'wp_object', 'object_test' ),
			Field::create( 'repeater', 'simple_repeater' )
				->add_group( 'entry', [
					'title'  => 'A group',
					'fields' => [
						Field::create( 'text', 'repeater_field_a' )
					],
					'edit_mode' => 'all'
				])
		]);
});

add_action( 'init', function() {
	remove_post_type_support( 'page', 'editor' );
});
