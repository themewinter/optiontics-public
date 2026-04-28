<?php
/**
 * Analytics REST Controller
 *
 * Provides KPI metrics, monthly revenue chart data, and product-wise
 * performance for the Optiontics analytics dashboard.
 *
 * Endpoint namespace : optiontics/v1
 * Routes:
 *   GET /analytics/summary             – six KPI cards + comparison period
 *   GET /analytics/revenue-chart       – monthly revenue for the line chart
 *   GET /analytics/product-performance – per-product revenue table
 *
 * Accepted ?date_range= values: all | 30_days | 7_days | today
 *
 * @package Optiontics\Core\Analytics\Controllers
 * @since   1.1.0
 */

namespace Optiontics\Core\Analytics\Controllers;

use Optiontics\Abstract\Base_Rest_Controller;
use WP_REST_Server;
use WP_HTTP_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Analytics_Controller
 */
class Analytics_Controller extends Base_Rest_Controller {

	// =========================================================================
	// CONSTANTS
	// =========================================================================

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
	protected $rest_base = 'analytics';

	/**
	 * Order item meta key written by Cart_Mutator.
	 */
	private const META_KEY = '_optiontics_addon_data';

	/**
	 * WooCommerce order statuses counted as successful orders.
	 * Centralised here — one place to change across all five query methods.
	 */
	private const ORDER_STATUSES = [ 'wc-completed', 'wc-processing' ];

	/**
	 * Transient TTL — 15 minutes.
	 */
	private const CACHE_TTL = 900;

	/**
	 * All transient keys managed by this controller.
	 */
	private const CACHE_KEYS = [
		'optiontics_analytics_summary_all',
		'optiontics_analytics_summary_30_days',
		'optiontics_analytics_summary_7_days',
		'optiontics_analytics_summary_today',
		'optiontics_analytics_revenue_chart',
		'optiontics_analytics_product_perf_all',
		'optiontics_analytics_product_perf_30_days',
		'optiontics_analytics_product_perf_7_days',
		'optiontics_analytics_product_perf_today',
	];

	// =========================================================================
	// HOOK REGISTRATION
	// =========================================================================

	/**
	 * Registers REST routes and cache-invalidation hooks.
	 *
	 * @return void
	 */
	public function register(): void {
		add_action( 'rest_api_init', [ $this, 'register_routes' ] );

		add_action( 'optiontics_option_block_created', [ $this, 'flush_all_caches' ] );
		add_action( 'optiontics_option_block_updated', [ $this, 'flush_all_caches' ] );
		add_action( 'before_delete_post',              [ $this, 'maybe_flush_on_delete' ] );
		add_action( 'transition_post_status',          [ $this, 'maybe_flush_on_status_change' ], 10, 3 );
	}

	/**
	 * Delete all analytics transients.
	 *
	 * @return void
	 */
	public function flush_all_caches(): void {
		foreach ( self::CACHE_KEYS as $key ) {
			delete_transient( $key );
		}
	}

	/**
	 * Flush caches only when the deleted post is an optiontics-block.
	 *
	 * @param int $post_id Post being deleted.
	 * @return void
	 */
	public function maybe_flush_on_delete( int $post_id ): void {
		if ( 'optiontics-block' === get_post_type( $post_id ) ) {
			$this->flush_all_caches();
		}
	}

	/**
	 * Flush caches when an optiontics-block transitions to or from 'publish'.
	 *
	 * @param string   $new_status New post status.
	 * @param string   $old_status Old post status.
	 * @param \WP_Post $post       Post object.
	 * @return void
	 */
	public function maybe_flush_on_status_change( string $new_status, string $old_status, \WP_Post $post ): void {
		if ( 'optiontics-block' !== $post->post_type ) {
			return;
		}

		if ( 'publish' === $new_status || 'publish' === $old_status ) {
			$this->flush_all_caches();
		}
	}

	// =========================================================================
	// ROUTE REGISTRATION
	// =========================================================================

	/**
	 * Register REST routes.
	 *
	 * @return void
	 */
	public function register_routes(): void {
		$auth = [ $this, 'permissions_check' ];

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/summary',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_summary' ],
					'permission_callback' => $auth,
					'args'                => $this->date_range_arg(),
				],
			]
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/revenue-chart',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_revenue_chart' ],
					'permission_callback' => $auth,
				],
			]
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/product-performance',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_product_performance' ],
					'permission_callback' => $auth,
					'args'                => $this->date_range_arg(),
				],
			]
		);
	}

	// =========================================================================
	// PERMISSION CHECK
	// =========================================================================

	/**
	 * Verify the current user can access analytics data.
	 *
	 * @return bool|\WP_Error True when authorised, WP_Error otherwise.
	 */
	public function permissions_check(): bool|\WP_Error {
		if ( current_user_can( 'manage_options' ) || optiontics_is_dokan_vendor() ) {
			return true;
		}

		return new \WP_Error(
			'rest_forbidden',
			__( 'You do not have permission to access analytics.', 'optiontics' ),
			[ 'status' => rest_authorization_required_code() ]
		);
	}

	// =========================================================================
	// ENDPOINTS
	// =========================================================================

	/**
	 * GET /analytics/summary
	 *
	 * Returns six KPI metrics for the chosen date range plus the prior
	 * equivalent period so the UI can show trend badges.
	 *
	 * @param  \WP_REST_Request $request REST request object.
	 * @return WP_HTTP_Response
	 */
	public function get_summary( \WP_REST_Request $request ): WP_HTTP_Response {
		$range     = $this->sanitize_range( $request->get_param( 'date_range' ) );
		$cache_key = 'optiontics_analytics_summary_' . $range;
		$cached    = get_transient( $cache_key );

		if ( false !== $cached ) {
			return $this->response( $cached );
		}

		[ $start, $end ]           = $this->date_bounds( $range );
		[ $prev_start, $prev_end ] = $this->previous_period( $range, $start );

		$data = [
			'total_options'          => $this->count_options( 'any' ),
			'active_options'         => $this->count_options( 'publish' ),
			'products_using_options' => $this->count_products_with_options(),
			'revenue_with_options'   => $this->revenue_with_options( $start, $end ),
			'orders_with_options'    => $this->count_orders_with_options( $start, $end ),
			'conversion_rate'        => $this->conversion_rate( $start, $end ),
			// Previous period — used by the UI trend badge.
			'prev_revenue'           => $this->revenue_with_options( $prev_start, $prev_end ),
			'prev_orders'            => $this->count_orders_with_options( $prev_start, $prev_end ),
			'prev_conversion_rate'   => $this->conversion_rate( $prev_start, $prev_end ),
		];

		set_transient( $cache_key, $data, self::CACHE_TTL );

		return $this->response( $data );
	}

	/**
	 * GET /analytics/revenue-chart
	 *
	 * Returns monthly revenue for the past 18 months (always full range —
	 * the chart does not change with the date-range filter).
	 *
	 * @param  \WP_REST_Request $request REST request object.
	 * @return WP_HTTP_Response
	 */
	public function get_revenue_chart( \WP_REST_Request $request ): WP_HTTP_Response {
		$cache_key = 'optiontics_analytics_revenue_chart';
		$cached    = get_transient( $cache_key );

		if ( false !== $cached ) {
			return $this->response( $cached );
		}

		global $wpdb;

		// Build a list of the past 18 calendar months (oldest → newest).
		$months = [];
		for ( $i = 17; $i >= 0; $i-- ) {
			$months[] = gmdate( 'Y-m', strtotime( "-{$i} months" ) );
		}

		$cutoff    = gmdate( 'Y-m-01', strtotime( '-17 months' ) );
		$status_in = $this->order_statuses_sql();

		if ( $this->is_hpos_active() ) {
			// HPOS path — wc_orders stores date_created_gmt and total_amount directly.
			// phpcs:disable WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL
			$rows = $wpdb->get_results(
				$wpdb->prepare(
					"SELECT
						DATE_FORMAT( o.date_created_gmt, '%%Y-%%m' ) AS month,
						SUM( o.total_amount )                         AS revenue
					FROM {$wpdb->prefix}woocommerce_order_items AS oi
					INNER JOIN {$wpdb->prefix}woocommerce_order_itemmeta AS oim
						ON  oim.order_item_id = oi.order_item_id
						AND oim.meta_key      = %s
					INNER JOIN {$wpdb->prefix}wc_orders AS o
						ON o.id = oi.order_id
					WHERE o.type              = %s
					  AND o.status            IN ({$status_in})
					  AND o.date_created_gmt >= %s
					GROUP BY month
					ORDER BY month ASC",
					self::META_KEY,
					'shop_order',
					$cutoff
				)
			);
			// phpcs:enable
		} else {
			// Legacy path — orders stored in wp_posts / wp_postmeta.
			// phpcs:disable WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL
			$rows = $wpdb->get_results(
				$wpdb->prepare(
					"SELECT
						DATE_FORMAT( p.post_date, '%%Y-%%m' ) AS month,
						SUM( pm.meta_value )                  AS revenue
					FROM {$wpdb->prefix}woocommerce_order_items AS oi
					INNER JOIN {$wpdb->prefix}woocommerce_order_itemmeta AS oim
						ON  oim.order_item_id = oi.order_item_id
						AND oim.meta_key      = %s
					INNER JOIN {$wpdb->posts} AS p
						ON p.ID = oi.order_id
					INNER JOIN {$wpdb->postmeta} AS pm
						ON  pm.post_id   = p.ID
						AND pm.meta_key  = '_order_total'
					WHERE p.post_type    = %s
					  AND p.post_status  IN ({$status_in})
					  AND p.post_date   >= %s
					GROUP BY month
					ORDER BY month ASC",
					self::META_KEY,
					'shop_order',
					$cutoff
				)
			);
			// phpcs:enable
		}

		// Index rows by month for O(1) lookup.
		$by_month = [];
		foreach ( $rows as $row ) {
			$by_month[ $row->month ] = (float) $row->revenue;
		}

		// Ensure every month slot is present, filling gaps with 0.
		$chart_data = [];
		foreach ( $months as $m ) {
			$chart_data[] = [
				'month'   => $m,
				'revenue' => $by_month[ $m ] ?? 0.0,
			];
		}

		$payload = [ 'items' => $chart_data ];
		set_transient( $cache_key, $payload, self::CACHE_TTL );

		return $this->response( $payload );
	}

	/**
	 * GET /analytics/product-performance
	 *
	 * Returns up to 10 products sorted by revenue, each row including:
	 *   product_id, product_name, revenue, order_count, option_count, growth
	 *
	 * @param  \WP_REST_Request $request REST request object.
	 * @return WP_HTTP_Response
	 */
	public function get_product_performance( \WP_REST_Request $request ): WP_HTTP_Response {
		$range     = $this->sanitize_range( $request->get_param( 'date_range' ) );
		$cache_key = 'optiontics_analytics_product_perf_' . $range;
		$cached    = get_transient( $cache_key );

		if ( false !== $cached ) {
			return $this->response( $cached );
		}

		[ $start, $end ]           = $this->date_bounds( $range );
		[ $prev_start, $prev_end ] = $this->previous_period( $range, $start );

		$current_rows = $this->query_product_revenue( $start, $end );

		// Build a previous-period revenue map for growth calculation.
		$prev_rows = $this->query_product_revenue( $prev_start, $prev_end );
		$prev_map  = [];
		foreach ( $prev_rows as $row ) {
			$prev_map[ (int) $row->product_id ] = (float) $row->revenue;
		}

		// Batch-fetch product titles to avoid N+1 queries.
		$product_ids    = array_map( static fn( $r ) => (int) $r->product_id, $current_rows );
		$product_titles = $this->get_product_titles( $product_ids );

		$items = [];
		foreach ( $current_rows as $row ) {
			$product_id = (int) $row->product_id;
			$revenue    = (float) $row->revenue;
			$prev_rev   = $prev_map[ $product_id ] ?? 0.0;

			if ( $prev_rev > 0 ) {
				$growth = round( ( ( $revenue - $prev_rev ) / $prev_rev ) * 100, 1 );
			} elseif ( $revenue > 0 ) {
				$growth = 100.0; // New revenue with no prior baseline.
			} else {
				$growth = 0.0;
			}

			$items[] = [
				'product_id'   => $product_id,
				'product_name' => $product_titles[ $product_id ] ?? __( 'Unknown Product', 'optiontics' ),
				'revenue'      => $revenue,
				'order_count'  => (int) $row->order_count,
				'option_count' => $this->count_options_for_product( $product_id ),
				'growth'       => $growth,
			];
		}

		$payload = [ 'items' => $items ];
		set_transient( $cache_key, $payload, self::CACHE_TTL );

		return $this->response( $payload );
	}

	// =========================================================================
	// PRIVATE QUERY HELPERS
	// =========================================================================

	/**
	 * Count optiontics-block posts by status.
	 *
	 * Uses WP_Query with no_found_rows to skip the SQL_CALC_FOUND_ROWS overhead.
	 *
	 * @param  string $status 'any' | 'publish' | 'draft' etc.
	 * @return int
	 */
	private function count_options( string $status ): int {
		$args = [
			'post_type'              => 'optiontics-block',
			'post_status'            => $status,
			'posts_per_page'         => -1,
			'fields'                 => 'ids',
			'no_found_rows'          => true,
			'update_post_meta_cache' => false,
			'update_post_term_cache' => false,
		];

		if ( optiontics_is_dokan_vendor() && ! current_user_can( 'manage_options' ) ) {
			$args['author'] = get_current_user_id();
		}

		$query = new \WP_Query( $args );

		return count( $query->posts );
	}

	/**
	 * Count distinct WooCommerce products that have at least one published
	 * addon block assigned.
	 *
	 * update_post_meta() serialises arrays, so meta_value must be decoded with
	 * maybe_unserialize(), not json_decode().
	 *
	 * @return int
	 */
	private function count_products_with_options(): int {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$rows = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT pm.meta_value
				FROM {$wpdb->postmeta} AS pm
				INNER JOIN {$wpdb->posts} AS p ON p.ID = pm.post_id
				WHERE pm.meta_key   = %s
				  AND p.post_type   = 'optiontics-block'
				  AND p.post_status = 'publish'
				  AND pm.meta_value != ''",
				'optiontics_option_block_products'
			)
		);

		$product_ids = [];
		foreach ( $rows as $raw ) {
			$value = maybe_unserialize( $raw );

			if ( is_array( $value ) ) {
				foreach ( $value as $pid ) {
					if ( is_numeric( $pid ) && (int) $pid > 0 ) {
						$product_ids[ (int) $pid ] = true;
					}
				}
			} elseif ( is_numeric( $raw ) && (int) $raw > 0 ) {
				$product_ids[ (int) $raw ] = true;
			}
		}

		return count( $product_ids );
	}

	/**
	 * Sum order totals for completed/processing orders that contain addon data.
	 *
	 * @param  string|null $start ISO datetime string or null (no lower bound).
	 * @param  string|null $end   ISO datetime string or null (no upper bound).
	 * @return float
	 */
	private function revenue_with_options( ?string $start, ?string $end ): float {
		global $wpdb;

		$status_in = $this->order_statuses_sql();

		if ( $this->is_hpos_active() ) {
			$where_date = $this->date_where_clause( 'o.date_created_gmt', $start, $end );

			// phpcs:disable WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL
			$result = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT COALESCE( SUM( o.total_amount ), 0 )
					FROM {$wpdb->prefix}woocommerce_order_items AS oi
					INNER JOIN {$wpdb->prefix}woocommerce_order_itemmeta AS oim
						ON  oim.order_item_id = oi.order_item_id
						AND oim.meta_key      = %s
					INNER JOIN {$wpdb->prefix}wc_orders AS o ON o.id = oi.order_id
					WHERE o.type   = %s
					  AND o.status IN ({$status_in})
					{$where_date}",
					self::META_KEY,
					'shop_order'
				)
			);
			// phpcs:enable
		} else {
			$where_date = $this->date_where_clause( 'p.post_date', $start, $end );

			// phpcs:disable WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL
			$result = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT COALESCE( SUM( pm.meta_value ), 0 )
					FROM {$wpdb->prefix}woocommerce_order_items AS oi
					INNER JOIN {$wpdb->prefix}woocommerce_order_itemmeta AS oim
						ON  oim.order_item_id = oi.order_item_id
						AND oim.meta_key      = %s
					INNER JOIN {$wpdb->posts} AS p ON p.ID = oi.order_id
					INNER JOIN {$wpdb->postmeta} AS pm
						ON  pm.post_id  = p.ID
						AND pm.meta_key = '_order_total'
					WHERE p.post_type   = %s
					  AND p.post_status IN ({$status_in})
					{$where_date}",
					self::META_KEY,
					'shop_order'
				)
			);
			// phpcs:enable
		}

		return (float) $result;
	}

	/**
	 * Count distinct orders that contain at least one optiontics addon item.
	 *
	 * @param  string|null $start
	 * @param  string|null $end
	 * @return int
	 */
	private function count_orders_with_options( ?string $start, ?string $end ): int {
		global $wpdb;

		$status_in = $this->order_statuses_sql();

		if ( $this->is_hpos_active() ) {
			$where_date = $this->date_where_clause( 'o.date_created_gmt', $start, $end );

			// phpcs:disable WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL
			$result = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT COUNT( DISTINCT oi.order_id )
					FROM {$wpdb->prefix}woocommerce_order_items AS oi
					INNER JOIN {$wpdb->prefix}woocommerce_order_itemmeta AS oim
						ON  oim.order_item_id = oi.order_item_id
						AND oim.meta_key      = %s
					INNER JOIN {$wpdb->prefix}wc_orders AS o ON o.id = oi.order_id
					WHERE o.type   = %s
					  AND o.status IN ({$status_in})
					{$where_date}",
					self::META_KEY,
					'shop_order'
				)
			);
			// phpcs:enable
		} else {
			$where_date = $this->date_where_clause( 'p.post_date', $start, $end );

			// phpcs:disable WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL
			$result = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT COUNT( DISTINCT oi.order_id )
					FROM {$wpdb->prefix}woocommerce_order_items AS oi
					INNER JOIN {$wpdb->prefix}woocommerce_order_itemmeta AS oim
						ON  oim.order_item_id = oi.order_item_id
						AND oim.meta_key      = %s
					INNER JOIN {$wpdb->posts} AS p ON p.ID = oi.order_id
					WHERE p.post_type   = %s
					  AND p.post_status IN ({$status_in})
					{$where_date}",
					self::META_KEY,
					'shop_order'
				)
			);
			// phpcs:enable
		}

		return (int) $result;
	}

	/**
	 * Conversion rate = (orders with options / total orders) × 100, clamped to [0, 100].
	 *
	 * @param  string|null $start
	 * @param  string|null $end
	 * @return float
	 */
	private function conversion_rate( ?string $start, ?string $end ): float {
		global $wpdb;

		$status_in = $this->order_statuses_sql();

		if ( $this->is_hpos_active() ) {
			$where_date = $this->date_where_clause( 'date_created_gmt', $start, $end );

			// phpcs:disable WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL
			$total_orders = (int) $wpdb->get_var(
				$wpdb->prepare(
					"SELECT COUNT(*)
					FROM {$wpdb->prefix}wc_orders
					WHERE type   = %s
					  AND status IN ({$status_in})
					{$where_date}",
					'shop_order'
				)
			);
			// phpcs:enable
		} else {
			$where_date = $this->date_where_clause( 'post_date', $start, $end );

			// phpcs:disable WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL
			$total_orders = (int) $wpdb->get_var(
				$wpdb->prepare(
					"SELECT COUNT(*)
					FROM {$wpdb->posts}
					WHERE post_type   = %s
					  AND post_status IN ({$status_in})
					{$where_date}",
					'shop_order'
				)
			);
			// phpcs:enable
		}

		if ( $total_orders <= 0 ) {
			return 0.0;
		}

		$option_orders = $this->count_orders_with_options( $start, $end );

		return round( min( 100.0, ( $option_orders / $total_orders ) * 100 ), 1 );
	}

	/**
	 * Query per-product revenue for the given date window.
	 * Returns up to 10 products sorted by revenue DESC.
	 *
	 * @param  string|null $start
	 * @param  string|null $end
	 * @return array<object>
	 */
	private function query_product_revenue( ?string $start, ?string $end ): array {
		global $wpdb;

		$status_in = $this->order_statuses_sql();

		if ( $this->is_hpos_active() ) {
			$where_date = $this->date_where_clause( 'o.date_created_gmt', $start, $end );

			// phpcs:disable WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL
			return (array) $wpdb->get_results(
				$wpdb->prepare(
					"SELECT
						oim_product.meta_value                               AS product_id,
						COUNT( DISTINCT oi.order_id )                        AS order_count,
						SUM( CAST( oim_total.meta_value AS DECIMAL(10,2) ) ) AS revenue
					FROM {$wpdb->prefix}woocommerce_order_items AS oi
					INNER JOIN {$wpdb->prefix}woocommerce_order_itemmeta AS oim_addon
						ON  oim_addon.order_item_id = oi.order_item_id
						AND oim_addon.meta_key      = %s
					INNER JOIN {$wpdb->prefix}woocommerce_order_itemmeta AS oim_product
						ON  oim_product.order_item_id = oi.order_item_id
						AND oim_product.meta_key      = '_product_id'
					INNER JOIN {$wpdb->prefix}woocommerce_order_itemmeta AS oim_total
						ON  oim_total.order_item_id = oi.order_item_id
						AND oim_total.meta_key      = '_line_total'
					INNER JOIN {$wpdb->prefix}wc_orders AS o ON o.id = oi.order_id
					WHERE o.type   = %s
					  AND o.status IN ({$status_in})
					{$where_date}
					GROUP BY oim_product.meta_value
					ORDER BY revenue DESC
					LIMIT 10",
					self::META_KEY,
					'shop_order'
				)
			);
			// phpcs:enable
		}

		// Legacy (wp_posts) path.
		$where_date = $this->date_where_clause( 'p.post_date', $start, $end );

		// phpcs:disable WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL
		return (array) $wpdb->get_results(
			$wpdb->prepare(
				"SELECT
					oim_product.meta_value                               AS product_id,
					COUNT( DISTINCT oi.order_id )                        AS order_count,
					SUM( CAST( oim_total.meta_value AS DECIMAL(10,2) ) ) AS revenue
				FROM {$wpdb->prefix}woocommerce_order_items AS oi
				INNER JOIN {$wpdb->prefix}woocommerce_order_itemmeta AS oim_addon
					ON  oim_addon.order_item_id = oi.order_item_id
					AND oim_addon.meta_key      = %s
				INNER JOIN {$wpdb->prefix}woocommerce_order_itemmeta AS oim_product
					ON  oim_product.order_item_id = oi.order_item_id
					AND oim_product.meta_key      = '_product_id'
				INNER JOIN {$wpdb->prefix}woocommerce_order_itemmeta AS oim_total
					ON  oim_total.order_item_id = oi.order_item_id
					AND oim_total.meta_key      = '_line_total'
				INNER JOIN {$wpdb->posts} AS p ON p.ID = oi.order_id
				WHERE p.post_type   = %s
				  AND p.post_status IN ({$status_in})
				{$where_date}
				GROUP BY oim_product.meta_value
				ORDER BY revenue DESC
				LIMIT 10",
				self::META_KEY,
				'shop_order'
			)
		);
		// phpcs:enable
	}

	/**
	 * Count published addon blocks directly assigned to a specific product.
	 *
	 * Uses LIKE as a cheap pre-filter then validates via maybe_unserialize() to
	 * avoid false positives (e.g. product ID 5 matching meta that contains 15).
	 *
	 * @param  int $product_id WooCommerce product ID.
	 * @return int
	 */
	private function count_options_for_product( int $product_id ): int {
		global $wpdb;

		// LIKE pre-filter narrows the result set; PHP-side check confirms exact match.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$rows = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT pm.meta_value
				FROM {$wpdb->postmeta} AS pm
				INNER JOIN {$wpdb->posts} AS p ON p.ID = pm.post_id
				WHERE pm.meta_key   = %s
				  AND p.post_type   = 'optiontics-block'
				  AND p.post_status = 'publish'
				  AND pm.meta_value LIKE %s",
				'optiontics_option_block_products',
				'%' . $wpdb->esc_like( (string) $product_id ) . '%'
			)
		);

		$count = 0;
		foreach ( $rows as $raw ) {
			$value = maybe_unserialize( $raw );

			if ( is_array( $value ) ) {
				// Exact integer match — prevents ID 5 matching 15, 50, etc.
				if ( in_array( $product_id, array_map( 'intval', $value ), true ) ) {
					$count++;
				}
			} elseif ( (int) $raw === $product_id ) {
				$count++;
			}
		}

		return $count;
	}

	/**
	 * Batch-fetch product post titles to avoid N+1 queries in get_product_performance().
	 *
	 * @param  int[] $product_ids List of WooCommerce product IDs.
	 * @return array<int, string> Map of product_id → post_title.
	 */
	private function get_product_titles( array $product_ids ): array {
		if ( empty( $product_ids ) ) {
			return [];
		}

		$posts = get_posts(
			[
				'post__in'               => $product_ids,
				'post_type'              => 'product',
				'posts_per_page'         => count( $product_ids ),
				'no_found_rows'          => true,
				'update_post_meta_cache' => false,
				'update_post_term_cache' => false,
			]
		);

		$titles = [];
		foreach ( $posts as $post ) {
			$titles[ $post->ID ] = $post->post_title;
		}

		return $titles;
	}

	// =========================================================================
	// HPOS HELPER
	// =========================================================================

	/**
	 * Detect whether WooCommerce HPOS (High-Performance Order Storage) is active.
	 *
	 * Result is static-cached so the DB check happens at most once per request.
	 *
	 * @return bool
	 */
	private function is_hpos_active(): bool {
		global $wpdb;
		static $active = null;

		if ( null !== $active ) {
			return $active;
		}

		// 1. Check the table exists.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$table_exists = (bool) $wpdb->get_var(
			$wpdb->prepare( 'SHOW TABLES LIKE %s', $wpdb->prefix . 'wc_orders' )
		);

		if ( ! $table_exists ) {
			$active = false;
			return $active;
		}

		// 2. Confirm orders are actually stored there (the table may exist but be
		//    empty when a site has reverted to legacy storage after migration).
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$active = (bool) $wpdb->get_var(
			$wpdb->prepare(
				"SELECT COUNT(*) FROM {$wpdb->prefix}wc_orders WHERE type = %s LIMIT 1",
				'shop_order'
			)
		);

		return $active;
	}

	// =========================================================================
	// DATE HELPERS
	// =========================================================================

	/**
	 * Sanitise and normalise a date_range parameter value.
	 *
	 * @param  mixed $raw Raw value from the REST request.
	 * @return string 'all' | '30_days' | '7_days' | 'today'
	 */
	private function sanitize_range( $raw ): string {
		$allowed = [ 'all', '30_days', '7_days', 'today' ];
		$value   = sanitize_text_field( (string) $raw );

		return in_array( $value, $allowed, true ) ? $value : 'all';
	}

	/**
	 * Return [ $start, $end ] UTC datetime strings for the given range.
	 * Returns [ null, null ] for 'all' (no bounds).
	 *
	 * @param  string $range
	 * @return array{0: string|null, 1: string|null}
	 */
	private function date_bounds( string $range ): array {
		switch ( $range ) {
			case 'today':
				return [
					gmdate( 'Y-m-d 00:00:00' ),
					gmdate( 'Y-m-d 23:59:59' ),
				];
			case '7_days':
				return [
					gmdate( 'Y-m-d 00:00:00', strtotime( '-6 days' ) ),
					gmdate( 'Y-m-d 23:59:59' ),
				];
			case '30_days':
				return [
					gmdate( 'Y-m-d 00:00:00', strtotime( '-29 days' ) ),
					gmdate( 'Y-m-d 23:59:59' ),
				];
			default:
				return [ null, null ];
		}
	}

	/**
	 * Return the previous equivalent period for trend comparison.
	 *
	 * @param  string      $range
	 * @param  string|null $current_start
	 * @return array{0: string|null, 1: string|null}
	 */
	private function previous_period( string $range, ?string $current_start ): array {
		if ( 'all' === $range || null === $current_start ) {
			return [ null, null ];
		}

		switch ( $range ) {
			case 'today':
				return [
					gmdate( 'Y-m-d 00:00:00', strtotime( '-1 day' ) ),
					gmdate( 'Y-m-d 23:59:59', strtotime( '-1 day' ) ),
				];
			case '7_days':
				return [
					gmdate( 'Y-m-d 00:00:00', strtotime( '-13 days' ) ),
					gmdate( 'Y-m-d 23:59:59', strtotime( '-7 days' ) ),
				];
			default: // 30_days
				return [
					gmdate( 'Y-m-d 00:00:00', strtotime( '-59 days' ) ),
					gmdate( 'Y-m-d 23:59:59', strtotime( '-30 days' ) ),
				];
		}
	}

	/**
	 * Build a SQL WHERE fragment for a date column, e.g.:
	 *   AND p.post_date >= '2024-01-01 00:00:00' AND p.post_date <= '2024-01-31 23:59:59'
	 *
	 * Values are produced by gmdate() (not user input) but are still run through
	 * $wpdb->prepare() for defence-in-depth and WPCS compliance.
	 * The returned string begins with a space for safe concatenation.
	 *
	 * @param  string      $column Qualified column name, e.g. 'o.date_created_gmt'.
	 * @param  string|null $start
	 * @param  string|null $end
	 * @return string
	 */
	private function date_where_clause( string $column, ?string $start, ?string $end ): string {
		global $wpdb;

		if ( null === $start && null === $end ) {
			return '';
		}

		$parts = [];

		if ( null !== $start ) {
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			$parts[] = $wpdb->prepare( "AND {$column} >= %s", $start );
		}

		if ( null !== $end ) {
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			$parts[] = $wpdb->prepare( "AND {$column} <= %s", $end );
		}

		return ' ' . implode( ' ', $parts );
	}

	/**
	 * Return a safe SQL IN-list string from ORDER_STATUSES for embedding in queries.
	 *
	 * Values come from a private constant (never user input) so direct embedding
	 * is safe. esc_sql() is applied for additional safety.
	 *
	 * @return string e.g. "'wc-completed','wc-processing'"
	 */
	private function order_statuses_sql(): string {
		return implode(
			',',
			array_map(
				static fn( string $s ) => "'" . esc_sql( $s ) . "'",
				self::ORDER_STATUSES
			)
		);
	}

	/**
	 * REST argument schema for the date_range query parameter.
	 *
	 * @return array[]
	 */
	private function date_range_arg(): array {
		return [
			'date_range' => [
				'default'           => 'all',
				'sanitize_callback' => 'sanitize_text_field',
				'validate_callback' => static function ( $value ) {
					return in_array( $value, [ 'all', '30_days', '7_days', 'today' ], true );
				},
			],
		];
	}
}
