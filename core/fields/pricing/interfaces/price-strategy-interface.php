<?php
/**
 * Price Strategy Interface
 *
 * Each concrete pricing strategy calculates the effective unit price
 * for a field choice using a different algorithm (flat, percentage, …).
 * New pricing models are added by implementing this interface — no
 * existing class needs to change (Open/Closed Principle).
 *
 * @package Optiontics\Core\FieldUnits\Pricing\Contracts
 * @since   2.0.0
 */

namespace Optiontics\Core\FieldUnits\Pricing\Contracts;

use Optiontics\Core\FieldUnits\DTO\Pricing_Result;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Interface Price_Strategy_Interface
 */
interface Price_Strategy_Interface {

	/**
	 * Return the type slug this strategy handles.
	 *
	 * Must match the 'type' value stored in a field choice, e.g. 'flat'.
	 *
	 * @return string
	 */
	public function handles(): string;

	/**
	 * Calculate a Pricing_Result for a single field choice.
	 *
	 * @param  array $choice      Sanitised choice array (from Field_Definition::$choices).
	 * @param  float $base_price  Product base price for percentage calculations.
	 * @param  int   $quantity    Quantity multiplier (≥ 1).
	 * @return Pricing_Result     Immutable result carrying effective price + display HTML.
	 */
	public function calculate( array $choice, float $base_price, int $quantity ): Pricing_Result;
}
