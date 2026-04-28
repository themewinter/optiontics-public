<?php
/**
 * Addon Cart Handler
 *
 * Thin WooCommerce hook wiring layer. Delegates all work to
 * Cart_Validator (what is valid?) and Cart_Mutator (what changes?).
 * Replaces the old monolithic Cart_Page class.
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
 * Class Addon_Cart_Handler
 */
class Addon_Cart_Handler {

	/**
	 * @var Cart_Validator
	 */
	private Cart_Validator $validator;

	/**
	 * @var Cart_Mutator
	 */
	private Cart_Mutator $mutator;

	/**
	 * Boot the cart handler and register WooCommerce hooks.
	 */
	public function __construct() {
		$this->validator = new Cart_Validator();
		$this->mutator   = new Cart_Mutator( new Pricing_Engine() );

		add_filter( 'woocommerce_add_cart_item_data',      [ $this, 'on_add_to_cart' ],     20, 3 );
		add_action( 'woocommerce_before_calculate_totals', [ $this, 'on_calculate_totals' ], 20, 1 );
		add_filter( 'woocommerce_get_item_data',           [ $this, 'on_get_item_data' ],    10, 2 );
		add_action( 'woocommerce_add_order_item_meta',     [ $this, 'on_save_order_meta' ],  10, 2 );
	}

	// =========================================================================
	// HOOKS
	// =========================================================================

	/**
	 * Capture and attach addon selections when an item is added to the cart.
	 *
	 * @param  array $cart_item_data Existing cart item data.
	 * @param  int   $product_id     Product ID.
	 * @param  int   $variation_id   Variation ID.
	 * @return array
	 */
	public function on_add_to_cart( array $cart_item_data, int $product_id, int $variation_id ): array {
		$selections = $this->validator->validated_selections();

		if ( empty( $selections ) ) {
			return $cart_item_data;
		}

		return $this->mutator->attach_to_cart_item( $cart_item_data, $selections );
	}

	/**
	 * Adjust cart item prices to include addon cost.
	 *
	 * @param  \WC_Cart $cart Cart object.
	 * @return void
	 */
	public function on_calculate_totals( \WC_Cart $cart ): void {
		if ( is_admin() && ! defined( 'DOING_AJAX' ) ) {
			return;
		}

		// Guard against double-firing on the same request.
		if ( did_action( 'woocommerce_before_calculate_totals' ) > 1 ) {
			return;
		}

		$this->mutator->apply_price_adjustment( $cart );
	}

	/**
	 * Add addon detail rows to cart/checkout item display.
	 *
	 * @param  array $item_data Existing display rows.
	 * @param  array $cart_item Cart item array.
	 * @return array
	 */
	public function on_get_item_data( array $item_data, array $cart_item ): array {
		return $this->mutator->build_display_rows( $item_data, $cart_item );
	}

	/**
	 * Persist addon data to the order when checkout is completed.
	 *
	 * @param  int   $item_id Order item ID.
	 * @param  array $values  Cart item values.
	 * @return void
	 */
	public function on_save_order_meta( int $item_id, array $values ): void {
		$this->mutator->persist_to_order( $item_id, $values );
	}
}
