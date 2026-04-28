<?php
/**
 * Field Renderer
 *
 * Orchestrates rendering of one or many field units for a given product.
 * Replaces the old Block_Compiler. Key differences:
 *  - Accepts Field_Definition DTOs, not raw arrays (parsing is upstream).
 *  - Uses Render_Context DTO instead of a loose product_id int.
 *  - Field handler instances are stateless; the renderer holds state.
 *  - render_all() is the main entry point; it builds Field_Definition objects
 *    from the raw data array so callers can pass raw editor JSON directly.
 *
 * @package Optiontics\Core\FieldUnits\Support
 * @since   2.0.0
 */

namespace Optiontics\Core\FieldUnits\Support;

use Optiontics\Core\FieldUnits\DTO\Field_Definition;
use Optiontics\Core\FieldUnits\DTO\Render_Context;
use Optiontics\Core\FieldUnits\Contracts\Field_Unit_Interface;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Field_Renderer
 */
class Field_Renderer {

	/**
	 * @var Field_Type_Registry
	 */
	private Field_Type_Registry $registry;

	/**
	 * @param Field_Type_Registry $registry Field type registry.
	 */
	public function __construct( Field_Type_Registry $registry ) {
		$this->registry = $registry;
	}

	// =========================================================================
	// PUBLIC API
	// =========================================================================

	/**
	 * Parse and render an array of raw field data entries for a product.
	 *
	 * This is the primary entry point. Raw JSON from the editor is passed in;
	 * Field_Definition DTOs are built here and forwarded to render_one().
	 *
	 * @param  array<int, array<string, mixed>> $raw_fields Editor JSON field entries.
	 * @param  Render_Context                   $ctx        Rendering environment.
	 * @return string                                       Escaped HTML output.
	 */
	public function render_all( array $raw_fields, Render_Context $ctx ): string {
		if ( empty( $raw_fields ) ) {
			return '';
		}

		$output  = '';
		$count   = 0;
		$limit   = $ctx->render_limit;

		foreach ( $raw_fields as $raw ) {
			if ( ! is_array( $raw ) || empty( $raw ) ) {
				continue;
			}

			if ( $count >= $limit ) {
				do_action( 'optiontics_render_limit_reached', $limit, $ctx->product_id );
				break;
			}

			try {
				$def = Field_Definition::from_array( $raw );
			} catch ( \InvalidArgumentException $e ) {
				do_action( 'optiontics_field_definition_error', $raw, $e, $ctx->product_id );
				continue;
			}

			$html = $this->render_one( $def, $ctx );

			if ( '' !== $html ) {
				$output .= $html;
				++$count;
			}
		}

		/**
		 * Filter the complete rendered output for a product's field set.
		 *
		 * @param string         $output     Accumulated HTML.
		 * @param Render_Context $ctx        Rendering environment.
		 * @param int            $count      Number of fields rendered.
		 */
		return (string) apply_filters( 'optiontics_rendered_fields_output', $output, $ctx, $count );
	}

	/**
	 * Render a single, already-parsed Field_Definition.
	 *
	 * @param  Field_Definition $def  Parsed field configuration.
	 * @param  Render_Context   $ctx  Rendering environment.
	 * @return string                 Escaped HTML, empty on skip or error.
	 */
	public function render_one( Field_Definition $def, Render_Context $ctx ): string {
		$handler = $this->registry->get_handler( $def->field_type );

		if ( null === $handler ) {
			do_action( 'optiontics_unknown_field_type', $def->field_type, $ctx->product_id );
			return '';
		}

		if ( ! $handler->is_visible( $def ) ) {
			return '';
		}

		try {
			$html = $handler->output( $def, $ctx );

			if ( ! is_string( $html ) ) {
				return '';
			}

			/**
			 * Filter a single rendered field's HTML.
			 *
			 * @param string             $html    Rendered HTML.
			 * @param Field_Definition   $def     Field configuration.
			 * @param Field_Unit_Interface $handler Field handler instance.
			 * @param Render_Context     $ctx     Rendering environment.
			 */
			$html = (string) apply_filters(
				'optiontics_rendered_field',
				$html,
				$def,
				$handler,
				$ctx
			);

			$html = (string) apply_filters(
				"optiontics_rendered_field_{$def->field_type}",
				$html,
				$def,
				$ctx
			);

			return $html;

		} catch ( \Throwable $e ) {
			// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			error_log( sprintf(
				'Optiontics Field_Renderer: output() failed for type "%s" on product %d — %s',
				esc_html( $def->field_type ),
				$ctx->product_id,
				esc_html( $e->getMessage() )
			) );
			do_action( 'optiontics_field_render_exception', $e, $def, $ctx );
			return '';
		}
	}
}
