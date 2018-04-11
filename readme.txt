=== Ultimate Fields ===
Contributors: RadoGeorgiev
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QNZXU5VDH6PNQ
Tags: custom fields, meta, theme options, repeater, post meta
Requires at least: 4.9
Tested up to: 4.9.5
Stable tag: 3.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Easy and powerful custom fields management: Post Meta, Options Pages, Repeaters and many field types!

== Description ==

With Ultimate Fields you can easily create fields in the admin. Those fields can be displayed when you are editing a post or page (any post type actually) or in an options page (ex. Theme Options) anywhere in the admin.

= Features =
* Easy to use.
* Many types of fields.
* Post Meta containers which display fields on post edit screens.
* Post Meta containers can only be shown when a specific criteria is met. Criteria may include: Post Type, Specific Category (for posts), Specific custom taxonomy tags, Specific Templates and Specific hierarchy levels.
* Options Page containers which display options wherever needed. You can specify if you want the page to appear in the main menu or as a sub-page in the Appearance, Tools and Settings menu. Custom icons are also supported.
* Both Post meta and Options Pages support tabs.
* Properly styled: Ultimate Fields follows WordPress' built in styles as much as possible and provides a seamless experience. It's even fully responsive.
* PHP and JSON Exports: You can export your fields to PHP and embed them in your theme or plugin.
* Output settings: You can change the way each field's value is displayed and then just call get_value( 'field_name' ), without any additional processing.

= Fields =
* Heading Field
* Text Field
* Textarea Field
* Select Field
* Select Page Field
* Radio Field
* Checkbox Field
* Checkbox Set Field
* File Field
* Select Term Field
* Rich Text Editor (TinyMCE) Field

= Repeaters =
Repeaters can be used to add repeatable groups of fields. You can combine a text and a file field into a Slide group and allow the user to add as many slides as he needs. The value is saved in a single field!

Additionally you can add different types of groups into a single repeater. This way the user could add both Video Slides and Image Slides through the same place.

= Embedding in themes and plugins =
Ultimate Fields has all the necessary logic built in. Just place it wherever you need and include ultimate-fields.php

== Installation ==

1. Upload `ultimate-fields` to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. You are ready to create your first container. To do this, choose "Add New" from the "Ultimate Fields" section in the menu.
4. Output values through get_option(), get_post_meta(), uf() and get_uf().

== Screenshots ==

1. This screenshot shows the main page where you can set a container up.
2. The second screenshot shows how the Fields interface looks.
3. You can see an example options page on the third screenshot.
4. A Post Meta box which contains a couple of fields.

== Changelog ==

= 1.2 =
* Updated visual styles
* Added a warning about dropping qTranslate support in the next big version
* Fixed JavaScript errors

= 1.1 =
* The MIME type of screenshots is changed in order to allow them to be viewable in the browser without downloading.
* The Richtext field has been updated to be compatible with the latest version of WordPress, 4.4.2 . A wrong link to mac.int is also fixed.
* The "Select Term" field will not trigger a fatal error when a taxonomy is no longer existing.
* Modified the filters for the textarea and richtext filter output.
* Tabs are no longer broken.
* The repeater field is working well.

= 1.0.3 =
* Adding an HTML field that is only available through code.
* UF_Datastore_Postmeta will return NULL if a value is not set. This way checkboxes and default values will work.
* Modified UF_Field_Checkbox to check for the proper value when retrieving from a datastore.
* UF_Postmeta is not calling save when a new post is being created (the draft).
* Made a few minor changes to allow Ultimate Post Types to work properly.

= 1.0.2 =
* PHP: Fixed bugs with the import functionality, which prevent containers from being registered.
* PHP: The get_uf_repeater( $key ) function returns processed values: Repeater values, like images and etc. will be processed before the function returns them.

= 1.0.1 =
* PHP: The Richtext Field will no longer add blank lines when displaying multiple paragraphs.
* PHP: The Richtext Field's setting for rows is actually working.
* PHP: Options pages can now reside under other Ultimate Fields pages.
* PHP: uf_extend is now called on plugins_loaded. This way all that is extended will have access to more hooks, including widgets_init.
* PHP: Changed the message when a container is saved.
* PHP: UF_Field_Set will be saved even without checked values.

* JS & CSS: Validation is a bit better - it highlights the field and tab of the error.
* JS: New repeater elements can be toggled by using the arrow.

* Translations: Fixed the path in uf-bg_BG.po
* Translations: German translation added (Big Thanks to [sixtyseven](https://profiles.wordpress.org/sixtyseven/) !)
* Translations: Several string fixes
* Translations: The Heading field does no longer use automatically generated labels. This way translations can work.
* Translations: New tabs' text can be translated too now, missing textdomain added.

**WordPress 3.9**
The "Richtext" field is fixed.

= 1.0 =
Initial version.
