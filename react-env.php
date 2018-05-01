<?php
use Ultimate_Fields\Container;
use Ultimate_Fields\Field;

add_action( 'uf.init', function() {
	Container::create( 'Page Tabbed Stuff' )
		->add_location( 'post_type', 'page' )
		->set_layout( 'rows' )
		->add_fields([
			Field::create( 'tab', 'tab_1' )
				->set_icon( 'dashicons-admin-generic' ),
			Field::create( 'text', 'first_tab_field' )
				->set_description( 'This field has a description!' )
				->required(),
			Field::create( 'checkbox', 'show_second_tab' )->fancy(),
			Field::create( 'text', 'fake_second_tab' )
				->add_dependency( 'show_second_tab' ),
			Field::create( 'complex', 'complex_parent' )
				->add_fields([
					Field::create( 'text', 'complex_child' )
				]),

			Field::create( 'tab', 'tab_2' )
				->add_dependency( 'show_second_tab' ),
			Field::create( 'checkbox', 'second_tab_field' )->fancy(),
			Field::create( 'text', 'second_tab_field_2' )
				->add_dependency( 'second_tab_field' ),
		]);

	Container::create( 'Page Stuff' )
		->add_location( 'post_type', 'page' )
		->add_fields([
			Field::create( 'wp_object', 'object_test' ),
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
			Field::create( 'repeater', 'simple_repeater' )
				->add_group( 'entry', [
					'title'  => 'A group',
					'fields' => [
						Field::create( 'text', 'repeater_field_a' )
					],
					'edit_mode' => 'all'
				]),
			Field::create( 'repeater', 'complex_repeater' )
				->add_group( 'text', [
					'fields' => [
						Field::create( 'text', 'title' )
					]
				])
				->add_group( 'image', [
					'fields' => [
						Field::create( 'image', 'image' )
					]
				])
		]);
});

add_action( 'init', function() {
	remove_post_type_support( 'page', 'editor' );
});
