<div class="uf-customizer-validation-message">
	<h4><?php _e( 'Your data contains errors', 'ultimate-fields-pro' ) ?></h4>
	<p><?php _e( 'Please make sure to fix the errors, listed within the fields below before trying to save.', 'ultimate-fields-pro' ) ?></p>
</div>

<% if( description && description.length ) { %>
<div class="uf-container-description">
	<%= description %>
</div>
<% } %>

<div class="uf-fields"></div>
