<?php
namespace Ultimate_Fields\Field;

use Ultimate_Fields\Template;
use Ultimate_Fields\Field\File;

/**
 * Adds the necessary functionality for the gallery field.
 *
 * @since 3.0
 */
class Gallery extends File {
	/**
	 * Indicates if the field works with multiple files or not.
	 *
	 * @since 3.0
	 * @var bool
	 */
	protected $multiple = true;

	/**
	 * Holds the allowed file type.
	 *
	 * @since 3.0
	 * @var boolean
	 */
	protected $file_type = 'image';

	/**
	 * Filters out the IDs from a field's value.
	 *
	 * @since 3.0
	 *
	 * @param mixed $value The value that is being prepared.
	 * @return int[]
	 */
	public function extract_ids_from_value( $value ) {
		$ids = array();

		# Make sure that Gallery attachments are separated from the normal format
		foreach( $value as $id ) {
			$ids[] = $id;
		}

		return $ids;
	}

	/**
	 * Generates the preview data for a specific ID.
	 *
	 * @since 3.0
	 *
	 * @param int $id The ID of the attachment.
	 * @return mixed[]
	 */
	public function generate_preview_data_for_id( $id ) {
		$id = str_replace( 'attachment_', '', $id );
		return wp_prepare_attachment_for_js( $id );
	}

	/**
	 * Enqueues the needed scripts for the field.
	 *
	 * @since 3.0
	 */
	public function enqueue_scripts() {
		parent::enqueue_scripts();

		# Add the gallery script
		$this->enqueue_script( 'jquery-ui-sortable' );

		# Add the gallery template
		Template::add( 'gallery', 'field/gallery' );

		# Localize
		ultimate_fields()
			->localize( 'gallery-select', _x( 'Select images', 'gallery', 'ultimate-fields' ) )
			->localize( 'gallery-remove', __( 'Remove all images', 'ultimate-fields' ) )
			->localize( 'gallery-sort', __( 'Sort', 'ultimate-fields' ) )
			->localize( 'gallery-order-change', __( 'Change order', 'ultimate-fields' ) )
			->localize( 'gallery-order-title', __( 'Title', 'ultimate-fields' ) )
			->localize( 'gallery-order-file', __( 'File name', 'ultimate-fields' ) )
			->localize( 'gallery-order-date', __( 'Date Uploaded', 'ultimate-fields' ) )
			->localize( 'gallery-order-default', __( 'Default Order', 'ultimate-fields' ) )
			->localize( 'gallery-order-randomize', __( 'Randomize', 'ultimate-fields' ) )
			;
	}

	/**
	 * Processes the value of the gallery by using the gallery shortcode.
	 *
	 * @since 3.0
	 *
	 * @param mixed $value The value to process.
	 * @return string
	 */
	public function process( $value ) {
		if( ! $value || ! is_array( $value ) || empty( $value ) ) {
			return '';
		}

		return gallery_shortcode(array(
			'ids' => implode( ',', $value )
		));
	}
}
