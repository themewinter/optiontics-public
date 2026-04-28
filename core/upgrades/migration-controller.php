<?php
namespace Optiontics\Core\Upgrades;

use WP_REST_Server;
use Optiontics\Abstract\Base_Rest_Controller;
use Optiontics\Core\Upgrades\Upgrade_1_0_0\Upgrade_Product_Addons;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Migration_Controller class. Handles WPCafe product addons migration.
 *
 * @package Optiontics/Core/Upgrades
 */
class Migration_Controller extends Base_Rest_Controller {
    /**
     * Store the namespace for the REST API.
     *
     * @var string
     */
    protected $namespace = 'optiontics/v1';

    /**
     * Store the REST base for the API.
     *
     * @var string
     */
    protected $rest_base = 'migration';

    /**
     * Register the REST routes for migration.
     *
     * @return void
     */
    public function register_routes() {
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/wpcafe-addons',
            [
                'methods'  => WP_REST_Server::CREATABLE,
                'callback' => [ $this, 'migrate_wpcafe_addons' ],
                'permission_callback' => [ $this, 'check_permissions' ],
            ]
        );
    }

    /**
     * Migrate WPCafe product addons to Optiontics.
     *
     * @return \WP_REST_Response
     */
    public function migrate_wpcafe_addons() {
        // Check if migration already completed
        if ( get_option( 'wpcafe_product_addons_migrated_to_optiontics', false ) ) {
            return $this->error( __( 'Migration has already been completed.', 'optiontics' ), 400 );
        }

        // Check if WPCafe function exists (version 3.0.0+)
        if ( ! function_exists( 'wpcafe' ) ) {
            return $this->error( __( 'WPCafe plugin (version 3.0.0 or higher) is not active.', 'optiontics' ), 400 );
        }

        // Check if WPCafe product addons data exists
        $has_data = ! empty( get_option( 'wpcafe_product_addons', false ) ) || $this->has_product_addons_meta();

        if ( ! $has_data ) {
            return $this->error( __( 'No WPCafe product addons data found.', 'optiontics' ), 400 );
        }

        try {
            // Run the migration directly
            new Upgrade_Product_Addons();

            return $this->response( [
                'message' => __( 'WPCafe product addons migrated successfully.', 'optiontics' ),
            ] );
        } catch ( \Exception $e ) {
            return $this->error(
                /* translators: %s: error message from the exception */
                sprintf( __( 'Migration failed: %s', 'optiontics' ), $e->getMessage() ),
                500
            );
        }
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

    /**
     * Check permissions for migration operations.
     *
     * @return bool
     */
    public function check_permissions() {
        return current_user_can( 'manage_options' );
    }
}
