<?php
/**
 * Select (Dropdown) Field Unit
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
 * Class Select_Field
 */
class Select_Field extends Abstract_Field_Unit {

	/**
	 * {@inheritdoc}
	 */
	public function field_type(): string {
		return 'select';
	}

	/**
	 * {@inheritdoc}
	 */
	public function output( Field_Definition $def, Render_Context $ctx ): string {
		if ( ! $def->has_choices() ) {
			return '';
		}
		return $this->render_template( $def, $ctx, 'select' );
	}
}
