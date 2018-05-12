const $ = jQuery;

export default class Grid {
    constructor( element ) {
        this.element = element;
        this.resize();

        window.addEventListener( 'resize', () => this.resize() )
        jQuery( document ).on( 'uf-grid-resize', () => this.resize() )
    }

    static resize() {
        setTimeout( () => {
            $( document ).trigger( 'uf-grid-resize' );
        }, 1 );
    }

    resize() {
        var that = this, top, left;

		// Let fields update their sizes
		$( document ).trigger( 'uf-before-resize' );

        this.$gridElements = $( this.element.children ).filter( '.uf-field, .uf-section' );

		// Crawl
		this.$gridElements.each(function() {
			var $el = $( this ), elTop, elLeft;

			if( $el.hasClass( 'uf-tab-wrapper' ) || $el.hasClass( 'uf-inline-section' ) ) {
				top = left = undefined;
				return;
			}

			elTop  = $el.offset().top - parseInt( $el.css( 'margin-top' ) );
			elLeft = $el.offset().left - parseInt( $el.css( 'margin-left' ) );

			// For the first element, get the offsets
			if( 'undefined' == typeof left ) {
				left = elLeft;
				top  = elTop;
			}

			// Add the top index
			if( elTop == top ) {
				$el.addClass( 'top-row' );
			} else if( $el.hasClass( 'top-row' ) ) {
				$el.removeClass( 'top-row' );
			}

			// Add the left index
			if( elLeft == left ) {
				$el.addClass( 'first-col' );
			} else if( $el.hasClass( 'first-col' ) ) {
				$el.removeClass( 'first-col' );
			}
		});
    }
}
