<?php
/**
 * DOM Utilities
 *
 * Stateless helpers for generating safe HTML attributes, CSS class strings,
 * and img tags. Replaces the old Block_Helpers trait — logic now lives in a
 * focused utility class rather than mixed into every field type via inheritance.
 *
 * Architectural difference from old pattern:
 *  - Static class instead of a trait: zero coupling to field type hierarchy.
 *  - output_attrs() is removed — HTML is always built into a string and
 *    returned, never echoed from a utility function.
 *  - Data attribute names align with the NEW schema (node-id, group-id, title,
 *    logic-enabled) — not the old bid/sectionid/label/enlogic names.
 *
 * @package Optiontics\Core\FieldUnits\Support
 * @since   2.0.0
 */

namespace Optiontics\Core\FieldUnits\Support;

use Optiontics\Core\FieldUnits\DTO\Field_Definition;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Dom_Utilities
 */
final class Dom_Utilities {

	// =========================================================================
	// ATTRIBUTE BUILDING
	// =========================================================================

	/**
	 * Build a safe HTML attribute string from a key→value map.
	 *
	 * - Arrays and objects are JSON-encoded.
	 * - Empty strings, null, and false are omitted.
	 * - true emits a boolean attribute (name only, no value).
	 * - All keys and values are escaped.
	 *
	 * @param  array<string, mixed> $attrs Attribute map.
	 * @return string Space-separated attribute string (no leading space).
	 */
	public static function attrs( array $attrs ): string {
		if ( empty( $attrs ) ) {
			return '';
		}

		$parts = [];

		foreach ( $attrs as $key => $value ) {
			if ( ! is_string( $key ) || '' === $key ) {
				continue;
			}

			if ( is_array( $value ) || is_object( $value ) ) {
				$value = wp_json_encode( $value );
			}

			if ( '' === $value || null === $value || false === $value ) {
				continue;
			}

			if ( true === $value ) {
				$parts[] = esc_attr( $key );
			} else {
				$parts[] = esc_attr( $key ) . '="' . esc_attr( (string) $value ) . '"';
			}
		}

		return implode( ' ', $parts );
	}

	/**
	 * Build data-* attributes from a flat map.
	 *
	 * Keys are prefixed with "data-" and underscores converted to dashes.
	 * Empty/falsy values (except 0 and '0') are skipped.
	 *
	 * @param  array<string, mixed> $data_map Key→value pairs without "data-" prefix.
	 * @return array<string, mixed>           Ready for self::attrs().
	 */
	public static function data_attrs( array $data_map ): array {
		$out = [];

		foreach ( $data_map as $key => $value ) {
			// Preserve 0 and '0' as valid values.
			if (
				( '' === $value || null === $value || false === $value ) &&
				0 !== $value && '0' !== $value
			) {
				continue;
			}

			$attr_key        = 'data-' . str_replace( '_', '-', sanitize_key( (string) $key ) );
			$out[ $attr_key ] = ( is_array( $value ) || is_object( $value ) )
				? wp_json_encode( $value )
				: $value;
		}

		return $out;
	}

	/**
	 * Build the standard wrapper attributes for a field unit element.
	 *
	 * Generates the new data-* schema:
	 *   data-node-id, data-group-id, data-title, data-logic-enabled, data-required
	 *
	 * @param  Field_Definition $def        Field configuration.
	 * @param  string[]         $extra_classes Additional CSS classes to merge.
	 * @return array<string, mixed>         Attribute map ready for self::attrs().
	 */
	public static function field_wrapper_attrs( Field_Definition $def, array $extra_classes = [] ): array {
		$base_classes = array_filter( [
			'opt-field',
			'opt-field--' . sanitize_html_class( $def->field_type ),
			'opt-field--' . sanitize_html_class( $def->node_id ),
			$def->css_extra ? sanitize_html_class( $def->css_extra ) : '',
		] );

		$merged_classes = array_unique( array_merge( $base_classes, $extra_classes ) );

		$wrapper = [
			'class' => self::classes( $merged_classes ),
			'id'    => 'opt-node-' . sanitize_html_class( $def->node_id ),
		];

		$data = self::data_attrs( [
			'node-id'              => $def->node_id,
			'group-id'             => $def->group_id,
			'title'                => $def->title,
			'field-type'           => $def->field_type,
			'logic-enabled'        => $def->logic_enabled ? '1' : '0',
			'required'             => $def->is_required   ? '1' : '0',
			'conditions'           => $def->rules,
			'condition-visibility' => $def->condition_visibility,
			'condition-match'      => $def->condition_match,
			'default'              => $def->default_value,
		] );

		return array_merge( $wrapper, $data );
	}

	// =========================================================================
	// CSS CLASS HELPERS
	// =========================================================================

	/**
	 * Collapse an array of class names into a deduplicated, trimmed string.
	 *
	 * @param  string[] $classes Class name list (empty strings are dropped).
	 * @return string
	 */
	public static function classes( array $classes ): string {
		$filtered = array_unique( array_filter(
			$classes,
			static fn( $c ) => is_string( $c ) && '' !== trim( $c )
		) );

		return implode( ' ', $filtered );
	}

	// =========================================================================
	// IMAGE HELPERS
	// =========================================================================

	/**
	 * Render a safe <img> tag from a URL.
	 *
	 * Returns an empty string when the URL is missing or invalid.
	 *
	 * @param  string $url        Image URL (will be re-validated).
	 * @param  string $alt        Alt text.
	 * @param  array  $extra_attrs Additional HTML attributes.
	 * @return string             Escaped <img> tag or empty string.
	 */
	public static function img( string $url, string $alt = '', array $extra_attrs = [] ): string {
		$clean_url = esc_url_raw( $url );
		if ( '' === $clean_url || ! filter_var( $clean_url, FILTER_VALIDATE_URL ) ) {
			return '';
		}

		$attrs = array_merge(
			[
				'src'   => esc_url( $clean_url ),
				'alt'   => esc_attr( sanitize_text_field( $alt ) ),
				'class' => 'opt-field__image',
			],
			$extra_attrs
		);

		return '<img ' . self::attrs( $attrs ) . ' />';
	}

	/**
	 * Extract a validated image URL from a choice array.
	 *
	 * Checks 'image' key first, then 'img' as legacy fallback.
	 *
	 * @param  array $choice Choice entry from Field_Definition::$choices.
	 * @return string        Validated URL or empty string.
	 */
	public static function choice_image_url( array $choice ): string {
		$url = $choice['image'] ?? $choice['img'] ?? '';
		if ( ! is_string( $url ) || '' === $url ) {
			return '';
		}
		$clean = esc_url_raw( $url );
		return filter_var( $clean, FILTER_VALIDATE_URL ) ? esc_url( $clean ) : '';
	}

	// =========================================================================
	// PRICE DISPLAY HELPERS
	// =========================================================================

	/**
	 * Render a price display span for a field choice.
	 *
	 * Returns an empty string when $html is empty (free choice).
	 *
	 * @param  string $html      Pre-formatted WC price HTML from Pricing_Result.
	 * @param  array  $allowed   Allowed HTML tags map for wp_kses.
	 * @return string
	 */
	public static function price_display( string $html, array $allowed = [] ): string {
		if ( '' === $html ) {
			return '';
		}

		// wp_kses_post() allows del, ins, span, bdi — all tags emitted by wc_price()
		// and Pricing_Result::build_display_html(). Falls back to wp_kses() only
		// when the caller explicitly provides a non-empty custom tag map.
		$safe = ! empty( $allowed )
			? wp_kses( $html, $allowed )
			: wp_kses_post( $html );

		return '<span class="opt-field__price">' . $safe . '</span>';
	}

	// =========================================================================
	// QUANTITY INPUT
	// =========================================================================

	/**
	 * Render a quantity number input for a field choice.
	 *
	 * @param  string $node_id     Field node ID.
	 * @param  int    $option_idx  Choice index within the field.
	 * @param  int    $min         Minimum quantity (≥ 0).
	 * @param  int    $max         Maximum quantity (≥ 1).
	 * @return string
	 */
	public static function quantity_input(
		string $node_id,
		int $option_idx,
		int $min = 1,
		int $max = 100
	): string {
		$min = max( 0, $min );
		$max = max( 1, $max );
		if ( $max < $min ) {
			$max = $min + 1;
		}

		$attrs = self::attrs( [
			'type'          => 'number',
			'class'         => 'opt-qty-input',
			'min'           => $min,
			'max'           => $max,
			'value'         => $min,
			'data-node'     => esc_attr( $node_id ),
			'data-opt-idx'  => $option_idx,
		] );

		return '<input ' . $attrs . ' />';
	}
}
