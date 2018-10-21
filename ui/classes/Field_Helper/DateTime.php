<?php
namespace Ultimate_Fields\Pro\UI\Field_Helper;

use Ultimate_Fields\UI\Field_Helper;
use Ultimate_Fields\Field;

/**
 * Handles the date-field related functionality in the UI.
 *
 * @since 3.0
 */
class Datetime extends Field_Helper {
	/**
	 * Returns the title of the field, as displayed in the type dropdown.
	 *
	 * @since 3.0
	 *
	 * @return string
	 */
	public static function get_title() {
		return __( 'Date-Time', 'ultimate-fields-pro' );
	}

	/**
	 * Returns the fields that allow additional settings.
	 *
	 * @since 3.0
	 *
	 * @return mixed[]
	 */
	public static function get_fields( $existing ) {
		$fields = array(
			Field::create( 'datetime', 'default_value_datetime', __( 'Default value', 'ultimate-fields-pro' ) )
		);

		$output = array(

		);

		return array(
			'general' => $fields,
			'output'  => $output
		);
 	}

	/**
	 * Imports data about the field from post meta.
	 *
	 * @since 3.0
	 *
	 * @param mixed[] $field_data the data about the field.
	 */
	public function import_meta( $meta ) {
		parent::import_meta( $meta );


	}
}
