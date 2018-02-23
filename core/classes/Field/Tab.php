<?php
namespace Ultimate_Fields\Field;
use Ultimate_Fields\Field;

class Tab extends Field {
	protected $icon = '';

	public function export_data() {
		return array();
	}

	public function save( $source ) {
		// Nothing to save
	}

	/**
	 * Changes the icon of the tab.
	 *
	 * @since 3.0
	 *
	 * @param string $icon The CSS class for the icon element.
	 * @return Tab The instance of the field.
	 */
	public function set_icon( $icon ) {
		$this->icon = $icon;

		return $this;
	}

	/**
	 * Adds more details to the fields' settings.
	 *
	 * @since 3.0
	 *
	 * @return mixed[]
	 */
	public function export_field() {
		$settings = parent::export_field();

		if( $this->icon ) {
			$icon = $this->icon;

			if( preg_match( '~^dashicons[^\s]~i', $icon ) ) {
				$icon = 'dashicons ' . $icon;
			}

			$settings[ 'icon' ] = $icon;
		}

		return $settings;
	}

	public function enqueue_scripts() {
		wp_enqueue_script( 'uf-tab' );
	}

	/**
	 * Imports the field.
	 *
	 * @since 3.0
	 *
	 * @param mixed[] $data The data for the field.
	 */
	public function import( $data ) {
		parent::import( $data );

		$this->proxy_data_to_setters( $data, array(
			'tab_icon' => 'set_icon'
		));
	}

	/**
	 * Generates the data for file exports.
	 *
	 * @since 3.0
	 *
	 * @return mixed[]
	 */
	public function export() {
		$settings = parent::export();

		$this->export_properties( $settings, array(
			'icon' => array( 'tab_icon', '' )
		));

		return $settings;
	}
}
