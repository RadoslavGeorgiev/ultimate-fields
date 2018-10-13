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
			->set_suffix( '.00' ),
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
			->add_group( 'text', [
				'edit_mode' => 'both',
				'fields' => [
					Field::create( 'tab', 'tab_1' ),
					Field::create( 'text', 'title' ),
					Field::create( 'tab', 'tab_2' ),
					Field::create( 'text', 'second_title' ),
				]
			] )
	]);
