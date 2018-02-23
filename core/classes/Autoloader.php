<?php
namespace Ultimate_Fields;

/**
 * @todo: Comment the whole class.
 */
class Autoloader {
	protected $ns;
	protected $path;
	protected static $loaders = array();

	public function __construct( $ns, $path ) {
		static $callback_added;

		$this->ns   = $ns;
		$this->path = $path;

		array_unshift( self::$loaders, $this );

		if( is_null( $callback_added ) ) {
			spl_autoload_register( array( __CLASS__, 'autoload' ) );
			$callback_added = true;
		}
	}

	/**
	 * Loads all core classes.
	 *
	 * @since 3.0
	 *
	 * @param string $class_name The name of the class that is to be loaded.
	 */
	protected function load( $class_name ) {
		if( 0 !== strpos( $class_name, $this->ns ) ) {
			return;
		}

		$file = str_replace( $this->ns . '\\', '', $class_name );
		$file = str_replace( '\\', DIRECTORY_SEPARATOR, $file );
		$path = $this->path . DIRECTORY_SEPARATOR . $file . '.php';

		if( file_exists( $path ) ) {
			require_once $path;
			return true;
		}
	}

	/**
	 * Go through the global autoloaders.
	 *
	 * @since 3.0
	 *
	 * @param string $class_name The name of the class that is to be loaded.
	 */
	public static function autoload( $class_name ) {
		foreach( self::$loaders as $loader ) {
			if( $loader->load( $class_name ) ) {
				break;
			}
		}
	}
}
