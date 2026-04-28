<?php
/**
 * Settings REST Controller
 *
 * Endpoints under optiontics/v1/settings — get, update, and a public
 * (unauthenticated) read that returns only a whitelisted subset.
 *
 * @package Optiontics\Core\Settings\Controllers
 * @since   1.0.4
 */

namespace Optiontics\Core\Settings\Controllers;

use Optiontics\Abstract\Base_Rest_Controller;
use Optiontics\Core\Settings\Settings;
use WP_REST_Request;
use WP_REST_Server;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Settings_Controller
 */
class Settings_Controller extends Base_Rest_Controller {

	/**
	 * Keys safe to expose on the unauthenticated /settings/public endpoint.
	 *
	 * Start empty — extend via the optiontics_public_setting_keys filter as
	 * genuine frontend needs appear. Never list anything that carries a secret
	 * (API keys, webhook URLs, credentials).
	 *
	 * @var string[]
	 */
	private const PUBLIC_SETTING_KEYS = [];

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
	protected $rest_base = 'settings';

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
					'callback'            => [ $this, 'get_settings' ],
					'permission_callback' => [ $this, 'get_settings_check_permissions' ],
				],
				[
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => [ $this, 'update_settings' ],
					'permission_callback' => [ $this, 'update_settings_check_permissions' ],
				],
			]
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/public',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_public_settings' ],
					'permission_callback' => '__return_true',
				],
			]
		);
	}

	// =========================================================================
	// HANDLERS
	// =========================================================================

	/**
	 * GET /settings — full settings map (admin only).
	 *
	 * @param  WP_REST_Request $request
	 * @return \WP_HTTP_Response
	 */
	public function get_settings( $request ) {
		$settings = Settings::get();

		/**
		 * Filter the full settings payload before it is returned.
		 *
		 * @param array $settings
		 */
		$settings = (array) apply_filters( 'optiontics_settings', $settings );

		return $this->response( $settings );
	}

	/**
	 * POST/PUT /settings — merge a partial payload into stored settings.
	 *
	 * @param  WP_REST_Request $request
	 * @return \WP_HTTP_Response
	 */
	public function update_settings( $request ) {
		$params = $request->get_params();

		// Strip REST routing params that WP injects into get_params().
		unset( $params['_locale'], $params['rest_route'] );

		if ( ! is_array( $params ) || empty( $params ) ) {
			return $this->error( __( 'No settings provided.', 'optiontics' ) );
		}

		Settings::update( $params );

		do_action( 'optiontics_settings_updated', $params );

		return $this->get_settings( $request );
	}

	/**
	 * GET /settings/public — whitelisted keys, no auth.
	 *
	 * @param  WP_REST_Request $request
	 * @return \WP_HTTP_Response
	 */
	public function get_public_settings( $request ) {
		$all = Settings::get();

		/**
		 * Filter the list of keys exposed on the public settings endpoint.
		 *
		 * @param string[] $keys
		 */
		$public_keys = (array) apply_filters( 'optiontics_public_setting_keys', self::PUBLIC_SETTING_KEYS );

		$public = array_intersect_key( $all, array_flip( $public_keys ) );

		return $this->response( $public );
	}

	// =========================================================================
	// PERMISSIONS
	// =========================================================================

	/**
	 * @return bool
	 */
	public function get_settings_check_permissions(): bool {
		return current_user_can( 'manage_options' );
	}

	/**
	 * @return bool
	 */
	public function update_settings_check_permissions(): bool {
		return current_user_can( 'manage_options' );
	}
}
