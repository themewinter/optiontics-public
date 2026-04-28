<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/**
 * Get applicable products for an addon group
 *
 * @param array $args
 * @return array
 */
// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound
function adtx_get_addon_group_applicable_products( $args = [] ) {
    $args = wp_parse_args( $args, [
        'type' => 'all_woo_products', // all_woo_products | specific_woo_products | all_woo_categories | specific_woo_categories | all_woo_tags | specific_woo_tags | all_woo_brands | specific_woo_brands
        'exclude_products' => [],
        'include_products' => [],
        'exclude_categories' => [],
        'include_categories' => [],
        'exclude_tags' => [],
        'include_tags' => [],
        'exclude_brands' => [],
        'include_brands' => [],
        'author' => null,
    ] );

    $product_ids = [];

    // 🔹 Case 1: All products
    if ( $args['type'] === 'all_woo_products' ) {
        $query_args = [
            'post_type'      => 'product',
            'posts_per_page' => -1,
            'fields'         => 'ids',
            'post_status'    => 'publish',
        ];

        // Add author filter if provided (for vendor filtering)
        if ( ! empty( $args['author'] ) ) {
            $query_args['author'] = $args['author'];
        }

        $query = new WP_Query( $query_args );
        $product_ids = $query->posts;

        // Exclude specific products
        if ( ! empty( $args['exclude_products'] ) ) {
            $product_ids = array_diff($product_ids, $args['exclude_products']);
        }
    }

    // 🔹 Case 2: Specific products
    elseif ( $args['type'] === 'specific_woo_products' ) {
        $product_ids = $args['include_products'];

        if ( ! empty( $args['author'] ) && ! empty( $product_ids ) ) {
            $filtered_ids = get_posts( [
                'post_type'      => 'product',
                'posts_per_page' => -1,
                'fields'         => 'ids',
                'post__in'       => $product_ids,
                'author'         => $args['author'],
            ] );
            $product_ids = $filtered_ids;
        }
    }

    // 🔹 Case 3: All categories
    elseif ( $args['type'] === 'all_woo_categories' ) {
        $categories = get_terms(['taxonomy' => 'product_cat', 'fields' => 'ids']);
        $excluded = $args['exclude_categories'] ?? [];

        if ( ! empty( $excluded ) ) {
            $categories = array_diff($categories, $excluded);
        }

        $query_args = [
            'post_type'      => 'product',
            'posts_per_page' => -1,
            'fields'         => 'ids',
            // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
            'tax_query'      => [
                [
                    'taxonomy' => 'product_cat',
                    'field'    => 'term_id',
                    'terms'    => $categories,
                ],
            ],
        ];

        if ( ! empty( $args['author'] ) ) {
            $query_args['author'] = $args['author'];
        }

        $product_ids = get_posts( $query_args );
    }

    // 🔹 Case 4: Specific categories
    elseif ( $args['type'] === 'specific_woo_categories' ) {
        $query_args = [
            'post_type'      => 'product',
            'posts_per_page' => -1,
            'fields'         => 'ids',
            // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
            'tax_query'      => [
                [
                    'taxonomy' => 'product_cat',
                    'field'    => 'term_id',
                    'terms'    => $args['include_categories'],
                ],
            ],
        ];

        if ( ! empty( $args['author'] ) ) {
            $query_args['author'] = $args['author'];
        }

        $product_ids = get_posts( $query_args );
    }

    // 🔹 Case 5: All tags
    elseif ( $args['type'] === 'all_woo_tags' ) {
        $tags = get_terms(['taxonomy' => 'product_tag', 'fields' => 'ids']);
        $excluded = $args['exclude_tags'] ?? [];

        if ( ! empty( $excluded ) ) {
            $tags = array_diff( $tags, $excluded );
        }

        $query_args = [
            'post_type'      => 'product',
            'posts_per_page' => -1,
            'fields'         => 'ids',
            // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
            'tax_query'      => [
                [
                    'taxonomy' => 'product_tag',
                    'field'    => 'term_id',
                    'terms'    => $tags,
                ],
            ],
        ];

        if ( ! empty( $args['author'] ) ) {
            $query_args['author'] = $args['author'];
        }

        $product_ids = get_posts( $query_args );
    }

    // 🔹 Case 6: Specific tags
    elseif ( $args['type'] === 'specific_woo_tags' ) {
        $query_args = [
            'post_type'      => 'product',
            'posts_per_page' => -1,
            'fields'         => 'ids',
            // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
            'tax_query'      => [
                [
                    'taxonomy' => 'product_tag',
                    'field'    => 'term_id',
                    'terms'    => $args['include_tags'],
                ],
            ],
        ];

        if ( ! empty( $args['author'] ) ) {
            $query_args['author'] = $args['author'];
        }

        $product_ids = get_posts( $query_args );
    }

    // 🔹 Case 7: All brands
    elseif ( $args['type'] === 'all_woo_brands' ) {
        $brands = get_terms(['taxonomy' => 'product_brand', 'fields' => 'ids']);
        $excluded = $args['exclude_brands'] ?? [];

        if (!empty($excluded)) {
            $brands = array_diff($brands, $excluded);
        }

        $query_args = [
            'post_type'      => 'product',
            'posts_per_page' => -1,
            'fields'         => 'ids',
            // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
            'tax_query'      => [
                [
                    'taxonomy' => 'product_brand',
                    'field'    => 'term_id',
                    'terms'    => $brands,
                ],
            ],
        ];

        if ( ! empty( $args['author'] ) ) {
            $query_args['author'] = $args['author'];
        }

        $product_ids = get_posts( $query_args );
    }

    // 🔹 Case 8: Specific brands
    elseif ( $args['type'] === 'specific_woo_brands') {
        $query_args = [
            'post_type'      => 'product',
            'posts_per_page' => -1,
            'fields'         => 'ids',
            // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
            'tax_query'      => [
                [
                    'taxonomy' => 'product_brand',
                    'field'    => 'term_id',
                    'terms'    => $args['include_brands'],
                ],
            ],
        ];

        if ( ! empty( $args['author'] ) ) {
            $query_args['author'] = $args['author'];
        }

        $product_ids = get_posts( $query_args );
    }

    return array_unique( $product_ids );
}

/**
 * Check if the current user is a Dokan vendor
 *
 * @param int|null $user_id Optional. User ID to check. Defaults to current user.
 * @return bool True if user is a Dokan vendor, false otherwise.
 */
function optiontics_is_dokan_vendor( $user_id = null ) {
    if ( ! function_exists( 'dokan_is_user_seller' ) ) {
        return false;
    }

    if ( null === $user_id ) {
        $user_id = get_current_user_id();
    }

    return dokan_is_user_seller( $user_id );
}

