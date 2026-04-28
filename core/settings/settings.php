<?php
/**
 * Settings storage
 *
 * Flat key/value store backed by a single WP option row. Mirrors the
 * WpCafe\Settings pattern: merge-on-update so callers can pass partial payloads.
 *
 * @package Optiontics\Core\Settings
 * @since   1.0.4
 */

namespace Optiontics\Core\Settings;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Settings
 */
class Settings {

	/**
	 * Option key used in the wp_options table.
	 *
	 * @var string
	 */
	protected static $option_name = 'optiontics_settings_options';

	/**
	 * Read the full settings map, or a single value by key.
	 *
	 * @param  string $key Optional key. When empty, the full array is returned.
	 * @return mixed
	 */
	public static function get( $key = '' ) {
		$settings = get_option( self::$option_name, [] );

		if ( ! is_array( $settings ) ) {
			$settings = [];
		}

		if ( '' === $key ) {
			return $settings;
		}

		return $settings[ $key ] ?? '';
	}

	/**
	 * Merge an input payload into the stored settings and persist.
	 *
	 * Unknown keys are accepted (open schema by design — schema tightening is a
	 * separate concern). All string values are recursively sanitised to guard
	 * against XSS when the values are later rendered back.
	 *
	 * @param  array $options Partial key/value pairs to merge in.
	 * @return bool           Result of update_option().
	 */
	public static function update( $options = [] ) {
		if ( ! is_array( $options ) || empty( $options ) ) {
			return false;
		}

		$options  = self::sanitize( $options );
		$settings = self::get();

		foreach ( $options as $name => $value ) {
			$settings[ $name ] = $value;
		}

		return (bool) update_option( self::$option_name, $settings );
	}

	/**
	 * Remove a single key from the stored settings.
	 *
	 * @param  string $key Setting key to remove.
	 * @return bool        Whether the row was persisted.
	 */
	public static function delete( $key ) {
		$settings = self::get();

		if ( ! array_key_exists( $key, $settings ) ) {
			return true;
		}

		unset( $settings[ $key ] );

		return (bool) update_option( self::$option_name, $settings );
	}

	/**
	 * Recursively apply sanitize_text_field() to every string value.
	 *
	 * Arrays are walked. Booleans, integers, and floats are preserved. Anything
	 * else is coerced to an empty string.
	 *
	 * @param  array $input Raw input from REST.
	 * @return array        Sanitised map.
	 */
	private static function sanitize( array $input ): array {
		$out = [];

		foreach ( $input as $key => $value ) {
			$clean_key = is_string( $key ) ? sanitize_key( $key ) : $key;

			if ( is_array( $value ) ) {
				$out[ $clean_key ] = self::sanitize( $value );
			} elseif ( is_bool( $value ) ) {
				$out[ $clean_key ] = $value;
			} elseif ( is_int( $value ) || is_float( $value ) ) {
				$out[ $clean_key ] = $value;
			} elseif ( is_string( $value ) ) {
				$out[ $clean_key ] = sanitize_text_field( $value );
			} else {
				$out[ $clean_key ] = '';
			}
		}

		return $out;
	}
}
