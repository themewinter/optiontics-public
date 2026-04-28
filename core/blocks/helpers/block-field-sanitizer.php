<?php
/**
 * Block field sanitizer.
 *
 * Strips Pro-gated fields from the block definitions array before Free
 * persists it. Each gated feature is checked against the shared
 * `optiontics_feature_enabled` filter — same name as the JS filter —
 * so extensions that declare a feature enabled keep their payload,
 * while Free (no subscriber) strips it.
 *
 * Free owns only the stripmap (which fields belong to which feature);
 * it does not know whether Pro is installed and never checks a
 * constant or localize flag.
 *
 * @package Optiontics\Core\Blocks\Helpers
 * @since   1.0.0
 */

namespace Optiontics\Core\Blocks\Helpers;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Block_Field_Sanitizer {

	/**
	 * Feature → fields mapping.
	 *
	 * - `block_attr`  — the field lives on `$block['attributes'][ <name> ]`.
	 * - `option_field` — the field lives on each row of `$block['attributes']['options']`.
	 *
	 * Extensions may extend this via the `optiontics_gated_field_map` filter.
	 *
	 * @var array<string, array<string, string[]>>
	 */
	private static $stripmap = [
		'option_image' => [
			'option_field' => [ 'image' ],
		],
		'option_sales_price' => [
			'option_field' => [ 'sale' ],
		],
		'option_quantity' => [
			'block_attr' => [ 'isQuantity', 'quantityMin', 'quantityMax' ],
		],
	];

	/**
	 * Strip gated fields from a blocks array. Returns the array unchanged
	 * when every feature has an enabled subscriber.
	 *
	 * @param  array $blocks Incoming blocks payload (decoded JSON).
	 * @return array
	 */
	public static function sanitize( $blocks ) {
		if ( ! is_array( $blocks ) ) {
			return $blocks;
		}

		$stripmap = apply_filters( 'optiontics_gated_field_map', self::$stripmap );

		foreach ( $stripmap as $feature => $scopes ) {
			if ( apply_filters( 'optiontics_feature_enabled', false, $feature ) ) {
				continue;
			}

			foreach ( $blocks as &$block ) {
				if ( ! is_array( $block ) || empty( $block['attributes'] ) || ! is_array( $block['attributes'] ) ) {
					continue;
				}

				if ( ! empty( $scopes['block_attr'] ) ) {
					foreach ( $scopes['block_attr'] as $name ) {
						unset( $block['attributes'][ $name ] );
					}
				}

				if ( ! empty( $scopes['option_field'] ) && ! empty( $block['attributes']['options'] ) && is_array( $block['attributes']['options'] ) ) {
					foreach ( $block['attributes']['options'] as &$option ) {
						if ( ! is_array( $option ) ) {
							continue;
						}
						foreach ( $scopes['option_field'] as $name ) {
							unset( $option[ $name ] );
						}
					}
					unset( $option );
				}
			}
			unset( $block );
		}

		return $blocks;
	}
}
