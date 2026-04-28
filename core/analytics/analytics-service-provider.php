<?php
/**
 * Analytics Service Provider
 *
 * Bootstraps the Analytics REST API controller.
 *
 * @package Optiontics\Core\Analytics
 * @since   1.1.0
 */

namespace Optiontics\Core\Analytics;

use Optiontics\Providers\Base_Service_Provider;
use Optiontics\Core\Analytics\Controllers\Analytics_Controller;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Analytics_Service_Provider
 */
class Analytics_Service_Provider extends Base_Service_Provider {

	/**
	 * Services this provider bootstraps.
	 *
	 * @var array<class-string>
	 */
	protected $services = [
		Analytics_Controller::class,
	];

	/**
	 * {@inheritdoc}
	 *
	 * @return array<class-string>
	 */
	public function get_services() {
		return apply_filters( 'optiontics_analytics_services', $this->services );
	}
}
