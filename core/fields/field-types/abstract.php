<?php
/**
 * Abstract Field Unit
 *
 * Provides default implementations for is_visible() and base_price()
 * so concrete types only need to implement field_type() and output().
 * Composition with Dom_Utilities and Pricing_Engine replaces the old
 * trait mixin pattern — dependencies are explicit, not inherited.
 *
 * @package Optiontics\Core\FieldUnits\Types
 * @since   2.0.0
 */

namespace Optiontics\Core\FieldUnits\Types;

use Optiontics\Core\FieldUnits\Contracts\Field_Unit_Interface;
use Optiontics\Core\FieldUnits\DTO\Field_Definition;
use Optiontics\Core\FieldUnits\DTO\Render_Context;
use Optiontics\Core\FieldUnits\DTO\Pricing_Result;
use Optiontics\Core\FieldUnits\Pricing\Pricing_Engine;
use Optiontics\Core\FieldUnits\Support\Dom_Utilities;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Abstract class Abstract_Field_Unit
 */
abstract class Abstract_Field_Unit implements Field_Unit_Interface {

	// =========================================================================
	// INTERFACE DEFAULTS
	// =========================================================================

	/**
	 * {@inheritdoc}
	 *
	 * Hidden fields are never rendered. Conditional logic (is_visible returning
	 * false) is handled client-side for performance; the server always emits
	 * the HTML so JS can toggle visibility without a round-trip.
	 */
	public function is_visible( Field_Definition $def ): bool {
		return ! $def->is_hidden;
	}

	/**
	 * {@inheritdoc}
	 *
	 * Returns the flat/regular price from the first choice entry.
	 * Override in types that derive price differently (e.g. Toggle).
	 */
	public function base_price( Field_Definition $def ): float {
		$choice = $def->first_choice();
		if ( empty( $choice ) ) {
			return 0.0;
		}
		return max( 0.0, (float) ( $choice['regular'] ?? 0 ) );
	}

	// =========================================================================
	// PROTECTED HELPERS (available to all concrete types)
	// =========================================================================

	/**
	 * Compute the Pricing_Result for a choice using the shared engine.
	 *
	 * @param  array $choice     Choice entry from Field_Definition::$choices.
	 * @param  float $base_price Product base price for percentage calculations.
	 * @param  int   $quantity   Quantity multiplier.
	 * @return Pricing_Result
	 */
	protected function price_for( array $choice, float $base_price = 0.0, int $quantity = 1 ): Pricing_Result {
		static $engine = null;
		if ( null === $engine ) {
			$engine = new Pricing_Engine();
		}
		return $engine->resolve_for_choice( $choice, $base_price, $quantity );
	}

	/**
	 * Render the field label + required indicator HTML.
	 *
	 * Uses a semantic <label> element rather than a raw <h4> so that
	 * clicking the label focuses the associated input.
	 *
	 * @param  Field_Definition $def     Field configuration.
	 * @param  string           $for_id  HTML id of the associated input (optional).
	 * @return string
	 */
	protected function label_html( Field_Definition $def, string $for_id = '' ): string {
		if ( '' === $def->title ) {
			return '';
		}

		$required = $def->is_required
			? '<span class="opt-field__required" aria-hidden="true">*</span>'
			: '';

		$tag  = '' !== $for_id ? 'label' : 'div';
		$attr = '' !== $for_id ? ' for="' . esc_attr( $for_id ) . '"' : '';

		return sprintf(
			'<%1$s class="opt-field__label"%2$s>%3$s%4$s</%1$s>',
			$tag,
			$attr,
			esc_html( $def->title ),
			$required
		);
	}

	/**
	 * Render the field description paragraph when present.
	 *
	 * @param  Field_Definition $def         Field configuration.
	 * @param  array            $allowed_html Allowed tags map for wp_kses.
	 * @return string
	 */
	protected function description_html( Field_Definition $def, array $allowed_html = [] ): string {
		if ( '' === $def->description || $def->is_hidden ) {
			return '';
		}
		return sprintf(
			'<p class="opt-field__description">%s</p>',
			wp_kses( $def->description, $allowed_html )
		);
	}

	/**
	 * Require the appropriate PHP template file and return its output.
	 *
	 * The template file receives $def (Field_Definition), $ctx (Render_Context),
	 * and $this (the field unit instance) via variable scope.
	 *
	 * @param  Field_Definition $def  Field configuration.
	 * @param  Render_Context   $ctx  Rendering environment.
	 * @param  string           $tpl  Template filename without extension (e.g. 'checkbox').
	 * @return string
	 */
	protected function render_template(
		Field_Definition $def,
		Render_Context $ctx,
		string $tpl
	): string {
		$path = optiontics()->core_directory . '/fields/templates/' . sanitize_file_name( $tpl ) . '.php';

		if ( ! file_exists( $path ) ) {
			// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			error_log( sprintf( 'Optiontics: template file missing — %s', esc_html( $path ) ) );
			return '';
		}

		ob_start();
		// phpcs:ignore WordPressVIPMinimum.Files.IncludingFile.UsingVariable
		require $path;
		return (string) ob_get_clean();
	}
}
