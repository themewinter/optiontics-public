<?php
namespace Optiontics\Core\Upgrades;

use Optiontics\Providers\Base_Service_Provider;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Migration_Service_Provider handles migration services
 *
 * @package Optiontics/Core/Upgrades
 */
class Migration_Service_Provider extends Base_Service_Provider {
    /**
     * Store services
     *
     * @var array
     */
    protected $services = [
        Migration_Controller::class,
        Migration_Notice::class,
    ];

    /**
     * Register services
     *
     * @return  void
     */
    public function get_services() {
        return $this->services;
    }
}
