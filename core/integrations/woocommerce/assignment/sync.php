<?php
/**
 * Assign Product Service
 *
 * Listens to option-block lifecycle hooks and syncs product/term assignments.
 *
 * @package Optiontics\Core\Integrations\WooCommerce\Services
 * @since   1.0.0
 */

namespace Optiontics\Core\Integrations\WooCommerce\Services;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Assign_Product
 *
 * Responsible for:
 *  - Updating `optiontics_option_block_products` post meta whenever an option
 *    block is created or updated.
 *  - Maintaining `optiontics_term_assigned_meta_inc` term meta for category,
 *    tag, and brand assignments.
 *  - Cleaning up all assignments when an option block is deleted.
 *  - Redirecting add-to-cart flow for products that carry option blocks.
 */
class Assign_Product {

	/**
	 * Register WordPress hooks.
	 */
	public function __construct() {
		add_action( 'optiontics_option_block_created', [ $this, 'assign_product' ], 10, 2 );
		add_action( 'optiontics_option_block_updated', [ $this, 'assign_product' ], 10, 2 );
		add_action( 'before_delete_post',              [ $this, 'cleanup_on_delete' ], 10, 1 );

		add_filter( 'woocommerce_product_add_to_cart_text',    [ $this, 'handle_add_to_cart_text' ],    9999, 2 );
		add_filter( 'woocommerce_product_add_to_cart_url',     [ $this, 'handle_add_to_cart_url' ],     9999, 2 );
		add_filter( 'woocommerce_product_supports',            [ $this, 'handle_product_support' ],     9999, 3 );
	}

	// =========================================================================
	// PUBLIC HOOKS
	// =========================================================================

	/**
	 * Remove term assignments when an option block post is deleted.
	 *
	 * @param int $post_id Post ID being deleted.
	 * @return void
	 */
	public function cleanup_on_delete( $post_id ) {
		if ( get_post_type( $post_id ) === 'optiontics-block' ) {
			$this->cleanup_term_assignments( $post_id );
		}
	}

	/**
	 * Sync product and term assignments for an option block.
	 *
	 * @param int   $id   Option block post ID.
	 * @param array $data Sanitized block data from the REST controller.
	 * @return void
	 */
	public function assign_product( $id, $data ) {
		$type = ! empty( $data['product_type'] ) ? $data['product_type'] : '';

		// Backward-compatibility: normalize legacy singular type keys.
		$type_mapping = [
			'specific_woo_category' => 'specific_woo_categories',
			'all_woo_category'      => 'all_woo_categories',
		];

		if ( isset( $type_mapping[ $type ] ) ) {
			$type = $type_mapping[ $type ];
		}

		$valid_types = [
			'all_woo_products',
			'specific_woo_products',
			'all_woo_categories',
			'specific_woo_categories',
			'all_woo_tags',
			'specific_woo_tags',
			'all_woo_brands',
			'specific_woo_brands',
		];

		if ( ! in_array( $type, $valid_types, true ) ) {
			return;
		}

		$option_block = get_post( $id );
		if ( ! $option_block ) {
			return;
		}

		$product_args = [
			'type'               => $type,
			'exclude_products'   => $data['exclude_products'],
			'include_products'   => $data['include_products'],
			'exclude_categories' => $data['exclude_categories'],
			'include_categories' => $data['include_categories'],
			'exclude_tags'       => $data['exclude_tags'],
			'include_tags'       => $data['include_tags'],
			'exclude_brands'     => $data['exclude_brands'],
			'include_brands'     => $data['include_brands'],
		];

		$author_id = (int) $option_block->post_author;
		if ( optiontics_is_dokan_vendor( $author_id ) && ! user_can( $author_id, 'manage_options' ) ) {
			$product_args['author'] = $author_id;
		}

		$products = adtx_get_addon_group_applicable_products( $product_args );

		update_post_meta( $id, 'optiontics_option_block_products', $products );
		$this->assign_to_terms( $id, $type, $data );
	}

	/**
	 * Replace "Add to cart" with "Select Options" for products that carry addons.
	 *
	 * @param string      $btn_text Button text.
	 * @param \WC_Product $product  Product object.
	 * @return string
	 */
	public function handle_add_to_cart_text( $btn_text, $product ) {
		if ( $this->product_has_options( $product ) ) {
			$btn_text = __( 'Select Options', 'optiontics' );
		}
		return $btn_text;
	}

	/**
	 * Redirect add-to-cart URL to the product page for products with addons.
	 *
	 * @param string      $btn_url Button URL.
	 * @param \WC_Product $product Product object.
	 * @return string
	 */
	public function handle_add_to_cart_url( $btn_url, $product ) {
		if ( $this->product_has_options( $product ) ) {
			$btn_url = $product->get_permalink();
		}
		return $btn_url;
	}

	/**
	 * Disable AJAX add-to-cart for products with addons.
	 *
	 * @param bool        $support Whether the feature is supported.
	 * @param string      $feature Feature name.
	 * @param \WC_Product $product Product object.
	 * @return bool
	 */
	public function handle_product_support( $support, $feature, $product ) {
		if ( 'ajax_add_to_cart' === $feature && $this->product_has_options( $product ) ) {
			$support = false;
		}
		return $support;
	}

	/**
	 * Check whether a product has at least one published option block assigned.
	 *
	 * @param \WC_Product $product Product object.
	 * @return bool
	 */
	public function product_has_options( $product ) {
		if ( in_array( $product->get_type(), [ 'grouped', 'external' ], true ) ) {
			return false;
		}

		$product_id = $product->get_id();

		$option_ids = get_posts( [
			'post_type'      => 'optiontics-block',
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'fields'         => 'ids',
			// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
			'meta_query'     => [
				[
					'key'     => 'optiontics_option_block_products',
					'value'   => $product_id,
					'compare' => 'LIKE',
				],
			],
		] );

		return ! empty( $option_ids );
	}

	// =========================================================================
	// PRIVATE HELPERS
	// =========================================================================

	/**
	 * Add this option block to the relevant taxonomy term meta.
	 *
	 * @param int    $option_block_id Option block post ID.
	 * @param string $type            Product type key.
	 * @param array  $data            Sanitized block data.
	 * @return void
	 */
	private function assign_to_terms( $option_block_id, $type, $data ) {
		$this->cleanup_term_assignments( $option_block_id );

		$decode = static function ( $field ) {
			if ( is_string( $field ) && ! empty( $field ) ) {
				$decoded = json_decode( $field, true );
				return is_array( $decoded ) ? $decoded : [];
			}
			return is_array( $field ) ? $field : [];
		};

		$include_categories = $decode( $data['include_categories'] ?? [] );
		$exclude_categories = $decode( $data['exclude_categories'] ?? [] );
		$include_tags       = $decode( $data['include_tags'] ?? [] );
		$exclude_tags       = $decode( $data['exclude_tags'] ?? [] );
		$include_brands     = $decode( $data['include_brands'] ?? [] );
		$exclude_brands     = $decode( $data['exclude_brands'] ?? [] );

		// phpcs:disable WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_exclude -- exclusions are user-configured taxonomy term lists; bounded by store taxonomy depth.
		$type_config = [
			'all_woo_categories'      => [ 'taxonomy' => 'product_cat',   'include' => null,               'exclude' => $exclude_categories ],
			'specific_woo_categories' => [ 'taxonomy' => 'product_cat',   'include' => $include_categories, 'exclude' => [] ],
			'all_woo_tags'            => [ 'taxonomy' => 'product_tag',   'include' => null,               'exclude' => $exclude_tags ],
			'specific_woo_tags'       => [ 'taxonomy' => 'product_tag',   'include' => $include_tags,       'exclude' => [] ],
			'all_woo_brands'          => [ 'taxonomy' => 'product_brand', 'include' => null,               'exclude' => $exclude_brands ],
			'specific_woo_brands'     => [ 'taxonomy' => 'product_brand', 'include' => $include_brands,    'exclude' => [] ],
		];
		// phpcs:enable WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_exclude

		if ( ! isset( $type_config[ $type ] ) ) {
			return;
		}

		$config   = $type_config[ $type ];
		$taxonomy = $config['taxonomy'];
		$term_ids = [];

		if ( $config['include'] !== null && ! empty( $config['include'] ) ) {
			$term_ids = $config['include'];
		} else {
			$all_terms = get_terms( [
				'taxonomy'   => $taxonomy,
				'fields'     => 'ids',
				'hide_empty' => false,
			] );

			if ( ! is_wp_error( $all_terms ) ) {
				$term_ids = $all_terms;

				if ( ! empty( $config['exclude'] ) ) {
					$term_ids = array_diff( $term_ids, $config['exclude'] );
				}
			}
		}

		foreach ( $term_ids as $term_id ) {
			$existing = $this->get_json_term_meta( $term_id, 'optiontics_term_assigned_meta_inc', [] );

			if ( ! in_array( $option_block_id, $existing, true ) ) {
				$existing[] = $option_block_id;
				$this->update_json_term_meta( $term_id, 'optiontics_term_assigned_meta_inc', $existing );
			}
		}
	}

	/**
	 * Remove this option block from all taxonomy term meta.
	 *
	 * @param int $option_block_id Option block post ID.
	 * @return void
	 */
	private function cleanup_term_assignments( $option_block_id ) {
		$taxonomies = [ 'product_cat', 'product_tag', 'product_brand' ];

		foreach ( $taxonomies as $taxonomy ) {
			$terms = get_terms( [
				'taxonomy'   => $taxonomy,
				'fields'     => 'ids',
				'hide_empty' => false,
			] );

			if ( is_wp_error( $terms ) || empty( $terms ) ) {
				continue;
			}

			foreach ( $terms as $term_id ) {
				$existing = $this->get_json_term_meta( $term_id, 'optiontics_term_assigned_meta_inc', [] );
				$key      = array_search( $option_block_id, $existing, true );

				if ( false !== $key ) {
					unset( $existing[ $key ] );
					$this->update_json_term_meta( $term_id, 'optiontics_term_assigned_meta_inc', array_values( $existing ) );
				}
			}
		}
	}

	/**
	 * Retrieve and JSON-decode a term meta value.
	 *
	 * @param int    $term_id  Term ID.
	 * @param string $meta_key Meta key.
	 * @param array  $default  Default value.
	 * @return array
	 */
	private function get_json_term_meta( int $term_id, string $meta_key, array $default = [] ): array {
		$value = get_term_meta( $term_id, $meta_key, true );

		if ( empty( $value ) ) {
			return $default;
		}

		if ( is_string( $value ) ) {
			$decoded = json_decode( stripslashes( $value ), true );
			return is_array( $decoded ) ? $decoded : $default;
		}

		return is_array( $value ) ? $value : $default;
	}

	/**
	 * JSON-encode and store a term meta value.
	 *
	 * @param int    $term_id  Term ID.
	 * @param string $meta_key Meta key.
	 * @param array  $value    Value to store.
	 * @return void
	 */
	private function update_json_term_meta( int $term_id, string $meta_key, array $value ): void {
		update_term_meta( $term_id, $meta_key, wp_json_encode( $value ) );
	}
}
