<?php
namespace Optiontics\Assets;

use Optiontics\Providers\Base_Service_Provider;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * AssetsServiceProvider will responsible for all assets services
 *
 * @package Optiontics/Assets
 */

class Assets_Service_Provider extends Base_Service_Provider {

    /**
     * Store services
     *
     * @var array
     */
    protected $services = [
        Admin_Assets::class,
        Frontend_Assets::class,
        Common_Assets::class
    ];

    /**
     * Register services
     *
     * @return  array
     */
    public function get_services() {
        return apply_filters( 'optiontics_assets_services', $this->services );
    }
}
