<?php
/**
 * Our Plugins List
 *
 * Defines the sibling Arraytics plugins shown on the About Us "Our Plugins" section.
 * Plugin install/activate status is resolved at runtime by Extension_Controller.
 * Icon content is resolved via optiontics_get_plugin_icon() from plugin-icon.php.
 *
 * @package Optiontics/Utils
 */

defined( 'ABSPATH' ) || exit;

if ( ! function_exists( 'optiontics_our_plugins_list' ) ) {
	/**
	 * Returns the list of sibling Arraytics plugins.
	 *
	 * @return array<string, array<string, mixed>>
	 */
	function optiontics_our_plugins_list(): array {
		$plugins = [
			'wpcafe'   => [
				'name'        => 'wpcafe',
				'slug'        => 'wpcafe',
				'title'       => __( 'WP Cafe', 'optiontics' ),
				'description' => __( 'Complete restaurant management — food ordering, table reservation, and QR menus for WordPress.', 'optiontics' ),
				'is_pro'      => false,
				'doc_link'    => 'https://support.themewinter.com/docs/plugins/docs/wpcafe/',
				'demo_link'   => '',
				'icon'        => '',
			],
			'eventin'  => [
				'name'        => 'eventin',
				'slug'        => 'wp-event-solution',
				'title'       => __( 'Eventin', 'optiontics' ),
				'description' => __( 'Complete event management — create events, sell tickets, and engage attendees right from WordPress.', 'optiontics' ),
				'is_pro'      => false,
				'doc_link'    => 'https://support.themewinter.com/docs/plugins/docs/eventin/',
				'demo_link'   => '',
				'icon'        => '',
			],
			'timetics' => [
				'name'        => 'timetics',
				'slug'        => 'timetics',
				'title'       => __( 'Timetics', 'optiontics' ),
				'description' => __( 'Smart appointment scheduling — let clients book 24/7 with calendar sync, team management, and automated reminders.', 'optiontics' ),
				'is_pro'      => false,
				'doc_link'    => 'https://docs.arraytics.com/docs/timetics/getting-started/',
				'demo_link'   => '',
				'icon'        => '',
			],
			'booktics' => [
				'name'        => 'booktics',
				'slug'        => 'booktics',
				'title'       => __( 'Booktics', 'optiontics' ),
				'description' => __( 'The ultimate online booking plugin for WordPress — services, staff, schedules, and payments in one place.', 'optiontics' ),
				'is_pro'      => false,
				'doc_link'    => 'https://docs.arraytics.com/docs/booktics/',
				'demo_link'   => '',
				'icon'        => '',
			],
			'poptics'  => [
				'name'        => 'poptics',
				'slug'        => 'poptics',
				'title'       => __( 'Poptics', 'optiontics' ),
				'description' => __( 'Popup builder for WordPress — grow your audience with beautiful, targeted popups without writing code.', 'optiontics' ),
				'is_pro'      => false,
				'doc_link'    => 'https://docs.aethonic.com/docs/getting-started/intro/',
				'demo_link'   => '',
				'icon'        => '',
			],
		];

		foreach ( $plugins as &$plugin ) {
			if ( function_exists( 'optiontics_get_plugin_icon' ) ) {
				$plugin['icon'] = optiontics_get_plugin_icon( $plugin['name'] );
			}
		}
		unset( $plugin );

		return $plugins;
	}
}
