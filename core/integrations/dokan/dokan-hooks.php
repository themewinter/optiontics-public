<?php
/**
 * Dokan Hooks
 *
 * Integrates Optiontics addon data into the Dokan vendor order detail view.
 *
 * @package Optiontics\Core\Integrations\Dokan
 * @since   1.0.0
 */

namespace Optiontics\Core\Integrations\Dokan;

use Optiontics\Contracts\Hookable_Service_Contract;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Dokan_Hooks
 *
 * Displays addon line-item data inside the Dokan vendor dashboard
 * order detail page.
 */
class Dokan_Hooks implements Hookable_Service_Contract {

	/**
	 * Register WordPress / Dokan hooks.
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'dokan_order_detail_after_order_items', [ $this, 'enqueue_addon_script' ], 10, 1 );
	}

	/**
	 * Enqueue the addon display script and pass localised order data to JS.
	 *
	 * @param \WC_Order $order The current order object.
	 * @return void
	 */
	public function enqueue_addon_script( $order ) {
		if ( ! $order instanceof \WC_Order ) {
			return;
		}

		$items_with_addons = [];

		foreach ( $order->get_items() as $item_id => $item ) {
			$addon_data = wc_get_order_item_meta( $item_id, '_custom_addons_data', true );

			if ( empty( $addon_data ) || ! is_array( $addon_data ) ) {
				continue;
			}

			$addon_rows_html = '';

			foreach ( $addon_data as $addon ) {
				$label = ! empty( $addon['group'] ) ? $addon['group'] : ( $addon['label'] ?? 'Addon' );
				$qty   = isset( $addon['qty'] )   ? intval( $addon['qty'] )   : 1;
				$price = isset( $addon['price'] ) ? floatval( $addon['price'] ) : 0.0;

				if ( in_array( $addon['type'], [ 'text', 'textarea', 'telephone', 'number', 'switch', 'select' ], true ) && ! empty( $addon['value'] ) ) {
					$display_value = $addon['value'];
				} elseif ( in_array( $addon['type'], [ 'checkbox', 'radio' ], true ) && ! empty( $addon['optionLabel'] ) ) {
					$display_value = $addon['optionLabel'];
				} else {
					$display_value = ! empty( $addon['label'] ) ? $addon['label'] : '';
				}

				$addon_rows_html .= sprintf(
					'<div>%s: %s × %d — %s</div>',
					esc_html( $label ),
					esc_html( $display_value ),
					$qty,
					wc_price( $price )
				);
			}

			$items_with_addons[ $item_id ] = $addon_rows_html;
		}

		if ( empty( $items_with_addons ) ) {
			return;
		}

		wp_enqueue_script( 'optiontics-dokan-order-addons' );

		wp_localize_script(
			'optiontics-dokan-order-addons',
			'optionticsDokanAddons',
			[ 'items' => $items_with_addons ]
		);
	}
}
