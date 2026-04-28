<?php
/**
 * Flat Price Strategy
 *
 * Calculates a fixed additional cost for a field choice.
 * The price does not vary with the product's base price.
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
 * Class Flat_Price_Strategy
 */
class Flat_Price_Strategy implements Price_Strategy_Interface {

	/**
	 * {@inheritdoc}
	 */
	public function handles(): string {
		return 'flat';
	}

	/**
	 * {@inheritdoc}
	 *
	 * For flat pricing the base_price parameter is intentionally unused;
	 * the charge is taken directly from the choice's regular/sale fields.
	 */
	public function calculate( array $choice, float $base_price, int $quantity ): Pricing_Result {
		$regular = max( 0.0, (float) ( $choice['regular'] ?? 0 ) );
		$sale    = max( 0.0, (float) ( $choice['sale']    ?? 0 ) );

		return new Pricing_Result( $this->handles(), $regular, $sale, max( 1, $quantity ) );
	}
}
