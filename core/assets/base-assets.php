<?php
namespace Optiontics\Assets;

use Optiontics\Contracts\Hookable_Service_Contract;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Main assets management class
 */
abstract class Base_Assets implements Hookable_Service_Contract {
    /**
     * Get all scripts
     *
     * @return  array list of script to register
     */
    abstract public function get_scripts();

    /**
     * Get all styles
     *
     * @return  array   list of styles to regiser
     */
    abstract public function get_styles();

    /**
     * Register scripts and styles
     *
     * @return  void
     */
    public function register_styles_scripts() {
        $this->register_global_scripts();
        $this->register_scripts();
        $this->register_styles();
    }

    /**
     * Register scripts
     *
     * @param  array $scripts
     *
     * @return void
     */
    public function register_scripts() {
        $scripts = $this->get_scripts();

        foreach ( $scripts as $handle => $script ) {
            $deps      = isset( $script['deps'] ) ? $script['deps'] : [];
            $in_footer = isset( $script['in_footer'] ) ? $script['in_footer'] : true;
            $version   = isset( $script['version'] ) ? $script['version'] : $this->get_version( $script['src'] );

            $deps = $this->get_dependencies( $script['src'], $deps );

            if ( in_array( 'wp-i18n', $deps ) ) {
                $deps[] = 'optiontics-i18n';
            }

            wp_register_script( $handle, $script['src'], $deps, $version, $in_footer );
        }
    }

    /**
     * Register global scripts
     *
     * @return  void
     */
    private function register_global_scripts() {
        $scripts = [
            'optiontics-i18n' => [
                'src' => optiontics()->assets_url . '/build/js/i18n-loader.js',
            ],
        ];

        foreach ( $scripts as $handle => $script ) {
            $deps      = isset( $script['deps'] ) ? $script['deps'] : [];
            $in_footer = isset( $script['in_footer'] ) ? $script['in_footer'] : true;
            $version   = isset( $script['version'] ) ? $script['version'] : $this->get_version( $script['src'] );

            $deps = $this->get_dependencies( $script['src'], $deps );

            wp_register_script( $handle, $script['src'], $deps, $version, $in_footer );
        }

    }

    /**
     * Register styles
     *
     * @param  array $styles
     *
     * @return void
     */
    public function register_styles() {
        $styles = $this->get_styles();

        foreach ( $styles as $handle => $style ) {
            $deps    = isset( $style['deps'] ) ? $style['deps'] : false;
            $version = optiontics()->version;

            wp_register_style( $handle, $style['src'], $deps, $version );
        }
    }

    /**
     * Get script and style file dependencies
     *
     * @param   string  $file_name
     * @param   array  $deps
     *
     * @return  array
     */
    private function get_dependencies( $file_name, $deps = [] ) {
        $assets = $this->get_file_assets( $file_name );

        $assets_deps = ! empty( $assets['dependencies'] ) ? $assets['dependencies'] : [];

        $merged_deps = array_merge( $assets_deps, $deps );

        return $merged_deps;
    }

    /**
     * Get file assets
     *
     * @param   string  $file_name
     *
     * @return  array
     */
    private function get_file_assets( $file_url ) {
        $file   = $this->get_file_path( $file_url );
        $assets = [];

        if ( file_exists( $file ) ) {
            $assets = include $file;
        }

        return $assets;
    }

    /**
     * Get script file version
     *
     * @param   string  $file_name
     *
     * @return  string
     */
    private function get_version( $file_name ) {
        $assets      = $this->get_file_assets( $file_name );
        $assets_vers = ! empty( $assets['version'] ) ? $assets['version'] : optiontics()->version;
        return $assets_vers;
    }

    /**
     * Get file path from url
     *
     * @param   string  $url
     *
     * @return string
     */
    private function get_file_path( $url ) {
        // Check if the URL is valid
        if ( ! filter_var( $url, FILTER_VALIDATE_URL ) ) {
            return false;
        }

        // Parse the URL
        $url_parts = wp_parse_url( $url );

        // Check if the URL has a path component
        if ( ! isset( $url_parts['path'] ) ) {
            return false; // URL does not contain a path
        }

        $clean_path = str_replace( '.js', '.asset.php', $url_parts['path'] );

        // Get the file path from the URL path.
        if ( isset( $_SERVER['DOCUMENT_ROOT'] ) ) {
            $file_path = sanitize_text_field( wp_unslash( $_SERVER['DOCUMENT_ROOT'] ) ) . $clean_path;
        } else {
            $file_path = ''; // Or another appropriate fallback.
        }

        // Check if the file exists
        if ( ! file_exists( $file_path ) ) {
            return false; // File does not exist
        }

        return $file_path;
    }
}

