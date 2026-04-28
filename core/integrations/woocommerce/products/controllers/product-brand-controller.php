<?php
/**
 * Product Brand REST Controller
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
 * Class Product_Brand_Controller
 *
 * Provides read-only REST endpoints for WooCommerce product brands.
 * Endpoint: optiontics/v1/product-brands
 */
class Product_Brand_Controller extends Base_Rest_Controller {

	/** @var string */
	protected $namespace = 'optiontics/v1';

	/** @var string */
	protected $rest_base = 'product-brands';

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
	 * GET /product-brands
	 *
	 * @param WP_REST_Request $request
	 * @return WP_HTTP_Response|WP_Error
	 */
	public function get_items( $request ) {
		$per_page = absint( $request->get_param( 'per_page' ) ) ?: 10;
		$page     = absint( $request->get_param( 'page' ) )     ?: 1;

		$args = [
			'taxonomy'   => 'product_brand',
			'hide_empty' => rest_sanitize_boolean( $request->get_param( 'hide_empty' ) ),
			'orderby'    => $request->get_param( 'orderby' ) ?: 'name',
			'order'      => $request->get_param( 'order' )   ?: 'ASC',
			'number'     => $per_page,
			'offset'     => ( $page - 1 ) * $per_page,
		];

		if ( $request->get_param( 'search' ) ) {
			$args['name__like'] = sanitize_text_field( $request->get_param( 'search' ) );
		}

		if ( $request->get_param( 'include' ) ) {
			$args['include'] = $request->get_param( 'include' );
		}

		if ( $request->get_param( 'exclude' ) ) {
			// phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_exclude
			$args['exclude'] = $request->get_param( 'exclude' );
		}

		$brands = get_terms( $args );

		if ( is_wp_error( $brands ) ) {
			return $this->error( __( 'Error retrieving brands', 'optiontics' ), 500 );
		}

		$brands = $this->filter_vendor_brands( $brands );
		$data   = array_map( [ $this, 'prepare_brand_data' ], $brands );

		return $this->response( $data );
	}

	/**
	 * GET /product-brands/{id}
	 *
	 * @param WP_REST_Request $request
	 * @return WP_HTTP_Response|WP_Error
	 */
	public function get_item( $request ) {
		$brand = get_term( (int) $request->get_param( 'id' ), 'product_brand' );

		if ( ! $brand || is_wp_error( $brand ) ) {
			return $this->error( __( 'Brand not found', 'optiontics' ), 404 );
		}

		return $this->response( $this->prepare_brand_data( $brand ) );
	}

	/** @return bool */ public function get_items_permissions_check( $request ): bool { return true; }
	/** @return bool */ public function get_item_permissions_check( $request ): bool  { return true; }

	// =========================================================================
	// PRIVATE HELPERS
	// =========================================================================

	/**
	 * For Dokan vendors, restrict to brands that contain their products.
	 *
	 * @param array $brands
	 * @return array
	 */
	private function filter_vendor_brands( $brands ): array {
		if ( ! optiontics_is_dokan_vendor() || current_user_can( 'manage_options' ) ) {
			return $brands;
		}

		$vendor_product_ids = $this->get_vendor_product_ids();
		if ( empty( $vendor_product_ids ) ) {
			return [];
		}

		$filtered = [];
		foreach ( $brands as $brand ) {
			$matches = get_posts( [
				'post_type'      => 'product',
				'posts_per_page' => 1,
				'post__in'       => $vendor_product_ids,
				// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
				'tax_query'      => [
					[
						'taxonomy' => 'product_brand',
						'field'    => 'term_id',
						'terms'    => $brand->term_id,
					],
				],
				'fields'         => 'ids',
			] );

			if ( ! empty( $matches ) ) {
				$filtered[] = $brand;
			}
		}

		return $filtered;
	}

	/**
	 * Return the current vendor's published product IDs.
	 *
	 * @return int[]
	 */
	private function get_vendor_product_ids(): array {
		return wc_get_products( [
			'author' => get_current_user_id(),
			'limit'  => -1,
			'return' => 'ids',
		] );
	}

	/**
	 * Shape a WP_Term (product_brand) into the REST response array.
	 *
	 * @param \WP_Term $brand
	 * @return array
	 */
	private function prepare_brand_data( $brand ): array {
		$display_type = get_term_meta( $brand->term_id, 'display_type', true );
		$menu_order   = get_term_meta( $brand->term_id, 'order', true );
		$image_id     = get_term_meta( $brand->term_id, 'thumbnail_id', true );
		$image        = $this->prepare_term_image( $image_id );

		$data = [
			'id'          => (int) $brand->term_id,
			'name'        => $brand->name,
			'slug'        => $brand->slug,
			'parent'      => (int) $brand->parent,
			'description' => $brand->description,
			'display'     => $display_type ?: 'default',
			'image'       => $image,
			'menu_order'  => (int) $menu_order,
			'count'       => (int) $brand->count,
			'permalink'   => get_term_link( $brand, 'product_brand' ),
		];

		$children = get_terms( [
			'taxonomy'   => 'product_brand',
			'parent'     => $brand->term_id,
			'hide_empty' => false,
		] );

		$data['children'] = [];
		if ( ! is_wp_error( $children ) ) {
			foreach ( $children as $child ) {
				$data['children'][] = [
					'id'        => (int) $child->term_id,
					'name'      => $child->name,
					'slug'      => $child->slug,
					'count'     => (int) $child->count,
					'permalink' => get_term_link( $child, 'product_brand' ),
				];
			}
		}

		return $data;
	}

	/**
	 * Build image array from attachment ID, or null.
	 *
	 * @param int|string $image_id
	 * @return array|null
	 */
	private function prepare_term_image( $image_id ): ?array {
		if ( ! $image_id ) {
			return null;
		}
		$attachment = get_post( $image_id );
		if ( ! $attachment ) {
			return null;
		}
		return [
			'id'            => (int) $image_id,
			'date_created'  => wc_rest_prepare_date_response( $attachment->post_date_gmt ),
			'date_modified' => wc_rest_prepare_date_response( $attachment->post_modified_gmt ),
			'src'           => wp_get_attachment_url( $image_id ),
			'name'          => get_the_title( $attachment ),
			'alt'           => get_post_meta( $image_id, '_wp_attachment_image_alt', true ),
		];
	}

	/**
	 * {@inheritdoc}
	 */
	public function get_collection_params() {
		return [
			'page'       => [
				'description'       => __( 'Current page of the collection.', 'optiontics' ),
				'type'              => 'integer',
				'default'           => 1,
				'minimum'           => 1,
				'sanitize_callback' => 'absint',
				'validate_callback' => 'rest_validate_request_arg',
			],
			'per_page'   => [
				'description'       => __( 'Maximum number of items to be returned in result set.', 'optiontics' ),
				'type'              => 'integer',
				'default'           => 10,
				'minimum'           => 1,
				'maximum'           => 100,
				'sanitize_callback' => 'absint',
				'validate_callback' => 'rest_validate_request_arg',
			],
			'search'     => [
				'description'       => __( 'Limit results to those matching a string.', 'optiontics' ),
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
				'validate_callback' => 'rest_validate_request_arg',
			],
			'parent'     => [
				'description'       => __( 'Limit result set to brands assigned a specific parent.', 'optiontics' ),
				'type'              => 'integer',
				'sanitize_callback' => 'absint',
				'validate_callback' => 'rest_validate_request_arg',
			],
			'include'    => [
				'description'       => __( 'Limit result set to specific IDs.', 'optiontics' ),
				'type'              => 'array',
				'items'             => [ 'type' => 'integer' ],
				'default'           => [],
				'sanitize_callback' => 'wp_parse_id_list',
			],
			// phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_exclude
			'exclude'    => [
				'description'       => __( 'Ensure result set excludes specific IDs.', 'optiontics' ),
				'type'              => 'array',
				'items'             => [ 'type' => 'integer' ],
				'default'           => [],
				'sanitize_callback' => 'wp_parse_id_list',
			],
			'hide_empty' => [
				'description'       => __( 'Whether to hide brands not assigned to any products.', 'optiontics' ),
				'type'              => 'boolean',
				'default'           => false,
				'sanitize_callback' => 'wc_string_to_bool',
				'validate_callback' => 'rest_validate_request_arg',
			],
			'orderby'    => [
				'description'       => __( 'Sort collection by object attribute.', 'optiontics' ),
				'type'              => 'string',
				'default'           => 'name',
				'enum'              => [ 'id', 'include', 'name', 'slug', 'term_group', 'description', 'count' ],
				'sanitize_callback' => 'sanitize_key',
				'validate_callback' => 'rest_validate_request_arg',
			],
			'order'      => [
				'description'       => __( 'Order sort attribute ascending or descending.', 'optiontics' ),
				'type'              => 'string',
				'default'           => 'ASC',
				'enum'              => [ 'ASC', 'DESC' ],
				'sanitize_callback' => 'sanitize_key',
				'validate_callback' => 'rest_validate_request_arg',
			],
		];
	}
}
