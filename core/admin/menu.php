<?php
namespace Optiontics\Admin;

use Optiontics\Contracts\Hookable_Service_Contract;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Menu class. Register menus
 *
 * @package Optiontics/AdminMenu
 */
class Menu implements Hookable_Service_Contract {
    /**
     * Register hooks
     *
     * @return  void
     */
    public function register() {
        add_action( 'admin_menu', [ $this, 'register_admin_menu' ] );
    }
    /**
     * Register admin menu
     * @return  void
     */ 

     public function register_admin_menu() {
        global $submenu;
        $capability               = 'manage_options';
        $slug                     = 'optiontics';
        $url                      = 'admin.php?page=' . $slug . '#';

        $menu_items = array(
            array(
                'id'         => 'dashboard',
                'title'      => esc_html__( 'Dashboard', 'optiontics' ),
                'link'       => '/analytics',
                'capability' => apply_filters( 'optiontics_menu_permission_dashboard', $capability ),
                'position'   => apply_filters( 'optiontics_menu_position_dashboard', 1 ),
            ),
            array(
                'id'         => 'Options',
                'title'      => esc_html__( 'Options', 'optiontics' ),
                'link'       => '/',
                'capability' => apply_filters( 'optiontics_menu_permission', $capability ),
                'position'   => apply_filters( 'optiontics_menu_position', 2 ),
            ),
            array(
                'id'         => 'templates',
                'title'      => esc_html__( 'Templates', 'optiontics' ),
                'link'       => '/templates-list',
                'capability' => apply_filters( 'optiontics_menu_permission_templates', $capability ),
                'position'   => apply_filters( 'optiontics_menu_position_templates', 3 ),
            ),
            array(
                'id'         => 'settings',
                'title'      => esc_html__( 'Settings', 'optiontics' ),
                'link'       => '/settings',
                'capability' => apply_filters( 'optiontics_menu_permission_settings', $capability ),
                'position'   => apply_filters( 'optiontics_menu_position_settings', 4 ),
            ),
            array(
                'id'         => 'about',
                'title'      => esc_html__( 'About Us', 'optiontics' ),
                'link'       => '/about',
                'capability' => apply_filters( 'optiontics_menu_permission_about', $capability ),
                'position'   => apply_filters( 'optiontics_menu_position_about', 5 ),
            ),
        );

        $svg_icon      =  optiontics()->assets_url . '/images/brand_icon.svg';
        // $svg_icon = 'data:image/svg+xml;base64,' . base64_encode( $svg );

        add_menu_page(
            esc_html__( 'Optiontics', 'optiontics' ),
            esc_html__( 'Optiontics', 'optiontics' ),
            $capability,
            $slug,
            array( $this, 'optiontics_dashboard_view' ),
            $svg_icon,
            10
        );

        $menu_items = apply_filters( 'optiontics_menu', $menu_items );
        $position   = array_column( $menu_items, 'position' );

        array_multisort( $position, SORT_ASC, $menu_items );

        foreach ( $menu_items as $item ) {
            $external = ! empty( $item['external_link'] ) ? $item['external_link'] : false;

            $link               = ! $external ? $url . $item['link'] : $item['link'];
            $submenu[ $slug ][] = array(
                $item['title'],
                $item['capability'],
                $link,
            ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
        }
    }


    /**
     * Render the root div for the React SPA.
     * Called by WordPress when the top-level menu page is loaded directly.
     *
     * @return void
     */
    public function optiontics_dashboard_view() {
        echo '<div id="optiontics_dashboard"></div>';
    }
}