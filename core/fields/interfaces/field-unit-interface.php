<?php
/**
 * Field Unit Interface
 *
 * Every renderable field type in Optiontics implements this interface.
 * Field types are stateless — they receive context via parameters, not
 * constructor injection, which makes them trivially testable and composable.
 *
 * @package Optiontics\Core\FieldUnits\Contracts
 * @since   2.0.0
 */

namespace Optiontics\Core\FieldUnits\Contracts;

use Optiontics\Core\FieldUnits\DTO\Field_Definition;
use Optiontics\Core\FieldUnits\DTO\Render_Context;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Interface Field_Unit_Interface
 *
 * Deliberately different from the old Block_Contract:
 *  - "field_type()" replaces "get_type()"    — clarifies what is being returned
 *  - "output()" replaces "render()"          — aligns with WordPress output idiom
 *  - "is_visible()" replaces "should_render" — expresses intent, not imperative
 *  - "base_price()" replaces "get_price()"   — describes scope (base, not total)
 *  - Field_Definition DTO replaces raw array  — typed, validated, immutable
 *  - Render_Context DTO bundles env data     — no product_id float around loose
 */
interface Field_Unit_Interface {

	/**
	 * Return the registered type identifier for this field unit.
	 *
	 * Must match the key used in Field_Type_Registry::register().
	 * Example return values: 'checkbox', 'radio', 'textfield', 'toggle'.
	 *
	 * @return string Lowercase slug.
	 */
	public function field_type(): string;

	/**
	 * Produce the HTML output for this field unit.
	 *
	 * Receives the validated definition and rendering environment.
	 * Must return safe, escaped HTML ready for direct output.
	 *
	 * @param  Field_Definition $def  Immutable field configuration.
	 * @param  Render_Context   $ctx  Rendering environment (product, currency, …).
	 * @return string                 Escaped HTML string, never null.
	 */
	public function output( Field_Definition $def, Render_Context $ctx ): string;

	/**
	 * Decide whether this field unit should be included in rendered output.
	 *
	 * The default implementation checks the hidden flag and returns true
	 * for unconditional fields. Override for type-specific visibility logic.
	 *
	 * @param  Field_Definition $def Field configuration.
	 * @return bool True → render, False → skip.
	 */
	public function is_visible( Field_Definition $def ): bool;

	/**
	 * Return the base price for this field unit from its first choice.
	 *
	 * Returns 0.0 when the field carries no cost.
	 *
	 * @param  Field_Definition $def Field configuration.
	 * @return float
	 */
	public function base_price( Field_Definition $def ): float;
}
