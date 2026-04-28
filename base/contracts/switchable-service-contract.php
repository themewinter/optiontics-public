<?php
namespace Optiontics\Contracts;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Switchable Service Contract
 */
interface Switchable_Service_Contract {
    /**
     * Ensure that service is enable or disable
     *
     * @return  bool
     */
    public function is_enable();
}
