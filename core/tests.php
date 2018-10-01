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
	->add_fields( [
		Field::create( 'tab', 'first_tab' )
			->set_icon( 'dashicons-admin-generic' ),
		Field::create( 'checkbox', 'enable_second_tab' )
			->set_text( 'enable' ),
		Field::create( 'text', 'some_field_a' )
			->required()
			->set_description( 'This is a field...' ),
		Field::create( 'text', 'field_without_label' )
			->hide_label(),
		Field::create( 'text', 'half_field_1' )->set_width( 50 ),
		Field::create( 'text', 'half_field_2' )->set_width( 50 ),
		Field::create( 'checkbox', 'dependency_source' )
			->set_text( 'Show the second field in the next container.' ),
		Field::create( 'tab', 'second_tab' )
			->add_dependency( 'enable_second_tab' ),
		Field::create( 'text', 'some_field_b' ),
	] );

Container::create( 'post-fields-2' )
	->add_location( 'options', $page )
	->set_style( 'boxed' )
	->add_fields( [
		Field::create( 'text', 'some_field_1' ),
		Field::create( 'text', 'some_field_2' )
			->add_dependency( 'dependency_source' )
	] );
