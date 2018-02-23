<?php
namespace Ultimate_Fields\Field;

use Ultimate_Fields\Field;

/**
 * Displays a message without no input.
 *
 * @since 3.0
 */
class Message extends Field {
	/**
	 * Enqueues the script for the field.
	 *
	 * @since 3.0
	 */
	public function enqueue_scripts() {
		wp_enqueue_script( 'uf-field-message' );
	}
}