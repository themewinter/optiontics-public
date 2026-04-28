<?php
namespace Optiontics\Core\Upgrades\Upgrade_1_0_0;

use WP_Query;

/**
 * Class Upgrade_Product_Addons
 *
 * Handles the migration process for WPCafe product addons to Optiontics.
 * This migrates data from WPCafe 3.0.0+ to Optiontics option blocks.
 */
class Upgrade_Product_Addons {

    /**
     * Constructor for the Upgrade_Product_Addons class.
     *
     * Automatically triggers the upgrade process when an instance is created.
     */
    public function __construct() {
        $this->migrate_product_addons();
    }

    /**
     * Migrate product addons from WPCafe to Optiontics
     *
     * @return  void
     */
    private function migrate_product_addons() {
        if ( get_option( 'wpcafe_product_addons_migrated_to_optiontics', false ) ) {
            return;
        }

        if ( ! function_exists( 'wc_get_product' ) ) {
            return;
        }

        $migrated_anything = false;

        $global_addons = get_option( 'wpcafe_product_addons', [] );
        if ( ! empty( $global_addons ) && is_array( $global_addons ) ) {
            $migrated_anything = $this->migrate_global_addons( $global_addons ) || $migrated_anything;
        }

        $migrated_anything = $this->migrate_product_level_addons() || $migrated_anything;

        if ( $migrated_anything ) {
            update_option( 'wpcafe_product_addons_migrated_to_optiontics', true );
        }
    }

    /**
     * Migrate global addons stored in wpcafe_product_addons option.
     *
     * @param array $global_addons
     *
     * @return bool
     */
    private function migrate_global_addons( array $global_addons ): bool {
        $normalized_fields = $this->normalize_legacy_addons( $global_addons );

        if ( empty( $normalized_fields ) ) {
            return false;
        }

        $fields = $this->map_legacy_fields_to_optiontics_fields( $normalized_fields );
        if ( empty( $fields ) ) {
            return false;
        }

        $addons_menu       = ! empty( $global_addons['addons_menu'] ) ? array_map( 'absint', (array) $global_addons['addons_menu'] ) : [];
        $addons_categories = ! empty( $global_addons['addons_categories'] ) ? array_map( 'absint', (array) $global_addons['addons_categories'] ) : [];

        $created = false;

        if ( ! empty( $addons_menu ) ) {
            $created = $this->create_optiontics_block(
                'WPCafe Product Addons (Products)',
                $fields,
                [
                    'product_type'     => 'specific_woo_products',
                    'include_products' => $addons_menu,
                ]
            ) || $created;
        }

        if ( ! empty( $addons_categories ) ) {
            $created = $this->create_optiontics_block(
                'WPCafe Product Addons (Categories)',
                $fields,
                [
                    'product_type'        => 'specific_woo_categories',
                    'include_categories'  => $addons_categories,
                ]
            ) || $created;
        }

        if ( empty( $addons_menu ) && empty( $addons_categories ) ) {
            // Fallback: make it applicable to all products.
            $created = $this->create_optiontics_block(
                'WPCafe Product Addons',
                $fields,
                [
                    'product_type' => 'all_woo_products',
                ]
            ) || $created;
        }

        return $created;
    }

    /**
     * Migrate per-product addons stored in product meta _wpc_pro_pao_data.
     *
     * @return bool
     */
    private function migrate_product_level_addons(): bool {
        $query = new WP_Query([
            'post_type'      => 'product',
            'post_status'    => 'any',
            'posts_per_page' => -1,
            'fields'         => 'ids',
            // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
            'meta_query'     => [
                [
                    'key'     => '_wpc_pro_pao_data',
                    'compare' => 'EXISTS',
                ],
            ],
        ]);

        if ( empty( $query->posts ) ) {
            return false;
        }

        $created_any = false;

        foreach ( $query->posts as $product_id ) {
            $product_id = absint( $product_id );
            if ( ! $product_id ) {
                continue;
            }

            $legacy_fields = get_post_meta( $product_id, '_wpc_pro_pao_data', true );
            if ( empty( $legacy_fields ) || ! is_array( $legacy_fields ) ) {
                continue;
            }

            $fields = $this->map_legacy_fields_to_optiontics_fields( $legacy_fields );
            if ( empty( $fields ) ) {
                continue;
            }

            $product = wc_get_product( $product_id );
            $title   = $product ? ( 'WPCafe Addons - ' . $product->get_name() ) : ( 'WPCafe Addons - Product #' . $product_id );

            $created_any = $this->create_optiontics_block(
                $title,
                $fields,
                [
                    'product_type'     => 'specific_woo_products',
                    'include_products' => [ $product_id ],
                ]
            ) || $created_any;
        }

        return $created_any;
    }

    /**
     * Normalize legacy addon source into an array of addon fields.
     *
     * @param array $source
     *
     * @return array
     */
    private function normalize_legacy_addons( array $source ): array {
        // Already normalized format (like _wpc_pro_pao_data).
        if ( isset( $source[0] ) && is_array( $source[0] ) && isset( $source[0]['type'] ) ) {
            return $source;
        }

        if ( empty( $source['wpc_pro_pao_title'] ) || ! is_array( $source['wpc_pro_pao_title'] ) ) {
            return [];
        }

        $pao_title             = (array) $source['wpc_pro_pao_title'];
        $pao_type              = isset( $source['wpc_pro_pao_type'] ) ? (array) $source['wpc_pro_pao_type'] : [];
        $pao_title_format      = isset( $source['wpc_pro_pao_title_format'] ) ? (array) $source['wpc_pro_pao_title_format'] : [];
        $pao_place_holder      = isset( $source['wpc_pro_pao_place_holder'] ) ? (array) $source['wpc_pro_pao_place_holder'] : [];
        $pao_char_limit_enable = isset( $source['wpc_pro_pao_char_limit_enable'] ) ? (array) $source['wpc_pro_pao_char_limit_enable'] : [];
        $pao_char_min          = isset( $source['wpc_pro_pao_char_min'] ) ? (array) $source['wpc_pro_pao_char_min'] : [];
        $pao_char_max          = isset( $source['wpc_pro_pao_char_max'] ) ? (array) $source['wpc_pro_pao_char_max'] : [];
        $pao_desc_enable       = isset( $source['wpc_pro_pao_desc_enable'] ) ? (array) $source['wpc_pro_pao_desc_enable'] : [];
        $pao_desc              = isset( $source['wpc_pro_pao_desc'] ) ? (array) $source['wpc_pro_pao_desc'] : [];
        $pao_required          = isset( $source['wpc_pro_pao_required'] ) ? (array) $source['wpc_pro_pao_required'] : [];
        $pao_hide_price        = isset( $source['wpc_pro_pao_hide_price'] ) ? (array) $source['wpc_pro_pao_hide_price'] : [];
        $pao_option_label      = isset( $source['wpc_pro_pao_option_label'] ) ? (array) $source['wpc_pro_pao_option_label'] : [];
        $pao_option_price      = isset( $source['wpc_pro_pao_option_price'] ) ? (array) $source['wpc_pro_pao_option_price'] : [];
        $pao_option_price_type = isset( $source['wpc_pro_pao_option_price_type'] ) ? (array) $source['wpc_pro_pao_option_price_type'] : [];
        $pao_option_default    = isset( $source['wpc_pro_pao_option_default'] ) ? (array) $source['wpc_pro_pao_option_default'] : [];

        $normalized = [];

        for ( $i = 0; $i < count( $pao_title ); $i++ ) {
            if ( empty( $pao_title[ $i ] ) ) {
                continue;
            }

            $single_type = ! empty( $pao_type[ $i ] ) ? $pao_type[ $i ] : 'checkbox';
            $options     = [];

            $option_labels      = isset( $pao_option_label[ $i ] ) ? (array) $pao_option_label[ $i ] : [];
            $option_prices      = isset( $pao_option_price[ $i ] ) ? (array) $pao_option_price[ $i ] : [];
            $option_price_types = isset( $pao_option_price_type[ $i ] ) ? (array) $pao_option_price_type[ $i ] : [];
            $option_defaults    = isset( $pao_option_default[ $i ] ) ? (array) $pao_option_default[ $i ] : [];

            if ( 'text' === $single_type ) {
                $option_labels = [ 'dummy' ];
            }

            for ( $opt = 0; $opt < count( $option_labels ); $opt++ ) {
                $label = sanitize_text_field( $option_labels[ $opt ] );
                if ( 'text' === $single_type ) {
                    $label = '';
                }

                $price      = isset( $option_prices[ $opt ] ) ? (float) $option_prices[ $opt ] : 0;
                $price_type = isset( $option_price_types[ $opt ] ) ? sanitize_text_field( $option_price_types[ $opt ] ) : 'flat_fee';
                $default    = in_array( $opt, $option_defaults, true ) ? 1 : 0;

                $options[] = [
                    'label'      => $label,
                    'price'      => $price,
                    'price_type' => $price_type,
                    'default'    => $default,
                ];
            }

            $normalized[] = [
                'type'           => sanitize_text_field( $single_type ),
                'title'          => sanitize_text_field( $pao_title[ $i ] ),
                'title_format'   => isset( $pao_title_format[ $i ] ) ? sanitize_text_field( $pao_title_format[ $i ] ) : 'label',
                'place_holder'   => isset( $pao_place_holder[ $i ] ) ? sanitize_text_field( $pao_place_holder[ $i ] ) : '',
                'char_limit'     => isset( $pao_char_limit_enable[ $i ] ) ? 1 : 0,
                'char_min'       => isset( $pao_char_min[ $i ] ) ? absint( $pao_char_min[ $i ] ) : 0,
                'char_max'       => isset( $pao_char_max[ $i ] ) ? absint( $pao_char_max[ $i ] ) : 0,
                'desc_enable'    => isset( $pao_desc_enable[ $i ] ) ? 1 : 0,
                'desc'           => isset( $pao_desc[ $i ] ) ? wp_kses_post( $pao_desc[ $i ] ) : '',
                'required'       => isset( $pao_required[ $i ] ) ? 1 : 0,
                'pao_hide_price' => isset( $pao_hide_price[ $i ] ) ? 1 : 0,
                'options'        => $options,
            ];
        }

        return $normalized;
    }

    /**
     * Convert legacy field array to Optiontics field array.
     *
     * @param array $legacy_fields
     *
     * @return array
     */
    private function map_legacy_fields_to_optiontics_fields( array $legacy_fields ): array {
        $fields = [];

        foreach ( $legacy_fields as $index => $legacy_field ) {
            if ( empty( $legacy_field['type'] ) || empty( $legacy_field['title'] ) ) {
                continue;
            }

            $mapped_type = $this->map_legacy_type_to_optiontics_type( $legacy_field['type'] );
            if ( empty( $mapped_type ) ) {
                continue;
            }

            $field = [
                'blockid'   => $this->generate_block_id(),
                'type'      => $mapped_type,
                'label'     => sanitize_text_field( $legacy_field['title'] ),
                'desc'      => ( ! empty( $legacy_field['desc_enable'] ) ) ? wp_kses_post( $legacy_field['desc'] ?? '' ) : '',
                'hide'      => ( ! empty( $legacy_field['title_format'] ) && 'hide' === $legacy_field['title_format'] ),
                'required'  => ! empty( $legacy_field['required'] ),
                'columns'   => 1,
                'isQuantity' => false,
            ];

            if ( 'textarea' === $mapped_type ) {
                $field['placeholder'] = ! empty( $legacy_field['place_holder'] ) ? sanitize_text_field( $legacy_field['place_holder'] ) : '';
            }

            $field['_options'] = $this->map_legacy_options_to_optiontics_options( $legacy_field, $field );
            if ( empty( $field['_options'] ) ) {
                continue;
            }

            $fields[] = $field;
        }

        return $fields;
    }

    /**
     * Generate craftData structure for Optiontics blocks with validation and error handling
     *
     * @param array $fields Array of field definitions
     * @return array
     */
    private function generate_craft_data( array $fields ): array {
        try {
            if (empty($fields) || !is_array($fields)) {
                throw new \InvalidArgumentException('Fields must be a non-empty array');
            }

            // Initialize the craft_data structure with ROOT node
            $craft_data = [
                'ROOT' => [
                    'type' => ['resolvedName' => 'body'],
                    'isCanvas' => true,
                    'props' => [
                        'displayName' => 'Body',
                        'type' => 'body',
                        'background' => '#ffffff',
                        'color' => '#000000',
                        'minHeight' => '350px',
                        'minWidth' => '300px',
                        'width' => ['size' => 100, 'unit' => '%'],
                        'padding' => [
                            'top' => 15, 'right' => 15, 'bottom' => 15, 'left' => 15,
                            'isLinked' => false, 'unit' => 'px'
                        ]
                    ],
                    'displayName' => 'Body',
                    'custom' => [],
                    'hidden' => false,
                    'nodes' => [],
                    'linkedNodes' => []
                ]
            ];

            // Common styles for all field types
            $common_styles = [
                'height' => ['val' => 32],
                'width' => ['val' => 32],
                'radius' => ['val' => 4],
                'mrR' => ['val' => 8]
            ];

            // Supported field types and their required properties
            $supported_field_types = [
                'checkbox' => ['_options'],
                'radio' => ['_options'],
                'select' => ['_options'],
                'textfield' => ['placeholder'],
                'textarea' => ['placeholder'],
            ];

            foreach ($fields as $field) {
                if (!is_array($field)) {
                    continue;
                }

                // Ensure required fields exist
                $field = wp_parse_args($field, [
                    'blockid' => uniqid(),
                    'type' => 'textfield',
                    'label' => '',
                    'desc' => '',
                    'hide' => false,
                    'required' => false,
                    'class' => '',
                    'id' => '',
                    'en_logic' => false,
                    'fieldConditions' => [
                        'condition' => ['visibility' => '', 'match' => ''],
                        'rules' => [['field' => '', 'compare' => '', 'value' => '']]
                    ]
                ]);

                $block_id = $field['blockid'];
                $field_type = $field['type'];

                // Skip unsupported field types
                if (!array_key_exists($field_type, $supported_field_types)) {
                    continue;
                }

                // Validate required properties for the field type
                $missing_props = array_filter(
                    $supported_field_types[$field_type],
                    fn($prop) => !isset($field[$prop]) || (is_array($field[$prop]) && empty($field[$prop]))
                );

                if (!empty($missing_props)) {
                    continue;
                }

                // Prepare the field props
                $field_props = [
                    'displayName' => ucfirst($field_type),
                    'type' => $field_type,
                    'label' => $field['label'],
                    'desc' => $field['desc'],
                    'hide' => $field['hide'],
                    'required' => $field['required'],
                    'class' => $field['class'],
                    'id' => $field['id'],
                    '_styles' => $common_styles,
                    'en_logic' => $field['en_logic'],
                    'fieldConditions' => $field['fieldConditions']
                ];

                // Add type-specific properties
                if (in_array($field_type, ['checkbox', 'radio', 'select'])) {
                    $field_props['isQuantity'] = $field['isQuantity'] ?? true;
                    $field_props['min'] = $field['min'] ?? 1;
                    $field_props['max'] = $field['max'] ?? 100;
                    $field_props['columns'] = $field['columns'] ?? 1;
                    $field_props['options'] = array_map([$this, 'sanitize_option'], $field['_options'] ?? []);
                }

                // Handle textfield/textarea specific props
                if (in_array($field_type, ['textfield', 'textarea'])) {
                    $field_props['placeholder'] = $field['placeholder'] ?? '';
                    $field_props['pricePosition'] = $field['pricePosition'] ?? 'with_title';
                    $field_props['options'] = array_map([$this, 'sanitize_option'], $field['_options'] ?? []);
                }

                // Add the field to craft_data
                $craft_data[$block_id] = [
                    'type' => ['resolvedName' => $field_type],
                    'isCanvas' => false,
                    'props' => $field_props,
                    'displayName' => $field['label'] ?: ucfirst($field_type),
                    'custom' => [],
                    'parent' => 'ROOT',
                    'hidden' => false,
                    'nodes' => [],
                    'linkedNodes' => []
                ];

                $craft_data['ROOT']['nodes'][] = $block_id;
            }

            // Ensure we have at least one valid field (ROOT alone = nothing migrated)
            if (count($craft_data) <= 1) {
                throw new \RuntimeException('No valid fields found in the input');
            }

            return $craft_data;

        } catch (\Exception $e) {
            return $this->get_fallback_craft_data();
        }
    }

    /**
     * Sanitize option values
     *
     * @param array $option
     * @return array
     */
    private function sanitize_option(array $option): array {
        return [
            'value' => $option['value'] ?? '',
            'type' => in_array($option['type'] ?? '', ['fixed', 'percentage', 'Free']) ? $option['type'] : 'fixed',
            'regular' => isset($option['regular']) ? (string) $option['regular'] : '',
            'sale' => isset($option['sale']) ? (string) $option['sale'] : '',
            'default' => (bool) ($option['default'] ?? false),
            'image' => $option['image'] ?? ''
        ];
    }

    /**
     * Get a fallback craftData structure in case of errors
     *
     * @return array
     */
    private function get_fallback_craft_data(): array {
        return [
            'ROOT' => [
                'type' => ['resolvedName' => 'body'],
                'isCanvas' => true,
                'props' => [
                    'displayName' => 'Body',
                    'type' => 'body',
                    'background' => '#ffffff',
                    'color' => '#000000',
                    'minHeight' => '350px',
                    'minWidth' => '300px',
                    'width' => ['size' => 100, 'unit' => '%'],
                    'padding' => [
                        'top' => 15, 'right' => 15, 'bottom' => 15, 'left' => 15,
                        'isLinked' => false, 'unit' => 'px'
                    ]
                ],
                'displayName' => 'Body',
                'custom' => [],
                'hidden' => false,
                'nodes' => [],
                'linkedNodes' => []
            ]
        ];
    }

    /**
     * Create an Optiontics block with the given data
     *
     * @param string $title The title of the block
     * @param array $fields Array of field definitions
     * @param array $conditions Array of conditions for product assignment
     * @return bool True on success, false on failure
     */
    private function create_optiontics_block( string $title, array $fields, array $conditions ): bool {
        try {
            // Validate required fields
            if (empty($title) || empty($fields)) {
                throw new \InvalidArgumentException('Title and fields are required');
            }

            $product_type = $conditions['product_type'] ?? '';
            if (empty($product_type)) {
                throw new \InvalidArgumentException('Product type is required');
            }

            // Generate craftData structure for the editor
            $craft_data = $this->generate_craft_data($fields);
            if (empty($craft_data)) {
                throw new \RuntimeException('Failed to generate craftData');
            }

            $block_data = [
                'product_type'       => $product_type,
                'exclude_products'   => $conditions['exclude_products'] ?? [],
                'include_products'   => $conditions['include_products'] ?? [],
                'exclude_categories' => $conditions['exclude_categories'] ?? [],
                'include_categories' => $conditions['include_categories'] ?? [],
                'exclude_tags'       => $conditions['exclude_tags'] ?? [],
                'include_tags'       => $conditions['include_tags'] ?? [],
                'exclude_brands'     => $conditions['exclude_brands'] ?? [],
                'include_brands'     => $conditions['include_brands'] ?? [],
                'fields'             => $fields, // Keep original fields for reference
            ];

            $post_id = wp_insert_post([
                'post_type'    => 'optiontics-block',
                'post_status'  => 'publish',
                'post_title'   => $title,
                'post_content' => '',
            ]);

            if (is_wp_error($post_id) || empty($post_id)) {
                throw new \RuntimeException(
                    'Failed to create option block: ' .
                    (is_wp_error($post_id) ? $post_id->get_error_message() : 'Unknown error')
                );
            }

            // Store Optiontics expected meta (even if Optiontics is not installed yet).
            update_post_meta($post_id, 'fields', wp_json_encode($fields));
            update_post_meta($post_id, 'product_type', $block_data['product_type']);
            update_post_meta($post_id, 'exclude_products', $block_data['exclude_products']);
            update_post_meta($post_id, 'include_products', $block_data['include_products']);
            update_post_meta($post_id, 'exclude_categories', $block_data['exclude_categories']);
            update_post_meta($post_id, 'include_categories', $block_data['include_categories']);
            update_post_meta($post_id, 'exclude_tags', $block_data['exclude_tags']);
            update_post_meta($post_id, 'include_tags', $block_data['include_tags']);
            update_post_meta($post_id, 'exclude_brands', $block_data['exclude_brands']);
            update_post_meta($post_id, 'include_brands', $block_data['include_brands']);

            // Store craftData in both meta keys for compatibility
            $craft_data_json = wp_json_encode($craft_data);
            if ($craft_data_json !== false) {
                update_post_meta($post_id, 'craftData', $craft_data_json);
                update_post_meta($post_id, 'craft_data', $craft_data_json);
            }

            // Calculate and store applicable products
            $products = $this->get_applicable_products_for_block($block_data);
            update_post_meta($post_id, 'optiontics_option_block_products', $products);

            // Add a flag to identify migrated blocks
            update_post_meta($post_id, 'wpcafe_legacy_addons_migrated', 1);

            // If Optiontics is active, trigger product assignment
            if (class_exists('Optiontics\\Core\\WC\\Services\\Assign_Product')) {
                do_action('optiontics_option_block_created', $post_id, $block_data);
            }

            return true;

        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get applicable product IDs for a block without relying on Optiontics plugin.
     *
     * This is a minimal implementation to ensure migrated blocks work later
     * when Optiontics is installed.
     *
     * @param array $block_data
     *
     * @return array
     */
    private function get_applicable_products_for_block( array $block_data ): array {
        $product_type       = $block_data['product_type'] ?? '';
        $include_products   = ! empty( $block_data['include_products'] ) ? array_map( 'absint', (array) $block_data['include_products'] ) : [];
        $exclude_products   = ! empty( $block_data['exclude_products'] ) ? array_map( 'absint', (array) $block_data['exclude_products'] ) : [];
        $include_categories = ! empty( $block_data['include_categories'] ) ? array_map( 'absint', (array) $block_data['include_categories'] ) : [];
        $exclude_categories = ! empty( $block_data['exclude_categories'] ) ? array_map( 'absint', (array) $block_data['exclude_categories'] ) : [];

        $product_ids = [];

        if ( 'specific_woo_products' === $product_type ) {
            $product_ids = $include_products;
        } elseif ( 'all_woo_products' === $product_type ) {
            $query = new WP_Query([
                'post_type'      => 'product',
                'post_status'    => 'publish',
                'posts_per_page' => -1,
                'fields'         => 'ids',
            ]);
            $product_ids = $query->posts;
        } elseif ( 'specific_woo_categories' === $product_type && ! empty( $include_categories ) ) {
            $product_ids = get_posts([
                'post_type'      => 'product',
                'posts_per_page' => -1,
                'fields'         => 'ids',
                // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
                'tax_query'      => [
                    [
                        'taxonomy' => 'product_cat',
                        'field'    => 'term_id',
                        'terms'    => $include_categories,
                    ],
                ],
            ]);
        } elseif ( 'all_woo_categories' === $product_type ) {
            $categories = get_terms([
                'taxonomy' => 'product_cat',
                'fields'   => 'ids',
            ]);

            if ( ! is_wp_error( $categories ) && is_array( $categories ) ) {
                if ( ! empty( $exclude_categories ) ) {
                    $categories = array_diff( $categories, $exclude_categories );
                }

                $product_ids = get_posts([
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
                ]);
            }
        }

        if ( ! empty( $exclude_products ) ) {
            $product_ids = array_diff( $product_ids, $exclude_products );
        }

        return array_values( array_unique( array_map( 'absint', (array) $product_ids ) ) );
    }

    /**
     * Map legacy addon type to optiontics field type.
     *
     * @param string $legacy_type
     *
     * @return string
     */
    private function map_legacy_type_to_optiontics_type( string $legacy_type ): string {
        $legacy_type = sanitize_text_field( $legacy_type );

        if ( 'dropdown' === $legacy_type ) {
            return 'select';
        }

        if ( 'text' === $legacy_type ) {
            return 'textarea';
        }

        if ( in_array( $legacy_type, [ 'checkbox', 'radio' ], true ) ) {
            return $legacy_type;
        }

        return '';
    }

    /**
     * Map legacy options list into Optiontics _options format.
     *
     * @param array $legacy_field
     * @param array $field
     *
     * @return array
     */
    private function map_legacy_options_to_optiontics_options( array $legacy_field, array &$field ): array {
        $legacy_options = ! empty( $legacy_field['options'] ) && is_array( $legacy_field['options'] ) ? $legacy_field['options'] : [];
        if ( empty( $legacy_options ) ) {
            // Optiontics expects _options even for textarea/text.
            $legacy_options = [ [ 'price_type' => 'flat_fee', 'price' => 0, 'default' => 0, 'label' => '' ] ];
        }

        $options = [];

        foreach ( $legacy_options as $legacy_option ) {
            $option_value = isset( $legacy_option['label'] ) ? sanitize_text_field( $legacy_option['label'] ) : '';
            $legacy_price = isset( $legacy_option['price'] ) ? (float) $legacy_option['price'] : 0;
            $legacy_type  = isset( $legacy_option['price_type'] ) ? sanitize_text_field( $legacy_option['price_type'] ) : 'flat_fee';
            $is_default   = ! empty( $legacy_option['default'] );

            $price_type = 'fixed';
            if ( 'percentage_based' === $legacy_type ) {
                $price_type = 'percentage';
            } elseif ( 'quantity_based' === $legacy_type ) {
                $price_type         = 'fixed';
                $field['isQuantity'] = true;
                $field['min']       = 1;
                $field['max']       = 100;
            }

            if ( $legacy_price <= 0 ) {
                $price_type = 'no_cost';
            }

            $options[] = [
                'value'   => $option_value,
                'type'    => $price_type,
                'regular' => ( 'no_cost' === $price_type ) ? '0' : (string) $legacy_price,
                'sale'    => '',
                'default' => $is_default,
                'image'   => '',
            ];
        }

        return $options;
    }

    /**
     * Generate a stable-enough block id for Optiontics fields.
     *
     * @return string
     */
    private function generate_block_id(): string {
        $uuid = function_exists( 'wp_generate_uuid4' ) ? wp_generate_uuid4() : uniqid( '', true );
        $uuid = preg_replace( '/[^a-z0-9]/i', '', (string) $uuid );

        $prefix = substr( $uuid, 0, 4 );
        $suffix = substr( $uuid, 4, 6 );

        return strtolower( $prefix . '-' . $suffix );
    }
}
