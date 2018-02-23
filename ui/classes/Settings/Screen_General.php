<?php
namespace Ultimate_Fields\UI\Settings;

use Ultimate_Fields\Container;
use Ultimate_Fields\Field;
use Ultimate_Fields\Options_Page;

/**
 * Handles the general settings of the plugin.
 *
 * @since 3.0
 */
class Screen_General extends Screen {
	/**
	 * Returns the ID of the screen.
	 *
	 * @since 3.0
	 * @return string
	 */
	public function get_id() {
		return 'general';
	}

	/**
	 * Returns the title of the screen.
	 *
	 * @since 3.0
	 * @return string
	 */
	public function get_title() {
		return __( 'Settings', 'ultimate-fields' );
	}

	/**
	 * Loads the screen when needed.
	 *
	 * For this screen, the method will create an options page and add a container to it.
	 *
	 * @since 3.0
	 */
	public function load() {
		# Create an options page
		$this->page = Options_Page::create( 'settings', __( 'Settings', 'ultimate-fields' ) );
		$this->page->set_screen_id( get_current_screen()->id );

		# Remove the page from the menu
		remove_action( 'admin_menu', array( $this->page, 'add_to_menu' ) );

		# Remove the screen options
		add_filter( 'screen_options_show_screen', '__return_false' );

		# Create a container for the setting
		Container::create( __( 'Settings', 'ultimate-fields' ) )
			->add_location( 'options', $this->page )
			// ->set_description_position( 'label' )
			->add_fields( $this->get_settings_fields() );

		$this->page->load();
	}

	/**
	 * Displays the screen.
	 *
	 * @since 3.0
	 */
	public function display() {
		$this->page->display();
	}

	/**
	 * Returns the field settings for the container.
	 *
	 * @since 3.0
	 *
	 * @return Ultimate_Fields\Field
	 */
	public function get_settings_fields() {
		static $fields;

		if( ! is_null( $fields ) ) {
			return $fields;
		}

		$fields = array(
			Field::create( 'section', 'general_settings', __( 'Ultimate Fields Pro', 'ultimate-fields' ) )
				->set_icon( 'dashicons dashicons-admin-generic' ),
			Field::create( 'text', 'uf_pro_key', __( 'License key', 'ultimate-fields' ) )
				->set_description( __( 'Enter your license key here to enable automatic updates. If you don\'t have one yet, click the "Get Ultimate Fields Pro" link above to learn more about Ultimate Fields Pro.', 'ultimate-fields' ) ),
			Field::create( 'section', 'api_keys', __( 'Field Settings', 'ultimate-fields' ) )
				->set_description( __( 'Those keys will be used through Map and Font fields throughout the site. If no value is entered, the fields field will not be available. You can generate an API key at the <a href="https://console.developers.google.com/project" target="_blank">Google APIs Console</a>.', 'ultimate-fields' ) )
				->set_icon( 'dashicons dashicons-list-view' ),
			Field::create( 'text', 'uf_google_maps_api_key', __( 'Google Maps API Key', 'ultimate-fields' ) ),
				// ->set_description( __( 'This key would be used for all Map fields throughout the site. If no value is entered, the Map field will not be available. You can generate an API key at the <a href="https://console.developers.google.com/project" target="_blank">Google APIs Console</a>.', 'ultimate-fields' ) ),
			Field::create( 'text', 'uf_google_fonts_api_key', __( 'Google Fonts API Key', 'ultimate-fields' ) ),
				// ->set_description( __( 'This key would be used for all Font fields throughout the site. If no value is entered, the Google Fonts tab will not be available for the field. You can generate an API key at the <a href="https://console.developers.google.com/project" target="_blank">Google APIs Console</a>.', 'ultimate-fields' ) )
		);

		return $fields;
	}
}
