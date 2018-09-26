<script type="text/javascript">
(function() {
	var allContainers = document.querySelectorAll( '.uf-container' );
	var container = allContainers[ allContainers.length - 1 ];

	// Locate the postbox
	var box = container;
	while( ! box.classList.contains( 'postbox' ) ) box = box.parentNode;

	// Unwrap
	box.classList.remove( 'postbox' );
	box.classList.add( 'uf-container-seamless' );

	// Remove all un-necessary elements
	var elements = box.querySelectorAll( '.handlediv,.hndle' ), i;
	for(i=0; i<elements.length; i++)
		box.removeChild( elements[ i ] );
})();
</script>
