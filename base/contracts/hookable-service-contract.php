<?php
namespace Optiontics\Contracts;

if ( ! defined( 'ABSPATH' ) ) exit;
/**
 * Hookable Service Contract
 *
 * @package Optiontics/Contract
 */
interface Hookable_Service_Contract {
    /**
     * Register a single service
     *
     * @return  void
     */
    public function register();
}
