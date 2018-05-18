<?php
namespace Ultimate_Fields;

use Ultimate_Fields\Container;
use Ultimate_Fields\Helper\JS_L10N;

/**
 * Handles the top-level functionality of Ultimate Fields.
 *
 * @since 3.0
 */
class Core {
	/**
	 * Holds the path to the main plugin file.
	 *
	 * @since 3.0
	 * @var string
	 */
	protected $plugin_file;

	/**
	 * Holds an instance of the JSON manager if synchronization isn't disabled.
	 *
	 * @since 3.0
	 * @var bool|Ultimate_Fields\JSON_Manager
	 */
	protected $json_manager = false;

	/**
	 * Returns an instance of the class.
	 *
	 * @since 3.0
	 *
	 * @return Core
	 */
	public static function instance( $file = '', $autoload = false ) {
		static $instance;

		if( is_null( $instance ) ) {
			$instance = new self( $file, $autoload );
		}

		return $instance;
	}

	/**
	 * Initialzies the class.
	 *
	 * @since 3.0
	 *
	 * @param string $directory The directory of the core.
	 * @param bool   $autoload  Indicates whether to use the build-in autoloader.
	 */
	protected function __construct( $file, $autoload = false ) {
		if( ! $file ) {
			$file = __DIR__;
		}

		define( 'ULTIMATE_FIELDS_DIR', trailingslashit( dirname( $file ) ) );
		define( 'ULTIMATE_FIELDS_URL', $this->get_url( $file ) );
		define( 'ULTIMATE_FIELDS_VERSION', '3.0.2' );

		require_once dirname( $file ) . '/api.php';
		require_once dirname( $file ) . '/compat.php';

		if( $autoload ) {
			require_once( __DIR__ . '/Autoloader.php' );
			new Autoloader( 'Ultimate_Fields', ULTIMATE_FIELDS_DIR . DIRECTORY_SEPARATOR . 'classes' );
		}

		add_action( 'admin_enqueue_scripts', array( $this, 'register_scripts' ), 9 );
		add_action( 'wp_enqueue_scripts', array( $this, 'register_scripts' ), 9 );
		add_action( 'login_enqueue_scripts', array( $this, 'register_scripts' ), 9 );
		add_action( 'admin_enqueue_scripts', array( $this, 'initialize_scripts' ), 12 );
		add_action( 'wp_enqueue_editor', array( $this, 'initialize_scripts' ), 12 );
		add_action( 'wp_enqueue_scripts', array( $this, 'initialize_scripts' ), 12 );
		add_action( 'login_enqueue_scripts', array( $this, 'initialize_scripts' ), 12 );
		add_action( 'after_setup_theme', array( $this, 'initialize' ), 999 );
		add_filter( 'uf.field.class', array( $this, 'generate_field_class' ), 10, 2 );

		// Add some generic filters/actions
		add_filter( 'uf.api.the_value', 'wp_kses_post', 5 );

		// Load translations
		if( defined( 'ULTIMATE_FIELDS_PLUGIN_FILE' ) ) {
			load_plugin_textdomain( 'ultimate-fields', FALSE, ULTIMATE_FIELDS_LANGUAGES_DIR );
		}
	}

	/**
	 * Initializes existing fields, allows the plugin to be extended and etc.
	 *
	 * @since 3.0
	 */
	public function initialize() {
		/**
		 * Allows extensions to register their functionality.
		 *
		 * @since 3.0
		 *
		 * @param Ultimate_Fields\Core The core of the plugin, for quick access.
		 */
		do_action( 'uf.extend', $this );

		/**
		 * Lets the UI register it's functionality, if available.
		 *
		 * @since 3.0
		 */
		do_action( 'uf.register_ui' );

		/**
		 * Registers containers, which are saved as JSON, if any.
		 */
		$this->load_from_json();

		/**
		 * Allows plugins, themes and etc. to register their own fields.
		 *
		 * Use this hook to register your fields. This way you'd have a fail-save
		 * for the admin, in case Ultimate Fields gets deactivated.
		 *
		 * Please note that you need to attach your code to this hook no later than
		 * `after_setup_theme` with normal priority. If you do that, your fields
		 * will not get registered.
		 *
		 * @since 3.0
		 */
		do_action( 'uf.init' );
	}

	/**
	 * Transforms a string into an appropriate class name within UF.
	 *
	 * @since 3.0
	 *
	 * @param string $class_name A loosely-formatted class name within the Ultimate_Fields namespace.
	 * @return string A properly formatted class name.
	 */
	public function generate_class_name( $class_name ) {
		static $generated;

		# Check the cache
		if( isset( $generated[ $class_name ] ) ) {
			return $generated[ $class_name ];
		}

		$namespaces = array();

		foreach( preg_split( '~[\\/]~', $class_name ) as $namespace ) {
			$namespace = preg_split( '~[_-]~', $namespace );
			$namespace = array_map( 'ucfirst', $namespace );
			$namespace = implode( '_', $namespace );
			$namespaces[] = $namespace;
		}

		$full_name = 'Ultimate_Fields\\' . implode( '\\', $namespaces );

		/**
		 * Allows a class name to be modified before being used.
		 *
		 * @since 3.0
		 *
		 * @param string $class_name The name of the class.
		 * @return string
		 */
		$full_name = apply_filters( 'uf.class_name', $full_name );

		$generated[ $class_name ] = $full_name;

		return $full_name;
	}

	/**
	 * Generates the class name for special fields fields.
	 *
	 * @since 3.0
	 *
	 * @param mixed  $class_name A null, which will be overwritten if the class exists.
	 * @param string $type       The requested field type.
	 * @return mixed
	 */
	public function generate_field_class( $class_name, $type ) {
		static $fields;

		if( is_null( $fields ) ) {
			$fields = array(
				'wysiwyg'    => 'Ultimate_Fields\\Field\\WYSIWYG',
				'wp_object'  => 'Ultimate_Fields\\Field\\WP_Object',
				'wp_objects' => 'Ultimate_Fields\\Field\\WP_Objects'
			);
		}

		if( is_null( $class_name ) && isset( $fields[ $type ] ) ) {
			return $fields[ $type ];
		} else {
			return $class_name;
		}
	}

	/**
	 * Returns a "plugin" URL based on a path.
	 *
	 * @since 3.0
	 *
	 * @param  string $path The path to use.
	 * @return string The generated URL.
	 */
	public function get_url( $path ) {
		// Check for in-theme mode
		$normalized_path = str_replace( '\\', '/', $path );
		$normalized_root = str_replace( '\\', '/', get_theme_root() );

		if( 0 === strpos( $normalized_path, $normalized_root ) ) {
			$sub = str_replace( $normalized_root, '', $normalized_path );
			$url = get_theme_root_uri() . dirname( $sub ) . '/';
			$url = str_replace( DIRECTORY_SEPARATOR, '/', $url );

			return $url;
		}

		// Plugin mode
		$url = plugins_url( '/', $path );
		return $url;
	}

	/**
	 * Returns the basename of a class.
	 *
	 * @since 3.0
	 *
	 * @param mixed $item The item whose base class is needed.
	 * @return string
	 */
	public function basename( $item ) {
		if( is_object( $item ) ) {
			$item = get_class( $item );
		}

		$item = str_replace( '\\', '/', $item );

		return basename( $item );
	}

	/**
	 * Generates a title from a class name or a sanitized string.
	 *
	 * @since 3.0
	 *
	 * @param string $id The ID to transform into a title.
	 * @param string $overload A string that short-circuits the function.
	 * @return string A capitalized title.
	 */
	public function generate_title( $id, $overload = null ) {
		if( ! is_null( $overload ) ) {
			return $overload;
		}

		$label = preg_replace( '~[-_]~', ' ', $id );
		$label = ucwords( $label );

		return $label;
	}

	/**
	 * Registers all core scripts, making them available for enqueueing later.
	 *
	 * @since 3.0
	 */
	public function register_scripts() {
		// Prepare some shortcuts
		$js = ULTIMATE_FIELDS_URL . 'js/';
		$v  = ULTIMATE_FIELDS_VERSION;

		// Register vendor scripts and styles
		wp_register_script( 'uf-select2', ULTIMATE_FIELDS_URL . 'assets/js/select2/select2.min.js', array( 'jquery' ), $v );
		wp_register_style( 'uf-select2-css', ULTIMATE_FIELDS_URL . 'assets/css/select2/select2.min.css', array(), ULTIMATE_FIELDS_VERSION );

		// Register regular scripts
		wp_register_script( 'uf-core',                $js . 'uf.js',                  array( 'jquery', 'underscore', 'backbone' ), $v );
		wp_register_script( 'uf-datastore',           $js . 'datastore.js',           array( 'uf-core' ), $v );
		wp_register_script( 'uf-dependencies',        $js . 'dependencies.js',        array( 'uf-core' ), $v );
		wp_register_script( 'uf-overlay',             $js . 'overlay.js',             array( 'uf-core' ), $v );
		wp_register_script( 'uf-container-layout',    $js . 'container-layout.js',    array( 'uf-core' ), $v );
		wp_register_script( 'uf-container',           $js . 'container/base.js',      array( 'uf-core', 'uf-datastore', 'uf-container-layout' ), $v );
		wp_register_script( 'uf-container-group',     $js . 'container/group.js',     array( 'uf-container', 'uf-overlay' ), $v );
		wp_register_script( 'uf-container-post-type', $js . 'container/post-type.js', array( 'uf-container' ), $v );
		wp_register_script( 'uf-container-options',   $js . 'container/options.js',   array( 'uf-container' ), $v );
		wp_register_script( 'uf-field',               $js . 'field/base.js',          array( 'uf-core', 'uf-dependencies', 'jquery-ui-sortable' ), $v );
		wp_register_script( 'uf-field-message',       $js . 'field/message.js',       array( 'uf-field' ), $v );
		wp_register_script( 'uf-field-text',          $js . 'field/text.js',          array( 'uf-field' ), $v );
		wp_register_script( 'uf-field-password',      $js . 'field/password.js',      array( 'uf-field' ), $v );
		wp_register_script( 'uf-field-textarea',      $js . 'field/textarea.js',      array( 'uf-field' ), $v );
		wp_register_script( 'uf-field-checkbox',      $js . 'field/checkbox.js',      array( 'uf-field' ), $v );
		wp_register_script( 'uf-field-select',        $js . 'field/select.js',        array( 'uf-field' ), $v );
		wp_register_script( 'uf-field-multiselect',   $js . 'field/multiselect.js',   array( 'uf-field', 'uf-field-select' ), $v );
		wp_register_script( 'uf-field-image-select',  $js . 'field/image-select.js',  array( 'uf-field' ), $v );
		wp_register_script( 'uf-field-wysiwyg',       $js . 'field/wysiwyg.js',       array( 'uf-field', 'uf-field-textarea' ), $v );
		wp_register_script( 'uf-field-file',          $js . 'field/file.js',          array( 'uf-field', 'media-models', 'uf-overlay' ), $v );
		wp_register_script( 'uf-field-image',         $js . 'field/image.js',         array( 'uf-field', 'uf-field-file' ), $v );
		wp_register_script( 'uf-field-file-uploader', $js . 'field/file-uploader.js', array( 'uf-field', 'uf-field-file', 'wp-plupload', 'plupload' ), $v );
		wp_register_script( 'uf-field-wp-object',     $js . 'field/wp-object.js',     array( 'uf-field', 'uf-select2' ), $v );
		wp_register_script( 'uf-field-wp-objects',    $js . 'field/wp-objects.js',    array( 'uf-field', 'uf-field-wp-object' ), $v );
		wp_register_script( 'uf-field-link',          $js . 'field/link.js',          array( 'uf-field', 'uf-field-wp-object' ), $v );
		wp_register_script( 'uf-field-number',        $js . 'field/number.js',        array( 'uf-field', 'jquery-ui-slider' ), $v );
		wp_register_script( 'uf-field-repeater',      $js . 'field/repeater.js',      array( 'uf-field', 'uf-container-group', 'jquery-ui-sortable', 'jquery-ui-draggable', 'uf-overlay' ), $v );
		wp_register_script( 'uf-field-complex',       $js . 'field/complex.js',       array( 'uf-field', 'uf-container-group' ), $v );
		wp_register_script( 'uf-tab',                 $js . 'tab.js',                 array( 'uf-field' ), $v );
		wp_register_script( 'uf-initialize',          $js . 'initialize.js',          array( 'uf-core', 'uf-container', 'uf-field' ), $v );

		// The admin-menu dependency is needed in the backend, in order to enqueue new styles after those of WordPress.
		wp_register_style( 'ultimate-fields-css', ULTIMATE_FIELDS_URL . 'assets/css/ultimate-fields.css', array( 'admin-menu' ), ULTIMATE_FIELDS_VERSION );

		/**
		 * Allow more scripts and styles to be added.
		 *
		 * @since 3.0
		 */
		do_action( 'uf.register_scripts' );

		/**
		 * Once all UF scripts have been registered, allows them to be also enqueued.
		 *
		 * @since 3.0
		 */
		do_action( 'uf.enqueue_scripts' );
	}

	/**
	 * Checks if any UF scripts are already included and enqueues the initialzier.
	 *
	 * @since 3.0
	 */
	public function initialize_scripts() {
		if( wp_script_is( 'uf-core' ) ) {
			wp_enqueue_script( 'uf-initialize' );
			wp_enqueue_style( 'ultimate-fields-css' );
		}

		/**
		 * After the initializing scripts have been included, allow extensions to do the same.
		 *
		 * @since 3.0
		 */
		do_action( 'uf.initialized_scripts' );
	}

	/**
	 * Returns a simple array with all available
	 * image sizes, containing the key of the size ant it's name.
	 *
	 * @since 3.0
	 *
	 * @return string[]
	 */
	public function get_image_sizes() {
		# Fetch image sizes
		$image_sizes = get_intermediate_image_sizes();
		$image_sizes = array_combine( $image_sizes, $image_sizes );

		# Add prettier labels to some sizes
		if( isset( $image_sizes[ 'full' ] ) )
			$image_sizes[ 'full' ] = __( 'Full', 'ultimate-fields' );
		if( isset( $image_sizes[ 'thumbnail' ] ) )
			$image_sizes[ 'thumbnail' ] = __( 'Thumbnail', 'ultimate-fields' );
		if( isset( $image_sizes[ 'medium' ] ) )
			$image_sizes[ 'medium' ] = __( 'Medium', 'ultimate-fields' );
		if( isset( $image_sizes[ 'large' ] ) )
			$image_sizes[ 'large' ] = __( 'Large', 'ultimate-fields' );

		return $image_sizes;
	}

	/**
	 * Retrieves the available post types for selects and etc.
	 *
	 * @since 3.0
	 *
	 * @return mixed[]
	 */
	public function get_available_post_types() {
		static $cached;

		if( $cached ) {
			return $cached;
		}

		$post_types = array();

		/**
		 * Allows certain post types to be excluded from the list for selects, post meta pages and more.
		 *
		 * @since 3.0
		 *
		 * @param string[] $post_types The post types that should be excluded.
		 * @return mixed[]
		 */
		$excluded = apply_filters( 'uf.excluded_post_types', array( 'attachment', 'ultimate-fields' ) );

		foreach( get_post_types( array( 'show_ui' => true ), 'objects' ) as $id => $post_type ) {
			if( in_array( $id, $excluded ) ) {
				continue;
			}

			$post_types[ $id ] = $post_type->labels->name;
		}

		# Cache the result
		if( did_action( 'init' ) ) {
			$cached = $post_types;
		}

		return $post_types;
	}

	/**
	 * Retrieves the available taxonomies for selects and etc.
	 *
	 * @since 3.0
	 *
	 * @return mixed[]
	 */
	public function get_available_taxonomies( $hierarchical_only = true ) {
		$taxonomy_slugs = array_values( get_taxonomies() );
		$taxonomies     = array();
		$t_options      = array();

		/**
		 * Allows certain taxonomies to be excluded from the list for selects, post meta pages and more.
		 *
		 * @since 3.0
		 *
		 * @param string[] $taxonimies The taxonimies that should be excluded.
		 * @return mixed[]
		 */
		$excluded = apply_filters( 'uf.ui.excluded_taxonimies', array( 'link_category' ) );

		foreach( $taxonomy_slugs as $taxonomy_slug ) {
			if( in_array( $taxonomy_slug, $excluded ) ) {
				continue;
			}

			$taxonomy = get_taxonomy( $taxonomy_slug );

			// Non-hierarchical taxonomies are not supported.
			if( ( ! $taxonomy->hierarchical && $hierarchical_only ) || ! $taxonomy->show_ui ) {
				continue;
			}

			$t_options[ $taxonomy_slug ]  = $taxonomy->labels->name;
			$taxonomies[ $taxonomy_slug ] = $taxonomy;

		}

		return $t_options;
	}

	/**
	 * Loads the existing containers from JSON files and sets them up.
	 *
	 * @since 3.0
	 */
	public function load_from_json() {
		if( defined( 'ULTIMATE_FIELDS_DISABLE_JSON' ) && ULTIMATE_FIELDS_DISABLE_JSON ) {
			return;
		}

		$manager = $this->json_manager = JSON_Manager::instance();

		foreach( $manager->get_containers() as $data ) {
			Container::create_from_array( $data );
		}

		return true;
	}


	/**
	 * Lets extensions know if the plugin has been loaded though JSON.
	 *
	 * @since 3.0
	 *
	 * @return bool
	 */
	public function is_json_enabled() {
		return $this->json_manager && $this->json_manager->is_enabled();
	}

	/**
	 * Returns the JSON manager.
	 *
	 * @since 3.0
	 *
	 * @return Ultimate_Fields\JSON_Manager
	 */
	public function get_json_manager() {
		return $this->json_manager;
	}

	/**
	 * Checks if an AJAX call is being performed and returns the current action.
	 *
	 * @since 3.0
	 *
	 * @param mixed $item The item that is currently being loaded.
	 */
	public function is_ajax( $item ) {
		if(
			'POST' != $_SERVER[ 'REQUEST_METHOD' ]
			||
			! (
				isset( $_REQUEST[ 'uf_force_ajax' ] )
				||
				(
					! empty( $_SERVER[ 'HTTP_X_REQUESTED_WITH' ] )
					&& 'xmlhttprequest' == strtolower( $_SERVER[ 'HTTP_X_REQUESTED_WITH' ] )
				)
			)
		) {
			return false;
		}

		# Check for an action
		if( ! isset( $_REQUEST[ 'uf_action' ] ) ) {
			return false;
		}

		$action = strtolower( trim( $_REQUEST[ 'uf_action' ] ) );

		/**
		 * Allows external methods to perform AJAX before checking containers fields.
		 *
		 * @since 3.0
		 *
		 * @param mixed $item The item that is currently being displayed.
		 */
		do_action( 'uf.ajax.' . $action, $item );

		/**
		 * Allows external methods to perform AJAX before checking fields within containers.
		 *
		 * @since 3.0
		 *
		 * @param string $action The action that is being performed.
		 * @param mixed  $item   The item that is currently being displayed.
		 */
		do_action( 'uf.ajax', $action, $item );

		return $action;
	}

	/**
	 * Allows AJAX calls to be performed based on a particular object(location).
	 *
	 * @since 3.0
	 *
	 * @param mixed $item The item that is currently being loaded.
	 */
	public function ajax( $item = null ) {
		if( ! $action = $this->is_ajax( $item ) ) {
			return;
		}

		# If an AJAX has noot been performed yet, check containers
		foreach( Container::get_registered() as $container ) {
			$container->perform_ajax( $item, $action );
		}
	}

	/**
	 * Returns an the localization object of Ultimate Fields.
	 *
	 * @since 3.0
	 *
	 * @return JS_L10N
	 */
	public function l10n() {
		return JS_L10N::instance();
	}

	/**
	 * Directly localizes a string for JavaScript.
	 *
	 * @since 3.0
	 *
	 * @param string $key The key of the string, used in JS.
	 * @param string $string The translation.
	 * @return Core The instance of the class.
	 */
	public function localize( $key, $string ) {
		$this->l10n()->translate( $key, $string );

		return $this;
	}
}
