<?php
/**
 * Pricing Result DTO
 *
 * Immutable value object returned by every Price_Strategy_Interface
 * implementation. Carries the effective price, sale state, and the
 * pre-formatted WooCommerce price HTML.
 *
 * @package Optiontics\Core\FieldUnits\DTO
 * @since   2.0.0
 */

namespace Optiontics\Core\FieldUnits\DTO;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Pricing_Result
 */
final class Pricing_Result {

	/**
	 * Effective unit price (sale price when active, otherwise regular price).
	 *
	 * @var float
	 */
	public readonly float $effective_price;

	/**
	 * Regular (non-sale) price.
	 *
	 * @var float
	 */
	public readonly float $regular_price;

	/**
	 * Sale price (0.0 when no sale is active).
	 *
	 * @var float
	 */
	public readonly float $sale_price;

	/**
	 * Whether a sale price is currently active.
	 *
	 * @var bool
	 */
	public readonly bool $on_sale;

	/**
	 * Whether this field choice carries any cost at all.
	 *
	 * @var bool
	 */
	public readonly bool $has_cost;

	/**
	 * Price type slug (e.g. 'flat', 'percentage', 'no_cost').
	 *
	 * @var string
	 */
	public readonly string $price_type;

	/**
	 * Total price after applying quantity multiplier.
	 *
	 * @var float
	 */
	public readonly float $total_price;

	/**
	 * WooCommerce-formatted HTML price string (including del/ins tags on sale).
	 *
	 * @var string
	 */
	public readonly string $display_html;

	/**
	 * @param string $price_type      Type slug.
	 * @param float  $regular_price   Regular price.
	 * @param float  $sale_price      Sale price, 0 if none.
	 * @param int    $quantity        Quantity multiplier.
	 * @param string $display_html    Pre-formatted WC price HTML.
	 */
	public function __construct(
		string $price_type,
		float $regular_price,
		float $sale_price,
		int $quantity = 1,
		string $display_html = ''
	) {
		$this->price_type    = $price_type;
		$this->regular_price = max( 0.0, $regular_price );
		$this->sale_price    = max( 0.0, $sale_price );
		$this->on_sale       = $this->sale_price > 0.0 && $this->sale_price < $this->regular_price;
		$this->effective_price = $this->on_sale ? $this->sale_price : $this->regular_price;
		$this->has_cost      = 'no_cost' !== $price_type && $this->effective_price > 0.0;
		$qty                 = max( 1, $quantity );
		$this->total_price   = $this->effective_price * $qty;
		$this->display_html  = $display_html !== '' ? $display_html : $this->build_display_html();
	}

	/**
	 * Create a "free / no cost" result for fields with no pricing.
	 *
	 * @return self
	 */
	public static function free(): self {
		return new self( 'no_cost', 0.0, 0.0 );
	}

	/**
	 * Build the display HTML string using WooCommerce price helpers.
	 *
	 * Shows struck-through regular + highlighted sale price when on sale.
	 *
	 * @return string Safe HTML.
	 */
	private function build_display_html(): string {
		if ( ! $this->has_cost || ! function_exists( 'wc_price' ) ) {
			return '';
		}

		if ( $this->on_sale ) {
			return sprintf(
				'<del>%s</del>&nbsp;<ins>%s</ins>',
				wc_price( $this->regular_price ),
				wc_price( $this->effective_price )
			);
		}

		return wc_price( $this->effective_price );
	}
}
