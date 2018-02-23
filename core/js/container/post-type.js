(function( $ ){

	/**
	 * This file handles the post meta container of Ultimate Fields.
	 */
	var container = UltimateFields.Container,
		postType  = container.Post_Type = {},
		controller;

	/**
	 * The post type container's model follows the same structure
	 * as the basci container model of Ultimate FIelds.
	 */
 	postType.Model = container.Base.Model.extend({
		/**
		 * Saves the initial state of the container in order to be able to check for changes later.
		 */
		saveInitialState: function() {
			this.initialState = JSON.stringify( this.datastore.export() );
		},

		/**
		 * Checks if the values within the container have changed.
		 */
		hasChanged: function() {
			return JSON.stringify( this.datastore.export() ) !== this.initialState;
		}
	});

 	/**
 	 * The view for post meta adds locations, controllers and etc.
 	 * to the default container view in UF.
 	 */
 	postType.View = UltimateFields.Container.Base.View.extend({
 		/**
 		 * Initializes the view.
 		 */
 		initialize: function() {
 			var that = this;

			this.initializeLocations( UltimateFields.Location.Post_Type );

			// Connect to the controller
			controller.addContainer( this );

			postType.integrateWithYoastSEO( this );
 		},

 		/**
 		 * Renders the visible part of the container.
 		 */
 		render: function() {
 			var that = this,
 				tmpl = UltimateFields.template( 'post-type' );

 			// Add the basic layout
 			this.$el.html( tmpl( this.model.toJSON() ) );

			// If the container is seamless, remove the metabox class
			this.seamless();

 			// Add normal fields and initialize the hidden field
 			this.addFields();
 			this.initializeHiddenField();
 		},

 		/**
 		 * Shows the meta box of the container and the responsible checkbox.
 		 */
 		show: function() {
 			this.$el.closest( '.postbox' ).show();
 			$( '#adv-settings label[for="' + this.model.get( 'id' ) + '-hide"]' ).show();
 		},

 		/**
 		 * Hides the meta box of the container and the responsible checkbox.
 		 */
 		hide: function() {
 			this.$el.closest( '.postbox' ).hide();
 			$( '#adv-settings label[for="' + this.model.get( 'id' ) + '-hide"]' ).hide();
 		}
 	});

 	/**
 	 * This handles the visibility of the group based on rules and locations.
 	 */
 	UltimateFields.Location.Post_Type = UltimateFields.Location.extend({
		defaults: {
			visible: true,
			templates: { visible: [], hidden: [] }
		},

		/**
		 * Starts listening for all needed items/rules.
		 */
		listen: function() {
			var that = this;

			this.checked = new Backbone.Model();

			if( this.get( 'templates' ) && ! this.empty( this.get( 'templates' ) ) ) {
				this.listenForTemplates();
			}

			if( this.get( 'levels' ) && ! this.empty( this.get( 'levels' ) ) ) {
				this.listenForLevels();
			}

			if( this.get( 'terms' ) ) _.each( this.get( 'terms' ), function( terms, taxonomy ) {
				that.listenForTerms( terms, taxonomy );
			});

			if( this.get( 'formats' ) && ! this.empty( this.get( 'formats' ) ) ) {
				this.listenForFormats();
			}

			if( this.get( 'stati' ) && ! this.empty( this.get( 'stati' ) ) ) {
				this.listenForStati();
			}

			if( this.get( 'parents' ) && ! this.empty( this.get( 'parents' ) ) ) {
				this.listenForParents();
			}
		},

		/**
		 * Listens for template changes, if templates are present.
		 */
		listenForTemplates: function() {
			var that      = this,
				templates = this.get( 'templates' ),
				$select   = $( 'select#page_template' ),
				check;

			// Check if there is a selector at all
			if( ! $select.length ) {
				return;
			}

			check = function() {
				that.checked.set( 'templates', that.checkSingleValue( $select.val(), templates ) );
			}

			// Listen for changes
			$select.change( _.bind( check, this ) );
			check();
		},

		/**
		 * Listens for post formats if any.
		 */
		listenForFormats: function() {
			var formats = this.get( 'formats' ),
				$radios = $( '#post-formats-select input:radio' ),
				check;

			// If there are no radios, don't listen to anything
			if( ! $radios.length ) {
				return;
			}

			check = function() {
				var format = $radios.filter( ':checked' ).val();
				this.checked.set( 'formats', this.checkSingleValue( format, formats ) );
			}

			$radios.on( 'change', _.bind( check, this ) );
			check.apply( this );
		},

		/**
		 * Listen for the current post status.
		 */
		listenForStati: function() {
			var stati   = this.get( 'stati' ),
				$select = $( '#post_status' ),
				check;

			check = function() {
				var status = $select.val();

				this.checked.set( 'stati', this.checkSingleValue( status, stati ) );
			}

			// Listen for changes
			$select.on( 'change', _.bind( check, this ) );
			check.apply( this );
		},

		/**
		 * Listens for particular post(page) parents.
		 */
		listenForParents: function() {
			var parents = this.get( 'parents' ),
				$select = $( '#parent_id' ),
				check;

			// If there is no parents dropdown, don't use the rules
			if( 0 === $select.length ) {
				return;
			}

			// Format parents
			parents.visible = parents.visible.map( parseInt );
			parents.hidden  = parents.hidden.map( parseInt );

			// Performs checks for the rule
			check = function() {
				var parent = parseInt( $select.val() );
				this.checked.set( 'parents', this.checkSingleValue( parent, parents ) );
			}

			// Listen for changes
			$select.on( 'change', _.bind( check, this ) );
			check.apply( this );
		},

		/**
		 * Listens for terms whenever a taxonomy is available.
		 */
		listenForTerms: function( terms, taxonomy ) {
			var that = this,
				$box, check;

			check = function() {
				var current = [];

				$box.find( 'input:checked' ).each(function( checkbox ) {
					var value = parseInt( this.value );

					if( current.indexOf( value ) == -1 ) {
						current.push( value );
					}
				});

				that.checked.set( 'tax_' + taxonomy, that.checkMultipleValues( current, terms ) );
			}

			$box = $( '#' + taxonomy + 'div' );

			if( ! $box.length ) {
				return; // No box, no checks
			}

			$box.on( 'change', 'input', check );
			check();
		},

		/**
		 * Listens for level changes on hierarchical post-types.
		 */
		listenForLevels: function() {
			var that    = this,
				levels  = this.get( 'levels' ),
				$select = $( 'select#parent_id' ),
				check;

			// Check if there is a selector at all
			if( ! $select.length ) {
				return;
			}

			// Format levels
			levels.visible = levels.visible.map(function( level ) { return parseInt( level ) });
			levels.hidden  = levels.hidden.map(function( level ) { return parseInt( level ) });

			// Does the checks
			check = function() {
				var level;

				$select.find( 'option' ).each(function() {
					var $option = $( this );

					if( ( 'undefined' == typeof level ) && $option.attr( 'value' ) == $select.val() ) {
						level = $option.attr( 'class' );
					}
				});

				level = level || 'level--1';
				level = parseInt( level.replace( 'level-', '' ) ) + 2;

				that.checked.set( 'levels', that.checkSingleValue( level, levels ) );
			}

			// Listen for changes
			$select.change( _.bind( check, this ) );
			check();
		}
	});

	/**
	 * This controller will handle and validate all groups.
	 */
	postType.Controller = container.Controller.extend({
		/**
		 * Binds the controller to the actual form.
		 */
		bindToForm: function() {
			var that = this, $form = $( '#post' );

			this.preventUnload = true;

			// Add a submission handler
			$form.submit(function( e ) {
				that.preventUnload = false;

				if( ! that.validate() ) {
					e.preventDefault();
				};

				setTimeout(function() {
					that.preventUnload = true;
				}, 10);
			});

			// When unloading the window, prevent leaving if there have been changes
			$( window ).on( 'beforeunload', _.bind( this.onbeforeunload, this ) );

			// Ensure that there is an input to track changes
			if( 0 == $form.find( '.uf-change-indicator' ).length ) {
				$form.append( '<input type="hidden" name="uf_has_changed" value="0" class="uf-change-indicator" />' );
			}

			_.each( this.containers, function( container ) {
				// Let each container save their initial state
				container.model.saveInitialState();

				// Listen for changes in data to indicate that a new revision is needed
				container.model.datastore.on( 'change', function() {
					that.checkContainerStates();
				});
			});
		},

		/**
		 * Checks if containers have changed and saves the result in a hidden field.
		 */
		checkContainerStates: function() {
			var changed = false;

			_.each( this.containers, function( container ) {
				if( container.model.hasChanged() ) {
					changed = true;
				}
			});

			$( '#post .uf-change-indicator' ).val( changed ? '1' : '0' );
		},

		/**
		 * Before unloading the window, check for changes.
		 */
		onbeforeunload: function() {
			var changed = false;

			if( ! this.preventUnload ) {
				return;
			}

			_.each( this.containers, function( container ) {
				if( container.model.hasChanged() ) {
					changed = true;
				}
			});

			if( changed ) {
				return false;
			}
		},

		/**
		 * Lists problems with validation.
		 *
		 * @param <Array.String> problems String representation of the problems.
		 */
		showErrorMessage: function( problems ) {
			var $div   = this.generateErrorMessage( problems ),
				$after = $( '#edit-slug-box' );

			// If there is no slug box, show after the title
			if( ! $after.length ) {
				$after = $( '#titlewrap' );
			}

			// Remove saved messages
			$( '#titlewrap' ).siblings( '.notice-success' ).remove();

			// Remove old messages
			$after.siblings( '.uf-error' ).remove();

			// Add the message
			$after.after( $div );

			// Scroll the body to the top
			$( 'html,body' ).animate({
				scrollTop: 0
			});
		}
	});

	// Create a single controller that would be used with all forms
	controller = new postType.Controller();

	// Connect the controller to the form
	$( document ).on( 'uf-init', function() {
		controller.bindToForm();
	});

	postType.integrateWithYoastSEO = function( view ) {
		$(window).on( 'YoastSEO:ready', function () {
			new postType.YoastSEOIntegration( view );
		});
	}

	postType.YoastSEOIntegration = function() { this.initialize.apply( this, arguments ); }
	_.extend( postType.YoastSEOIntegration.prototype, {
		initialize: function( view ) {
			var callback;

			this.view       = view;
			this.lastString = false;
			this.pluginName = 'ultimate-fields-' + view.model.get( 'id' );

			YoastSEO.app.registerPlugin( this.pluginName, { status: 'ready' } );

			// Add a Yoast listener
			callback = _.bind( this.addFieldsToContent, this );
			YoastSEO.app.registerModification( 'content', callback, this.pluginName, 5 );

			// Add a container visbility hidden
			view.model.on( 'change:visible', _.bind( this.reload, this ) );
			view.model.datastore.on( 'all', _.bind( this.reload, this ) );
		},

		/**
		 * Reloads the output HTML when something within Ultimate Fields changes.
		 */
		reload: function() {
			var str = this.generateContent();

			if( str != this.lastString ) {
				YoastSEO.app.pluginReloaded( this.pluginName );
			}
		},

		/**
		 * Generates the needed content string.
		 */
		generateContent: function() {
			var that = this, extraContent = [];

			if( ! ( visible = this.view.model.get( 'visible' ) ) ) {
				return false;
			}

			this.view.model.get( 'fields' ).each(function( field ) {
				var value = field.getSEOValue();

				if( value ) {
					extraContent.push( value );
				}
			});

			return extraContent.length
				? extraContent.join( ' ' )
				: false;
		},

		/**
		 * Merges the existing content with the locally generated HTML.
		 */
		addFieldsToContent: function( content ) {
			var generated = this.generateContent();

			return generated
				? content + ' ' + generated
				: content;
		}
	});

})( jQuery );
