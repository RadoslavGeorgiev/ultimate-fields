<?php
use Ultimate_Fields\Container;
use Ultimate_Fields\Field;

Container::create( 'post-fields-1' )
	->add_location( 'post_type', 'page' )
	->add_fields( [
		Field::create( 'text', 'some_field_a' )
	] );
