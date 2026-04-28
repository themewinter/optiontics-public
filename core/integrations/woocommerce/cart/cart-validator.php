<?php
/**
 * Cart Validator
 *
 * Responsible only for validating the raw addon submission from a
 * WooCommerce add-to-cart POST. Returns a sanitised, typed selections
 * array or an empty array when validation fails.
 *
 * Structural difference from old Cart_Page:
 *  - Validation is a separate class, not a method inside the full cart handler.
 *  - Nonce check happens here, not interleaved with price mutation.
 *  - Returns a typed value (array or empty array) — never false/null.
 *
 * @package Optiontics\Core\Integrations\WooCommerce\Cart
 * @since   2.0.0
 */

namespace Optiontics\Core\Integrations\WooCommerce\Cart;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Cart_Validator
 */
class Cart_Validator {

	/**
	 * Nonce action name.
	 */
	private const NONCE_ACTION = 'optiontics_addon_form';

	/**
	 * Nonce field name in the POST payload.
	 */
	private const NONCE_FIELD = 'optiontics_addon_form_nonce';

	/**
	 * Validate the current add-to-cart POST and return cleaned selections.
	 *
	 * @return array<int, array<string, mixed>> Cleaned selections, or empty on failure.
	 */
	public function validated_selections(): array {
		if ( ! $this->nonce_passes() ) {
			return [];
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Missing -- nonce verified in $this->nonce_passes() above.
		if ( empty( $_POST['addon_data_json'] ) ) {
			return [];
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- nonce verified in $this->nonce_passes() above.
		$raw  = wp_unslash( $_POST['addon_data_json'] );
		$data = json_decode( $raw, true );

		if ( ! is_array( $data ) || empty( $data ) ) {
			return [];
		}

		return $this->sanitize_selections( $data );
	}

	// =========================================================================
	// PRIVATE
	// =========================================================================

	/**
	 * Verify the form nonce.
	 *
	 * @return bool
	 */
	private function nonce_passes(): bool {
		$nonce = isset( $_POST[ self::NONCE_FIELD ] )
			? sanitize_text_field( wp_unslash( $_POST[ self::NONCE_FIELD ] ) )
			: '';

		return wp_verify_nonce( $nonce, self::NONCE_ACTION ) !== false;
	}

	/**
	 * Sanitise each selection entry into a typed structure.
	 *
	 * @param  array $raw Raw decoded JSON array.
	 * @return array<int, array<string, mixed>>
	 */
	private function sanitize_selections( array $raw ): array {
		$clean = [];

		foreach ( $raw as $entry ) {
			if ( ! is_array( $entry ) ) {
				continue;
			}

			$price = floatval( $entry['price'] ?? 0 );
			$qty   = max( 1, intval( $entry['qty'] ?? 1 ) );

			// Skip selections that carry a negative price (guard against manipulation).
			if ( $price < 0 ) {
				continue;
			}

			$clean[] = [
				'field_type'   => sanitize_key( (string) ( $entry['type']        ?? '' ) ),
				'group_label'  => sanitize_text_field( (string) ( $entry['label']       ?? $entry['group']  ?? '' ) ),
				'field_label'  => sanitize_text_field( (string) ( $entry['label']       ?? '' ) ),
				'choice_label' => sanitize_text_field( (string) ( $entry['optionLabel'] ?? $entry['value']  ?? '' ) ),
				'value'        => sanitize_text_field( (string) ( $entry['value']       ?? '' ) ),
				'price'        => $price,
				'qty'          => $qty,
			];
		}

		return $clean;
	}
}
