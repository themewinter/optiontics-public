<?php
/**
 * Cart Mutator
 *
 * Applies validated addon selections to WooCommerce's cart and order
 * lifecycle: price adjustment, cart display, and order meta persistence.
 * Replaces the price/display/save methods that were mixed into Cart_Page.
 *
 * @package Optiontics\Core\Integrations\WooCommerce\Cart
 * @since   2.0.0
 */

namespace Optiontics\Core\Integrations\WooCommerce\Cart;

use Optiontics\Core\FieldUnits\Pricing\Pricing_Engine;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Cart_Mutator
 */
class Cart_Mutator {

	/**
	 * @var Pricing_Engine
	 */
	private Pricing_Engine $pricing;

	/**
	 * Cart item key that carries addon selections.
	 */
	private const CART_KEY = 'optiontics_selections';

	/**
	 * Order item meta key for the full addon JSON (internal).
	 */
	private const META_KEY_JSON = '_optiontics_addon_data';

	/**
	 * @param Pricing_Engine $pricing Pricing engine instance.
	 */
	public function __construct( Pricing_Engine $pricing ) {
		$this->pricing = $pricing;
	}

	// =========================================================================
	// CART ITEM DATA
	// =========================================================================

	/**
	 * Attach validated selections to a cart item and prevent cart item merging.
	 *
	 * @param  array $cart_item_data Existing cart data.
	 * @param  array $selections     Sanitised selections from Cart_Validator.
	 * @return array
	 */
	public function attach_to_cart_item( array $cart_item_data, array $selections ): array {
		if ( empty( $selections ) ) {
			return $cart_item_data;
		}

		$cart_item_data[ self::CART_KEY ] = $selections;
		// Unique key prevents WooCommerce from merging items with different addons.
		$cart_item_data['unique_key'] = md5( microtime() . wp_rand() );

		return $cart_item_data;
	}

	// =========================================================================
	// PRICE ADJUSTMENT
	// =========================================================================

	/**
	 * Add the cumulative addon cost to each affected cart item's price.
	 *
	 * Called from the woocommerce_before_calculate_totals hook.
	 *
	 * @param  \WC_Cart $cart WooCommerce cart object.
	 * @return void
	 */
	public function apply_price_adjustment( \WC_Cart $cart ): void {
		foreach ( $cart->get_cart() as $cart_item ) {
			if ( empty( $cart_item[ self::CART_KEY ] ) ) {
				continue;
			}

			$product   = $cart_item['data'] ?? null;
			if ( ! ( $product instanceof \WC_Product ) ) {
				continue;
			}

			$base      = (float) $product->get_price();
			$extra     = $this->pricing->total_from_selections( $cart_item[ self::CART_KEY ] );
			$new_price = $base + $extra;

			if ( abs( $new_price - $base ) > 0.0001 ) {
				$product->set_price( $new_price );
			}
		}
	}

	// =========================================================================
	// CART DISPLAY
	// =========================================================================

	/**
	 * Append addon rows to the cart/checkout item data display.
	 *
	 * @param  array $item_data Existing display rows.
	 * @param  array $cart_item Cart item array.
	 * @return array
	 */
	public function build_display_rows( array $item_data, array $cart_item ): array {
		$selections = $cart_item[ self::CART_KEY ] ?? [];

		if ( empty( $selections ) || ! is_array( $selections ) ) {
			return $item_data;
		}

		foreach ( $selections as $sel ) {
			$display_label = ! empty( $sel['group_label'] )
				? $sel['group_label']
				: ( $sel['field_label'] ?? esc_html__( 'Addon', 'optiontics' ) );

			$display_value = $this->resolve_display_value( $sel );
			$price_html    = function_exists( 'wc_price' ) ? wc_price( (float) ( $sel['price'] ?? 0 ) ) : '';
			$qty           = max( 1, (int) ( $sel['qty'] ?? 1 ) );

			$item_data[] = [
				// WooCommerce cart-item-data.php template renders $data['key'] directly
				// inside <dt> — wrapping in <strong> here makes it bold everywhere.
				'key'     => sprintf( '<strong>%s</strong>', esc_html( $display_label ) ),
				'display' => sprintf(
					'%s &times; %d &mdash; %s',
					esc_html( $display_value ),
					$qty,
					wp_kses_post( $price_html )
				),
			];
		}

		return $item_data;
	}

	// =========================================================================
	// ORDER META PERSISTENCE
	// =========================================================================

	/**
	 * Persist addon selections as order item meta when an order is created.
	 *
	 * @param  int   $item_id Order item ID.
	 * @param  array $values  Cart item values.
	 * @return void
	 */
	public function persist_to_order( int $item_id, array $values ): void {
		$selections = $values[ self::CART_KEY ] ?? [];

		if ( empty( $selections ) || ! is_array( $selections ) ) {
			return;
		}

		// Full JSON (hidden — leading underscore).
		wc_add_order_item_meta( $item_id, self::META_KEY_JSON, $selections );

		// Human-readable rows (no underscore → visible on order screens + emails).
		foreach ( $selections as $sel ) {
			$label        = ! empty( $sel['group_label'] ) ? $sel['group_label'] : ( $sel['field_label'] ?? 'Addon' );
			$display_val  = $this->resolve_display_value( $sel );
			$qty          = max( 1, (int) ( $sel['qty'] ?? 1 ) );
			$price_html   = function_exists( 'wc_price' ) ? wc_price( (float) ( $sel['price'] ?? 0 ) ) : '';

			wc_add_order_item_meta(
				$item_id,
				$label,
				sprintf(
					'<strong>%s</strong> × %d — %s',
					esc_html( $display_val ),
					$qty,
					wp_kses_post( $price_html )
				)
			);
		}
	}

	// =========================================================================
	// PRIVATE
	// =========================================================================

	/**
	 * Determine the display value for a selection entry.
	 *
	 * Multi-choice fields (checkbox, radio) show the choice label.
	 * Free-text fields show the submitted value.
	 *
	 * @param  array $sel Selection entry.
	 * @return string
	 */
	private function resolve_display_value( array $sel ): string {
		$multi_types = [ 'checkbox', 'radio', 'select', 'toggle', 'switch' ];

		if ( in_array( $sel['field_type'] ?? '', $multi_types, true ) ) {
			return ! empty( $sel['choice_label'] ) ? $sel['choice_label'] : ( $sel['value'] ?? '' );
		}

		return ! empty( $sel['value'] ) ? $sel['value'] : ( $sel['field_label'] ?? '' );
	}
}
