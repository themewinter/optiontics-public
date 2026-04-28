<?php
/**
 * Init Main Class
 *
 * @package Optiontics/Init
 */

namespace Optiontics;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Class Init
 */
class Init {

    /**
     * Plugin version.
     *
     * @var string
     */
    public $version;

    /**
     * Plugin file.
     *
     * @var string
     */
    public $plugin_file;

    /**
     * Plugin directory.
     *
     * @var string
     */
    public $plugin_directory;

    /**
     * @var string
     */
    public $build_url;

    /**
     * Plugin base name.
     *
     * @var string
     */
    public $basename;

    /**
     * Plugin text directory path.
     *
     * @var string
     */
    public $text_domain_directory;

    /**
     * Plugin text directory path.
     *
     * @var string
     */
    public $template_directory;

    /**
     * Plugin assets directory path.
     *
     * @var string
     */
    public $assets_url;

    /**
     * Plugin url.
     *
     * @var string
     */
    public $plugin_url;

    /**
     * Container that holds all the services.
     *
     * @var Container
     */
    public $container;

    /**
     * Core directory.
     *
     * @var string
     */
    public $core_directory;

    /**
     * Boiler Constructor.
     */
    public function __construct() {
        $this->init();

        add_action( 'init', [ $this, 'init_classes' ] );

        register_activation_hook( $this->plugin_file, [ $this, 'activate' ]);

        register_deactivation_hook($this->plugin_file, [ $this, 'deactivate' ] );
    }

    /**
     * Initialize the plugin.
     *
     * @return void
     */
    protected function init(): void {
        $this->version               = OPTIONTICS_VERSION;
        $this->plugin_file           = OPTIONTICS_FILE;
        $this->plugin_directory      = OPTIONTICS_DIR;
        $this->basename              = plugin_basename( $this->plugin_file );
        $this->text_domain_directory = $this->plugin_directory . '/languages';
        $this->template_directory    = $this->plugin_directory . '/templates';
        $this->plugin_url            = plugins_url( '', $this->plugin_file );
        $this->assets_url            = $this->plugin_url . '/assets';
        $this->build_url             = $this->plugin_url . '/build';
        $this->core_directory        = $this->plugin_directory . '/core';
    }

    /**
     * Init classes
     *
     * @return  void
     */
    public function init_classes() {
        $this->get_container()->get('global');
    }

    /**
     * Get container
     *
     * @return  Container
     */
    public function get_container() {
        return optiontics_container();
    }

    /**
     * Initializes the Optiontics class.
     *
     * Checks for an existing Optiontics instance
     * and if it doesn't find one, creates it.
     *
     * @return Init
     */
    public static function instance(): Init {
        static $instance = false;

        if ( ! $instance ) {
            $instance = new self();
        }

        return $instance;
    }

    /**
     * Trigger plugin activation class
     *
     * @return void
     */
    public function activate() {
        Activate::run();
    }

    /**
     * Trigger plugin deactivation class
     *
     * @return void
     */
    public function deactivate() {
        Deactivate::run();
    }
}
