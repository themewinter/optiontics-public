<?php
namespace Optiontics\Core\Upgrades;

use Optiontics\Contracts\Hookable_Service_Contract;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Migration_Notice class. Displays admin notice for WPCafe migration.
 *
 * @package Optiontics/Core/Upgrades
 */
class Migration_Notice implements Hookable_Service_Contract {

    /**
     * Register hooks.
     *
     * @return void
     */
    public function register() {
        add_action( 'admin_notices', [ $this, 'show_migration_notice' ] );
    }

    /**
     * Show migration notice if conditions are met.
     *
     * @return void
     */
    public function show_migration_notice() {
        // Only show in admin to users who can manage options
        if ( ! is_admin() || ! current_user_can( 'manage_options' ) ) {
            return;
        }

        // Check if migration already completed
        if ( get_option( 'wpcafe_product_addons_migrated_to_optiontics', false ) ) {
            return;
        }

        // Check if WPCafe function exists (version 3.0.0+)
        if ( ! function_exists( 'wpcafe' ) ) {
            return;
        }

        // Check if WPCafe product addons data exists
        $has_data = ! empty( get_option( 'wpcafe_product_addons', false ) ) || $this->has_product_addons_meta();

        if ( ! $has_data ) {
            return;
        }

        // Enqueue the migration script
        wp_enqueue_script( 'optiontics-wpcafe-migration' );

        // Localize script with necessary data
        wp_localize_script( 'optiontics-wpcafe-migration', 'optionticsWPCafeMigration', [
            'restUrl' => rest_url( 'optiontics/v1/migration/wpcafe-addons' ),
            'nonce'   => wp_create_nonce( 'wp_rest' ),
        ] );

        ?>
        <div class="notice notice-warning is-dismissible" id="optiontics-migration-notice">
            <p>
                <strong><?php esc_html_e( 'Migrate Your Product Addons to Optiontics', 'optiontics' ); ?></strong>
            </p>
            <p>
                <?php esc_html_e( 'We found existing WPCafe product addons. Migrate them to Optiontics to continue managing addons smoothly.', 'optiontics' ); ?>
            </p>
            <p>
                <button type="button" class="button button-primary" id="optiontics-run-migration">
                    <?php esc_html_e( 'Migrate Now', 'optiontics' ); ?>
                </button>
                <span class="spinner" style="float: none; margin: 0 10px;"></span>
                <span id="optiontics-migration-status"></span>
            </p>
        </div>
        <?php
    }

    /**
     * Check if any products have WPCafe product addons meta data
     *
     * @return bool
     */
    private function has_product_addons_meta(): bool {
        $products = get_posts([
            'post_type'      => 'product',
            'post_status'    => 'any',
            'posts_per_page' => 1,
            'fields'         => 'ids',
            // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query -- EXISTS check is the only way to detect legacy meta; posts_per_page=1 limits impact.
            'meta_query'     => [
                [
                    'key'     => '_wpc_pro_pao_data',
                    'compare' => 'EXISTS',
                ],
            ],
        ]);

        return ! empty( $products );
    }
}
