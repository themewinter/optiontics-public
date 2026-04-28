<?php
/**
 * Toggle (On/Off Switch) Field Template
 *
 * @var \Optiontics\Core\FieldUnits\DTO\Field_Definition         $def
 * @var \Optiontics\Core\FieldUnits\DTO\Render_Context           $ctx
 * @var \Optiontics\Core\FieldUnits\Types\Abstract_Field_Unit    $this
 *
 * @package Optiontics\Core\FieldUnits\Templates
 * @since   2.0.0
 */

use Optiontics\Core\FieldUnits\Support\Dom_Utilities;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$optiontics_choice      = $def->first_choice();
$optiontics_price       = $this->price_for( $optiontics_choice, $ctx->base_price );
$optiontics_enable_qty  = (bool) $def->get( 'isQuantity', false );
$optiontics_min_qty     = max( 0, (int) $def->get( 'min', 1 ) );
$optiontics_max_qty     = max( 1, (int) $def->get( 'max', 100 ) );
$optiontics_toggle_id   = 'opt-toggle-' . $def->node_id;
$optiontics_img         = Dom_Utilities::choice_image_url( $optiontics_choice );
$optiontics_wrapper     = Dom_Utilities::field_wrapper_attrs( $def, [ 'opt-group', 'opt-group--toggle' ] );

?>
<div <?php echo Dom_Utilities::attrs( $optiontics_wrapper ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<?php /* ── Field title row (block label) ── */ ?>
	<p class="opt-field__label">
		<?php echo esc_html( $def->title ); ?>
		<?php if ( $def->is_required ) : ?>
			<span class="opt-field__required" aria-hidden="true">*</span>
		<?php endif; ?>
	</p>

	<?php if ( '' !== $def->description ) : ?>
		<p class="opt-field__description"><?php echo wp_kses_post( $def->description ); ?></p>
	<?php endif; ?>

	<?php /* ── Toggle row (switch + option label + price) ── */ ?>
	<div class="opt-toggle-row">
		<span class="opt-toggle-track">
			<input
				type="checkbox"
				id="<?php echo esc_attr( $optiontics_toggle_id ); ?>"
				class="opt-toggle-input"
				name="opt_toggle_<?php echo esc_attr( $def->node_id ); ?>"
				value="yes"
				data-price="<?php echo esc_attr( $optiontics_price->effective_price ); ?>"
				data-node="<?php echo esc_attr( $def->node_id ); ?>"
				data-choice-label="<?php echo esc_attr( $optiontics_choice['value'] ); ?>"
				<?php if ( ! empty( $optiontics_choice['default'] ) ) : ?>
					checked
				<?php endif; ?>
				<?php if ( $def->is_required ) : ?>
					data-required="1"
				<?php endif; ?>
			>
			<span class="opt-toggle-thumb" aria-hidden="true"></span>
		</span>

		<label class="opt-toggle-label" for="<?php echo esc_attr( $optiontics_toggle_id ); ?>">
			<?php if ( '' !== $optiontics_img ) : ?>
				<?php echo Dom_Utilities::img( $optiontics_img, $optiontics_choice['value'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<?php endif; ?>
			<span class="opt-toggle-label__text"><?php echo esc_html( $optiontics_choice['value'] ); ?></span>
			<?php if ( $optiontics_price->has_cost ) : ?>
				<?php echo Dom_Utilities::price_display( $optiontics_price->display_html, $ctx->allowed_html ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<?php endif; ?>
		</label>

		<?php if ( $optiontics_enable_qty ) : ?>
			<?php echo Dom_Utilities::quantity_input( $def->node_id, 0, $optiontics_min_qty, $optiontics_max_qty ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		<?php endif; ?>
	</div>

</div>
