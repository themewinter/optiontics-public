<?php
namespace Optiontics\Resources;
use Optiontics\Abstract\Resource;
use Optiontics\Core\Blocks\Helpers\Block_Field_Sanitizer;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Block Resource
 *
 * Handles block data and interactions.
 *
 * @package Optiontics/Resources
 */
class Block_Resource extends Resource {
    /**
     * Transform the resource into an array.
     *
     * @return array
     */
    public function to_array() {
        $post = get_post( $this->data->id );

        // Decoded once so the sanitizer can strip gated fields with no live
        // subscriber (e.g. Pro deactivated after a Pro-saved payload).
        $decoded_fields = json_decode( $this->data->fields, true );
        if ( is_array( $decoded_fields ) ) {
            $decoded_fields = Block_Field_Sanitizer::sanitize( $decoded_fields );
        }

        $block_data = [
            'id'           => $this->data->id,
            'title'        => $post->post_title,
            'description'   => $post->post_content,
            'fields'        => $decoded_fields,
            'status'        => $post->post_status,
            'product_type'  => $this->data->product_type,
            'exclude_products' => $this->data->exclude_products,
            'include_products' => $this->data->include_products,
            'exclude_categories' => $this->data->exclude_categories,
            'include_categories' => $this->data->include_categories,
            'exclude_tags' => $this->data->exclude_tags,
            'include_tags' => $this->data->include_tags,
            'exclude_brands' => $this->data->exclude_brands,
            'include_brands' => $this->data->include_brands,
            'craftData' => $this->data->craft_data,
            'preview_url'   => self::resolve_preview_url( $this->data ),
        ];

        return $block_data;
    }

    /**
     * Resolve a single product permalink to use as a live preview URL.
     *
     * Queries only 1 product (posts_per_page = 1) so this is as cheap as
     * possible regardless of catalogue size.
     *
     * @param  mixed $data  The raw model data object (same as $this->data).
     * @return string|null  Absolute product URL, or null when nothing matches.
     */
    private static function resolve_preview_url( $data ): ?string {
        $product_type = $data->product_type ?? '';

        // ── All Woo Products ─────────────────────────────────────────────────
        if ( 'all_woo_products' === $product_type ) {
            $exclude = self::parse_ids( $data->exclude_products ?? [] );
            $args    = [
                'post_type'      => 'product',
                'post_status'    => 'publish',
                'posts_per_page' => 1,
                'fields'         => 'ids',
                'orderby'        => 'date',
                'order'          => 'DESC',
            ];
            if ( ! empty( $exclude ) ) {
                $args['post__not_in'] = $exclude;
            }
            $ids = get_posts( $args );
            return ! empty( $ids ) ? get_permalink( $ids[0] ) : null;
        }

        // ── Specific Products ─────────────────────────────────────────────────
        if ( 'specific_woo_products' === $product_type ) {
            $include = self::parse_ids( $data->include_products ?? [] );
            if ( empty( $include ) ) return null;
            // Validate the first ID is a published product.
            $ids = get_posts( [
                'post_type'      => 'product',
                'post_status'    => 'publish',
                'posts_per_page' => 1,
                'fields'         => 'ids',
                'post__in'       => $include,
                'orderby'        => 'post__in',
            ] );
            return ! empty( $ids ) ? get_permalink( $ids[0] ) : null;
        }

        // ── Category-based (specific or all) ─────────────────────────────────
        if ( in_array( $product_type, [ 'specific_woo_categories', 'all_woo_categories' ], true ) ) {
            if ( 'specific_woo_categories' === $product_type ) {
                $terms = self::parse_ids( $data->include_categories ?? [] );
            } else {
                $terms   = get_terms( [ 'taxonomy' => 'product_cat', 'fields' => 'ids', 'hide_empty' => true ] );
                $exclude = self::parse_ids( $data->exclude_categories ?? [] );
                if ( ! empty( $exclude ) ) {
                    $terms = array_diff( (array) $terms, $exclude );
                }
                $terms = array_values( (array) $terms );
            }
            if ( empty( $terms ) ) return null;
            $ids = get_posts( [
                'post_type'      => 'product',
                'post_status'    => 'publish',
                'posts_per_page' => 1,
                'fields'         => 'ids',
                // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
                'tax_query'      => [ [ 'taxonomy' => 'product_cat', 'field' => 'term_id', 'terms' => $terms ] ],
            ] );
            return ! empty( $ids ) ? get_permalink( $ids[0] ) : null;
        }

        // ── Tag-based ─────────────────────────────────────────────────────────
        if ( in_array( $product_type, [ 'specific_woo_tags', 'all_woo_tags' ], true ) ) {
            if ( 'specific_woo_tags' === $product_type ) {
                $terms = self::parse_ids( $data->include_tags ?? [] );
            } else {
                $terms   = get_terms( [ 'taxonomy' => 'product_tag', 'fields' => 'ids', 'hide_empty' => true ] );
                $exclude = self::parse_ids( $data->exclude_tags ?? [] );
                if ( ! empty( $exclude ) ) {
                    $terms = array_diff( (array) $terms, $exclude );
                }
                $terms = array_values( (array) $terms );
            }
            if ( empty( $terms ) ) return null;
            $ids = get_posts( [
                'post_type'      => 'product',
                'post_status'    => 'publish',
                'posts_per_page' => 1,
                'fields'         => 'ids',
                // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
                'tax_query'      => [ [ 'taxonomy' => 'product_tag', 'field' => 'term_id', 'terms' => $terms ] ],
            ] );
            return ! empty( $ids ) ? get_permalink( $ids[0] ) : null;
        }

        // ── Brand-based ───────────────────────────────────────────────────────
        if ( in_array( $product_type, [ 'specific_woo_brands', 'all_woo_brands' ], true ) ) {
            if ( 'specific_woo_brands' === $product_type ) {
                $terms = self::parse_ids( $data->include_brands ?? [] );
            } else {
                $terms   = get_terms( [ 'taxonomy' => 'product_brand', 'fields' => 'ids', 'hide_empty' => true ] );
                $exclude = self::parse_ids( $data->exclude_brands ?? [] );
                if ( ! empty( $exclude ) ) {
                    $terms = array_diff( (array) $terms, $exclude );
                }
                $terms = array_values( (array) $terms );
            }
            if ( empty( $terms ) ) return null;
            $ids = get_posts( [
                'post_type'      => 'product',
                'post_status'    => 'publish',
                'posts_per_page' => 1,
                'fields'         => 'ids',
                // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
                'tax_query'      => [ [ 'taxonomy' => 'product_brand', 'field' => 'term_id', 'terms' => $terms ] ],
            ] );
            return ! empty( $ids ) ? get_permalink( $ids[0] ) : null;
        }

        return null;
    }

    /**
     * Normalise a meta value that may be a serialized string, a JSON string,
     * an already-decoded array, or a single integer, into a clean array of ints.
     *
     * @param  mixed $value
     * @return int[]
     */
    private static function parse_ids( $value ): array {
        if ( empty( $value ) ) return [];

        // Already an array (e.g. from get_post_meta with $single = false).
        if ( is_array( $value ) ) {
            return array_map( 'intval', array_filter( $value ) );
        }

        // JSON string.
        if ( is_string( $value ) ) {
            $decoded = json_decode( $value, true );
            if ( is_array( $decoded ) ) {
                return array_map( 'intval', array_filter( $decoded ) );
            }
            // Possibly a serialized PHP value (WordPress stores arrays this way).
            $unserialized = maybe_unserialize( $value );
            if ( is_array( $unserialized ) ) {
                return array_map( 'intval', array_filter( $unserialized ) );
            }
            // Single numeric string.
            return is_numeric( $value ) ? [ (int) $value ] : [];
        }

        // Single integer.
        if ( is_numeric( $value ) ) {
            return [ (int) $value ];
        }

        return [];
    }
}
