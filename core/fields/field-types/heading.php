<?php
/**
 * Heading Field Unit
 *
 * Renders a decorative heading/separator — carries no price, never required.
 *
 * @package Optiontics\Core\FieldUnits\Types
 * @since   2.0.0
 */

namespace Optiontics\Core\FieldUnits\Types;

use Optiontics\Core\FieldUnits\DTO\Field_Definition;
use Optiontics\Core\FieldUnits\DTO\Render_Context;
use Optiontics\Core\FieldUnits\Support\Dom_Utilities;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Heading_Field
 */
class Heading_Field extends Abstract_Field_Unit {

	/**
	 * {@inheritdoc}
	 */
	public function field_type(): string {
		return 'heading';
	}

	/**
	 * {@inheritdoc}
	 *
	 * Headings are always free; override to prevent unnecessary pricing lookup.
	 */
	public function base_price( Field_Definition $def ): float {
		return 0.0;
	}

	/**
	 * {@inheritdoc}
	 *
	 * Headings are built inline — no separate template needed.
	 */
	public function output( Field_Definition $def, Render_Context $ctx ): string {
		if ( '' === $def->title ) {
			return '';
		}

		$wrapper_attrs = Dom_Utilities::field_wrapper_attrs( $def );

		return sprintf(
			'<div %s><h3 class="opt-field__heading-text">%s</h3>%s</div>',
			Dom_Utilities::attrs( $wrapper_attrs ),
			esc_html( $def->title ),
			$this->description_html( $def, $ctx->allowed_html )
		);
	}
}
