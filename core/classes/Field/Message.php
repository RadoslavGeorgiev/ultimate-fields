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
	 * Ensures that unlike normal fields, no values are saved for messages.
	 *
	 * @since 3.0.2
	 *
	 * @param mixed[] $source The source which the value of the field would be available in.
	 */
	public function save( $source ) {
		// Nothing to do here really...
	}
}
