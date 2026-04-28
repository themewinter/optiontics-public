<?php
/**
 * Phone Number Field Template
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

$optiontics_tel_id   = 'opt-tel-' . $def->node_id;
$optiontics_price    = $this->price_for( $def->first_choice(), $ctx->base_price );
$optiontics_wrapper  = Dom_Utilities::field_wrapper_attrs( $def, [ 'opt-group', 'opt-group--telephone' ] );

?>
<div <?php echo Dom_Utilities::attrs( $optiontics_wrapper ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<label class="opt-field__label" for="<?php echo esc_attr( $optiontics_tel_id ); ?>">
		<?php echo esc_html( $def->title ); ?>
		<?php if ( $optiontics_price->has_cost ) : ?>
			<?php echo Dom_Utilities::price_display( $optiontics_price->display_html, $ctx->allowed_html ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		<?php endif; ?>
		<?php if ( $def->is_required ) : ?>
			<span class="opt-field__required" aria-hidden="true">*</span>
		<?php endif; ?>
	</label>

	<?php if ( '' !== $def->description ) : ?>
		<p class="opt-field__description"><?php echo wp_kses_post( $def->description ); ?></p>
	<?php endif; ?>

	<input
		type="tel"
		id="<?php echo esc_attr( $optiontics_tel_id ); ?>"
		class="opt-tel-input"
		name="opt_tel_<?php echo esc_attr( $def->node_id ); ?>"
		placeholder="<?php echo esc_attr( $def->get( 'placeholder', '' ) ); ?>"
		data-price="<?php echo esc_attr( $optiontics_price->effective_price ); ?>"
		data-node="<?php echo esc_attr( $def->node_id ); ?>"
		<?php if ( $def->is_required ) : ?>
			required
			data-required="1"
		<?php endif; ?>
	>
</div>
