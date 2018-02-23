<?php
namespace Ultimate_Fields\Helper;

/**
 * @todo: Comment the whole class.
 */
class Missing_Features {
	protected $features = array();

	public static function instance() {
		static $instance;

		if( is_null( $instance ) ) {
			$instance = new self;
		}

		return $instance;
	}

	private function __construct() {
		add_action( 'admin_notices', array( $this, 'display_notices') );
	}

	public function report( $class_name, $context ) {
		$this->features[ $class_name ] = compact( 'class_name', 'context' );
	}

	public function display_notices() {
		$generic = array();
		$pro     = array();

		foreach( $this->features as $class_name => $feature ) {
			if( $this->is_pro_feature( $class_name ) ) {
				$pro[] = $feature;
			} else {
				$generic[] = $feature;
			}
		}

		echo '<div class="notice error">';

		// Display a heading
		$heading = __( 'Ultimate Fields: Missing Features', 'ultimate-fields' );
		echo '<p><strong>' . esc_html( $heading ) . '</strong></p>';

		if( ! empty( $pro ) ) {
			echo wpautop( __( 'Those features are only available in Ultimate Fields Pro. Please install and activate the plugin in order to enable them.', 'showcase' ) );
			$this->list( $pro );
		}

		if( ! empty( $generic ) ) {
			echo wpautop( __( 'The following features are not a part of Ultimate Fields or Ultimate Fields Pro, meaning that an extension is required in order to enable them:', 'showcase' ) );
			$this->list( $generic );
		}

		echo '</div>';
	}

	public function is_pro_feature( $class_name ) {
		static $features;

		if( is_null( $features ) ) {
			$features = array(
				'Ultimate_Fields\\Field\\Color',
				'Ultimate_Fields\\Field\\Audio',
				'Ultimate_Fields\\Field\\Video',
				'Ultimate_Fields\\Field\\Gallery',
				'Ultimate_Fields\\Field\\Date',
				'Ultimate_Fields\\Field\\Time',
				'Ultimate_Fields\\Field\\DateTime',
				'Ultimate_Fields\\Field\\Font',
				'Ultimate_Fields\\Field\\Icon',
				'Ultimate_Fields\\Field\\Map',
				'Ultimate_Fields\\Field\\Embed',
				'Ultimate_Fields\\Field\\Sidebar',
				'Ultimate_Fields\\Field\\Layout',

				'Ultimate_Fields\\Location\\Comment',
				'Ultimate_Fields\\Location\\User',
				'Ultimate_Fields\\Location\\Attachment',
				'Ultimate_Fields\\Location\\Menu_Item',
				'Ultimate_Fields\\Location\\Shortcode',
				'Ultimate_Fields\\Location\\Widget',
				'Ultimate_Fields\\Location\\Taxonomy',
				'Ultimate_Fields\\Location\\Customizer',
			);
		}

		return in_array( $class_name, $features );
	}

	protected function list( $features ) {
		$items = array();

		foreach( $features as $feature ) {
			switch( $feature['context'] ) {
				case 'field':
					$context = __( 'Field', 'ultimate-fields' );
					break;

				case 'location':
					$context = __( 'Location', 'ultimate-fields' );
					break;

				default:
					$context = __( 'Generic feature', 'ultimate-fields' );
			}

			$class_name = $feature['class_name'];
			$class_name = str_replace( 'Ultimate_Fields\\', '', $class_name );
			$class_name = str_replace( '\\', ' / ', $class_name );

			$items[] = '<li>- ' . $class_name . ' (' . $context . ')</li>';
		}

		echo '<ul>' . implode( $items, "\n" ) . '</ul>';
	}
}
