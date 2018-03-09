(function( $ ){

	var resizers = [];

	$( document ).on( 'uf-before-resize', function() {
		console.log('in here');
		_.each( resizers, function( resizer ) {
			resizer();
		});
	});

	UltimateFields.ContainerLayout = Backbone.View.extend({
		initialize: function( args ) {
			// Flags
			this.gridAdded = false;

			// Save the args (not a model)
			this.args = args;

			// Add a proper callback
			resizers.push( _.bind( this.update, this ) );
			if( 'grid' == args.layout ) {
				this.startGrid();
			}

			return;
		},

		startGrid: function() {
			if( this.gridAdded ) {
				return;
			}

			var grid = UltimateFields.grid( $container );

			// Fix the grid when there is conditional logic or the tab changes
			this.model.get( 'fields' ).on( 'change:visible', grid );
			this.model.datastore.on( 'change:__tab', grid );

			// Save the flag
			this.gridAdded = true;
		},

		update: function() {
			var w = this.$el.width();
			var layout = this.args.layout;

			if( 'rows' === this.args.layout ) {
				if( w > 1000 ) {
					// Standard mode
					this.$el
						.addClass( 'uf-fields-layout-rows' )
						.removeClass( 'uf-fields-layout-grid' );

					layout = 'rows';
				} else {
					// When the width is not enough, switch to grid
					this.$el
						.addClass( 'uf-fields-layout-grid' )
						.removeClass( 'uf-fields-layout-rows' );

					layout = 'grid';
				}
			} else {
				this.$el.addClass( 'uf-fields-layout-grid' );
			}

			console.log(layout);

			_.each( this.args.fields, function( wrap ) {
				wrap.useLayout( layout );
			});
		}
	});

})( jQuery );
