(function( $ ){

	/**
	 * This file handles
	 */
	var container = UltimateFields.Container  = {},
		base      = container.Base = {};

	base.Model = Backbone.Model.extend({
		defaults: {
			description:        '',
			layout:             'auto',
			description:        '',
			visible:            true,
			validation_enabled: false
		},

		initialize: function( args ) {
			args = args || {};

			this.set( 'tabs', {} );

			this.set( 'fields', new UltimateFields.Field.Collection( args.fields || this.get( 'fields' ) || [] ) );
		},

		/**
		 * Sets a new datastore to the container and fields inside.
		 */
		setDatastore: function( datastore ) {
			var that = this,
				tabs = new UltimateFields.Field.Collection,
				tab;

			this.datastore = datastore;

			// Set the first tab if any
			this.get( 'fields' ).each(function( field ) {
				if( ! ( field instanceof UltimateFields.Field.Tab.Model ) )
					return;

				if( window.location.hash.replace( '#', '' ) == field.get( 'name' ) ) {
					that.datastore.set( '__tab', field.get( 'name' ) );
				}
			});

			if( ! datastore.get( '__tab' ) && ( tab = this.get( 'fields' ).findWhere({ type: 'Tab' }) ) ) {
				datastore.set( '__tab', tab.get( 'name' ) );
			}

			// Send the datastore to the fields
			this.get( 'fields' ).each(function( field ) {
				field.setDatastore( datastore );

				if( 'Tab'== field.get( 'type' ) ) {
					that.get( 'tabs' )[ field.get( 'name' ) ] = field.get( 'visible' );

					// Save the field within the tabs
					tabs.add( field );
				}
			});

			// When a tab gets invalidated, we should switch away from it (if possible)
			tabs.on( 'change:visible', function( tab ) {
				var currentTab = datastore.get( '__tab' );

				if( tab.get( 'name' ) == currentTab ) {
					// ToDo: Don't simply switch to the first tab, but the first avaiable
					datastore.set( '__tab', tabs.at( 0 ).get( 'name' ) );
				}
			});

			// Wheneve the datastore changes, validate
			datastore.on( 'change', function() {
				if( that.get( 'validation_enabled' ) ) {
					that.validate();
				}
			});
		},

		/**
		 * Forces default datastore values to be used (mainly within repeaters).
		 */
		forceDefaultValues: function() {
			this.get( 'fields' ).each( function( field ){
				field.useDefaultValueIfNeeded( true );
			});
		},

		/**
		 * Prevents automatic syncronisations of containers with the backend.
		 */
		sync: function() {
			return false; // No automatic syncing
		},

		/**
		 * Goes through each field and collects validation errors.
		 *
		 * Returns an array with string errors if found, underfined otherwise.
		 */
		validate: function() {
			var errors      = [],
				tabs        = this.get( 'tabs' ),
				invalidTabs = [];

			// Indivate that variation should be performed on every change
			this.set( 'validation_enabled', true );

			if( ! this.get( 'visible' ) ) {
				return errors;
			}

			this.get( 'fields' ).each( function( field ) {
				var state;

				// If the fields' tab is invisible, the field is invisible too
				if( field.get( 'tab' ) && ! tabs[ field.get( 'tab' ) ] ) {
					return;
				}

				state = field.validate();

				if( 'undefined' != typeof state ) {
					var tab;

					errors.push( state );

					if( ( tab = field.get( 'tab' ) ) && ! ( tab in invalidTabs ) ) {
						invalidTabs[ tab ] = 1;
					}
				}
			});

			// Save the errors if any
			this.set( 'validationErrors', errors );

			// Save the tabs as (in)valid
			_.each( this.get( 'fields' ).where({ type: 'Tab' }), function( tab ) {
				tab.set( 'invalidTab', tab.get( 'name' ) in invalidTabs );
			});

			if( errors.length ) {
				return errors;
			} else {
				// Restore the silent state
				this.set( 'validation_enabled', false );
			}
		},

		/**
		 * Resets the container.
		 */
		reset: function() {
			this.setDatastore( new UltimateFields.Datastore( this.get( 'originalData' ) ) );
		},

		/**
		 * Retrieve a value from within the container.
		 */
		getValue: function( key ) {
			return this.datastore.get( key );
		}
	});

	/**
	 * This is the basic view for containers.
	 *
	 * Each location should extend this view and add its own methods and handlers.
	 */
	base.View = Backbone.View.extend({
		/**
		 * Does the basic rendering of a container.
		 */
		render: function() {
			var that    = this,
				$fields = $( '<div class="uf-fields" />' );

			this.$el.append( $fields );

 			// Add normal fields and initialize the hidden field
 			this.addFields( $fields );
		},

		/**
		 * Starts the process of saving all data into a hidden input field.
		 */
		initializeHiddenField: function( $input ) {
			var that = this;

			// Save a handle to the input
			this.$input = this.$el.find( '.uf-container-data' );

			// Do an initial population
			this.populateInput();

			// When the datastore changes, save values too
 			this.model.datastore.on( 'all', function() {
 				that.populateInput();
 			});
		},

		/**
		 * Populates the hidden input with th econtainers' data.
		 */
 		populateInput: function() {
 			this.$input.val( JSON.stringify( this.model.datastore ) );
 		},

		/**
		 * Adds fields to container while formatting their div properly.
		 */
		addFields: function( $container, options ) {
			var that = this, tabsAdded = false, $tabs, grid, layout;

			if( ! $container ) {
				$container = this.$el.find( '.uf-fields' );
			} else if( 'string' == typeof $container ) {
				$container = this.$el.find( $container );
			}

			// Save a handle to the div
			this.$fields = $container;
			this.fieldViews = [];

			options = _.extend( {
				wrap: UltimateFields.Field[ 'grid' == this.model.get( 'layout' ) ? 'GridWrap' : 'Wrap' ],
				tabs: true
			}, options || {});

			// Add some classes
			layout = this.model.get( 'layout' );
			if( 'auto' == layout ) layout = 'rows';
			$container
				.addClass( 'uf-fields-layout-' + ( 'rows' == layout ? 'rows' : 'grid' ) );

			// Add each individual field
			this.model.get( 'fields' ).each(function( model ) {
				var wrap = options.wrap;

				if( model instanceof UltimateFields.Field.Tab.Model ) {
					if( tabsAdded || ! options.tabs ) {
						return;
					}

					that.$tabs = $tabs = $( '<div class="uf-tab-wrapper" />' )
						.append( that.getTabs() )
						.appendTo( $container );

					tabsAdded = true;

					return;
				}

				if( model instanceof UltimateFields.Field.Section.Model ) {
					wrap = UltimateFields.Field.Section.Wrap;
				}

				// Set the appropriate description position
				model.set( 'description_position', that.model.get( 'description_position' ) );

				var view = new wrap({
					model: model
				});

				view.$el.appendTo( $container );
				view.render();
				that.fieldViews.push( view );
			});

			// Let borders work
			if( 'grid' == this.model.get( 'layout' ) ) {
				grid = UltimateFields.grid( $container );

				// Fix the grid when there is conditional logic or the tab changes
				this.model.get( 'fields' ).on( 'change:visible', grid );
				this.model.datastore.on( 'change:__tab', grid );
			}
		},

		/**
		 * Generates the views for the tabs, but not their wrapper.
		 */
		getTabs: function() {
			var that  = this,
				tabs  = [],
				views = [];

			this.model.get( 'fields' ).each(function( field ){
				var tab;

				if( ! ( field instanceof UltimateFields.Field.Tab.Model ) )
					return;

				tab = new UltimateFields.Tab({
					model: field
				});

				that.model.get( 'tabs' )[ field.get( 'name' ) ] = field.get( 'visible' );
				field.on( 'change:visible', function() {
					that.model.get( 'tabs' )[ field.get( 'name' ) ] = field.get( 'visible' );
				});

				tabs.push( tab.$el );
				views.push( tab );

				if( ! that.tabHasVisibleFields( field ) ) {
					tab.$el.hide();
				}
			});

			// Check tabs when valus change
			this.model.datastore.on( 'change', function() {
				_.each( views, function( tab ) {
					var has = that.tabHasVisibleFields( tab.model );

					tab.$el[ has ? 'removeClass' : 'addClass' ]( 'uf-tab-hidden' );
				});
			});

			return tabs;
		},

		/**
		 * Checks if any of the fields, which belong in a tab are visible.
		 */
		tabHasVisibleFields: function( tab ) {
			var that = this,
				has  = false;

			_.each( this.model.get( 'fields' ).where({ tab: tab.get( 'name' ) }), function( field ) {
				if( field.get( 'visible' ) ) {
					has = true;
				}
			});

			return has;
		},

		/**
		 * Initializes all locations when needed.
		 */
		initializeLocations: function( locationClass ) {
			var that        = this,
			 	initialized = false,
				go;

			go = function() {
				if( ! initialized ) {
					that._initializeLocations( locationClass );
					initialized = true;
				}
			}

			this.on( 'addedToDOM', go );
			$( document ).on( 'uf-initialize-loaded', go );
			$( document ).on( 'uf-init', go );
		},

		/**
		 * Initializes the location when the right trigger has happened.
		 */
		_initializeLocations: function( locationClass ) {
			var that = this, locations = new UltimateFields.Locations;

			// Convert to the right class
		   _.each( this.model.get( 'locations' ), function( location ) {
			   locations.add( new locationClass( location ) );
		   });

		   // Save a handle
		   this.model.set( 'locations', locations );

		   // Listen for changes
		   locations.on( 'change:visible', function() {
			   that[ locations.isVisible() ? 'show' : 'hide' ]();
			   that.model.set( 'visible', locations.isVisible() );
		   });

		   that[ locations.isVisible() ? 'show' : 'hide' ]();
		   this.model.set( 'visible', locations.isVisible() );
		},

		/**
		 * Shows the container based on location rules.
		 */
 		show: function() {
 			this.$el.show();
 		},

 		/**
 		 * Hides the container based on location rules.
 		 */
 		hide: function() {
 			this.$el.hide();
 		},

		/**
		 * Makes the container seamless by removing WordPress elements.
		 *
		 * Applies to options, post types, users, comments and more.
		 */
		seamless: function() {
			var that = this, $box;

			if( 'seamless' != this.model.get( 'style' ) ) {
				return;
			}

			$box = this.$el.closest( '.postbox' );

			// Start by removing the box
			$box.removeClass( 'postbox' ).addClass( 'uf-container-seamless' );

			// Remove un-neccessary elements
			$box.children( '.handlediv' ).remove();

			// ToDo: Do this conditionally
			$box.children( '.hndle' ).remove();

			this.$el.find( '.uf-fields' ).eq( 0 ).addClass( 'uf-fields-seamless' ).removeClass( 'uf-boxed-fields' );
		},

		/**
		 * Focuses the first field in the container.
		 */
		focusFirstField: function() {
			var focused = false;

			_.each( this.fieldViews, function( view ) {
				if( focused ) {
					return;
				}

				if( 'function' != typeof view.input.focus ) {
					return;
				}

				view.input.focus();
				focused = true;
			})
		}
	});

	/**
	 * This model should be used in forms, where multiple containers
	 * should be validated and handled simultaneously on the forms' submit.
	 */
	container.Controller = UltimateFields.Controller.extend({
		initialize: function() {
			this.containers = [];
		},

 		/**
 		 * Handles new containers.
 		 */
 		addContainer: function( container ) {
 			this.containers.push( container );
 		},

 		/**
 		 * Attempts validating all available forms.
 		 */
 		validate: function() {
			var that     = this,
				problems = [];

			_.each( that.containers, function( view ){
				_.each( view.model.validate(), function( problem ) {
					problems.push( problem );
				})
			});

			if( problems.length ) {
				that.showErrorMessage( problems );
				return false;
			}

			return true;
 		},

 		/**
 		 * Shows a message with all errors.
 		 */
 		generateErrorMessage: function( problems ) {
 			var tmpl = UltimateFields.template( 'container-error' );

			return $( tmpl( {
				title: UltimateFields.L10N.localize( 'container-issues' ),
				problems: problems
			}));
 		}
	});

})( jQuery );
