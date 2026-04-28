<?php
/**
 * Product REST Controller
 *
 * @package Optiontics\Core\Integrations\WooCommerce\Products\Controllers
 * @since   1.0.0
 */

namespace Optiontics\Core\Integrations\WooCommerce\Products\Controllers;

use Optiontics\Abstract\Base_Rest_Controller;
use WP_Error;
use WP_HTTP_Response;
use WP_REST_Server;
use WP_REST_Request;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Product_Controller
 *
 * Provides read-only REST endpoints for WooCommerce products.
 * Endpoint: optiontics/v1/products
 */
class Product_Controller extends Base_Rest_Controller {

	/** @var string */
	protected $namespace = 'optiontics/v1';

	/** @var string */
	protected $rest_base = 'products';

	/**
	 * {@inheritdoc}
	 */
	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_items' ],
					'permission_callback' => [ $this, 'get_items_permissions_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<id>[\d]+)',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_item' ],
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
					'args'                => [
						'context' => $this->get_context_param( [ 'default' => 'view' ] ),
					],
				],
			]
		);
	}

	/**
	 * GET /products
	 *
	 * @param WP_REST_Request $request
	 * @return WP_HTTP_Response|WP_Error
	 */
	public function get_items( $request ) {
		$per_page = (int) $request->get_param( 'per_page' );
		$per_page = $per_page > 0 ? min( $per_page, 100 ) : 25;

		$args = [
			'limit'   => $per_page,
			'page'    => absint( $request->get_param( 'page' ) ) ?: 1,
			'orderby' => $request->get_param( 'orderby' ) ?: 'date',
			'order'   => $request->get_param( 'order' )   ?: 'DESC',
			'status'  => 'publish',
		];

		// Vendors see only their own products.
		if ( optiontics_is_dokan_vendor() && ! current_user_can( 'manage_options' ) ) {
			$args['author'] = get_current_user_id();
		}

		if ( $request->get_param( 'category' ) ) {
			$args['category'] = [ sanitize_text_field( $request->get_param( 'category' ) ) ];
		}

		if ( $request->get_param( 'search' ) ) {
			$args['s'] = sanitize_text_field( $request->get_param( 'search' ) );
		}

		if ( $request->get_param( 'include' ) ) {
			$args['include'] = $request->get_param( 'include' );
		}

		if ( $request->get_param( 'exclude' ) ) {
			// phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_exclude
			$args['exclude'] = $request->get_param( 'exclude' );
		}

		$products = wc_get_products( $args );
		$data     = array_map( [ $this, 'prepare_product_data' ], $products );

		return $this->response( $data );
	}

	/**
	 * GET /products/{id}
	 *
	 * @param WP_REST_Request $request
	 * @return WP_HTTP_Response|WP_Error
	 */
	public function get_item( $request ) {
		$product = wc_get_product( (int) $request->get_param( 'id' ) );

		if ( ! $product || $product->get_status() !== 'publish' ) {
			return $this->error( __( 'Product not found', 'optiontics' ), 404 );
		}

		return $this->response( $this->prepare_product_data( $product ) );
	}

	/** @return bool */ public function get_items_permissions_check( $request ): bool { return true; }
	/** @return bool */ public function get_item_permissions_check( $request ): bool  { return true; }

	// =========================================================================
	// PRIVATE HELPERS
	// =========================================================================

	/**
	 * Shape a WC_Product into the REST response array.
	 *
	 * @param \WC_Product $product
	 * @return array
	 */
	private function prepare_product_data( $product ): array {
		$data = [
			'id'                 => $product->get_id(),
			'name'               => $product->get_name(),
			'slug'               => $product->get_slug(),
			'permalink'          => $product->get_permalink(),
			'date_created'       => wc_rest_prepare_date_response( $product->get_date_created() ),
			'date_modified'      => wc_rest_prepare_date_response( $product->get_date_modified() ),
			'type'               => $product->get_type(),
			'status'             => $product->get_status(),
			'featured'           => $product->get_featured(),
			'catalog_visibility' => $product->get_catalog_visibility(),
			'description'        => $product->get_description(),
			'short_description'  => $product->get_short_description(),
			'sku'                => $product->get_sku(),
			'price'              => $product->get_price(),
			'regular_price'      => $product->get_regular_price(),
			'sale_price'         => $product->get_sale_price(),
			'price_html'         => $product->get_price_html(),
			'on_sale'            => $product->is_on_sale(),
			'purchasable'        => $product->is_purchasable(),
			'total_sales'        => $product->get_total_sales(),
			'virtual'            => $product->is_virtual(),
			'downloadable'       => $product->is_downloadable(),
			'tax_status'         => $product->get_tax_status(),
			'tax_class'          => $product->get_tax_class(),
			'manage_stock'       => $product->managing_stock(),
			'stock_quantity'     => $product->get_stock_quantity(),
			'stock_status'       => $product->get_stock_status(),
			'backorders'         => $product->get_backorders(),
			'backorders_allowed' => $product->backorders_allowed(),
			'backordered'        => $product->is_on_backorder(),
			'sold_individually'  => $product->is_sold_individually(),
			'weight'             => $product->get_weight(),
			'dimensions'         => [
				'length' => $product->get_length(),
				'width'  => $product->get_width(),
				'height' => $product->get_height(),
			],
			'shipping_required'  => $product->needs_shipping(),
			'shipping_class'     => $product->get_shipping_class(),
			'shipping_class_id'  => $product->get_shipping_class_id(),
			'reviews_allowed'    => $product->get_reviews_allowed(),
			'average_rating'     => $product->get_average_rating(),
			'rating_count'       => $product->get_rating_count(),
			'related_ids'        => array_map( 'absint', array_values( wc_get_related_products( $product->get_id() ) ) ),
			'upsell_ids'         => array_map( 'absint', $product->get_upsell_ids() ),
			'cross_sell_ids'     => array_map( 'absint', $product->get_cross_sell_ids() ),
			'parent_id'          => $product->get_parent_id(),
			'purchase_note'      => $product->get_purchase_note(),
			'categories'         => $this->get_taxonomy_terms( $product, 'product_cat' ),
			'tags'               => $this->get_taxonomy_terms( $product, 'product_tag' ),
			'images'             => $this->get_images( $product ),
			'attributes'         => $this->get_attributes( $product ),
			'default_attributes' => $this->get_default_attributes( $product ),
			'variations'         => [],
			'grouped_products'   => [],
			'menu_order'         => $product->get_menu_order(),
			'meta_data'          => $this->filter_public_meta( $product->get_meta_data() ),
		];

		if ( $product->is_type( 'variable' ) ) {
			foreach ( $product->get_children() as $variation_id ) {
				$variation = wc_get_product( $variation_id );
				if ( $variation ) {
					$data['variations'][] = $this->prepare_variation_data( $variation );
				}
			}
		}

		if ( $product->is_type( 'grouped' ) ) {
			foreach ( $product->get_children() as $grouped_id ) {
				$grouped = wc_get_product( $grouped_id );
				if ( $grouped ) {
					$data['grouped_products'][] = [
						'id'    => $grouped->get_id(),
						'name'  => $grouped->get_name(),
						'slug'  => $grouped->get_slug(),
						'price' => $grouped->get_price(),
					];
				}
			}
		}

		return $data;
	}

	/**
	 * Shape a variation into a compact array.
	 *
	 * @param \WC_Product_Variation $variation
	 * @return array
	 */
	private function prepare_variation_data( $variation ): array {
		return [
			'id'                 => $variation->get_id(),
			'date_created'       => wc_rest_prepare_date_response( $variation->get_date_created() ),
			'date_modified'      => wc_rest_prepare_date_response( $variation->get_date_modified() ),
			'permalink'          => $variation->get_permalink(),
			'sku'                => $variation->get_sku(),
			'price'              => $variation->get_price(),
			'regular_price'      => $variation->get_regular_price(),
			'sale_price'         => $variation->get_sale_price(),
			'on_sale'            => $variation->is_on_sale(),
			'purchasable'        => $variation->is_purchasable(),
			'virtual'            => $variation->is_virtual(),
			'downloadable'       => $variation->is_downloadable(),
			'tax_status'         => $variation->get_tax_status(),
			'tax_class'          => $variation->get_tax_class(),
			'manage_stock'       => $variation->managing_stock(),
			'stock_quantity'     => $variation->get_stock_quantity(),
			'stock_status'       => $variation->get_stock_status(),
			'backorders'         => $variation->get_backorders(),
			'backorders_allowed' => $variation->backorders_allowed(),
			'backordered'        => $variation->is_on_backorder(),
			'weight'             => $variation->get_weight(),
			'dimensions'         => [
				'length' => $variation->get_length(),
				'width'  => $variation->get_width(),
				'height' => $variation->get_height(),
			],
			'shipping_class'     => $variation->get_shipping_class(),
			'shipping_class_id'  => $variation->get_shipping_class_id(),
			'image'              => $this->get_images( $variation ),
			'attributes'         => $this->get_variation_attributes( $variation ),
		];
	}

	/**
	 * Filter out private / internal meta before shipping to a public endpoint.
	 * By convention (core, WC, most plugins) keys prefixed with `_` are not
	 * intended for frontend consumption and can carry vendor-only data.
	 *
	 * @param  array $meta Raw meta_data array from WC_Product::get_meta_data().
	 * @return array
	 */
	private function filter_public_meta( array $meta ): array {
		$public = [];

		foreach ( $meta as $entry ) {
			$data = method_exists( $entry, 'get_data' ) ? $entry->get_data() : (array) $entry;
			$key  = (string) ( $data['key'] ?? '' );
			if ( '' === $key || 0 === strpos( $key, '_' ) ) {
				continue;
			}
			$public[] = $entry;
		}

		/**
		 * Filter the public product meta payload just before it's returned.
		 * Sites can further trim or add keys here.
		 *
		 * @param array $public  Meta entries that will be exposed.
		 * @param array $raw     Original full meta set.
		 */
		return (array) apply_filters( 'optiontics_product_public_meta', $public, $meta );
	}

	/**
	 * @param \WC_Product $product
	 * @param string      $taxonomy
	 * @return array
	 */
	private function get_taxonomy_terms( $product, string $taxonomy ): array {
		$terms = get_the_terms( $product->get_id(), $taxonomy );
		if ( ! $terms || is_wp_error( $terms ) ) {
			return [];
		}

		return array_map( static function ( $term ) {
			return [
				'id'          => $term->term_id,
				'name'        => $term->name,
				'slug'        => $term->slug,
				'description' => $term->description,
				'count'       => $term->count,
			];
		}, $terms );
	}

	/**
	 * @param \WC_Product $product
	 * @return array
	 */
	private function get_images( $product ): array {
		$images         = [];
		$attachment_ids = array_merge( [ $product->get_image_id() ], $product->get_gallery_image_ids() );

		foreach ( $attachment_ids as $attachment_id ) {
			if ( ! $attachment_id ) {
				continue;
			}
			$attachment = get_post( $attachment_id );
			if ( ! $attachment ) {
				continue;
			}
			$images[] = [
				'id'            => (int) $attachment_id,
				'date_created'  => wc_rest_prepare_date_response( $attachment->post_date_gmt ),
				'date_modified' => wc_rest_prepare_date_response( $attachment->post_modified_gmt ),
				'src'           => wp_get_attachment_url( $attachment_id ),
				'name'          => get_the_title( $attachment ),
				'alt'           => get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ),
			];
		}

		return $images;
	}

	/**
	 * @param \WC_Product $product
	 * @return array
	 */
	private function get_attributes( $product ): array {
		return array_map( static function ( $attribute ) {
			return [
				'id'        => $attribute->get_id(),
				'name'      => $attribute->get_name(),
				'position'  => $attribute->get_position(),
				'visible'   => $attribute->get_visible(),
				'variation' => $attribute->get_variation(),
				'options'   => $attribute->get_options(),
			];
		}, $product->get_attributes() );
	}

	/**
	 * @param \WC_Product $product
	 * @return array
	 */
	private function get_default_attributes( $product ): array {
		$result = [];
		foreach ( $product->get_default_attributes() as $attribute ) {
			if ( ! is_array( $attribute ) ) {
				continue;
			}
			$result[] = [
				'id'     => $attribute['id']     ?? '',
				'name'   => $attribute['name']   ?? '',
				'option' => $attribute['option'] ?? '',
			];
		}
		return $result;
	}

	/**
	 * @param \WC_Product_Variation $variation
	 * @return array
	 */
	private function get_variation_attributes( $variation ): array {
		$result = [];
		foreach ( $variation->get_variation_attributes() as $name => $value ) {
			$result[] = [ 'name' => $name, 'value' => $value ];
		}
		return $result;
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_collection_params() {
		return [
			'page'     => [
				'description'       => __( 'Current page of the collection.', 'optiontics' ),
				'type'              => 'integer',
				'default'           => 1,
				'minimum'           => 1,
				'sanitize_callback' => 'absint',
				'validate_callback' => 'rest_validate_request_arg',
			],
			'search'   => [
				'description'       => __( 'Limit results to those matching a string.', 'optiontics' ),
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
				'validate_callback' => 'rest_validate_request_arg',
			],
			'category' => [
				'description'       => __( 'Limit result set to products assigned a specific category ID.', 'optiontics' ),
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
				'validate_callback' => 'rest_validate_request_arg',
			],
			'include'  => [
				'description'       => __( 'Limit result set to specific IDs.', 'optiontics' ),
				'type'              => 'array',
				'items'             => [ 'type' => 'integer' ],
				'default'           => [],
				'sanitize_callback' => 'wp_parse_id_list',
			],
			// phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_exclude
			'exclude'  => [
				'description'       => __( 'Ensure result set excludes specific IDs.', 'optiontics' ),
				'type'              => 'array',
				'items'             => [ 'type' => 'integer' ],
				'default'           => [],
				'sanitize_callback' => 'wp_parse_id_list',
			],
			'orderby'  => [
				'description'       => __( 'Sort collection by object attribute.', 'optiontics' ),
				'type'              => 'string',
				'default'           => 'date',
				'enum'              => [ 'date', 'id', 'include', 'title', 'slug', 'price', 'popularity', 'rating', 'menu_order' ],
				'sanitize_callback' => 'sanitize_key',
				'validate_callback' => 'rest_validate_request_arg',
			],
			'order'    => [
				'description'       => __( 'Order sort attribute ascending or descending.', 'optiontics' ),
				'type'              => 'string',
				'default'           => 'DESC',
				'enum'              => [ 'ASC', 'DESC' ],
				'sanitize_callback' => 'sanitize_key',
				'validate_callback' => 'rest_validate_request_arg',
			],
		];
	}
}
