<?php
/**
 * Checkbox Field Template
 *
 * Variables in scope (injected by Abstract_Field_Unit::render_template()):
 *   @var \Optiontics\Core\FieldUnits\DTO\Field_Definition         $def
 *   @var \Optiontics\Core\FieldUnits\DTO\Render_Context           $ctx
 *   @var \Optiontics\Core\FieldUnits\Types\Abstract_Field_Unit    $this
 *
 * @package Optiontics\Core\FieldUnits\Templates
 * @since   2.0.0
 */

use Optiontics\Core\FieldUnits\Support\Dom_Utilities;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$optiontics_columns     = (int) $def->get( 'columns', 1 );
$optiontics_col_class   = $optiontics_columns > 1 ? 'opt-choices--cols-' . $optiontics_columns : '';
$optiontics_enable_qty  = (bool) $def->get( 'isQuantity', false );
$optiontics_min_qty     = max( 0, (int) $def->get( 'min', 1 ) );
$optiontics_max_qty     = max( 1, (int) $def->get( 'max', 100 ) );
$optiontics_wrapper     = Dom_Utilities::field_wrapper_attrs( $def, [ 'opt-fieldset', 'opt-fieldset--checkbox' ] );

?>
<fieldset <?php echo Dom_Utilities::attrs( $optiontics_wrapper ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<legend class="opt-field__label">
		<?php echo esc_html( $def->title ); ?>
		<?php if ( $def->is_required ) : ?>
			<span class="opt-field__required" aria-hidden="true">*</span>
		<?php endif; ?>
	</legend>

	<?php if ( '' !== $def->description ) : ?>
		<p class="opt-field__description"><?php echo wp_kses_post( $def->description ); ?></p>
	<?php endif; ?>

	<div class="opt-choices <?php echo esc_attr( $optiontics_col_class ); ?>">
		<?php foreach ( $def->choices as $optiontics_idx => $optiontics_choice ) : ?>
			<?php
			$optiontics_price  = $this->price_for( $optiontics_choice, $ctx->base_price );
			$optiontics_img    = Dom_Utilities::choice_image_url( $optiontics_choice );
			$optiontics_inp_id = 'opt-cb-' . esc_attr( $def->node_id ) . '-' . $optiontics_idx;
			?>
			<div class="opt-choice opt-choice--checkbox">
				<input
					type="checkbox"
					id="<?php echo esc_attr( $optiontics_inp_id ); ?>"
					class="opt-choice__input"
					name="opt_cb_<?php echo esc_attr( $def->node_id ); ?>[]"
					value="<?php echo esc_attr( $optiontics_price->effective_price ); ?>"
					data-price="<?php echo esc_attr( $optiontics_price->effective_price ); ?>"
					data-price-type="<?php echo esc_attr( $optiontics_choice['type'] ); ?>"
					data-opt-index="<?php echo esc_attr( $optiontics_idx ); ?>"
					data-choice-label="<?php echo esc_attr( $optiontics_choice['value'] ); ?>"
					<?php if ( ! empty( $optiontics_choice['default'] ) ) : ?>
						checked
					<?php endif; ?>
					<?php if ( $def->is_required ) : ?>
						data-required="1"
					<?php endif; ?>
				>
				<label for="<?php echo esc_attr( $optiontics_inp_id ); ?>" class="opt-choice__label">
					<?php if ( '' !== $optiontics_img ) : ?>
						<?php echo Dom_Utilities::img( $optiontics_img, $optiontics_choice['value'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					<?php endif; ?>
					<span class="opt-choice__text"><?php echo esc_html( $optiontics_choice['value'] ); ?></span>
				</label>

				<?php if ( $optiontics_price->has_cost ) : ?>
					<?php echo Dom_Utilities::price_display( $optiontics_price->display_html, $ctx->allowed_html ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				<?php endif; ?>

				<?php if ( $optiontics_enable_qty ) : ?>
					<?php echo Dom_Utilities::quantity_input( $def->node_id, $optiontics_idx, $optiontics_min_qty, $optiontics_max_qty ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				<?php endif; ?>
			</div>
		<?php endforeach; ?>
	</div>
</fieldset>
