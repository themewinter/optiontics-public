<?php
/**
 * WooCommerce Services Orchestrator
 *
 * @package Optiontics\Core\Integrations\WooCommerce
 * @since   2.0.0
 */

namespace Optiontics\Core\Integrations\WooCommerce;

use Optiontics\Contracts\Hookable_Service_Contract;
use Optiontics\Contracts\Switchable_Service_Contract;
use Optiontics\Core\Integrations\WooCommerce\Views\Product_Form_View;
use Optiontics\Core\Integrations\WooCommerce\Cart\Addon_Cart_Handler;
use Optiontics\Core\Integrations\WooCommerce\Services\Assign_Product;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class WC_Services
 *
 * Responsible only for instantiating the WC integration layer and
 * toggling the feature when WooCommerce is not active.
 */
class WC_Services implements Hookable_Service_Contract, Switchable_Service_Contract {

	/**
	 * Instantiate and register all WC integration services.
	 *
	 * @return void
	 */
	public function register(): void {
		new Product_Form_View();
		new Addon_Cart_Handler();
		new Assign_Product();
	}

	/**
	 * This service is only active when WooCommerce is loaded.
	 *
	 * @return bool
	 */
	public function is_enable(): bool {
		return function_exists( 'WC' );
	}
}
