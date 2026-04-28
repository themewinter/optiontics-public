<?php
/**
 * Select (Dropdown) Field Template
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

$optiontics_select_id = 'opt-select-' . $def->node_id;
$optiontics_wrapper   = Dom_Utilities::field_wrapper_attrs( $def, [ 'opt-group', 'opt-group--select' ] );

?>
<div <?php echo Dom_Utilities::attrs( $optiontics_wrapper ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<label class="opt-field__label" for="<?php echo esc_attr( $optiontics_select_id ); ?>">
		<?php echo esc_html( $def->title ); ?>
		<?php if ( $def->is_required ) : ?>
			<span class="opt-field__required" aria-hidden="true">*</span>
		<?php endif; ?>
	</label>

	<?php if ( '' !== $def->description ) : ?>
		<p class="opt-field__description"><?php echo wp_kses_post( $def->description ); ?></p>
	<?php endif; ?>

	<select
		id="<?php echo esc_attr( $optiontics_select_id ); ?>"
		class="opt-select"
		name="opt_select_<?php echo esc_attr( $def->node_id ); ?>"
		data-node="<?php echo esc_attr( $def->node_id ); ?>"
		<?php if ( $def->is_required ) : ?>
			required
			data-required="1"
		<?php endif; ?>
	>
		<option value=""><?php echo esc_html__( 'Choose an option', 'optiontics' ); ?></option>
		<?php foreach ( $def->choices as $optiontics_idx => $optiontics_choice ) : ?>
			<?php $optiontics_price = $this->price_for( $optiontics_choice, $ctx->base_price ); ?>
			<option
				value="<?php echo esc_attr( $optiontics_idx ); ?>"
				data-price="<?php echo esc_attr( $optiontics_price->effective_price ); ?>"
				data-price-type="<?php echo esc_attr( $optiontics_choice['type'] ); ?>"
				data-opt-index="<?php echo esc_attr( $optiontics_idx ); ?>"
				data-choice-label="<?php echo esc_attr( $optiontics_choice['value'] ); ?>"
				<?php if ( ! empty( $optiontics_choice['default'] ) ) : ?>
					selected
				<?php endif; ?>
			>
				<?php echo esc_html( $optiontics_choice['value'] ); ?>
				<?php if ( $optiontics_price->has_cost ) : ?>
					(+<?php echo esc_html( wp_strip_all_tags( wc_price( $optiontics_price->effective_price ) ) ); ?>)
				<?php endif; ?>
			</option>
		<?php endforeach; ?>
	</select>
</div>
