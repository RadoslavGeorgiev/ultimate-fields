<!--
## Fields

### Improved repeaters

- Tabs
- Full-screen mode
- __more stuff__
- Existing groups
- Table mode

### Complex field

### Relational fields
Object
Objects
Link


## Others

### JSON Import/Export
### JSON Synchronization
### New website & Documentation
### New layout
###
### Unlimited nesting
### REST API
### Admin columns

-->

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
				<h3>Repeaters</h3>
				<p>Repeaters now support tabs, full-screen mode for groups, table layouts and more.</p>
			</div>

			<div class="uf-welcome-column">
				<h3>Complex Field</h3>
				<p>The complex field allows you to group multiple fields (in the same row) and makes your containers more reusable </p>
			</div>

			<div class="uf-welcome-column">
				<h3>Relational fields</h3>
			</div>

			<div class="uf-welcome-column">
				<h3>Conditional Logic</h3>
			</div>
		</div>
	</div>


	<hr />


	<div class="uf-welcome-section uf-welcome-two-col">
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
