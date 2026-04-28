<?php
/**
 * Plugin Icon Helper
 *
 * Resolves icon content for sibling Arraytics plugins from local image assets.
 * SVG files are returned as inline markup; other formats as URL strings.
 *
 * @package Optiontics/Utils
 */

defined( 'ABSPATH' ) || exit;

if ( ! function_exists( 'optiontics_get_plugin_icon' ) ) {
	/**
	 * Get icon for a plugin by name.
	 *
	 * Looks for a matching file in assets/images/our-plugins/ (svg, webp, png, jpg).
	 * Returns inline SVG markup for .svg files, or a URL string for raster images.
	 *
	 * @param string $plugin_name Plugin name/slug (e.g. 'eventin', 'timetics').
	 * @return string Inline SVG string, image URL, or empty string if not found.
	 */
	function optiontics_get_plugin_icon( string $plugin_name ): string {
		if ( ! defined( 'OPTIONTICS_DIR' ) || ! defined( 'OPTIONTICS_FILE' ) ) {
			return '';
		}

		$base_path = OPTIONTICS_DIR . '/assets/images/our-plugins/';
		$base_url  = plugins_url( '', OPTIONTICS_FILE ) . '/assets/images/our-plugins/';

		foreach ( [ 'svg', 'webp', 'png', 'jpg' ] as $ext ) {
			$file = $base_path . $plugin_name . '.' . $ext;
			if ( file_exists( $file ) ) {
				// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
				return 'svg' === $ext ? file_get_contents( $file ) : $base_url . $plugin_name . '.' . $ext;
			}
		}

		return '';
	}
}
