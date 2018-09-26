<?php
use Ultimate_Fields\Container;
use Ultimate_Fields\Field;

Container::create( 'post-fields-1' )
	->set_style( 'seamless' )
	->add_location( 'post_type', 'page', [
		// 'style' => 'seamless',
	])
	->add_fields( [
		Field::create( 'text', 'some_field_a' )
	] );
