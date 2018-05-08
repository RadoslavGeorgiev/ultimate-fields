<?php
use Ultimate_Fields\Container;
use Ultimate_Fields\Field;
use Ultimate_Fields\Options_Page;

add_action( 'uf.init', function() {
	$page = Options_Page::create( 'react-env' );
	$ovrs = Options_Page::create( 'react-overlays' );

	Container::create( 'Page Stuff' )
		->add_location( 'post_type', 'page' )
		->add_location( 'options', $page )
		->add_fields([
			Field::create( 'section', 'test_section' )
				->set_icon( 'dashicons-admin-generic' )
				->set_description( 'This is a test section.' ),
			Field::create( 'wp_object', 'object_test' )
				->set_width( 50 ),
			Field::create( 'file', 'file_test' )
				->set_width( 50 ),
			Field::create( 'message', 'test_message' )
				->set_description( 'The message of the message.' ),
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
				// ->fancy()
				,
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

	Container::create( 'Page Tabbed Stuff' )
		->add_location( 'post_type', 'page' )
		->add_location( 'options', $page )
		->set_layout( 'rows' )
		->add_fields([
			Field::create( 'tab', 'tab_1' )
				->set_icon( 'dashicons-admin-generic' ),
			Field::create( 'text', 'first_tab_field' )
				->set_description( 'This field has a description!' )
				->required(),
			Field::create( 'message', 'test_message_2' )
				->set_description( 'The message of the message.' ),
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

	Container::create( 'Stuff' )
		->add_location( 'options', $ovrs )
		->add_fields([
			Field::create( 'repeater', 'overlay_repeater' )
				->add_group( 'entry', [
					'edit_mode' => 'both',
					'fields'    => array(
						Field::create( 'tab', 'tab_one' ),
						Field::create( 'text', 'test' ),
						Field::create( 'image', 'image' ),
						Field::create( 'repeater', 'nested_repeater' )
							->add_group( 'entry', [
								'edit_mode' => 'both',
								'fields'    => array(
									Field::create( 'text', 'test' ),
									Field::create( 'text', 'test_2' )
								)
							]),
						Field::create( 'tab', 'tab_two' ),
						Field::create( 'text', 'tab_two_field' ),
					)
				])
		]);

	Container::create( 'All React Fields' )
		->add_location( 'options' )
		->set_layout( 'rows' )
		->add_fields([
			Field::create( 'tab', 'text_fields' ),
			Field::create( 'text', 'text_field' )
				->set_prefix( '$' )
				->set_suffix( '.00' ),
			Field::create( 'password', 'password_field' )
				->set_prefix( 'usr_' ),
			Field::create( 'textarea', 'textarea_field' )
				->set_rows( 5 ),
			Field::create( 'wysiwyg', 'wysiwyg_field', 'WYSIWYG Field' )
		]);
});

add_action( 'init', function() {
	remove_post_type_support( 'page', 'editor' );
});
