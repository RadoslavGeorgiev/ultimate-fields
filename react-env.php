<?php
use Ultimate_Fields\Container;
use Ultimate_Fields\Field;
use Ultimate_Fields\Options_Page;

define( 'ENV_PAGE_STUFF', false );
define( 'ENV_PAGE_TABBED_STUFF', false );
define( 'ENV_STUFF', false );
define( 'ENV_ALL_REACT_FIELDS', false );
define( 'ENV_REPEATERS_PAGE', false );
define( 'ENV_COMPLEX_PAGE', true );

add_action( 'uf.init', function() {
	if( ENV_PAGE_STUFF || ENV_PAGE_TABBED_STUFF ) {
		$page = Options_Page::create( 'react-env' );
	}

	if( ENV_PAGE_STUFF ) Container::create( 'Page Stuff' )
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

	if( ENV_PAGE_TABBED_STUFF ) Container::create( 'Page Tabbed Stuff' )
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

	if( ENV_STUFF ) Container::create( 'Stuff' )
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

		$select_options = array(
		''      => 'None',
		'vienna'      => 'Vienna',
		'varna'       => 'Varna',
		'new_york'    => 'New York',
		'los_angeles' => 'Los Angeles',
		'london'      => 'London',
		'sofia'       => 'Sofia',
		'bratislava'  => 'Bratislava'
	);
	$image_options = array();
	$raw = array(
		'light-green'  => 'Light Green',
		'light-blue'   => 'Light Blue',
		'light-sky'    => 'Light Sky',
		'light-purple' => 'Light Purple',
		'light-red'    => 'Light Red',
		'light-yellow' => 'Light Yellow',
		'dark-green'   => 'Dark Green',
		'dark-blue'    => 'Dark Blue',
		'dark-sky'     => 'Dark Sky',
		'dark-purple'  => 'Dark Purple',
		'dark-red'     => 'Dark Red',
		'dark-yellow'  => 'Dark Yellow'
	);
	foreach( $raw as $key => $label ) {
		$image_options[ $key ] = array(
			'image' => 'http://ra.do/uf3/wp-content/plugins/uf3-demo/images/color-' . $key . '.png',
			'label' => $label
		);
	}

	if( ENV_ALL_REACT_FIELDS ) Container::create( 'All React Fields' )
		->add_location( 'options' )
		->set_layout( 'rows' )
		->add_fields([
			Field::create( 'tab', 'text_fields' )
				->set_icon( 'dashicons-editor-spellcheck' ),
			Field::create( 'text', 'text_field' )
				->set_prefix( '$' )
				->set_suffix( '.00' ),
			Field::create( 'password', 'password_field' )
				->set_prefix( 'usr_' ),
			Field::create( 'textarea', 'textarea_field' )
				->set_rows( 5 ),
			Field::create( 'wysiwyg', 'wysiwyg_field', 'WYSIWYG Field' ),
			Field::create( 'number', 'standard_number_field' ),
			Field::create( 'number', 'number_field_w_slider' )
				->enable_slider( 100, 1000, 5 ),

			Field::create( 'tab', 'demo_choices_fields', 'Choice Fields' )
				->set_icon( 'dashicons-forms' ),
			Field::create( 'section', 'demo_checkbox_fields', 'Checkbox Fields' ),
			Field::create( 'checkbox', 'demo_checkbox_field', 'Checkbox Field' )
				->set_text( 'Yes' ),
			Field::create( 'checkbox', 'demo_checkbox_field_2', 'Fancy Checkbox Field' )
				->fancy()
				->set_text( 'Yes' ),
			Field::create( 'section', 'demo_select_fields', 'Select Fields' ),
			Field::create( 'select', 'demo_select_field', 'Select Field' )
				->add_options( $select_options ),
			Field::create( 'select', 'select_w_groups' )
				->add_options([
					'Group One' => [
						'Option 1',
						'Option 2'
					],
					'Group Two' => [
						'Option 3'
					]
				]),
			Field::create( 'select', 'demo_select_field_2', 'Fancy Select Field' )
				->fancy()
				->add_options( $select_options ),
			Field::create( 'select', 'demo_select_field_3', 'Radio Select Field' )
				->set_input_type( 'radio' )
				->add_options( $select_options ),
			Field::create( 'select', 'demo_select_field_4', 'Horizontal Radio Select Field' )
				->set_input_type( 'radio' )
				->set_orientation( 'horizontal' )
				->add_options( $select_options ),
			Field::create( 'section', 'demo_multiselect_fields', 'Multiselect Fields' ),
			Field::create( 'multiselect', 'demo_multiselect_field', 'Multiselect Field' )
				->add_options( $select_options ),
			Field::create( 'multiselect', 'demo_multiselect_field_2', 'Multiselect Field with Checkboxes' )
				->set_input_type( 'checkbox' )
				->add_options( $select_options ),
			Field::create( 'section', 'demo_imageselect_fields', 'Image Select Field' ),
			Field::create( 'image_select', 'demo_image_select_field', 'Image Select' )
				->add_options( $image_options ),

			Field::create( 'tab', 'demo_file_fields', 'File Fields' )
				->set_icon( 'dashicons-admin-media' ),
			Field::create( 'file', 'demo_file_field', 'File Field' ),
			Field::create( 'image', 'demo_image_field', 'Image Field' ),
			// Field::create( 'audio', 'demo_audio_field', 'Audio Field' ),
			// Field::create( 'video', 'demo_video_field', 'Video Field' ),
			// Field::create( 'gallery', 'demo_gallery_field', 'Gallery Field' ),

			Field::create( 'tab', 'demo_relational_fields', 'Relational Fields' )
				->set_icon( 'dashicons-randomize' ),
			Field::create( 'wp_object', 'demo_object_field', 'Object Field' ),
			Field::create( 'wp_objects', 'demo_objects_field', 'Objects Field' )
				->set_max( 2 ),
			Field::create( 'link', 'demo_link_field', 'Link Field' )
				->required(),
		]);

	if( ENV_REPEATERS_PAGE ) Container::create( 'new-repeater' )
		->add_location( 'options' )
		->set_layout( 'rows' )
		->add_fields([
			Field::create( 'repeater', 'new_repeater' )
				->set_minimum( 1 )
				->set_maximum( 10 )

				->add_group( 'text_group', [
					'title' => 'Text Group'	,
					'fields' => [
						Field::create( 'tab', 'content' ),
						Field::create( 'text', 'title' )->required(),
						Field::create( 'text', 'other_field' )->required(),
						Field::create( 'tab', 'appearance' ),
						Field::create( 'text', 'appearance_field' ),
					],
					'description' => 'A text group that is somewhere around here.',

					'minimum' => 1,
					'maximum' => 3,
					// 'border_color' => 'blue',
					// 'title_color' => 'white',
					// 'title_background' => 'red',

					'edit_mode' => 'both'
				])
				->add_group( 'image', [
					'fields' => [
						Field::create( 'image', 'image' )
					],
					'edit_mode' => 'popup'
				])

				// ->set_chooser_type( 'tags' )
		]);

	if( ENV_COMPLEX_PAGE ) Container::create( 'complex-tests' )
		->add_location( 'options' )
		->add_fields([
			Field::create( 'complex', 'complex_field_2' )
				->add_fields([
					Field::create( 'text', 'complex_subfield_1' )->set_width( 50 )->required(),
					Field::create( 'text', 'complex_subfield_2' )->set_width( 50 ),
					Field::create( 'text', 'complex_subfield_3' )
				])
		]);
});

add_action( 'init', function() {
	remove_post_type_support( 'page', 'editor' );
});
