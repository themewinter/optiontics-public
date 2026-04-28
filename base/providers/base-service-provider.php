<?php
namespace Optiontics\Providers;

use Optiontics\Contracts\Provider_Contract;
use Optiontics\Contracts\Switchable_Service_Contract;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * BaseServiceProvider will responsible for all optiontics services
 *
 * @package Optiontics/Providers
 */
abstract class Base_Service_Provider {
    /**
     * Store container
     *
     * @var Container
     */
    protected $container;

    /**
     * Constructor for BaseServiceProvider class
     *
     * @return  void
     */
    public function boot() {
        add_action( 'init', [ $this, 'register' ], 20 );
    }

    /**
     * Register services
     *
     * @return  void
     */
    public function register() {
        $services = $this->get_services();

        if ( $services ) {
            foreach( $services as $service ) {
                $object = new $service();
                if ( $object instanceof Switchable_Service_Contract ) {
                    if ( $object->is_enable() ) {
                        $object->register();
                    }
                } else {
                    // If it's not switchable, always register
                    $object->register();
                }
            }
        }
    }

    /**
     * Get services
     *
     * @return  array service lists
     */
    abstract public function get_services();
}
