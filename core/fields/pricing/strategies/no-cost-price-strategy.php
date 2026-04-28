<?php
/**
 * No Cost Price Strategy
 *
 * Handles fields/choices that carry zero additional charge.
 * Always returns a free Pricing_Result regardless of inputs.
 *
 * @package Optiontics\Core\FieldUnits\Pricing\Strategies
 * @since   2.0.0
 */

namespace Optiontics\Core\FieldUnits\Pricing\Strategies;

use Optiontics\Core\FieldUnits\Pricing\Contracts\Price_Strategy_Interface;
use Optiontics\Core\FieldUnits\DTO\Pricing_Result;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class No_Cost_Price_Strategy
 */
class No_Cost_Price_Strategy implements Price_Strategy_Interface {

	/**
	 * {@inheritdoc}
	 */
	public function handles(): string {
		return 'no_cost';
	}

	/**
	 * {@inheritdoc}
	 */
	public function calculate( array $choice, float $base_price, int $quantity ): Pricing_Result {
		return Pricing_Result::free();
	}
}
