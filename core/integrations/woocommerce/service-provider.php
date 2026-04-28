<?php
/**
 * WooCommerce Integration Service Provider
 *
 * Bootstraps all WooCommerce integration services.
 *
 * @package Optiontics\Core\Integrations\WooCommerce
 * @since   1.0.0
 */

namespace Optiontics\Core\Integrations\WooCommerce;

use Optiontics\Providers\Base_Service_Provider;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class WC_Integration_Service_Provider
 *
 * Bootstraps the WooCommerce integration layer: product views, cart hooks,
 * and product-assignment service.
 */
class WC_Integration_Service_Provider extends Base_Service_Provider {

	/**
	 * Services this provider bootstraps.
	 *
	 * @var array<class-string>
	 */
	protected $services = [
		WC_Services::class,
	];

	/**
	 * {@inheritdoc}
	 *
	 * Allows third-party code to add/remove WC integration services at runtime.
	 *
	 * @return array<class-string>
	 */
	public function get_services() {
		return apply_filters( 'optiontics_wc_integration_services', $this->services );
	}
}
