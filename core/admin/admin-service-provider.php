<?php
namespace Optiontics\Admin;
use Optiontics\Providers\Base_Service_Provider;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Admin_Service_Provider will responsible for all admin services
 *
 * @package Optiontics/Admin
 */

class Admin_Service_Provider extends Base_Service_Provider {
    /**
     * Store services
     *
     * @var array
     */
    protected $services = [
        Menu::class,
        Plugin_Action_Links::class,
    ];

    /**
     * Register services
     *
     * @return  void
     */
    public function get_services() {
        return apply_filters( 'optiontics_admin_services',  $this->services );
    }
}