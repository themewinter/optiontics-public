<?php
namespace Optiontics\Assets;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Manage all admin scripts and styles
 */
class Admin_Assets extends Base_Assets {
    /**
     * Register single service
     *
     * @return  void
     */
    public function register() {
        add_action( 'admin_enqueue_scripts',  [$this, 'register_styles_scripts'] );
        add_action( 'admin_enqueue_scripts',  [$this, 'enqueue'] );
        add_action( 'admin_enqueue_scripts',  [$this, 'i18n_loader'] );
    }

    /**
     * Enqueue scripts and styles
     *
     * @return  void
     */
    public function enqueue( $top ) {
        if ( 'toplevel_page_optiontics' !== $top ) {
            return;
        }
        wp_enqueue_media();
        wp_enqueue_style( 'optiontics-admin-style' );
        wp_enqueue_script( 'optiontics-dashboard-scripts' );
        wp_localize_script( 'optiontics-dashboard-scripts', 'optiontics', Localize::get_admin() );
        wp_set_script_translations( 'optiontics-dashboard-scripts', 'optiontics' );
    }

    /**
     * Load i18n
     *
     * @return  void
     */
    public function i18n_loader() {
        $locale = get_locale();

        if ( '' === $locale || 'en_US' === $locale ) {
            return;
        }

        $state = wp_json_encode( [
            'baseUrl'     => content_url( '/languages/' ) . '/',
            'locale'      => $locale,
            'domainMap'   => (object) [],
            'domainPaths' => (object) [],
        ] );

        wp_add_inline_script(
            'optiontics-i18n',
            "window.optionticsI18nLoader = { state: {$state} };",
            'before'
        );
    }


    /**
     * Get all scripts
     *
     * @return  array List register scripts
     */
    public function get_scripts() {
         $scripts = [
            'optiontics-dashboard-scripts'     => [
                'src'       => optiontics()->assets_url . '/build/js/dashboard.js',
                'deps'      => [],
                'in_footer' => true,
            ],
            'optiontics-wpcafe-migration'     => [
                'src'       => optiontics()->assets_url . '/build/js/wpcafe-migration.js',
                'deps'      => ['jquery'],
                'in_footer' => true,
            ],
        ];

        $scripts =  apply_filters( 'optiontics_admin_scripts', $scripts );

        return $scripts;
    }

    /**
     * List of register styles
     *
     * @return  array
     */
    public function get_styles() {
        $styles = [
              'optiontics-admin-style'    => [
                'src' => optiontics()->assets_url . '/build/css/admin.css',
            ],
        ];

        return apply_filters( 'optiontics_admin_styles', $styles );
    }
}