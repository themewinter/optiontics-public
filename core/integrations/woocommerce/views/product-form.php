<?php
/**
 * Product Form View
 *
 * Renders the addon field form on WooCommerce product pages.
 * Replaces Fields_View. Key differences:
 *  - Uses Component_Repository (new schema) instead of Product_Blocks_Service.
 *  - Uses Field_Renderer + Field_Type_Registry (new stack) instead of Block_Compiler.
 *  - Class name "Product_Form_View" expresses what it renders, not what it fetches.
 *  - Gallery hook kept for functional parity.
 *
 * @package Optiontics\Core\Integrations\WooCommerce\Views
 * @since   2.0.0
 */

namespace Optiontics\Core\Integrations\WooCommerce\Views;

use Optiontics\Core\FieldUnits\DTO\Render_Context;
use Optiontics\Core\FieldUnits\Support\Field_Renderer;
use Optiontics\Core\FieldUnits\Support\Field_Type_Registry;
use Optiontics\Core\Integrations\WooCommerce\Repository\Assignment_Resolver;
use Optiontics\Core\Integrations\WooCommerce\Repository\Component_Repository;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Product_Form_View
 */
class Product_Form_View {

	/**
	 * @var Component_Repository
	 */
	private Component_Repository $repository;

	/**
	 * @var Field_Renderer
	 */
	private Field_Renderer $renderer;

	/**
	 * Register WooCommerce hooks.
	 */
	public function __construct() {
		$registry         = new Field_Type_Registry();
		$this->renderer   = new Field_Renderer( $registry );
		$this->repository = new Component_Repository( new Assignment_Resolver() );

		add_action( 'woocommerce_before_add_to_cart_button',     [ $this, 'inject_addon_form' ],   100 );
		add_filter( 'woocommerce_product_get_gallery_image_ids', [ $this, 'merge_addon_gallery' ],  99, 2 );
	}

	// =========================================================================
	// HOOKS
	// =========================================================================

	/**
	 * Render the addon form above the add-to-cart button.
	 *
	 * @return void
	 */
	public function inject_addon_form(): void {
		global $product;

		if ( ! ( $product instanceof \WC_Product ) ) {
			return;
		}

		$product_id = $product->get_id();
		$data       = $this->repository->fetch_for_product( $product_id );

		if ( empty( $data['components'] ) ) {
			return;
		}

		$this->trigger_asset_hooks();

		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $this->build_form_html( $product, $data );
	}

	/**
	 * Merge addon gallery images into the product's gallery.
	 *
	 * @param  int[]       $gallery_ids Existing gallery image IDs.
	 * @param  \WC_Product $product     Product object.
	 * @return int[]
	 */
	public function merge_addon_gallery( array $gallery_ids, \WC_Product $product ): array {
		if ( ! ( $product instanceof \WC_Product ) ) {
			return $gallery_ids;
		}

		$data = $this->repository->fetch_for_product( $product->get_id() );

		if ( empty( $data['active_map'] ) ) {
			return $gallery_ids;
		}

		$image_data = get_option( 'optiontics_product_image_update_data', [] );

		if ( ! is_array( $image_data ) || empty( $image_data ) ) {
			return $gallery_ids;
		}

		$extra = [];
		foreach ( $data['active_map'] as $addon_id ) {
			if ( isset( $image_data[ $addon_id ] ) && is_array( $image_data[ $addon_id ] ) ) {
				$extra = array_merge( $extra, $image_data[ $addon_id ] );
			}
		}

		if ( empty( $extra ) ) {
			return $gallery_ids;
		}

		$merged = array_merge( $gallery_ids, array_filter( $extra, 'is_numeric' ) );
		return array_values( array_unique( $merged ) );
	}

	// =========================================================================
	// PRIVATE RENDERING
	// =========================================================================

	/**
	 * Build the full addon form HTML for a product.
	 *
	 * @param  \WC_Product $product WooCommerce product object.
	 * @param  array       $data    Component repository result.
	 * @return string
	 */
	private function build_form_html( \WC_Product $product, array $data ): string {
		$product_id    = $product->get_id();
		$currency_data = $this->currency_attrs( $product );
		$ctx           = new Render_Context( $product_id );

		$html  = '<div class="opt-addon-form" ' . $currency_data . '>';
		$html .= $this->nonce_field();
		$html .= $this->render_all_addons( $data, $ctx );
		$html .= $this->price_summary_html( $product );
		$html .= '</div>';

		return $html;
	}

	/**
	 * Build the data-* currency attributes string for the form wrapper.
	 *
	 * @param  \WC_Product $product Product for context.
	 * @return string
	 */
	private function currency_attrs( \WC_Product $product ): string {
		if ( ! function_exists( 'get_woocommerce_currency_symbol' ) ) {
			return '';
		}

		return sprintf(
			'data-currency="%s" data-decimal="%s" data-thousands="%s" data-decimals="%d" data-format="%s"',
			esc_attr( get_woocommerce_currency_symbol() ),
			esc_attr( wc_get_price_decimal_separator() ),
			esc_attr( wc_get_price_thousand_separator() ),
			(int) wc_get_price_decimals(),
			esc_attr( get_woocommerce_price_format() )
		);
	}

	/**
	 * Generate the WP nonce field for the addon form.
	 *
	 * @return string
	 */
	private function nonce_field(): string {
		ob_start();
		wp_nonce_field( 'optiontics_addon_form', 'optiontics_addon_form_nonce' );
		return (string) ob_get_clean();
	}

	/**
	 * Loop over each addon block and render its field units.
	 *
	 * @param  array          $data Repository result array.
	 * @param  Render_Context $ctx  Rendering environment.
	 * @return string
	 */
	private function render_all_addons( array $data, Render_Context $ctx ): string {
		$html = '';

		foreach ( $data['components'] as $addon_id => $raw_fields ) {
			if ( ! is_array( $raw_fields ) || empty( $raw_fields ) ) {
				continue;
			}

			$addon_id = absint( $addon_id );
			$html    .= $this->admin_edit_link( $addon_id );
			$html    .= $this->renderer->render_all( $raw_fields, $ctx );
		}

		return $html;
	}

	/**
	 * Render an admin-only "Edit Addon" link.
	 *
	 * @param  int $addon_id Addon block post ID.
	 * @return string
	 */
	private function admin_edit_link( int $addon_id ): string {
		$cap = (string) apply_filters( 'optiontics_demo_capability_check', 'manage_options' );

		if ( ! current_user_can( $cap ) || $addon_id <= 0 ) {
			return '';
		}

		$url = admin_url( 'admin.php?page=optiontics#/update/' . $addon_id );

		return sprintf(
			'<a class="opt-admin-edit-link" href="%s" target="_blank" rel="noopener noreferrer">%s</a>',
			esc_url( $url ),
			esc_html__( 'Edit Addon', 'optiontics' )
		);
	}

	/**
	 * Render the addons-price / total-price summary element.
	 *
	 * @param  \WC_Product $product WooCommerce product object.
	 * @return string
	 */
	private function price_summary_html( \WC_Product $product ): string {
		$base_price = (float) $product->get_price();

		return sprintf(
			'<div class="opt-price-summary">
				<div class="opt-price-summary__addons">
					<strong>%s:</strong>
					<span id="optiontics_option_price">%s</span>
				</div>
				<div class="opt-price-summary__total">
					<strong>%s:</strong>
					<span id="optiontics_option_total_price" data-base="%s">%s</span>
				</div>
			</div>',
			esc_html__( 'Addons Price', 'optiontics' ),
			function_exists( 'wc_price' ) ? wp_kses_post( wc_price( 0 ) ) : '0',
			esc_html__( 'Total', 'optiontics' ),
			esc_attr( $base_price ),
			function_exists( 'wc_price' ) ? wp_kses_post( wc_price( $base_price ) ) : esc_html( $base_price )
		);
	}

	/**
	 * Trigger asset enqueue hooks.
	 *
	 * @return void
	 */
	private function trigger_asset_hooks(): void {
		do_action( 'optiontics_enqueue_block_css' );
		do_action( 'optiontics_enqueue_block_js' );

		if ( wp_doing_ajax() ) {
			do_action( 'optiontics_load_script_on_ajax' );
		}
	}
}
