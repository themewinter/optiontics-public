<?php
namespace Optiontics\Abstract;

use Optiontics\Contracts\Hookable_Service_Contract;
use Exception;
use WP_Error;
use WP_HTTP_Response;
use WP_REST_Controller;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * BaseRest Controller
 *
 * @package Optiontics/Abstracts
 */
abstract class Base_Rest_Controller extends WP_REST_Controller implements Hookable_Service_Contract {
    /**
     * Register routes
     *
     * @return  void
     */
    public function register() {
        add_action( 'rest_api_init', [ $this, 'register_routes' ] );
    }

    /**
     * Register all routes
     *
     * @return  void
     */
    public function register_routes() {
        throw new Exception('Need to override register_routes method from child class');
    }

    /**
     * Send rest error
     *
     * @param   string  $message      Error message
     * @param   integer  $status_code  Error status code
     *
     * @return  WP_Error
     */
    public function error( $message, $status_code = 422, $type = '', $details = '' ) {
        $data = [
            'success'   => 0,
            'message'   => $message,
            'error'     => [
                'code'  => $status_code,
                'type'  => $type,
                'details'   => $details,
            ],
        ];

        return new WP_HTTP_Response( $data, $status_code );
    }

    /**
     * Send rest response
     *
     * @param   array  $data  Response data
     *
     * @return  array
     */
    public function response( $data = [], $status_code = 200, ) {
        $message = is_array( $data ) && ! empty( $data['message'] ) ? $data['message'] : __( 'Request was successful', 'optiontics' );

        if ( is_array( $data ) && isset( $data['message'] ) ) {
            unset( $data['message'] );
        }

        $data = [
            'success'   => 1,
            'message'   => $message,
            'data'      => $data,
        ];

       return new WP_HTTP_Response( $data, $status_code );
    }
}
