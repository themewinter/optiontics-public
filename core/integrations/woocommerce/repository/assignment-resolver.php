<?php
/**
 * Assignment Resolver
 *
 * Answers the question: "which addon groups are assigned to this product?"
 * Replaces the product-ID lookup logic previously buried inside
 * Product_Blocks_Service::get_product_option_ids().
 *
 * Structural change: this is a dedicated, single-responsibility class.
 * No price logic, no block data loading — only assignment resolution.
 * Caches per request via a keyed array (not static class state).
 *
 * Meta keys that must never change (documented in project memory):
 *   optiontics_option_block_products  — post meta on each addon block
 *   optiontics_term_assigned_meta_inc — term meta for taxonomy assignments
 *
 * @package Optiontics\Core\Integrations\WooCommerce\Repository
 * @since   2.0.0
 */

namespace Optiontics\Core\Integrations\WooCommerce\Repository;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Assignment_Resolver
 */
class Assignment_Resolver {

	/**
	 * Per-request cache: product_id → int[] of addon block IDs.
	 *
	 * @var array<int, int[]>
	 */
	private array $cache = [];

	/**
	 * Taxonomies used for term-based assignment.
	 *
	 * @var string[]
	 */
	private array $taxonomies = [ 'product_cat', 'product_tag', 'product_brand' ];

	// =========================================================================
	// PUBLIC API
	// =========================================================================

	/**
	 * Return all published addon block IDs applicable to a product.
	 *
	 * Merges direct product assignments with term-based assignments.
	 * Results are sorted for consistency and cached for the request lifetime.
	 *
	 * @param  int $product_id WooCommerce product ID.
	 * @return int[]           Sorted, unique array of addon block post IDs.
	 */
	public function applicable_addon_ids( int $product_id ): array {
		if ( $product_id <= 0 ) {
			return [];
		}

		if ( isset( $this->cache[ $product_id ] ) ) {
			return $this->cache[ $product_id ];
		}

		$direct    = $this->resolve_direct_assignments( $product_id );
		$via_terms = $this->resolve_term_assignments( $product_id );

		$merged = array_values( array_unique( array_merge( $direct, $via_terms ) ) );
		sort( $merged );

		/**
		 * Filter the resolved addon IDs for a product.
		 *
		 * @param int[] $merged     Addon block IDs.
		 * @param int   $product_id Product ID.
		 */
		$merged = (array) apply_filters( 'optiontics_applicable_addon_ids', $merged, $product_id );

		$this->cache[ $product_id ] = array_values( array_filter( $merged, 'is_numeric' ) );

		return $this->cache[ $product_id ];
	}

	/**
	 * Evict cached assignments for a product.
	 *
	 * Called by the Assign_Product service when an addon is updated.
	 *
	 * @param  int $product_id Product ID.
	 * @return void
	 */
	public function invalidate( int $product_id ): void {
		unset( $this->cache[ $product_id ] );
	}

	// =========================================================================
	// PRIVATE RESOLUTION
	// =========================================================================

	/**
	 * Find addon blocks directly assigned to a product via post meta.
	 *
	 * @param  int $product_id Product ID.
	 * @return int[]
	 */
	private function resolve_direct_assignments( int $product_id ): array {
		$posts = get_posts( [
			'post_type'      => 'optiontics-block',
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'fields'         => 'ids',
			// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
			'meta_query'     => [
				[
					'key'     => 'optiontics_option_block_products',
					'value'   => (string) $product_id,
					'compare' => 'LIKE',
				],
			],
		] );

		return is_array( $posts ) ? array_map( 'intval', $posts ) : [];
	}

	/**
	 * Find addon blocks assigned via taxonomy term meta.
	 *
	 * @param  int $product_id Product ID.
	 * @return int[]
	 */
	private function resolve_term_assignments( int $product_id ): array {
		$ids = [];

		foreach ( $this->taxonomies as $taxonomy ) {
			$terms = get_the_terms( $product_id, $taxonomy );

			if ( ! $terms || is_wp_error( $terms ) ) {
				continue;
			}

			foreach ( $terms as $term ) {
				$raw     = get_term_meta( $term->term_id, 'optiontics_term_assigned_meta_inc', true );
				$decoded = is_string( $raw ) ? json_decode( stripslashes( $raw ), true ) : $raw;

				if ( is_array( $decoded ) ) {
					$ids = array_merge( $ids, array_map( 'intval', $decoded ) );
				}
			}
		}

		return $ids;
	}
}
