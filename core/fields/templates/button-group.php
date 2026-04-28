<?php
/**
 * Button Group Field Template
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

$optiontics_selection = (string) $def->get( 'selection', 'single' );
$optiontics_multi     = 'multiple' === $optiontics_selection;
$optiontics_wrapper   = Dom_Utilities::field_wrapper_attrs(
	$def,
	[
		'opt-fieldset',
		'opt-fieldset--button-group',
	]
);

$optiontics_input_type = $optiontics_multi ? 'checkbox' : 'radio';
$optiontics_input_name = $optiontics_multi
	? 'opt_button_group_' . $def->node_id . '[]'
	: 'opt_button_group_' . $def->node_id;

// Carry the matching choice-class so the existing radio/checkbox JS
// pipelines (price aggregation, validation) pick up button-group inputs
// without any selector juggling.
$optiontics_choice_class = $optiontics_multi ? 'opt-choice--checkbox' : 'opt-choice--radio';
?>
<fieldset
	<?php echo Dom_Utilities::attrs( $optiontics_wrapper ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	data-selection="<?php echo esc_attr( $optiontics_selection ); ?>"
>
	<legend class="opt-field__label">
		<?php echo esc_html( $def->title ); ?>
		<?php if ( $def->is_required ) : ?>
			<span class="opt-field__required" aria-hidden="true">*</span>
		<?php endif; ?>
	</legend>

	<?php if ( '' !== $def->description ) : ?>
		<p class="opt-field__description"><?php echo wp_kses_post( $def->description ); ?></p>
	<?php endif; ?>

	<div class="opt-choices opt-choices--button-group">
		<?php foreach ( $def->choices as $optiontics_idx => $optiontics_choice ) : ?>
			<?php
			$optiontics_price  = $this->price_for( $optiontics_choice, $ctx->base_price );
			$optiontics_inp_id = 'opt-btn-group-' . esc_attr( $def->node_id ) . '-' . $optiontics_idx;
			?>
			<label
				for="<?php echo esc_attr( $optiontics_inp_id ); ?>"
				class="opt-choice opt-choice--button-group <?php echo esc_attr( $optiontics_choice_class ); ?>"
			>
				<input
					type="<?php echo esc_attr( $optiontics_input_type ); ?>"
					id="<?php echo esc_attr( $optiontics_inp_id ); ?>"
					class="opt-choice__input opt-choice__input--hidden"
					name="<?php echo esc_attr( $optiontics_input_name ); ?>"
					value="<?php echo esc_attr( $optiontics_price->effective_price ); ?>"
					data-price="<?php echo esc_attr( $optiontics_price->effective_price ); ?>"
					data-price-type="<?php echo esc_attr( $optiontics_choice['type'] ); ?>"
					data-opt-index="<?php echo esc_attr( $optiontics_idx ); ?>"
					<?php if ( ! empty( $optiontics_choice['default'] ) ) : ?>
						checked
					<?php endif; ?>
					<?php if ( $def->is_required ) : ?>
						data-required="1"
					<?php endif; ?>
				>
				<span class="opt-choice__button">
					<span class="opt-choice__text"><?php echo esc_html( $optiontics_choice['value'] ); ?></span>
					<?php if ( $optiontics_price->has_cost ) : ?>
						<?php echo Dom_Utilities::price_display( $optiontics_price->display_html, $ctx->allowed_html ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					<?php endif; ?>
				</span>
			</label>
		<?php endforeach; ?>
	</div>
</fieldset>
