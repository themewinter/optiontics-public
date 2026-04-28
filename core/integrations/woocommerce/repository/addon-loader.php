<?php
/**
 * Component Repository
 *
 * Loads the stored field definitions (from the 'fields' post meta) for
 * each addon block and returns a structured summary ready for the renderer.
 *
 * Replaces Product_Blocks_Service. Key structural differences:
 *  - Delegates ID resolution to Assignment_Resolver (single responsibility).
 *  - Returns array keyed by 'components', 'active_map', 'summary' — NOT
 *    'blocks', 'published_ids', 'total_addons' (schema change by design).
 *  - Price data is removed from this class; pricing belongs in Pricing_Engine.
 *  - No global option reads (PRAD read from prad_option_assign_all); all data
 *    comes from post/term meta.
 *
 * @package Optiontics\Core\Integrations\WooCommerce\Repository
 * @since   2.0.0
 */

namespace Optiontics\Core\Integrations\WooCommerce\Repository;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Component_Repository
 */
class Component_Repository {

	/**
	 * @var Assignment_Resolver
	 */
	private Assignment_Resolver $resolver;

	/**
	 * Per-request cache: product_id → result array.
	 *
	 * @var array<int, array>
	 */
	private array $cache = [];

	/**
	 * @param Assignment_Resolver $resolver Assignment ID resolver.
	 */
	public function __construct( Assignment_Resolver $resolver ) {
		$this->resolver = $resolver;
	}

	// =========================================================================
	// PUBLIC API
	// =========================================================================

	/**
	 * Return all field-unit definitions for a product, grouped by addon block.
	 *
	 * Return shape (deliberately different from old pattern):
	 * [
	 *   'components' => [ addon_id => [ ...raw field arrays ] ],
	 *   'active_map' => [ addon_id, addon_id, … ]   (published IDs in order),
	 *   'summary'    => [ 'addon_count' => int, 'field_count' => int ],
	 * ]
	 *
	 * @param  int $product_id WooCommerce product ID.
	 * @return array
	 */
	public function fetch_for_product( int $product_id ): array {
		if ( $product_id <= 0 ) {
			return $this->empty_result();
		}

		if ( isset( $this->cache[ $product_id ] ) ) {
			return $this->cache[ $product_id ];
		}

		$result     = $this->empty_result();
		$addon_ids  = $this->resolver->applicable_addon_ids( $product_id );

		if ( empty( $addon_ids ) ) {
			return $result;
		}

		foreach ( $addon_ids as $addon_id ) {
			$addon_id = (int) $addon_id;
			$status   = get_post_status( $addon_id );

			if ( 'publish' !== $status ) {
				if ( false === $status ) {
					// Addon was deleted — fire cleanup hook.
					do_action( 'optiontics_delete_option_product_meta', $addon_id );
				}
				continue;
			}

			$fields = $this->load_field_definitions( $addon_id );

			if ( empty( $fields ) ) {
				continue;
			}

			do_action( 'optiontics_render_addon_css', $addon_id, wp_doing_ajax() ? 'print' : '' );

			$result['components'][ $addon_id ]  = $fields;
			$result['active_map'][]             = $addon_id;
			$result['summary']['addon_count']++;
			$result['summary']['field_count'] += count( $fields );
		}

		/**
		 * Filter the complete component result for a product.
		 *
		 * @param array $result     Repository result array.
		 * @param int   $product_id Product ID.
		 */
		$result = (array) apply_filters( 'optiontics_component_repository_result', $result, $product_id );

		$this->cache[ $product_id ] = $result;

		return $result;
	}

	/**
	 * Evict cached data for a product.
	 *
	 * @param  int $product_id Product ID.
	 * @return void
	 */
	public function invalidate( int $product_id ): void {
		unset( $this->cache[ $product_id ] );
		$this->resolver->invalidate( $product_id );
	}

	/**
	 * Check whether a product has at least one active addon.
	 *
	 * @param  int $product_id Product ID.
	 * @return bool
	 */
	public function product_has_addons( int $product_id ): bool {
		return ! empty( $this->fetch_for_product( $product_id )['components'] );
	}

	// =========================================================================
	// PRIVATE HELPERS
	// =========================================================================

	/**
	 * Load and decode the field definitions stored on an addon block post.
	 *
	 * The meta key 'fields' is a critical key that must never be renamed.
	 *
	 * @param  int $addon_id Addon block post ID.
	 * @return array<int, array<string, mixed>>
	 */
	private function load_field_definitions( int $addon_id ): array {
		$raw = get_post_meta( $addon_id, 'fields', true );

		if ( is_string( $raw ) && '' !== $raw ) {
			$decoded = json_decode( $raw, true );
			$raw     = is_array( $decoded ) ? $decoded : [];
		}

		if ( ! is_array( $raw ) || empty( $raw ) ) {
			return [];
		}

		// Strip any gated fields whose feature has no live subscriber. This
		// guards against data that was persisted while Pro was active and
		// then left behind when Pro was later deactivated.
		$raw = \Optiontics\Core\Blocks\Helpers\Block_Field_Sanitizer::sanitize( $raw );

		return (array) apply_filters( 'optiontics_addon_field_definitions', $raw, $addon_id );
	}

	/**
	 * Return an empty result skeleton.
	 *
	 * @return array
	 */
	private function empty_result(): array {
		return [
			'components' => [],
			'active_map' => [],
			'summary'    => [
				'addon_count' => 0,
				'field_count' => 0,
			],
		];
	}
}
