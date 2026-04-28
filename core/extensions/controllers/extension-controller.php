<?php
/**
 * Extension Controller
 *
 * REST API for the About Us "Our Plugins" section.
 * Endpoint: GET optiontics/v1/extensions?type=our-plugins
 *
 * @package Optiontics\Core\Extensions\Controllers
 * @since   1.0.4
 */

namespace Optiontics\Core\Extensions\Controllers;

use Arraytics\ToolsSdk\PluginManager;
use Optiontics\Abstract\Base_Rest_Controller;
use WP_REST_Server;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Extension_Controller
 *
 * Returns the list of sibling Arraytics plugins with live install/activate status.
 */
class Extension_Controller extends Base_Rest_Controller {

	/**
	 * REST namespace.
	 *
	 * @var string
	 */
	protected $namespace = 'optiontics/v1';

	/**
	 * REST route base.
	 *
	 * @var string
	 */
	protected $rest_base = 'extensions';

	// =========================================================================
	// ROUTE REGISTRATION
	// =========================================================================

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
				],
			]
		);
	}

	// =========================================================================
	// HANDLERS
	// =========================================================================

	/**
	 * GET /extensions — returns plugin list with live status.
	 *
	 * @param  \WP_REST_Request $request
	 * @return \WP_HTTP_Response
	 */
	public function get_items( $request ) {
		$type = ! empty( $request['type'] ) ? sanitize_text_field( $request['type'] ) : 'our-plugins';

		if ( $type !== 'our-plugins' ) {
			return $this->error( __( 'Invalid type provided', 'optiontics' ) );
		}

		return $this->response( $this->get_our_plugins_with_status() );
	}

	// =========================================================================
	// PERMISSION CHECKS
	// =========================================================================

	/**
	 * @return bool
	 */
	public function get_items_permissions_check( $request ): bool {
		return current_user_can( 'manage_options' ) || optiontics_is_dokan_vendor();
	}

	// =========================================================================
	// PRIVATE HELPERS
	// =========================================================================

	/**
	 * Returns sibling Arraytics plugins with live install/activate status resolved via PluginManager.
	 *
	 * @return array
	 */
	private function get_our_plugins_with_status(): array {
		$plugins = function_exists( 'optiontics_our_plugins_list' ) ? optiontics_our_plugins_list() : [];

		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		foreach ( $plugins as $key => &$plugin ) {
			$slug = isset( $plugin['slug'] ) ? $plugin['slug'] : $key;

			if ( PluginManager::is_activated( $slug ) ) {
				$plugin['status'] = 'deactivate';
			} elseif ( PluginManager::is_installed( $slug ) ) {
				$plugin['status'] = 'activate';
			} else {
				$plugin['status'] = 'install';
			}
		}
		unset( $plugin );

		return array_values( $plugins );
	}
}
