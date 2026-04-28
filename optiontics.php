<?php
/**
 * Plugin Name:        Optiontics 
 * Description:        Optiontics is a plugin for WordPress that allows you to create and manage your fields.
 * Version:            1.0.4
 * Author:             Arraytics
 * Author URI:         https://arraytics.com
 * Plugin URI:         https://themewinter.com/optiontics
 * License:            GPL-2.0+
 * License URI:        http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:        optiontics
 * Domain Path:       /languages
 * Requires at least: 6.2
 * Requires PHP:      7.4
 */

defined( 'ABSPATH' ) || exit;

use Optiontics\Init;
use Optiontics\Container\Container;
use Optiontics\Providers\Global_Service_Provider;

require_once __DIR__ . '/vendor/autoload.php';


// Define constant for the Plugin file.
defined( 'OPTIONTICS_FILE' ) || define( 'OPTIONTICS_FILE', __FILE__ );
defined( 'OPTIONTICS_DIR' ) || define( 'OPTIONTICS_DIR', __DIR__ );
defined( 'OPTIONTICS_VERSION' ) || define( 'OPTIONTICS_VERSION', '1.0.4' );


global $optiontics_container;

$optiontics_container = new Container();

$optiontics_container->add_service_provider( 'global', Global_Service_Provider::class );

/**
 * optiontics container
 *
 * @return  Container
 */
function optiontics_container() {
    global $optiontics_container;

    return $optiontics_container;
}

/**
 * Main plugin initialization
 *
 * @return Optiontics
 */
function optiontics() {
    return Init::instance();
}

// Kick-off the plugin.
optiontics();