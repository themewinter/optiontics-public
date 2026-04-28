<?php
/**
 * Extension Service Provider
 *
 * Bootstraps the Extensions REST API controllers (About Us — Our Plugins).
 *
 * @package Optiontics\Core\Extensions
 * @since   1.0.4
 */

namespace Optiontics\Core\Extensions;

use Optiontics\Providers\Base_Service_Provider;
use Optiontics\Core\Extensions\Controllers\Extension_Controller;
use Optiontics\Core\Extensions\Controllers\Plugin_Controller;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Extension_Service_Provider
 */
class Extension_Service_Provider extends Base_Service_Provider {

	/**
	 * Services this provider bootstraps.
	 *
	 * @var array<class-string>
	 */
	protected $services = [
		Extension_Controller::class,
		Plugin_Controller::class,
	];

	/**
	 * {@inheritdoc}
	 *
	 * @return array<class-string>
	 */
	public function get_services() {
		return apply_filters( 'optiontics_extension_services', $this->services );
	}
}
