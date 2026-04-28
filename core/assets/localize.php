<?php
namespace Optiontics\Assets;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Manage all localize data
 */
class Localize {

    /**
     * Get admin localize data
     *
     * @return  array Collection localize data
     */
    public static function get_admin() {
        $current_user = wp_get_current_user();

        $data = [
            'site_url'            => site_url(),
            'admin_url'           => admin_url(),
            'nonce'               => wp_create_nonce( 'wp_rest' ),
            'date_format'         => get_option( 'date_format' ),
            'date_format_string'  => date_i18n( get_option( 'date_format' ) ),
            'time_format'         => get_option( 'time_format' ),
            'time_format_string'  => date_i18n( get_option( 'time_format' ) ),
            'start_of_week'       => get_option( 'start_of_week', 0 ),
            'current_user_id'     => get_current_user_id(),
            'wc_active'           => function_exists( 'WC' ) ? true : false,
        ];

        // Add WooCommerce currency settings if WooCommerce is active
        if ( function_exists( 'WC' ) ) {
            $data['currency'] = [
                'symbol'            => get_woocommerce_currency_symbol(),
                'decimal_separator'  => wc_get_price_decimal_separator(),
                'thousand_separator' => wc_get_price_thousand_separator(),
                'num_decimals'       => wc_get_price_decimals(),
                'symbol_position'    => get_woocommerce_price_format(),
            ];
        }

        return apply_filters( 'wpcafe_admin_localize', $data );
    }

    /**
     * Get frontend localize data
     *
     * @return  array Collection localize data
     */
    public static function get_frontend() {
        $data = [
            'site_url'            => site_url(),
            'nonce'               => wp_create_nonce( 'wp_rest' ),
            'date_format'         => get_option( 'date_format' ),
            'time_format'         => get_option( 'time_format' ),
            'current_user_id'     => get_current_user_id(),
            'start_of_week'       => get_option( 'start_of_week', 0 ),
            'locale_name'         => strtolower( str_replace( '_', '-', get_locale() ) ),
            'table_layout'        => function_exists( 'wpc_is_module_enable' ) ? wpc_is_module_enable('table_layout') : "",
            'wc_active'           => function_exists( 'WC' ) ? true : false,
        ];

        return apply_filters( 'wpcafe_frontend_localize', $data );
    }
}
