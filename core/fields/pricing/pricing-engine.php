<?php
/**
 * Pricing Engine
 *
 * Resolves the correct Price_Strategy_Interface implementation for a
 * field choice and delegates calculation to it. New pricing types are
 * added via add_strategy() without touching this class.
 *
 * @package Optiontics\Core\FieldUnits\Pricing
 * @since   2.0.0
 */

namespace Optiontics\Core\FieldUnits\Pricing;

use Optiontics\Core\FieldUnits\Pricing\Contracts\Price_Strategy_Interface;
use Optiontics\Core\FieldUnits\Pricing\Strategies\Flat_Price_Strategy;
use Optiontics\Core\FieldUnits\Pricing\Strategies\Percentage_Price_Strategy;
use Optiontics\Core\FieldUnits\Pricing\Strategies\No_Cost_Price_Strategy;
use Optiontics\Core\FieldUnits\DTO\Pricing_Result;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Pricing_Engine
 *
 * Architectural notes:
 *  - Strategies are stored in a keyed map (type_slug → object), not an array
 *    of if/elseif branches — adding a type is O(1) and requires zero edits here.
 *  - resolve_for_choice() is the sole entry point; callers never touch strategy
 *    objects directly.
 *  - The engine is an ordinary class (not static) so it can be injected and
 *    mocked in tests.
 */
class Pricing_Engine {

	/**
	 * Registered strategies, keyed by their type slug.
	 *
	 * @var array<string, Price_Strategy_Interface>
	 */
	private array $strategies = [];

	/**
	 * Boot the engine with all built-in strategies.
	 */
	public function __construct() {
		$this->add_strategy( new No_Cost_Price_Strategy() );

		// Register flat/fixed as aliases — the admin editor saves type="fixed";
		// "flat" is kept for back-compat with any external integrations.
		$flat = new Flat_Price_Strategy();
		$this->add_strategy( $flat );
		$this->strategies['fixed'] = $flat;

		$this->add_strategy( new Percentage_Price_Strategy() );

		/**
		 * Allow third-party code to register additional pricing strategies.
		 *
		 * @param Pricing_Engine $engine This engine instance.
		 */
		do_action( 'optiontics_register_price_strategies', $this );
	}

	// =========================================================================
	// STRATEGY REGISTRY
	// =========================================================================

	/**
	 * Register a pricing strategy.
	 *
	 * If a strategy for the same type slug is already registered, it is
	 * replaced — this lets add-ons override built-in behaviour.
	 *
	 * @param  Price_Strategy_Interface $strategy Strategy instance.
	 * @return void
	 */
	public function add_strategy( Price_Strategy_Interface $strategy ): void {
		$this->strategies[ $strategy->handles() ] = $strategy;
	}

	/**
	 * Check whether a strategy exists for a given type slug.
	 *
	 * @param  string $type_slug Type slug.
	 * @return bool
	 */
	public function has_strategy( string $type_slug ): bool {
		return isset( $this->strategies[ $type_slug ] );
	}

	// =========================================================================
	// PRICE RESOLUTION
	// =========================================================================

	/**
	 * Resolve and execute the correct pricing strategy for a single field choice.
	 *
	 * Falls back to 'no_cost' when the choice's type is unrecognised.
	 *
	 * @param  array $choice      Sanitised choice array from Field_Definition::$choices.
	 * @param  float $base_price  Product base price; used by percentage strategies.
	 * @param  int   $quantity    Quantity multiplier (default 1).
	 * @return Pricing_Result     Immutable result with effective price + display HTML.
	 */
	public function resolve_for_choice(
		array $choice,
		float $base_price = 0.0,
		int $quantity = 1
	): Pricing_Result {
		$type = isset( $choice['type'] ) ? sanitize_key( (string) $choice['type'] ) : 'no_cost';

		/**
		 * Filter the resolved price type before strategy dispatch.
		 *
		 * @param string $type       Resolved type slug.
		 * @param array  $choice     Choice data.
		 * @param float  $base_price Product base price.
		 */
		$type = (string) apply_filters( 'optiontics_resolve_price_type', $type, $choice, $base_price );

		$strategy = $this->strategies[ $type ] ?? $this->strategies['no_cost'] ?? null;

		if ( null === $strategy ) {
			return Pricing_Result::free();
		}

		$qty    = max( 1, $quantity );
		$result = $strategy->calculate( $choice, max( 0.0, $base_price ), $qty );

		/**
		 * Filter the Pricing_Result after calculation.
		 *
		 * @param Pricing_Result $result     Calculated result.
		 * @param array          $choice     Choice data.
		 * @param string         $type       Type slug used.
		 * @param float          $base_price Product base price.
		 */
		return apply_filters( 'optiontics_pricing_result', $result, $choice, $type, $base_price );
	}

	/**
	 * Calculate the cumulative price for all choices in an addon submission.
	 *
	 * Used by the cart layer when totalling submitted addon selections.
	 *
	 * @param  array $selections  Array of submitted addon entries, each with price + qty.
	 * @return float              Total additional cost.
	 */
	public function total_from_selections( array $selections ): float {
		$total = 0.0;

		foreach ( $selections as $entry ) {
			if ( ! is_array( $entry ) ) {
				continue;
			}
			$price = max( 0.0, (float) ( $entry['price'] ?? 0 ) );
			$qty   = max( 1, (int) ( $entry['qty']   ?? 1 ) );
			$total += $price * $qty;
		}

		return $total;
	}
}
