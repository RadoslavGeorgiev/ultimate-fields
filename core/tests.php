<?php
use Ultimate_Fields\Container;
use Ultimate_Fields\Field;
use Ultimate_Fields\Options_Page;

$page = Options_Page::create( 'test-fields' );

Container::create( 'post-fields-1' )
	->set_style( 'boxed' )
	->set_description_position( 'label' )
	->set_layout( 'grid' )
	->add_location( 'options', $page )
	->add_location( 'post_type', 'page' )
	->add_fields( [
		Field::create( 'tab', 'first_tab' )
			->set_icon( 'dashicons-admin-generic' ),
		Field::create( 'checkbox', 'enable_second_tab' )
			->set_text( 'enable' ),
		Field::create( 'text', 'some_field_a' )
			->required()
			->set_description( 'This is a field...' )
			->set_prefix( '€' )
			->set_suffix( '.00' )
			->add_suggestions( [
				'Varna',
				'Vienna',
			] ),
		Field::create( 'text', 'half_field_2' )->set_width( 50 )
			->required(),
		Field::create( 'text', 'half_field_1' )->set_width( 50 )
			->required(),
		Field::create( 'repeater', 'simple_repeater' )
			->add_group( 'some_group', [
				'fields' => [
					Field::create( 'tab', 'tab_one' ),
					Field::create( 'text', 'sub_field_1' )
						->set_width( 50 )
						->required(),
					Field::create( 'text', 'sub_field_2' )
						->set_width( 50 ),
					Field::create( 'checkbox', 'show_next_field' )
						->set_width( 50 )
						->set_text( 'Show' )
						->set_default_value( true ),
					Field::create( 'text', 'conditional_sub_field' )
						->set_width( 50 )
						->add_dependency( 'show_next_field' ),
					Field::create( 'tab', 'tab_two' ),
					Field::create( 'text', 'sub_field_3' )
						->set_width( 50 ),
				],
			] )
			->set_default_value( [
				[
					'__type'      => 'some_group',
					'sub_field_1' => 'A',
					'sub_field_2' => 'B',
				],
				[
					'__type'      => 'some_group',
					'sub_field_1' => 'C',
				],
			] ),
		Field::create( 'checkbox', 'container_source' )
			->set_text( 'Show the second container.' ),
		Field::create( 'checkbox', 'dependency_source' )
			->set_text( 'Show the second field in the next container.' ),

		Field::create( 'tab', 'second_tab' )
			->add_dependency( 'enable_second_tab' ),
		Field::create( 'text', 'some_field_b' ),

		Field::create( 'tab', 'third_tab' ),
		Field::create( 'checkbox', 'third_tab_checkbox' )
			->set_text( 'Check me!' )
			->required()
	] );

Container::create( 'post-fields-2' )
	->add_location( 'options', $page )
	->add_location( 'post_type', 'page', [
		'levels'       => 2,
		'dependencies' => array(
			array(
				array(
					'field' => 'container_source'
				)
			)
		),
	] )
	->set_style( 'boxed' )
	->add_fields( [
		Field::create( 'text', 'some_field_1' ),
		Field::create( 'text', 'some_field_2' )
			->add_dependency( 'dependency_source' )
			->required()
	] );

$p3 = array();

for($i=0; $i<100; $i++ ) {
	$p3[] = Field::create( 'text', 'field_' . ($i+1) )
		->required();
}

Container::create( 'post-fields-3' )
	->set_style( 'boxed' )
	->add_location( 'post_type', 'post' )
	->add_fields( $p3 );

Container::create( 'repeater-field' )
	->set_style( 'boxed' )
	->add_location( 'options' )
	->add_fields([
		Field::create( 'repeater', 'multi_group_repeater' )
			->hide_label()
			->set_chooser_type( 'tags' )
			->add_group( 'text', [
				'edit_mode' => 'both',
				'layout' => 'rows',
				'icon' => 'dashicons dashicons-editor-paragraph',
				'fields' => [
					Field::create( 'tab', 'tab_1' ),
					Field::create( 'text', 'title' )
						->required(),
					Field::create( 'repeater', 'links' )
						->add_group( 'link', [
							'edit_mode' => 'both',
							'icon' => 'dashicons dashicons-admin-links',
							'fields' => [
								Field::create( 'text', 'link_name' ),
								Field::create( 'text', 'link_url' ),
								Field::create( 'repeater', 'icons' )
									->add_group( 'icon', [
										'edit_mode' => 'both',
										'icon' => 'dashicons dashicons-admin-links',
										'fields' => [
											Field::create( 'text', 'icon' )
										]
									] ),
							]
						] ),
					Field::create( 'tab', 'tab_2' ),
					Field::create( 'text', 'second_title' ),
				]
			] )
			->add_group( 'teaser', [
				'fields' => [
					Field::create( 'text', 'title' ),
					Field::create( 'textarea', 'text' ),
				]
			] )
	]);

Container::create( 'table-repeater' )
	->add_location( 'options' )
	->set_style( 'boxed' )
	->add_fields( [
		Field::create( 'repeater', 'table' )
			->hide_label()
			->set_layout( 'table' )
			->add_group( 'row', [
				'fields' => [
					Field::create( 'text', 'column_one' )->required(),
					Field::create( 'text', 'column_two' )->set_description( 'Description here' ),
				]
			] )
	] );

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
		// 'image' => ULTIMATE_FIELDS_DEMO_URL . '/images/color-' . $key . '.png',
		'label' => $label
	);
}

Container::create( 'all-fields' )
	->add_location( 'options' )
	->set_style( 'boxed' )
	->add_fields( [
		Field::create( 'tab', 'demo_text_fields', 'Text Fields' )
			->set_icon( 'dashicons-editor-spellcheck' ),
		Field::create( 'text', 'demo_text_field', 'Fancy Text Field' )
			->add_suggestions( array( 'Vienna', 'Varna' ) )
			->set_description( 'Start typing something with v' ),
		Field::create( 'text', 'demo_text_field_2', 'Dollar Value' )
			->set_prefix( '$' )
			->required( true, 'Please enter a dollar value (with a dot separator)' )
			->set_validation_rule( '~^\d+\.\d\d$~i' )
			->set_placeholder( '0.00' ),
		Field::create( 'text', 'demo_text_field_3', 'EUR Value' )
			->set_suffix( 'EUR' ),
		Field::create( 'textarea', 'demo_textarea_field', 'Textarea Field' )
			->set_rows( 4 )
			->set_default_value( "Lorem ipsum dolor" ),
		Field::create( 'wysiwyg', 'wysiwyg_field', 'WYSIWYG FIeld' ),

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
	] );
