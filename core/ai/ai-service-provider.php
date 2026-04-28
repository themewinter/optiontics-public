<?php
/**
 * AI Service Provider
 *
 * Registers the AI REST controller.
 *
 * @package Optiontics\Core\AI
 * @since   2.1.0
 */

namespace Optiontics\Core\AI;

use Optiontics\Providers\Base_Service_Provider;
use Optiontics\Core\AI\Controllers\AI_Controller;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class AI_Service_Provider
 */
class AI_Service_Provider extends Base_Service_Provider {

	/**
	 * @var array<class-string>
	 */
	protected $services = [
		AI_Controller::class,
	];

	public function get_services() {
		return apply_filters( 'optiontics_ai_services', $this->services );
	}
}
