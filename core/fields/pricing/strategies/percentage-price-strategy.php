<?php
/**
 * Percentage Price Strategy
 *
 * Calculates an additional cost as a percentage of the product's base price.
 * Example: choice.regular = 10 means "add 10% of the product price".
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
 * Class Percentage_Price_Strategy
 */
class Percentage_Price_Strategy implements Price_Strategy_Interface {

	/**
	 * {@inheritdoc}
	 */
	public function handles(): string {
		return 'percentage';
	}

	/**
	 * {@inheritdoc}
	 *
	 * regular/sale fields hold percentage values (e.g. 10 = 10%).
	 * The effective monetary amount is derived from $base_price.
	 */
	public function calculate( array $choice, float $base_price, int $quantity ): Pricing_Result {
		$regular_pct = max( 0.0, (float) ( $choice['regular'] ?? 0 ) );
		$sale_pct    = max( 0.0, (float) ( $choice['sale']    ?? 0 ) );
		$base        = max( 0.0, $base_price );

		$regular_amount = ( $regular_pct / 100 ) * $base;
		$sale_amount    = $sale_pct > 0.0 ? ( $sale_pct / 100 ) * $base : 0.0;

		return new Pricing_Result(
			$this->handles(),
			$regular_amount,
			$sale_amount,
			max( 1, $quantity )
		);
	}
}
