<?php
/**
 * Option Block REST Controller
 *
 * Full CRUD REST API for the optiontics-block CPT.
 * Endpoint: optiontics/v1/option-block
 *
 * @package Optiontics\Core\Blocks\Controllers
 * @since   1.0.0
 */

namespace Optiontics\Core\Blocks\Controllers;

use Optiontics\Abstract\Base_Rest_Controller;
use Optiontics\Core\Blocks\Helpers\Block_Field_Sanitizer;
use Optiontics\Models\Block_Model;
use Optiontics\Resources\Block_Resource;
use WP_Error;
use WP_HTTP_Response;
use WP_REST_Server;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Option_Block_Controller
 *
 * Handles list, create, read, update, delete, and bulk-delete for option blocks.
 * Permission model: admins have full access; Dokan vendors access only their own blocks.
 */
class Option_Block_Controller extends Base_Rest_Controller {

	/**
	 * REST namespace.
	 *
	 * @var string
	 */
	protected $namespace = 'optiontics/v1';

	/**
	 * REST route base.
	 *
	 * @var string
	 */
	protected $rest_base = 'option-block';

	// =========================================================================
	// ROUTE REGISTRATION
	// =========================================================================

	/**
	 * {@inheritdoc}
	 */
	public function register_routes(): void {
		// Collection endpoint.
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'create_item' ],
					'permission_callback' => [ $this, 'create_item_permissions_check' ],
				],
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_items' ],
					'permission_callback' => [ $this, 'get_items_permissions_check' ],
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'bulk_delete_item' ],
					'permission_callback' => [ $this, 'delete_item_permissions_check' ],
				],
			]
		);

		// Item endpoint.
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<id>[\d]+)',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_item' ],
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
				],
				[
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => [ $this, 'update_item' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'delete_item' ],
					'permission_callback' => [ $this, 'delete_item_permissions_check' ],
				],
			]
		);

		// Clone endpoint — duplicates an existing block as a fresh draft.
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<id>[\d]+)/clone',
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'clone_item' ],
					'permission_callback' => [ $this, 'create_item_permissions_check' ],
				],
			]
		);
	}

	// =========================================================================
	// COLLECTION HANDLERS
	// =========================================================================

	/**
	 * GET /option-block — paginated list.
	 *
	 * @param  \WP_REST_Request $request
	 * @return WP_HTTP_Response
	 */
	public function get_items( $request ) {
		$args = [
			'post_status'    => ! empty( $request['status'] ) ? sanitize_text_field( $request['status'] ) : 'any',
			'posts_per_page' => ! empty( $request['per_page'] ) ? intval( $request['per_page'] ) : 10,
			'paged'          => ! empty( $request['paged'] ) ? intval( $request['paged'] ) : 1,
			'search'         => ! empty( $request['search'] ) ? sanitize_text_field( $request['search'] ) : '',
			'filter'         => ! empty( $request['filter'] ) ? sanitize_text_field( $request['filter'] ) : '',
		];

		// Vendors see only their own blocks.
		if ( optiontics_is_dokan_vendor() && ! current_user_can( 'manage_options' ) ) {
			$args['author'] = get_current_user_id();
		}

		$response          = Block_Model::paginate( $args );
		$response['items'] = Block_Resource::collection( $response['items'] );

		return $this->response( $response );
	}

	/**
	 * POST /option-block — create a new block.
	 *
	 * @param  \WP_REST_Request $request
	 * @return WP_HTTP_Response|WP_Error
	 */
	public function create_item( $request ) {
		$data = $this->prepare_item_for_database( $request );

		if ( is_wp_error( $data ) ) {
			return $this->error( $data->get_error_message() );
		}

		$option_block = Block_Model::create( $data );

		if ( is_wp_error( $option_block ) ) {
			return $this->error( $option_block->get_error_message() );
		}

		do_action( 'optiontics_option_block_created', $option_block->id, $data );

		return $this->response( new Block_Resource( $option_block ) );
	}

	// =========================================================================
	// ITEM HANDLERS
	// =========================================================================

	/**
	 * GET /option-block/{id} — retrieve a single block.
	 *
	 * @param  \WP_REST_Request $request
	 * @return WP_HTTP_Response|WP_Error
	 */
	public function get_item( $request ) {
		$id           = absint( $request['id'] );
		$option_block = Block_Model::find( $id );

		if ( ! $option_block ) {
			return $this->error( __( 'Invalid option block id', 'optiontics' ) );
		}

		if ( ! $this->vendor_owns_block( $id ) ) {
			return $this->error(
				__( 'You do not have permission to access this option block', 'optiontics' ),
				403
			);
		}

		return $this->response( new Block_Resource( $option_block ) );
	}

	/**
	 * PUT /option-block/{id} — update an existing block.
	 *
	 * @param  \WP_REST_Request $request
	 * @return WP_HTTP_Response|WP_Error
	 */
	public function update_item( $request ) {
		$id   = absint( $request['id'] );
		$data = $this->prepare_item_for_database( $request );

		if ( is_wp_error( $data ) ) {
			return $this->error( $data->get_error_message() );
		}

		$option_block = Block_Model::find( $id );

		if ( ! $option_block ) {
			return $this->error( __( 'Invalid Option Block id', 'optiontics' ) );
		}

		if ( ! $this->vendor_owns_block( $id ) ) {
			return $this->error(
				__( 'You do not have permission to update this option block', 'optiontics' ),
				403
			);
		}

		$option_block->update( $data );

		do_action( 'optiontics_option_block_updated', $id, $data );

		return $this->response( new Block_Resource( $option_block ) );
	}

	/**
	 * DELETE /option-block/{id} — permanently delete a single block.
	 *
	 * @param  \WP_REST_Request $request
	 * @return WP_HTTP_Response|WP_Error
	 */
	public function delete_item( $request ) {
		$id           = absint( $request['id'] );
		$option_block = Block_Model::find( $id );

		if ( ! $option_block ) {
			return $this->error( __( 'Invalid Option Block id', 'optiontics' ) );
		}

		if ( ! $this->vendor_owns_block( $id ) ) {
			return $this->error(
				__( 'You do not have permission to delete this option block', 'optiontics' ),
				403
			);
		}

		if ( ! $option_block->delete() ) {
			return $this->error( __( 'Something went wrong. Option Block could not be deleted', 'optiontics' ) );
		}

		return $this->response( [ 'message' => __( 'Successfully deleted.', 'optiontics' ) ] );
	}

	/**
	 * POST /option-block/{id}/clone — duplicate a block as a draft.
	 *
	 * Copies every fillable attribute (fields, craft_data, product-scope
	 * meta, etc.) from the source block into a brand-new post. The clone
	 * is always saved as `draft` so it stays invisible on the frontend
	 * until the user explicitly publishes it. Title gets a " (Copy)" suffix
	 * so it's easy to spot in the list.
	 *
	 * Fires `optiontics_option_block_created` so the assignment sync picks
	 * up the new post for product-addon mapping.
	 *
	 * @param  \WP_REST_Request $request
	 * @return WP_HTTP_Response|WP_Error
	 */
	public function clone_item( $request ) {
		$id     = absint( $request['id'] );
		$source = Block_Model::find( $id );

		if ( ! $source ) {
			return $this->error( __( 'Invalid Option Block id', 'optiontics' ), 404 );
		}

		if ( ! $this->vendor_owns_block( $id ) ) {
			return $this->error(
				__( 'You do not have permission to clone this option block', 'optiontics' ),
				403
			);
		}

		$attributes = [
			'title'   => $this->build_clone_title( (string) $source->title ),
			'content' => (string) $source->content,
			'status'  => 'draft',
		];

		// Carry over every fillable attribute (fields, craft_data, product
		// scoping, etc.) untouched — using the source instance's getters
		// preserves the stored string form (JSON for `fields`) as-is.
		$fillable_keys = ( new Block_Model() )->get_fillable_keys();
		foreach ( $fillable_keys as $key ) {
			if ( in_array( $key, [ 'title', 'content', 'status' ], true ) ) {
				continue;
			}
			$attributes[ $key ] = $source->$key;
		}

		$clone = Block_Model::create( $attributes );

		if ( ! $clone ) {
			return $this->error( __( 'Failed to clone option block.', 'optiontics' ) );
		}

		/**
		 * Fire the standard lifecycle hook so product assignment and cache
		 * flush listeners pick up the new block.
		 */
		do_action( 'optiontics_option_block_created', $clone->id, $attributes );

		return $this->response( new Block_Resource( $clone ) );
	}

	/**
	 * Build the title for a cloned block. Always appends " (Copy)" — if the
	 * user clones a clone they'll get "Foo (Copy) (Copy)", which makes the
	 * chain obvious rather than silently dropping the suffix.
	 *
	 * @param  string $original Source block title.
	 * @return string
	 */
	private function build_clone_title( string $original ): string {
		$original = trim( $original );
		if ( '' === $original ) {
			$original = __( 'Untitled', 'optiontics' );
		}
		return $original . ' ' . __( '(Copy)', 'optiontics' );
	}

	/**
	 * DELETE /option-block (body: { ids: [...] }) — bulk delete.
	 *
	 * @param  \WP_REST_Request $request
	 * @return WP_HTTP_Response|WP_Error
	 */
	public function bulk_delete_item( $request ) {
		$ids = $request->get_param( 'ids' );

		if ( ! is_array( $ids ) || empty( $ids ) ) {
			return $this->error( __( 'Invalid or empty Option Block IDs.', 'optiontics' ), 400 );
		}

		$deleted = [];
		$failed  = [];

		foreach ( $ids as $id ) {
			$id           = absint( $id );
			$option_block = Block_Model::find( $id );

			if ( ! $option_block || ! $this->vendor_owns_block( $id ) ) {
				$failed[] = $id;
				continue;
			}

			$option_block->delete();
			$deleted[] = $id;
		}

		$message = __( 'Selected Option Block deleted.', 'optiontics' );

		if ( ! empty( $failed ) ) {
			$message = sprintf(
				/* translators: 1: deleted count, 2: failed count */
				__( 'Deleted %1$d blocks. Failed to delete %2$d blocks due to permission restrictions.', 'optiontics' ),
				count( $deleted ),
				count( $failed )
			);
		}

		return $this->response( [ 'deleted' => $deleted, 'failed' => $failed ], $message );
	}

	// =========================================================================
	// PERMISSION CHECKS
	// =========================================================================

	/** @return bool */ public function create_item_permissions_check( $request ): bool  { return $this->can_manage_option_blocks(); }
	/** @return bool */ public function get_items_permissions_check( $request ): bool    { return $this->can_manage_option_blocks(); }
	/** @return bool */ public function get_item_permissions_check( $request ): bool     { return $this->can_manage_option_blocks(); }
	/** @return bool */ public function update_item_permissions_check( $request ): bool  { return $this->can_manage_option_blocks(); }
	/** @return bool */ public function delete_item_permissions_check( $request ): bool  { return $this->can_manage_option_blocks(); }

	// =========================================================================
	// PRIVATE HELPERS
	// =========================================================================

	/**
	 * True when the current user is an admin or an active Dokan vendor.
	 *
	 * @return bool
	 */
	private function can_manage_option_blocks(): bool {
		return current_user_can( 'manage_options' ) || optiontics_is_dokan_vendor();
	}

	/**
	 * True when the current user owns the block or is an admin.
	 *
	 * @param  int $block_id
	 * @return bool
	 */
	private function vendor_owns_block( int $block_id ): bool {
		if ( current_user_can( 'manage_options' ) ) {
			return true;
		}

		if ( ! optiontics_is_dokan_vendor() ) {
			return false;
		}

		$post = get_post( $block_id );
		return $post && (int) $post->post_author === get_current_user_id();
	}

	/**
	 * Decode, validate, and sanitize the JSON request body.
	 *
	 * Returns an array ready for Block_Model::create() / update() on success,
	 * or a WP_Error when a required field is missing.
	 *
	 * @param  \WP_REST_Request $request
	 * @return array|WP_Error
	 */
	protected function prepare_item_for_database( $request ) {
		$data = json_decode( $request->get_body(), true );

		$product_type = ! empty( $data['product_type'] ) ? sanitize_text_field( $data['product_type'] ) : '';

		$fields = ! empty( $data['fields'] ) ? $data['fields'] : [];
		$fields = Block_Field_Sanitizer::sanitize( $fields );

		return [
			'title'              => ! empty( $data['title'] ) ? sanitize_text_field( $data['title'] ) : 'untitled',
			'content'            => ! empty( $data['description'] ) ? sanitize_textarea_field( $data['description'] ) : '',
 			'fields'             => wp_json_encode( ! empty( $data['fields'] ) ? $data['fields'] : [], JSON_UNESCAPED_UNICODE ),
			'status'             => ! empty( $data['status'] ) ? sanitize_key( $data['status'] ) : 'draft',
			'product_type'       => $product_type,
			'exclude_products'   => ! empty( $data['exclude_products'] ) ? $data['exclude_products'] : [],
			'include_products'   => ! empty( $data['include_products'] ) ? $data['include_products'] : [],
			'exclude_categories' => ! empty( $data['exclude_categories'] ) ? $data['exclude_categories'] : [],
			'include_categories' => ! empty( $data['include_categories'] ) ? $data['include_categories'] : [],
			'exclude_tags'       => ! empty( $data['exclude_tags'] ) ? $data['exclude_tags'] : [],
			'include_tags'       => ! empty( $data['include_tags'] ) ? $data['include_tags'] : [],
			'exclude_brands'     => ! empty( $data['exclude_brands'] ) ? $data['exclude_brands'] : [],
			'include_brands'     => ! empty( $data['include_brands'] ) ? $data['include_brands'] : [],
			'craft_data'         => ! empty( $data['craftData'] ) ? $data['craftData'] : [],
		];
	}
}
