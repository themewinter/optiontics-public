<?php
/**
 * Dokan Integration Service Provider
 *
 * @package Optiontics\Core\Integrations\Dokan
 * @since   1.0.0
 */

namespace Optiontics\Core\Integrations\Dokan;

use Optiontics\Providers\Base_Service_Provider;
use Optiontics\Contracts\Switchable_Provider_Contract;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Dokan_Service_Provider
 *
 * Bootstraps Dokan multi-vendor integration (vendor dashboard + order hooks).
 * The provider is skipped entirely when Dokan is not active.
 */
class Dokan_Service_Provider extends Base_Service_Provider implements Switchable_Provider_Contract {

	/**
	 * Services this provider bootstraps.
	 *
	 * @var array<class-string>
	 */
	protected $services = [
		Vendor_Dashboard::class,
		Dokan_Hooks::class,
	];

	/**
	 * Boot — deferred until plugins_loaded to ensure Dokan is fully initialised.
	 *
	 * @return void
	 */
	public function boot() {
		if ( did_action( 'plugins_loaded' ) ) {
			$this->register();
		} else {
			add_action( 'plugins_loaded', [ $this, 'register' ], 20 );
		}
	}

	/**
	 * {@inheritdoc}
	 *
	 * @return array<class-string>
	 */
	public function get_services() {
		return apply_filters( 'optiontics_dokan_services', $this->services );
	}

	/**
	 * This provider only activates when Dokan is loaded.
	 *
	 * @return bool
	 */
	public function is_enable() {
		return function_exists( 'dokan' ) || class_exists( 'WeDevs_Dokan' );
	}
}
