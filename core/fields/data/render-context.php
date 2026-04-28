<?php
/**
 * Render Context DTO
 *
 * Bundles all environment data a field unit needs to produce its HTML output.
 * Passed explicitly to Field_Unit_Interface::output() so field types remain
 * stateless — they never store product_id or currency as instance properties.
 *
 * @package Optiontics\Core\FieldUnits\DTO
 * @since   2.0.0
 */

namespace Optiontics\Core\FieldUnits\DTO;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Render_Context
 *
 * Immutable rendering environment. Constructed once per product page render
 * and reused for every field unit on that product.
 */
final class Render_Context {

	/**
	 * WooCommerce product ID.
	 *
	 * @var int
	 */
	public readonly int $product_id;

	/**
	 * Allowed HTML tag map for wp_kses() calls in field output.
	 *
	 * @var array<string, array<string, bool>>
	 */
	public readonly array $allowed_html;

	/**
	 * WooCommerce currency display settings.
	 *
	 * Keys: symbol, format, decimal_sep, thousand_sep, num_decimals.
	 *
	 * @var array<string, mixed>
	 */
	public readonly array $currency;

	/**
	 * Maximum number of field units to render per call.
	 * Prevents runaway loops from malformed data.
	 *
	 * @var int
	 */
	public readonly int $render_limit;

	/**
	 * Product base price (regular or sale) used by percentage pricing strategies.
	 *
	 * @var float
	 */
	public readonly float $base_price;

	/**
	 * @param int   $product_id  WooCommerce product ID (must be > 0).
	 * @param array $allowed_html Tag map for wp_kses; defaults via filter.
	 * @param int   $render_limit Max fields per render pass; default 100.
	 */
	public function __construct(
		int $product_id,
		array $allowed_html = [],
		int $render_limit = 100
	) {
		if ( $product_id <= 0 ) {
			throw new \InvalidArgumentException( 'Render_Context requires a positive product_id.' );
		}

		$this->product_id   = $product_id;
		$this->allowed_html = $this->resolve_allowed_html( $allowed_html );
		$this->currency     = $this->resolve_currency();
		$this->render_limit = max( 1, $render_limit );

		$product          = function_exists( 'wc_get_product' ) ? wc_get_product( $product_id ) : null;
		$this->base_price = ( $product instanceof \WC_Product ) ? (float) $product->get_price() : 0.0;
	}

	// =========================================================================
	// PRIVATE HELPERS
	// =========================================================================

	/**
	 * Resolve allowed HTML from parameter or filter, sanitise keys.
	 *
	 * @param  array $provided Caller-supplied tag map.
	 * @return array
	 */
	private function resolve_allowed_html( array $provided ): array {
		$tags = ! empty( $provided )
			? $provided
			: apply_filters( 'optiontics_allowed_html_tags', [] );

		if ( ! is_array( $tags ) ) {
			return [];
		}

		$clean = [];
		foreach ( $tags as $tag => $attrs ) {
			$clean[ sanitize_key( (string) $tag ) ] = is_array( $attrs )
				? array_fill_keys( array_map( 'sanitize_key', array_keys( $attrs ) ), true )
				: [];
		}

		return $clean;
	}

	/**
	 * Build the WooCommerce currency data array for this request.
	 *
	 * @return array<string, mixed>
	 */
	private function resolve_currency(): array {
		if ( ! function_exists( 'get_woocommerce_currency_symbol' ) ) {
			return [
				'symbol'       => '',
				'format'       => '%s%v',
				'decimal_sep'  => '.',
				'thousand_sep' => ',',
				'num_decimals' => 2,
			];
		}

		return [
			'symbol'       => get_woocommerce_currency_symbol(),
			'format'       => get_woocommerce_price_format(),
			'decimal_sep'  => wc_get_price_decimal_separator(),
			'thousand_sep' => wc_get_price_thousand_separator(),
			'num_decimals' => wc_get_price_decimals(),
		];
	}
}
