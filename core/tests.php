<?php
use Ultimate_Fields\Container;
use Ultimate_Fields\Field;

Container::create( 'post-fields-1' )
	->set_style( 'boxed' )
	->set_description_position( 'label' )
	->set_layout( 'grid' )
	->add_location( 'options' )
	->add_fields( [
		Field::create( 'text', 'some_field_a' )
			->required()
			->set_description( 'This is a field...' ),
		Field::create( 'text', 'field_without_label' )
			->hide_label(),
		Field::create( 'text', 'some_field_b' ),
		Field::create( 'text', 'half_field_1' )->set_width( 50 ),
		Field::create( 'text', 'half_field_2' )->set_width( 50 ),
	] );
