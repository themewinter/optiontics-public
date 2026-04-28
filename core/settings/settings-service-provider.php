<?php
/**
 * Settings Service Provider
 *
 * Bootstraps the Settings REST controller on the init hook via the
 * Base_Service_Provider pattern.
 *
 * @package Optiontics\Core\Settings
 * @since   1.0.4
 */

namespace Optiontics\Core\Settings;

use Optiontics\Providers\Base_Service_Provider;
use Optiontics\Core\Settings\Controllers\Settings_Controller;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Settings_Service_Provider
 */
class Settings_Service_Provider extends Base_Service_Provider {

	/**
	 * Services this provider bootstraps.
	 *
	 * @var array<class-string>
	 */
	protected $services = [
		Settings_Controller::class,
	];

	/**
	 * {@inheritdoc}
	 *
	 * @return array<class-string>
	 */
	public function get_services() {
		return apply_filters( 'optiontics_settings_services', $this->services );
	}
}
