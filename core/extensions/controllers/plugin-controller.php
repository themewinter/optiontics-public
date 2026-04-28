<?php
/**
 * Plugin Controller
 *
 * Handles install / activate / deactivate actions for sibling Arraytics plugins.
 * Endpoint: PUT optiontics/v1/plugins
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
 * Class Plugin_Controller
 */
class Plugin_Controller extends Base_Rest_Controller {

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
	protected $rest_base = 'plugins';

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
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => [ $this, 'update_item' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
				],
			]
		);
	}

	// =========================================================================
	// HANDLERS
	// =========================================================================

	/**
	 * PUT /plugins — install, activate, or deactivate a sibling plugin.
	 *
	 * @param  \WP_REST_Request $request
	 * @return \WP_HTTP_Response
	 */
	public function update_item( $request ) {
		$input  = json_decode( $request->get_body(), true );
		$name   = ! empty( $input['name'] )   ? sanitize_text_field( $input['name'] )   : '';
		$status = ! empty( $input['status'] ) ? sanitize_text_field( $input['status'] ) : '';

		$allowed_statuses = [ 'install', 'activate', 'deactivate' ];

		if ( ! $name ) {
			return $this->error( __( 'Please provide a plugin name.', 'optiontics' ) );
		}

		if ( ! $status || ! in_array( $status, $allowed_statuses, true ) ) {
			return $this->error( __( 'Invalid status. Allowed: install, activate, deactivate.', 'optiontics' ) );
		}

		// Resolve the WordPress.org slug from our plugin list.
		$our_plugins = function_exists( 'optiontics_our_plugins_list' ) ? optiontics_our_plugins_list() : [];
		$slug        = isset( $our_plugins[ $name ]['slug'] ) ? $our_plugins[ $name ]['slug'] : $name;

		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$result = false;

		if ( $status === 'install' ) {
			$result = PluginManager::install_plugin( $slug );
		}

		if ( $status === 'activate' ) {
			if ( ! PluginManager::is_installed( $slug ) ) {
				$installed = PluginManager::install_plugin( $slug );
				if ( ! $installed ) {
					return $this->error( __( 'Plugin installation failed.', 'optiontics' ) );
				}
			}
			$result = PluginManager::activate_plugin( $slug );
		}

		if ( $status === 'deactivate' && PluginManager::is_activated( $slug ) ) {
			$result = PluginManager::deactivate_plugin( $slug );
		}

		if ( ! $result ) {
			/* translators: %s: action status (install, activate, or deactivate) */
			return $this->error( sprintf( __( "Plugin couldn't %s.", 'optiontics' ), $status ) );
		}

		return $this->response( [ 'message' => __( 'Successfully updated.', 'optiontics' ) ] );
	}

	// =========================================================================
	// PERMISSION CHECKS
	// =========================================================================

	/**
	 * @return bool
	 */
	public function update_item_permissions_check( $request ): bool {
		return current_user_can( 'manage_options' );
	}
}
