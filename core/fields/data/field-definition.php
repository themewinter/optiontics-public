<?php
/**
 * Field Definition DTO
 *
 * Immutable value object representing a single field unit's validated
 * configuration. Replaces the raw associative array passed between
 * the old block classes, centralising sanitisation in one place.
 *
 * @package Optiontics\Core\FieldUnits\DTO
 * @since   2.0.0
 */

namespace Optiontics\Core\FieldUnits\DTO;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Field_Definition
 *
 * Architectural difference from the old pattern:
 *  - Properties are public readonly (PHP 8.1+), making the object truly immutable.
 *  - All sanitisation happens in from_array() — field types never need to
 *    call sanitize_text_field() themselves.
 *  - Named properties ("node_id", "group_id", "title") map to the NEW
 *    data-attribute schema, not the old "blockid/sectionid/label" names.
 *  - "choices" replaces "_options" — clearer domain language.
 *  - "rules" replaces "fieldConditions" — aligns with the rule-engine pattern.
 */
final class Field_Definition {

	/**
	 * Unique field identifier. Maps to data-node-id on the wrapper element.
	 *
	 * @var string
	 */
	public readonly string $node_id;

	/**
	 * Section / group scope identifier. Maps to data-group-id.
	 *
	 * @var string
	 */
	public readonly string $group_id;

	/**
	 * Human-readable field title. Maps to data-title.
	 *
	 * @var string
	 */
	public readonly string $title;

	/**
	 * Registered field type slug (e.g. 'checkbox', 'textfield').
	 *
	 * @var string
	 */
	public readonly string $field_type;

	/**
	 * Whether a value is required before form submission.
	 *
	 * @var bool
	 */
	public readonly bool $is_required;

	/**
	 * Whether the field label row should be hidden from view.
	 *
	 * @var bool
	 */
	public readonly bool $is_hidden;

	/**
	 * Optional descriptive text shown beneath the field.
	 *
	 * @var string
	 */
	public readonly string $description;

	/**
	 * Available choices/options for multi-value fields.
	 * Each entry is a sanitised array with at minimum: value, type, regular, sale.
	 *
	 * @var array<int, array<string, mixed>>
	 */
	public readonly array $choices;

	/**
	 * Conditional display rules. Empty array means always visible.
	 *
	 * @var array<int, array<string, mixed>>
	 */
	public readonly array $rules;

	/**
	 * Visibility action when rules match: 'show' or 'hide'.
	 *
	 * @var string
	 */
	public readonly string $condition_visibility;

	/**
	 * Rule combinator: 'all' (AND) or 'any' (OR).
	 *
	 * @var string
	 */
	public readonly string $condition_match;

	/**
	 * Whether conditional logic is active for this field.
	 *
	 * @var bool
	 */
	public readonly bool $logic_enabled;

	/**
	 * Optional extra CSS class(es) from the editor.
	 *
	 * @var string
	 */
	public readonly string $css_extra;

	/**
	 * Image URL at the field level (used by fields with a single image).
	 *
	 * @var string
	 */
	public readonly string $image_url;

	/**
	 * Default/pre-selected value.
	 *
	 * @var string
	 */
	public readonly string $default_value;

	/**
	 * Full sanitised raw data, for type-specific extras not covered above.
	 * Access via get() for a safe, default-aware getter.
	 *
	 * @var array<string, mixed>
	 */
	private readonly array $raw;

	/**
	 * Private constructor — use Field_Definition::from_array().
	 *
	 * @param array<string, mixed> $sanitized Pre-sanitised data array.
	 */
	private function __construct( array $sanitized ) {
		$this->node_id       = (string) ( $sanitized['blockid']         ?? '' );
		$this->group_id      = (string) ( $sanitized['sectionid']       ?? '' );
		$this->title         = (string) ( $sanitized['label']           ?? '' );
		$this->field_type    = (string) ( $sanitized['type']            ?? '' );
		$this->is_required   = (bool)   ( $sanitized['required']        ?? false );
		$this->is_hidden     = (bool)   ( $sanitized['hide']            ?? false );
		$this->description   = (string) ( $sanitized['desc']            ?? '' );
		$this->choices       = self::parse_choices( $sanitized['_options'] ?? [] );
		$raw_conditions      = $sanitized['fieldconditions'] ?? [];
		$this->rules         = self::parse_rules( $raw_conditions );
		$meta                = self::parse_condition_meta( $raw_conditions );
		$this->condition_visibility = $meta['visibility'];
		$this->condition_match      = $meta['match'];
		$this->logic_enabled = (bool)   ( $sanitized['en_logic']        ?? false );
		$this->css_extra     = (string) ( $sanitized['class']           ?? '' );
		$this->image_url     = self::validate_url( $sanitized['image']  ?? '' );
		$this->default_value = (string) ( $sanitized['defval']          ?? '' );
		$this->raw           = $sanitized;
	}

	// =========================================================================
	// FACTORY
	// =========================================================================

	/**
	 * Construct a Field_Definition from a raw editor data array.
	 *
	 * Sanitises all scalar values, decodes any JSON strings in sub-arrays,
	 * and returns an immutable DTO.
	 *
	 * @param  array<string, mixed> $raw Raw field configuration from the editor.
	 * @return self
	 * @throws \InvalidArgumentException When the array is empty or has no 'type'.
	 */
	public static function from_array( array $raw ): self {
		if ( empty( $raw ) ) {
			throw new \InvalidArgumentException( 'Field definition data cannot be empty.' );
		}

		if ( empty( $raw['type'] ) ) {
			throw new \InvalidArgumentException( 'Field definition must include a "type" key.' );
		}

		return new self( self::sanitize_raw( $raw ) );
	}

	// =========================================================================
	// DATA ACCESS
	// =========================================================================

	/**
	 * Retrieve any raw field value by key with a default fallback.
	 *
	 * Useful for type-specific settings not modelled as named properties.
	 * Prefer the typed properties when available.
	 *
	 * @param  string $key     Raw data key.
	 * @param  mixed  $default Fallback value.
	 * @return mixed
	 */
	public function get( string $key, mixed $default = null ): mixed {
		if ( '' === $key ) {
			return $default;
		}
		// Try sanitize_key form first (matches how sanitize_raw() stored it),
		// then the original key for numeric or mixed-case edge cases.
		$clean = sanitize_key( $key );
		return $this->raw[ $clean ] ?? $this->raw[ $key ] ?? $default;
	}

	/**
	 * Return the first choice entry, or an empty array when there are none.
	 *
	 * @return array<string, mixed>
	 */
	public function first_choice(): array {
		return $this->choices[0] ?? [];
	}

	/**
	 * Whether this field has at least one choice defined.
	 *
	 * @return bool
	 */
	public function has_choices(): bool {
		return ! empty( $this->choices );
	}

	// =========================================================================
	// PRIVATE SANITISATION
	// =========================================================================

	/**
	 * Recursively sanitise a raw data array.
	 *
	 * @param  array<string, mixed> $raw Input data.
	 * @return array<string, mixed>
	 */
	private static function sanitize_raw( array $raw ): array {
		$out = [];

		foreach ( $raw as $key => $value ) {
			$clean_key = is_string( $key ) ? sanitize_key( $key ) : $key;

			if ( is_array( $value ) ) {
				$out[ $clean_key ] = self::sanitize_raw( $value );
			} elseif ( is_string( $value ) ) {
				$out[ $clean_key ] = sanitize_text_field( $value );
			} elseif ( is_numeric( $value ) ) {
				$out[ $clean_key ] = is_float( $value + 0 ) ? (float) $value : (int) $value;
			} elseif ( is_bool( $value ) ) {
				$out[ $clean_key ] = (bool) $value;
			} else {
				$out[ $clean_key ] = $value;
			}
		}

		return $out;
	}

	/**
	 * Parse and normalise the choices array.
	 *
	 * Each choice must have at minimum: value (string), type (string),
	 * regular (float), sale (float). Malformed entries are dropped.
	 *
	 * @param  mixed $raw Raw _options value.
	 * @return array<int, array<string, mixed>>
	 */
	private static function parse_choices( mixed $raw ): array {
		if ( ! is_array( $raw ) ) {
			return [];
		}

		$choices = [];

		foreach ( $raw as $item ) {
			if ( ! is_array( $item ) ) {
				continue;
			}

			$choices[] = [
				'value'   => sanitize_text_field( (string) ( $item['value']   ?? '' ) ),
				'type'    => sanitize_key( (string) ( $item['type']    ?? 'no_cost' ) ),
				'regular' => (float) ( $item['regular'] ?? 0 ),
				'sale'    => (float) ( $item['sale']    ?? 0 ),
				'default' => (bool)  ( $item['default'] ?? false ),
				'html'    => wp_kses_post( (string) ( $item['html']    ?? '' ) ),
				'image'   => self::validate_url( (string) ( $item['image'] ?? $item['img'] ?? '' ) ),
				'extra'   => is_array( $item['extra'] ?? null ) ? $item['extra'] : [],
			];
		}

		return $choices;
	}

	/**
	 * Parse and normalise the conditional rules array.
	 *
	 * Accepts both the editor shape `{ condition: {...}, rules: [...] }`
	 * and a legacy flat list of rule objects.
	 *
	 * @param  mixed $raw Raw fieldConditions value.
	 * @return array<int, array<string, mixed>>
	 */
	private static function parse_rules( mixed $raw ): array {
		if ( ! is_array( $raw ) ) {
			return [];
		}

		// Editor shape wraps the rules array inside a `rules` key.
		if ( isset( $raw['rules'] ) && is_array( $raw['rules'] ) ) {
			$raw = $raw['rules'];
		}

		$rules = [];

		foreach ( $raw as $rule ) {
			if ( ! is_array( $rule ) ) {
				continue;
			}
			$field   = isset( $rule['field'] )   ? sanitize_text_field( (string) $rule['field'] )   : '';
			$compare = isset( $rule['compare'] ) ? sanitize_text_field( (string) $rule['compare'] ) : '';
			if ( '' === $field || '' === $compare ) {
				continue; // Drop the empty scaffold row the editor seeds by default.
			}

			$value_raw = $rule['value'] ?? '';
			if ( is_array( $value_raw ) ) {
				$value = array_values( array_map(
					static fn( $v ) => sanitize_text_field( (string) $v ),
					$value_raw
				) );
			} else {
				$value = sanitize_text_field( (string) $value_raw );
			}

			$rules[] = [
				'field'   => $field,
				'compare' => $compare,
				'value'   => $value,
			];
		}

		return $rules;
	}

	/**
	 * Extract the condition meta (visibility + match) from the editor shape.
	 *
	 * @param  mixed $raw Raw fieldConditions value.
	 * @return array{visibility:string, match:string}
	 */
	private static function parse_condition_meta( mixed $raw ): array {
		$meta = [ 'visibility' => 'show', 'match' => 'all' ];

		if ( ! is_array( $raw ) || empty( $raw['condition'] ) || ! is_array( $raw['condition'] ) ) {
			return $meta;
		}

		$c = $raw['condition'];
		if ( isset( $c['visibility'] ) && in_array( $c['visibility'], [ 'show', 'hide' ], true ) ) {
			$meta['visibility'] = (string) $c['visibility'];
		}
		if ( isset( $c['match'] ) && in_array( $c['match'], [ 'any', 'all' ], true ) ) {
			$meta['match'] = (string) $c['match'];
		}

		return $meta;
	}

	/**
	 * Validate a URL and return escaped form or empty string.
	 *
	 * @param  string $url Raw URL string.
	 * @return string
	 */
	private static function validate_url( string $url ): string {
		if ( '' === $url ) {
			return '';
		}
		$clean = esc_url_raw( $url );
		return filter_var( $clean, FILTER_VALIDATE_URL ) ? esc_url( $clean ) : '';
	}
}
