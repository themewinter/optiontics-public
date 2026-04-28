<?php
/**
 * Option Block Service Provider
 *
 * Bootstraps the Option Block REST API controller.
 *
 * @package Optiontics\Core\Blocks
 * @since   1.0.0
 */

namespace Optiontics\Core\Blocks;

use Optiontics\Providers\Base_Service_Provider;
use Optiontics\Core\Blocks\Controllers\Option_Block_Controller;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Option_Block_Service_Provider
 */
class Option_Block_Service_Provider extends Base_Service_Provider {

	/**
	 * Services this provider bootstraps.
	 *
	 * @var array<class-string>
	 */
	protected $services = [
		Option_Block_Controller::class,
	];

	/**
	 * {@inheritdoc}
	 *
	 * Allows third-party code to add/remove option-block services at runtime.
	 *
	 * @return array<class-string>
	 */
	public function get_services() {
		return apply_filters( 'optiontics_option_block_services', $this->services );
	}
}
