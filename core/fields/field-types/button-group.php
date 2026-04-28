<?php
/**
 * Button Group Field Unit
 *
 * Same choice schema as radio/checkbox; renders a pill-button group on the
 * storefront. Supports single- or multi-selection (via the `selection`
 * attribute) and three content-alignment modes.
 *
 * @package Optiontics\Core\FieldUnits\Types
 * @since   2.0.0
 */

namespace Optiontics\Core\FieldUnits\Types;

use Optiontics\Core\FieldUnits\DTO\Field_Definition;
use Optiontics\Core\FieldUnits\DTO\Render_Context;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Button_Group_Field
 */
class Button_Group_Field extends Abstract_Field_Unit {

	/**
	 * {@inheritdoc}
	 */
	public function field_type(): string {
		return 'button_group';
	}

	/**
	 * {@inheritdoc}
	 */
	public function output( Field_Definition $def, Render_Context $ctx ): string {
		if ( ! $def->has_choices() ) {
			return '';
		}
		return $this->render_template( $def, $ctx, 'button-group' );
	}
}
