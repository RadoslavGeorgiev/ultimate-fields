<div class="wrap uf-welcome">
	<div class="uf-welcome-section uf-welcome-section-first uf-welcome-top">
		<div class="uf-welcome-intro">
			<h1>Hello!</h1>
			<div class="about-text">
				<p>Thank you for installing or updating to Ultimate Fields 3!</p>
				<p>This is a complete rewrite of the plugin, which brings a ton of improvements and new features. To learn more about them, take a look below or visit <a href="https://www.ultimate-fields.com/" target="_blank">our new website</a>.</p>
			</div>
		</div>

		<div class="wp-ui-highlight uf-welcome-version">
			<span class="ultimate-fields-icon">
				<?php echo file_get_contents( ULTIMATE_FIELDS_UI_DIR . 'assets/icon.svg' ) ?>
			</span>
			<strong>Version <?php echo ULTIMATE_FIELDS_VERSION ?></strong>
		</div>
	</div>

	<hr />

	<div class="uf-welcome-section uf-welcome-changelog">
		<h2>Introducing a cool new plugin<sup>2</sup></h2>
		<p>Ultimate Fields 3 is a completely new plugin, following the same philosophy as the first version.</p>
		<p>Following the trends on the World Wide Web and the ones for WordPress, this version introduces a completely JavaScript driven interface. This allows for improved user experience and various functions, which were nearly impossible to exist in its PHP based equivalent.</p>
	</div>

	<hr />

	<div class="uf-welcome-section uf-welcome-section-centered">
		<h2>WYSIWYG fields creation</h2>

		<img src="<?php echo ULTIMATE_FIELDS_UI_URL ?>assets/welcome/wysiwyg-fields.png" alt="WYSIWYG Editor" class="uf-welcome-image" />

		<p>Starting from the first screen, Ultimate Fields already looks awesome.</p>
		<p>One of the key visual additions in Ultimate Fields 3 is the new container edit screen. In addition to the improved location settings, the section with the fields provides a real preview of the field, allowing you to see how the fields will look, while making the navigation between fields easier and visually intuitive.</p>

		<div class="clearfix"></div>
	</div>

	<hr />

	<div class="uf-welcome-section uf-welcome-section-centered">
		<h2>Overhauled UI</h2>
		<p>Although in its core, Ultimate Fields is trying to get out of the way from your users by utilizing the WordPress look and feel, it is all new now. Starting with simple fields and extending to the administration interface, version three is completely rewritten and heavily JavaScript-based.</p>
	</div>

	<hr />

	<div class="uf-welcome-section uf-welcome-section-centered">
		<h2>
			<span class="dashicons dashicons-chart-line"></span>
			Improved performance
		</h2>

		<div class="uf-welcome-columns">
			<div class="uf-welcome-column">
				<h4>Back-end performance</h4>
				<p>With smarter location rules, fields will not be initialized until they need to be displayed.</p>
				<p>This minifies the impact of Ultimate Fields in the back-end, preventing fields, which are not needed from slowing down the whole administration area.</p>
			</div>

			<div class="uf-welcome-column">
				<h4>Front-end performance</h4>
				<p>Version three uses a new approach for loading fields and values in the front end.</p>
				<p>The appropriate details are cached in an option, which is automatically loaded during WordPress startup. After that, when retrieving values, the performance impact of using <code>the_value()</code> and <code>get_the_value()</code> is zero to none. Now Ultimate Fields is the fastest in it&apos;s class.</p>
			</div>
		</div>
	</div>

	<hr />

	<div class="uf-welcome-section uf-welcome-section-centered">
		<h2>Better fields</h2>

		<div class="uf-welcome-columns">
			<div class="uf-welcome-column">
				<h4>Repeaters</h4>
				<p>Repeaters just became way more powerful.</p>
				<p>They now support tabs, full-screen mode for groups, table layouts, icons, color customization, minimum/maximum limits and that is not even all!</p>
			</div>

			<div class="uf-welcome-column">
				<h4>Complex Field</h4>
				<p>The new Complex field allows you to add multiple sub-fields to the same field. Those fields may even be loaded from an existing container, making reusable fields possible.</p>
			</div>

			<div class="uf-welcome-column uf-welcome-column-top">
				<h4>Relational fields</h4>
				<p>The new WP Object, WP Objects and Link field allow users to select all types of content through a JS-driven and intuitive field!</p>
			</div>

			<div class="uf-welcome-column uf-welcome-column-top">
				<h4>Conditional Logic</h4>
				<p>Conditional Logic is now supported in the User Interface. Not only that, but you can actually create multiple groups of rules.</p>
			</div>

			<div class="uf-welcome-column uf-welcome-column-top">
				<h4>Unlimited nesting</h4>
				<p>Now you can not just create repeaters, but also have fields within a complex field within a repeater within a layout field. From now on, the sky is the limit!</p>
			</div>

			<div class="uf-welcome-column uf-welcome-column-top">
				<h4>Minor UI Tweaks</h4>
				<p>Most existing fields will now work and look better, thanks to various tweaks and improvements in the interface.</p>
			</div>
		</div>
	</div>

	<hr />

	<div class="uf-welcome-section uf-welcome-section-centered">
		<h2>...and much more</h2>

		<div class="uf-welcome-columns">
			<div class="uf-welcome-column">
				<h4>JSON Import/Export</h4>
				<p>Reliably export and import fields from the admin as JSON files.</p>
			</div>

			<div class="uf-welcome-column">
				<h4>JSON Synchronization</h4>
				<p>Fields can be automatically saved and synchronized in your theme.</p>
			</div>

			<div class="uf-welcome-column uf-welcome-column-top">
				<h4>New website & Documentation</h4>
				<p>The website of the plugin is now live and full of docs.</p>
			</div>

			<div class="uf-welcome-column uf-welcome-column-top">
				<h4>New layout</h4>
				<p>The new Grid layout allows fields to be added to columns.</p>
			</div>

			<div class="uf-welcome-column uf-welcome-column-top">
				<h4>REST API</h4>
				<p>Automatically expose fields in the REST API.</p>
			</div>

			<div class="uf-welcome-column uf-welcome-column-top">
				<h4>Admin columns</h4>
				<p>Easily display the values of fields as columns in listings.</p>
			</div>
		</div>
	</div>

	<hr>

	<div class="uf-welcome-section">
		<img src="<?php echo ULTIMATE_FIELDS_UI_URL ?>assets/images/layout-field.png" alt="Repeater Tabs" width="460" class="uf-welcome-image" />

		<h2>Ultimate Fields Pro</h2>
		<p><strong>More Locations and Fields, Front-end Forms &amp; Faster Support</strong></p>
		<p>Read more about it on the official page.</p>

		<a href="https://www.ultimate-fields.com/pro/" target="_blank" class="button-primary">Read More &raquo;</a>

		<div class="clearfix"></div>
	</div>

	<hr />

	<div class="uf-welcome-section">
		<p>
			<a href="<?php echo admin_url( 'post-new.php?post_type=ultimate-fields&demo' ) ?>" class="button button-hero button-primary">Create your first container</a>
			&nbsp;
			<a href="https://www.ultimate-fields.com/pro/" class="button button-hero button-secondary" target="_blank">Get Ultimate Fields Pro</a>
		</p>
	</div>
</div>
