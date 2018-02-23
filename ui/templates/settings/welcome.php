<div class="wrap about-wrap uf-welcome">
	<div class="wp-ui-highlight version">
		<span class="ultimate-fields-icon">
			<?php echo file_get_contents( ULTIMATE_FIELDS_UI_DIR . 'assets/icon.svg' ) ?>
		</span>
		<strong>Version 2</strong>
	</div>

	<h1>Hello!</h1>
	<div class="about-text">Thank you for installing Ultimate Fields 2!<br />This version brings a ton of new and improved features. Please take a minute to get started.</div>

	<hr />

	<div class="changelog">
		<h2>Introducing a cool new plugin<sup>2</sup></h2>
		<p>Ultimate Fields 2 is a completely new plugin, following the same philosophy as version one.</p>
		<p>Following the trends on the World Wide Web and the ones for WordPress, this version introduces a completely JavaScript driven interface. This allows for improved user experience and various functions, which were nearly impossible to exist in it's PHP based equivalent.</p>
	</div>

	<hr />

	<div class="feature-section two-col">
		<div class="col">
			<img src="<?php echo ULTIMATE_FIELDS_UI_URL ?>assets/images/welcome-editor.png" alt="WYSIWYG Editor" width="550" />
		</div>
		<div class="col">
			<h2 class="about-headline-callout">WYSIWYG fields creation</h2>
			<p>Starting from the first screen, Ultimate Fields already looks awesome. One of the key visual additions in Ultimate Fields 2 is the new container edit screen. In addition to the improved location settings, the section with the fields provides a real preview of the field, allowing you to see how the fields will look, while making the navigation between fields easier and visually intuitive.</p>

			<h2 class="about-headline-callout">Overhauled UI</h2>
			<p>Although in its core, Ultimate Fields is trying to get out of the way from your users by utilizing the WordPress look and feel, it is all new now. Starting with simple fields and extending to the administration interface, version two is completely rewritten and heavily JavaScript-based.</p>
		</div>
	</div>

	<hr />

	<div class="feature-section two-col text-col">
		<h2 class="about-headline-callout"><span class="dashicons dashicons-chart-line"></span> Better performance</h2>
		<p>One of the main goals for Ultimate Fields 2 was to improve performance and the results are dramatic.</p>

		<div class="col">
			<h4>Back-end performance</h4>
			<p>With smarter location rules, fields will not be initialized until they need to be displayed.</p>
			<p>This minifies the impact of Ultimate Fields in the back-end, preventing fields, which are not needed from slowing down the whole administration area.</p>
		</div>

		<div class="col">
			<h4>Front-end performance</h4>
			<p>Version two uses a new approach for loading fields and values in the front end.</p>
			<p>The appropriate details are cached in an option, which is automatically loaded during WordPress startup. After that, when retrieving values, the performance impact of using <code>the_value()</code> and <code>get_the_value()</code> is zero to none. Now Ultimate Fields is the fastest in it&apos;s class.</p>
		</div>
	</div>

	<hr />

	<div class="feature-section two-col">
		<div class="col">
			<h2 class="about-headline-callout">Conditional Logic</h2>
			<p>Conditional logic was present in Ultimate Fields 1, but only available when fields were created by using code. The JavaScript-based logic of Ultimate Fields 2 allows conditional logic to be defined in the UI.</p>
		</div>
		<div class="col">
			<img src="<?php echo ULTIMATE_FIELDS_UI_URL ?>assets/images/conditional-logic.png" alt="Conditional Logic" width="374" />
		</div>
	</div>

	<hr />

	<div class="feature-section two-col">
		<h2 class="about-headline-callout">Improved repeaters</h2>
		<!-- <p>As everything else in version two, repeaters have been rewritten, improving performance and bringing new functionality.</p> -->

		<div class="col">
			<h3>Repeaters have tabs now</h3>
			<p>Using the same intuitive interface for creating tabs within containers, you can now create tabs within repeaters.</p>
			<p>Now groups with lots of fields can be nicely arranged and separated into sections.</p>
		</div>

		<div class="col">
			<img src="<?php echo ULTIMATE_FIELDS_UI_URL ?>assets/images/repeater-tabs.png" alt="Repeater Tabs" width="498" />
		</div>

		<div class="clear"></div>

		<div class="col">
			<img src="<?php echo ULTIMATE_FIELDS_UI_URL ?>assets/images/full-screen-repeater.png" alt="Full Screen Repeaters" width="434" />
		</div>

		<div class="col">
			<h3>Full screen groups</h3>
			<p>If tabs are not enough or you want to use a repeater within a limited space, which is insufficient for displaying normal groups, you can use the full-screen mode, which is one of the coolest new features of Ultimate Fields.</p>
			<p>Now you can enable full screen mode for repeater groups.</p>
			<p>As you can see, full-screen groups also support tabs.</p>
		</div>
	</div>

	<hr />

	<h2 class="about-headline-callout">Introducing virtual containers</h2>
	<p>Virtual Containers are a new concept in version two of Ultimate Fields. A virtual container is not automatically associated with pages, options and etc. Instead, it can be used in combination with the new complex field type, with repeaters and with the layout field.</p>
	<p>By doing so, you can reuse fields in different ways. With the complex field, you can combine similar fields (ex. button settings) and use them within multiple environments. If you are using repeaters for content builders, you could you re-use the same content block within different repeaters, meant for different places. The same applies to the layout field.</p>

	<hr />

	<h2 class="about-headline-callout">New field types</h2>
	<p>Ultimate Fields and Ultimate Fields Pro bring a lot of new fields types, which were not available in version one:</p>

	<table class="wp-list-table widefat">
		<thead>
			<tr>
				<th>Type</th>
				<td>Purpose</td>
			</tr>
		</thead>
		<tbody>
			<tr class="alternate">
				<th>Color</th>
				<td>A jQuery-based color picker</td>
			</tr>
			<tr>
				<th>Complex</th>
				<td>Allows various fields to be combined into a single complex field. Fields can be loaded from virtual containers.</td>
			</tr>
			<tr class="alternate">
				<th>Date</th>
				<td>A jQuery-based date picker</td>
			</tr>
			<tr>
				<th>Font</th>
				<td>Allows users to select a font from the Google Fonts directory, preview it and select their preferred variants.</td>
			</tr>
			<tr class="alternate">
				<th>Gallery</th>
				<td>Allows the selection of multiple images simultaneously, using the built-in media modal.</td>
			</tr>
			<tr>
				<th>Icon</th>
				<td>Allows users to select a font icon from Dashicons and Font-Awesome.</td>
			</tr>
			<tr class="alternate">
				<th>Image</th>
				<td>Extends the functionality of the file field to allow only the selection of images.</td>
			</tr>
			<tr>
				<th>Layout</th>
				<td>Extends the repeater field by adding columns. See below.</td>
			</tr>
			<tr>
				<th>Map</th>
				<td>Displays a Google Map and allows users to pick a location or look for an address within it.</td>
			</tr>
			<tr class="alternate">
				<th>Multiselect</th>
				<td>Allows users to select multiple values using a multiselect, checkboxes or select2</td>
			</tr>
			<tr>
				<th>Number</th>
				<td>Allows users to enter numbers and use sliders to control them.</td>
			</tr>
			<tr class="alternate">
				<th>Object</th>
				<td>Allows the selection of various object (post, term, etc.) types.</td>
			</tr>
			<tr>
				<th>Objects</th>
				<td>Extends the Object field by allowing multiple items to be selected.</td>
			</tr>
			<tr class="alternate">
				<th>Link</th>
				<td>Allows the user to enter an URL or select an existing item on the website.</td>
			</tr>
			<tr class="alternate">
				<th>Sidebar</th>
				<td>Allows users to select a sidebar for a certain position and also create a new one if needed.</td>
			</tr>
			<tr>
				<th>Table</th>
				<td>Similarly to the Repeater field, the table field allows users to enter data in a table-like looking UI.</td>
			</tr>
			<tr class="alternate">
				<th>Video</th>
				<td>Allows users to select various details about a video, including multiple formats and a poster.</td>
			</tr>
		</tbody>
	</table>
	<br />

	<hr />

	<div class="three-col">
		<div class="col">
			<h2 class="about-headline-callout">JSON Export/Import</h2>
			<p>Ultimate Fields 2 is now using JSON a lot, including for exports and imports, making it easier to select and migrate containers.</p>
		</div>

		<div class="col">
			<h2 class="about-headline-callout">Many new hooks</h2>
			<p>Ultimate Fields 2 provides more than 300 actions and filters, allowing you to change nearly all of it's aspects when needed.</p>
		</div>

		<div class="col">
			<h2 class="about-headline-callout">New website &amp; documentation</h2>
			<p>The time Ultimate Fields 2 required did not allow version one to get it's documentation. Now this is changed and there is a shiny new website. You can check it out at <a href="http://ultimate-fields.com/" target="_blank">http://ultimate-fields.com/</a>.</p>
		</div>
	</div>


	<hr />

	<div class="feature-section two-col">
		<div class="col">
			<img src="<?php echo ULTIMATE_FIELDS_UI_URL ?>assets/images/repeater-tabs.png" alt="Repeater Tabs" width="498" />
		</div>

		<div class="col">
			<h2 class="about-headline-callout">New layout structure</h2>
			<p>Ultimate Fields 1 only supported a tabular layout for it&apos;s fields. In version two, there is one new layout option, which places labels on top of their fields. When this mode is enabled, fields can have different widths, allowing you to lay your fields out in a tighter, better-organized manner.</p>
		</div>
	</div>

	<hr />

	<div class="feature-section two-col">
		<div class="col">
			<h2 class="about-headline-callout">Ultimate Fields Pro</h2>
			<p>The Pro version of the plugin includes various things like more containers, more fields and some other small goodies.</p>
			<p>You can read more about it on the official page.</p>

			<a href="http://ultimate-fields.com/pro" class="button-primary">Read More &raquo;</a>
		</div>

		<div class="col">
			<img src="<?php echo ULTIMATE_FIELDS_UI_URL ?>assets/images/layout-field.png" alt="Repeater Tabs" width="460" />
		</div>
	</div>


	<hr />

	<p>
		<a href="<?php echo admin_url( 'post-new.php?post_type=ultimate-fields&demo' ) ?>" class="button button-hero button-primary">Create your first container</a>
		&nbsp;
		<a href="http://ultimate-fields.com/pro/" class="button button-hero button-secondary" target="_blank">Get Ultimate Fields Pro</a>
	</p>
</div>
