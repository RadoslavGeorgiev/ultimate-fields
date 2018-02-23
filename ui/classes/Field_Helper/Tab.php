<?php
namespace Ultimate_Fields\UI\Field_Helper;

use Ultimate_Fields\UI\Field_Helper;
use Ultimate_Fields\Field;

/**
 * Handles the tab-related functionality in the UI.
 *
 * @since 3.0
 */
class Tab extends Field_Helper {
	/**
	 * Returns the title of the field, as displayed in the type dropdown.
	 *
	 * @since 3.0
	 *
	 * @return string
	 */
	public static function get_title() {
		return __( 'Tab', 'ultimate-fields' );
	}

	/**
	 * Returns the fields that allow additional settings.
	 *
	 * @since 3.0
	 *
	 * @return mixed[]
	 */
	public static function get_fields() {
		if( defined( 'ULTIMATE_FIELDS_PRO' ) && ULTIMATE_FIELDS_PRO ) {
			$field = Field::create( 'icon', 'tab_icon', __( 'Icon', 'ultimate-fields' ) )
				->add_set( 'dashicons' );
		} else {
			$field = Field::create( 'text', 'tab_icon', __( 'Icon', 'ultimate-fields' ) );
		}

		$fields = array(
			$field
 		);

 		return array(
 			'general' => $fields
 		);
 	}
}
