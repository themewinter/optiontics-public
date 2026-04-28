<?php
namespace Optiontics\Assets;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Manage all frontend scripts and styles
 */
class Frontend_Assets extends Base_Assets {
    /**
     * Register single service
     *
     * @return  void
     */
    public function register() {
        add_action( 'wp_enqueue_scripts',  [$this, 'register_styles_scripts'] );
        add_action( 'wp_enqueue_scripts',  [$this, 'enqueue'] );
    }

    /**
     * Enqueue scripts and styles
     *
     * Only loads on product pages, cart, and checkout to avoid unnecessary
     * asset loading on unrelated pages.
     *
     * @return  void
     */
    public function enqueue() {
        if ( ! is_product() && ! is_cart() && ! is_checkout() ) {
            return;
        }

        wp_enqueue_style( 'optiontics-frontend-style' );
        wp_enqueue_script( 'optiontics-frontend' );
        wp_localize_script( 'optiontics-frontend', 'optiontics',  Localize::get_frontend() );
    }

    /**
     * Get all scripts
     *
     * @return  array List register scripts
     */
    public function get_scripts() {
        $scripts = [
            'optiontics-frontend' => [
                'src' => optiontics()->assets_url . '/build/js/frontend.js',
                'deps' => ['jquery'],
                'in_footer' => true,
            ],
            'optiontics-dokan-multivendor-dashboard' => [
                'src' => optiontics()->assets_url . '/build/js/dashboard.js',
                'deps' => ['jquery'],
                'in_footer' => true,
            ],
            'optiontics-dokan-order-addons' => [
                'src' => optiontics()->assets_url . '/build/js/dokan-order-addons.js',
                'deps' => ['jquery'],
                'in_footer' => true,
            ]
        ];

        return apply_filters( 'optiontics_frontend_scripts', $scripts );
    }

    /**
     * List of register styles
     *
     * @return  array
     */
    public function get_styles() {
        $styles = [
            'optiontics-frontend-style'    => [
                'src' => optiontics()->assets_url . '/build/css/frontend.css',
            ],
            'optiontics-block-style'    => [
                'src' => optiontics()->assets_url . '/build/css/block.css',
            ],
            'optiontics-admin-style'    => [
                'src' => optiontics()->assets_url . '/build/css/admin.css',
            ],
        ];

        return apply_filters( 'optiontics_frontend_styles', $styles );
    }
}