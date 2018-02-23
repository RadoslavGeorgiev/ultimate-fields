<?php
namespace Ultimate_Fields\Helper;

/**
 * @todo: Comment
 */
class Dummy_Class {
	public function __set( $key, $value ) {
		// Nothing to set really
	}

	public function __get( $property ) {
		return null;
	}

	public function __call( $method_name, $args ) {
		return $this;
	}
}
