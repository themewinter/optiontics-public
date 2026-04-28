<?php
namespace Optiontics\Providers;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Global service provider that will responsible for all service provider
 *
 * @package Optiontics/Providers
 */

use Optiontics\Admin\Admin_Service_Provider;
use Optiontics\Assets\Assets_Service_Provider;
use Optiontics\Contracts\Provider_Contract;
use Optiontics\Contracts\Switchable_Provider_Contract;
use Optiontics\Core\Blocks\Option_Block_Service_Provider;
use Optiontics\Core\Integrations\WooCommerce\WC_Integration_Service_Provider;
use Optiontics\Core\Integrations\WooCommerce\Products\Products_Service_Provider;
use Optiontics\Core\Upgrades\Migration_Service_Provider;
use Optiontics\Core\Extensions\Extension_Service_Provider;
use Optiontics\Core\Integrations\Dokan\Dokan_Service_Provider;
use Optiontics\Core\Analytics\Analytics_Service_Provider;
use Optiontics\Core\AI\AI_Service_Provider;
use Optiontics\Core\Settings\Settings_Service_Provider;
/**
 * GlobalService Provider class
 */
class Global_Service_Provider implements Provider_Contract {
    /**
     * Store container
     *
     * @var Container
     */
    protected $container;

    /**
     * Store service providers
     *
     * @var array
     */
    protected $providers = [
        'admin'         => Admin_Service_Provider::class,
        'assets'        => Assets_Service_Provider::class,
        'option_block'  => Option_Block_Service_Provider::class,
        'wc_integration' => WC_Integration_Service_Provider::class,
        'wc_products'   => Products_Service_Provider::class,
        'migration'     => Migration_Service_Provider::class,
        'dokan'         => Dokan_Service_Provider::class,
        'extensions'    => Extension_Service_Provider::class,
        'analytics'     => Analytics_Service_Provider::class,
        'ai'            => AI_Service_Provider::class,
        'settings'      => Settings_Service_Provider::class,
    ];

    /**
     * GlobalServiceProvider
     *
     * @return  void
     */
    public function __construct() {
        $this->container = optiontics_container();
        $this->register();
        $this->boot();
    }

    /**
     * Register all module providers
     *
     * @return  void
     */
    public function register() {
        $providers = $this->get_providers();

        if ( $providers ) {
            foreach( $providers as $key => $provider ) {
                $this->container->add_service_provider( $key, $provider );
            }
        }
    }

    /**
     * Boot all services from providers
     *
     * @return  void
     */
    public function boot() {
        $providers = $this->get_providers();

        if ( $providers ) {
            foreach( $providers as $provider_name => $provider ) {
                $provider = $this->container->get( $provider_name );

                if ( $provider instanceof Switchable_Provider_Contract  ) {
                    if ( $provider->is_enable() ) {
                        $provider->boot();
                    }
                } else {
                    $provider->boot();
                }
            }
        }
    }

    /**
     * Get providers
     *
     * @return  array The providers.
     */
    private function get_providers() {
        return apply_filters( 'optiontics_service_providers', $this->providers );
    }
}

