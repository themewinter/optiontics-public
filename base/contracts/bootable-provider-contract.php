<?php
namespace Optiontics\Contracts;

if ( ! defined( 'ABSPATH' ) ) exit;
/**
 * Bootable Provider Contracts
 *
 * @package Optiontics/Contracts
 */

interface Bootable_Provider_Contract {
    /**
     * Boot services that need to initialize
     *
     * @return  void
     */
    public function boot();
}
