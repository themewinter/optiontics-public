<?php
/**
 * Field Type Registry
 *
 * Maps type slugs to Field_Unit_Interface class names and produces
 * hydrated instances on demand. Replaces the old Block_Registrar.
 *
 * Architectural differences:
 *  - Registry is an instance (not static state), injectable and testable.
 *  - make() returns a Field_Unit_Interface, not a heavy object carrying $data.
 *    Field types are stateless handlers; data travels via DTOs at call time.
 *  - get_handler() caches instances — one per type, not one per field+product.
 *  - Third-party registration via 'optiontics_register_field_types' action.
 *
 * @package Optiontics\Core\FieldUnits\Support
 * @since   2.0.0
 */

namespace Optiontics\Core\FieldUnits\Support;

use Optiontics\Core\FieldUnits\Contracts\Field_Unit_Interface;
use Optiontics\Core\FieldUnits\Types\Button_Group_Field;
use Optiontics\Core\FieldUnits\Types\Checkbox_Field;
use Optiontics\Core\FieldUnits\Types\Radio_Field;
use Optiontics\Core\FieldUnits\Types\Select_Field;
use Optiontics\Core\FieldUnits\Types\Text_Field;
use Optiontics\Core\FieldUnits\Types\Textarea_Field;
use Optiontics\Core\FieldUnits\Types\Phone_Field;
use Optiontics\Core\FieldUnits\Types\Email_Field;
use Optiontics\Core\FieldUnits\Types\Number_Field;
use Optiontics\Core\FieldUnits\Types\Toggle_Field;
use Optiontics\Core\FieldUnits\Types\Heading_Field;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Field_Type_Registry
 */
class Field_Type_Registry {

	/**
	 * Third-party registered type map: slug → FQCN.
	 *
	 * @var array<string, class-string<Field_Unit_Interface>>
	 */
	private array $registered = [];

	/**
	 * Cached handler instances: slug → object.
	 *
	 * @var array<string, Field_Unit_Interface>
	 */
	private array $cache = [];

	/**
	 * Built-in type map. Defined separately from $registered so external
	 * code cannot accidentally remove a core type.
	 *
	 * @var array<string, class-string<Field_Unit_Interface>>
	 */
	private array $core_types = [
		'button_group' => Button_Group_Field::class,
		'checkbox'  => Checkbox_Field::class,
		'radio'     => Radio_Field::class,
		'select'    => Select_Field::class,
		'textfield' => Text_Field::class,
		'textarea'  => Textarea_Field::class,
		'telephone' => Phone_Field::class,
		'email'     => Email_Field::class,
		'number'    => Number_Field::class,
		'toggle'    => Toggle_Field::class,
		// 'switch' stored in old editor JSON → maps to Toggle_Field for back-compat.
		'switch'    => Toggle_Field::class,
		'heading'   => Heading_Field::class,
	];

	/**
	 * Boot the registry and fire the extension hook.
	 */
	public function __construct() {
		/**
		 * Register custom field types.
		 *
		 * @param Field_Type_Registry $registry This registry instance.
		 */
		do_action( 'optiontics_register_field_types', $this );
	}

	// =========================================================================
	// REGISTRATION
	// =========================================================================

	/**
	 * Register a custom field type.
	 *
	 * Custom types override core types with the same slug.
	 *
	 * @param  string $slug       Type slug (lowercase a-z0-9_-).
	 * @param  string $class_name FQCN implementing Field_Unit_Interface.
	 * @return void
	 * @throws \InvalidArgumentException On bad slug or class.
	 */
	public function register( string $slug, string $class_name ): void {
		$slug = sanitize_key( $slug );

		if ( '' === $slug ) {
			throw new \InvalidArgumentException( 'Field type slug cannot be empty.' );
		}

		if ( ! class_exists( $class_name ) ) {
			throw new \InvalidArgumentException(
				sprintf( 'Field type class "%s" does not exist.', esc_html( $class_name ) )
			);
		}

		if ( ! is_subclass_of( $class_name, Field_Unit_Interface::class ) ) {
			throw new \InvalidArgumentException(
				sprintf(
					'"%s" must implement %s.',
					esc_html( $class_name ),
					Field_Unit_Interface::class
				)
			);
		}

		$this->registered[ $slug ] = $class_name;
		// Bust cached instance if slug was already resolved.
		unset( $this->cache[ $slug ] );
	}

	// =========================================================================
	// RESOLUTION
	// =========================================================================

	/**
	 * Return (and cache) a handler instance for the given type slug.
	 *
	 * Returns null for unknown types — callers decide how to handle that.
	 *
	 * @param  string $slug Field type slug.
	 * @return Field_Unit_Interface|null
	 */
	public function get_handler( string $slug ): ?Field_Unit_Interface {
		$slug = sanitize_key( $slug );

		if ( '' === $slug ) {
			return null;
		}

		if ( isset( $this->cache[ $slug ] ) ) {
			return $this->cache[ $slug ];
		}

		// Third-party registrations take priority over core types.
		$class = $this->registered[ $slug ] ?? $this->core_types[ $slug ] ?? null;

		if ( null === $class || ! class_exists( $class ) ) {
			return null;
		}

		try {
			$handler = new $class();

			if ( ! $handler instanceof Field_Unit_Interface ) {
				return null;
			}

			$this->cache[ $slug ] = $handler;
			return $handler;

		} catch ( \Throwable $e ) {
			// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			error_log( sprintf(
				'Optiontics: Failed to instantiate field type "%s": %s',
				esc_html( $slug ),
				esc_html( $e->getMessage() )
			) );
			return null;
		}
	}

	/**
	 * Check whether a type slug is known to the registry.
	 *
	 * @param  string $slug Type slug.
	 * @return bool
	 */
	public function has_type( string $slug ): bool {
		$slug = sanitize_key( $slug );
		return isset( $this->registered[ $slug ] ) || isset( $this->core_types[ $slug ] );
	}

	/**
	 * Return all registered type slugs (core + custom).
	 *
	 * @return string[]
	 */
	public function all_slugs(): array {
		return array_keys( array_merge( $this->core_types, $this->registered ) );
	}
}
