<?php
namespace Ultimate_Fields\Pro\UI\Field_Helper;

use Ultimate_Fields\UI\Field_Helper;
use Ultimate_Fields\Field;

/**
 * Adds the neccessary UI functionality for the video field.
 *
 * @since 3.0
 */
class Video extends Field_Helper {
	/**
	 * Returns the title of the field, as displayed in the type dropdown.
	 *
	 * @since 3.0
	 *
	 * @return string
	 */
	public static function get_title() {
		return __( 'Video', 'ultimate-fields-pro' );
	}

	public static function get_fields( $existing ) {
		$general_fields = array(
			Field::create( 'video', 'default_value_video', __( 'Default value', 'ultimate-fields-pro' ) )
		);

		$output_fields = array(
			Field::create( 'text', 'video_output_width', __( 'Width', 'ultimate-fields-pro' ) )
				->set_default_value( '1280' ),
			Field::create( 'text', 'video_output_height', __( 'Height', 'ultimate-fields-pro' ) )
				->set_default_value( '720' )
		);

		return array(
			'general' => $general_fields,
			'output'  => $output_fields
		);
	}
}
