<?php
/**
 * WooCommerce Products Service Provider
 *
 * Bootstraps the product, category, tag, and brand REST controllers.
 *
 * @package Optiontics\Core\Integrations\WooCommerce\Products
 * @since   1.0.0
 */

namespace Optiontics\Core\Integrations\WooCommerce\Products;

use Optiontics\Providers\Base_Service_Provider;
use Optiontics\Contracts\Switchable_Provider_Contract;
use Optiontics\Core\Integrations\WooCommerce\Products\Controllers\Product_Controller;
use Optiontics\Core\Integrations\WooCommerce\Products\Controllers\Product_Category_Controller;
use Optiontics\Core\Integrations\WooCommerce\Products\Controllers\Product_Brand_Controller;
use Optiontics\Core\Integrations\WooCommerce\Products\Controllers\Product_Tag_Controller;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Products_Service_Provider
 *
 * Registers the WooCommerce products REST API controllers.
 * The entire provider is silently skipped when WooCommerce is not active.
 */
class Products_Service_Provider extends Base_Service_Provider implements Switchable_Provider_Contract {

	/**
	 * Services this provider bootstraps.
	 *
	 * @var array<class-string>
	 */
	protected $services = [
		Product_Controller::class,
		Product_Category_Controller::class,
		Product_Brand_Controller::class,
		Product_Tag_Controller::class,
	];

	/**
	 * {@inheritdoc}
	 *
	 * @return array<class-string>
	 */
	public function get_services() {
		return apply_filters( 'optiontics_wc_products_services', $this->services );
	}

	/**
	 * This provider only activates when WooCommerce is loaded.
	 *
	 * @return bool
	 */
	public function is_enable() {
		return function_exists( 'WC' );
	}
}
