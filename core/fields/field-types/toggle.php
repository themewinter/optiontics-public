<?php
/**
 * Toggle (On/Off Switch) Field Unit
 *
 * Replaces the old Switch_Component. "Toggle" is a clearer semantic name;
 * "switch" is a PHP keyword which caused docblock confusion.
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
 * Class Toggle_Field
 */
class Toggle_Field extends Abstract_Field_Unit {

	/**
	 * {@inheritdoc}
	 *
	 * Note: the editor still stores 'switch' in the JSON 'type' field.
	 * The registry maps 'toggle' → this class AND 'switch' → this class
	 * for backward compatibility (handled in Field_Type_Registry).
	 */
	public function field_type(): string {
		return 'toggle';
	}

	/**
	 * {@inheritdoc}
	 */
	public function output( Field_Definition $def, Render_Context $ctx ): string {
		if ( ! $def->has_choices() ) {
			return '';
		}
		return $this->render_template( $def, $ctx, 'toggle' );
	}
}
