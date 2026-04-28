<?php
/**
 * Dokan Vendor Dashboard
 *
 * Adds the Optiontics page to the Dokan vendor dashboard navigation.
 *
 * @package Optiontics\Core\Integrations\Dokan
 * @since   1.0.0
 */

namespace Optiontics\Core\Integrations\Dokan;

use Optiontics\Contracts\Hookable_Service_Contract;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Vendor_Dashboard
 *
 * Hooks into Dokan to:
 *  - Add "Optiontics" to the vendor dashboard sidebar.
 *  - Register its query variable.
 *  - Render the React mount point when the page is visited.
 */
class Vendor_Dashboard implements Hookable_Service_Contract {

	/**
	 * Register WordPress / Dokan hooks.
	 *
	 * @return void
	 */
	public function register() {
		add_filter( 'dokan_get_dashboard_nav',   [ $this, 'add_vendor_dashboard_menu' ] );
		add_filter( 'dokan_query_var_filter',    [ $this, 'add_query_var' ] );
		add_action( 'dokan_load_custom_template', [ $this, 'load_template' ] );
	}

	/**
	 * Inject the Optiontics menu item into the Dokan dashboard navigation.
	 *
	 * @param array $urls Existing dashboard nav items.
	 * @return array
	 */
	public function add_vendor_dashboard_menu( $urls ) {
		$urls['optiontics'] = [
			'title' => esc_html__( 'Optiontics', 'optiontics' ),
			'icon'  => '<img src="' . esc_url( optiontics()->assets_url . '/images/brand_icon.svg' ) . '">',
			'url'   => dokan_get_navigation_url( 'optiontics' ),
			'pos'   => 51,
		];

		return apply_filters( 'optiontics_dokan_dashboard_menu', $urls );
	}

	/**
	 * Register the "optiontics" query variable with Dokan.
	 *
	 * @param array $query_vars Existing Dokan query variables.
	 * @return array
	 */
	public function add_query_var( $query_vars ) {
		$query_vars['optiontics'] = 'optiontics';
		return $query_vars;
	}

	/**
	 * Load the Optiontics template when the vendor visits the page.
	 *
	 * @param array $query_vars Active Dokan query variables.
	 * @return void
	 */
	public function load_template( $query_vars ) {
		if ( ! isset( $query_vars['optiontics'] ) ) {
			return;
		}

		if ( ! current_user_can( 'dokan_view_store_settings_menu' ) ) {
			dokan_get_template_part( 'global/dokan-error', '', [
				'deleted' => false,
				'message' => __( 'You have no permission to view this page', 'optiontics' ),
			] );
		} else {
			$this->render_dashboard_page();
		}
	}

	// =========================================================================
	// PRIVATE HELPERS
	// =========================================================================

	/**
	 * Output the Dokan-wrapped React mount point.
	 *
	 * @return void
	 */
	private function render_dashboard_page(): void {
		wp_enqueue_style( 'optiontics-frontend-style' );
		wp_enqueue_script( 'optiontics-dokan-multivendor-dashboard' );

		$localize_data = [
			'assets_url'               => optiontics()->assets_url . '/build',
			'option_tics_multivendor'  => '1',
			'wc_active'                => class_exists( 'WooCommerce' ) ? '1' : '0',
		];
		wp_localize_script( 'optiontics-dokan-multivendor-dashboard', 'optiontics', $localize_data );

		do_action( 'dokan_dashboard_wrap_start' );
		?>
		<div class="dokan-dashboard-wrap">
			<header class="dokan-dashboard-header dokan-clearfix"></header>
			<?php do_action( 'dokan_dashboard_content_before' ); ?>
			<optiontics-app id="optiontics-vendor-dashboard"></optiontics-app>
			<?php do_action( 'dokan_dashboard_content_after' ); ?>
		</div>
		<?php
		do_action( 'dokan_dashboard_wrap_end' );
	}
}
