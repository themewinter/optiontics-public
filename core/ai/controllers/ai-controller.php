<?php
/**
 * AI REST Controller
 *
 * Server-side proxy for the "Create with AI" feature. Routes generation
 * requests to the provider configured under Optiontics → Settings
 * (free_token / google_gemini / openai) and keeps API keys on the server.
 *
 * Endpoint: POST optiontics/v1/ai/generate
 *
 * @package Optiontics\Core\AI\Controllers
 * @since   2.1.0
 */

namespace Optiontics\Core\AI\Controllers;

use Optiontics\Abstract\Base_Rest_Controller;
use Optiontics\Core\FieldUnits\Support\Field_Type_Registry;
use Optiontics\Core\Settings\Settings;
use WP_REST_Request;
use WP_REST_Server;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class AI_Controller
 */
class AI_Controller extends Base_Rest_Controller {

	protected $namespace = 'optiontics/v1';
	protected $rest_base = 'ai';

	/**
	 * Providers this controller knows how to route to. Anything else coming
	 * out of the settings store is clamped to the fallback below.
	 */
	private const ALLOWED_PROVIDERS = [ 'free_token', 'google_gemini', 'openai' ];
	private const FALLBACK_PROVIDER = 'free_token';

	/**
	 * Max generations allowed per user inside the rate-limit window.
	 * Prevents any editor from burning the site's AI budget in a loop.
	 */
	private const RATE_LIMIT_MAX    = 15;
	private const RATE_LIMIT_WINDOW = 5 * MINUTE_IN_SECONDS;

	/**
	 * Default model per provider — used when the user hasn't picked one yet.
	 */
	private const DEFAULT_MODELS = [
		// Aisentic routes the real model server-side based on its own
		// classifier, so the blessed slug is the sentinel "aisentic-auto".
		'free_token'    => 'aisentic-auto',
		'google_gemini' => 'gemini-1.5-flash',
		'openai'        => 'gpt-4o-mini',
	];

	/**
	 * Aisentic-hosted chat-completion endpoint used by the Free Token provider.
	 * Matches the path the official Aisentic plugin hits. Filterable via
	 * `optiontics_aisentic_endpoint` for staging/self-hosted setups.
	 */
	private const AISENTIC_ENDPOINT = 'https://app.aisentic.com/api/v1/chat/completions';

	 

	/**
	 * Hard cap on fields per layout. Also stated in the prompt, but we
	 * enforce it server-side so over-eager models can't slow the client.
	 */
	private const MAX_FIELDS_PER_LAYOUT = 5;

	/**
	 * Resolved per-request cache of field-type slugs the AI may emit.
	 * Populated lazily from Field_Type_Registry so third-party types
	 * registered via `optiontics_register_field_types` are picked up.
	 *
	 * @var string[]|null
	 */
	private ?array $allowed_types = null;

	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/generate',
			[
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => [ $this, 'generate' ],
				'permission_callback' => [ $this, 'generate_permissions_check' ],
			]
		);
	}

	public function generate_permissions_check(): bool {
		// Same bar as creating/editing option blocks.
		return current_user_can( 'manage_options' );
	}

	/**
	 * POST /ai/generate — turn a natural-language prompt into a layout of
	 * blocks the editor can import.
	 */
	public function generate( WP_REST_Request $request ) {
		$body = json_decode( $request->get_body(), true );

		// Prompt must be a JSON string — reject arrays, objects, numbers, etc.
		$raw_prompt = is_array( $body ) && isset( $body['prompt'] ) ? $body['prompt'] : '';
		if ( ! is_string( $raw_prompt ) ) {
			return $this->error(
				__( 'Please enter a prompt describing what to build.', 'optiontics' ),
				400,
				'missing_prompt'
			);
		}

		$prompt = trim( sanitize_textarea_field( $raw_prompt ) );

		if ( '' === $prompt ) {
			return $this->error( __( 'Please enter a prompt describing what to build.', 'optiontics' ), 400, 'missing_prompt' );
		}
		if ( strlen( $prompt ) > 2000 ) {
			return $this->error( __( 'Prompt is too long. Keep it under 2000 characters.', 'optiontics' ), 400, 'prompt_too_long' );
		}

		$rate_limited = $this->check_rate_limit();
		if ( null !== $rate_limited ) {
			return $rate_limited;
		}

		$provider = $this->get_active_provider();

		switch ( $provider ) {
			case 'google_gemini':
				return $this->handle_google_gemini( $prompt );
			case 'openai':
				return $this->handle_openai( $prompt );
			case 'free_token':
			default:
				return $this->handle_free_token( $prompt );
		}
	}

	// =========================================================================
	// PROVIDER HANDLERS
	// =========================================================================

	/**
	 * Free Token — routes through the Aisentic-hosted chat-completion
	 * endpoint using the key the user saves under the Free Token card.
	 */
	private function handle_free_token( string $prompt ) {
		$api_key = $this->get_free_token_key();
		if ( '' === $api_key ) {
			return $this->error(
				__( 'Free Token is not configured on this site. Add your Aisentic API key under Optiontics → Settings → Free Token, or switch to another provider.', 'optiontics' ),
				503,
				'missing_api_key'
			);
		}

		// Defensive: strip any whitespace / line-break chars the user may have
		// copy-pasted around the key. A stray newline inside the header value
		// causes cURL to drop the Authorization header entirely, which upstream
		// reports back as "Missing Authentication header".
		$api_key = preg_replace( '/\s+/', '', $api_key );

		$model = $this->resolve_model( 'free_token' );

		/**
		 * Filter the default Aisentic endpoint. Useful for staging or
		 * self-hosted mirrors.
		 *
		 * @param string $endpoint  Absolute URL.
		 */
		$endpoint = (string) apply_filters( 'optiontics_aisentic_endpoint', self::AISENTIC_ENDPOINT );

		$response = wp_remote_post(
			$endpoint,
			[
				'timeout' => 30,
				'headers' => [
					'Authorization' => 'Bearer ' . $api_key,
					'Accept'        => 'application/json',
					'Content-Type'  => 'application/json',
				],
				'body'    => wp_json_encode( $this->build_chat_payload( $prompt, $model ) ),
			]
		);

		return $this->consume_chat_response(
			$response,
			__( 'Aisentic', 'optiontics' ),
			'aisentic'
		);
	}

	/**
	 * OpenAI — uses the OpenAI chat completions API directly.
	 */
	private function handle_openai( string $prompt ) {
		$api_key = trim( (string) Settings::get( 'ai_openai_api_key' ) );
		if ( '' === $api_key ) {
			return $this->error(
				__( 'OpenAI API key is not configured. Add it under Optiontics → Settings.', 'optiontics' ),
				503,
				'missing_api_key'
			);
		}

		$model = $this->resolve_model( 'openai' );

		$response = wp_remote_post(
			'https://api.openai.com/v1/chat/completions',
			[
				'timeout' => 30,
				'headers' => [
					'Authorization' => 'Bearer ' . $api_key,
					'Content-Type'  => 'application/json',
				],
				'body'    => wp_json_encode( $this->build_chat_payload( $prompt, $model ) ),
			]
		);

		return $this->consume_chat_response( $response, __( 'OpenAI', 'optiontics' ), 'openai' );
	}

	/**
	 * Google Gemini — uses the v1beta generateContent endpoint. Different
	 * request/response shape than the OpenAI-style chat APIs.
	 */
	private function handle_google_gemini( string $prompt ) {
		$api_key = trim( (string) Settings::get( 'ai_google_gemini_api_key' ) );
		if ( '' === $api_key ) {
			return $this->error(
				__( 'Google Gemini API key is not configured. Add it under Optiontics → Settings.', 'optiontics' ),
				503,
				'missing_api_key'
			);
		}

		$model = $this->resolve_model( 'google_gemini' );

		// Send the API key via header rather than the URL query string;
		// query strings can be captured in access logs / reverse-proxy logs.
		$url = sprintf(
			'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent',
			rawurlencode( $model )
		);

		$payload = [
			'systemInstruction' => [
				'parts' => [ [ 'text' => $this->get_system_prompt() ] ],
			],
			'contents'          => [
				[
					'role'  => 'user',
					'parts' => [ [ 'text' => $prompt ] ],
				],
			],
			'generationConfig'  => [
				'temperature'      => 0.3, 
				'responseMimeType' => 'application/json',
			],
		];

		$response = wp_remote_post(
			$url,
			[
				'timeout' => 30,
				'headers' => [
					'Content-Type'    => 'application/json',
					'x-goog-api-key'  => $api_key,
				],
				'body'    => wp_json_encode( $payload ),
			]
		);

		if ( is_wp_error( $response ) ) {
			return $this->error(
				sprintf(
					/* translators: %s: transport error message */
					__( 'Unable to reach Google Gemini: %s', 'optiontics' ),
					$response->get_error_message()
				),
				502,
				'gemini_transport_error'
			);
		}

		$status  = (int) wp_remote_retrieve_response_code( $response );
		$raw     = (string) wp_remote_retrieve_body( $response );
		$decoded = json_decode( $raw, true );

		if ( $status < 200 || $status >= 300 ) {
			$message = is_array( $decoded ) && ! empty( $decoded['error']['message'] )
				? (string) $decoded['error']['message']
				: sprintf(
					/* translators: %d: HTTP status code */
					__( 'Gemini returned status %d.', 'optiontics' ),
					$status
				);
			return $this->error( $message, 502, 'gemini_error' );
		}

		$content = $decoded['candidates'][0]['content']['parts'][0]['text'] ?? null;
		if ( ! is_string( $content ) || '' === trim( $content ) ) {
			return $this->error( __( 'AI returned an empty response.', 'optiontics' ), 502, 'empty_response' );
		}

		return $this->finish_with_content( $content );
	}

	// =========================================================================
	// HELPERS
	// =========================================================================

	/**
	 * Field-type slugs the AI is allowed to emit. Pulls from the live
	 * Field_Type_Registry so third-party types registered via
	 * `optiontics_register_field_types` are included automatically.
	 *
	 * Sites can further filter the list via `optiontics_ai_allowed_field_types`
	 * (e.g. to hide a type the AI keeps picking poorly).
	 *
	 * @return string[]
	 */
	private function get_allowed_types(): array {
		if ( null !== $this->allowed_types ) {
			return $this->allowed_types;
		}

		$registry = new Field_Type_Registry();
		$slugs    = $registry->all_slugs();

		/**
		 * Filter the allowed field-type slugs the AI may emit.
		 *
		 * @param string[] $slugs All registered field-type slugs.
		 */
		$slugs = (array) apply_filters( 'optiontics_ai_allowed_field_types', $slugs );

		// Normalise: string, non-empty, unique, numerically re-indexed.
		$slugs = array_values( array_unique( array_filter(
			array_map(
				static fn( $s ) => is_string( $s ) ? sanitize_key( $s ) : '',
				$slugs
			),
			static fn( string $s ) => '' !== $s
		) ) );

		$this->allowed_types = $slugs;
		return $slugs;
	}

	/**
	 * Active provider from the settings store, clamped to the known set.
	 * Any unexpected value (stale install, direct DB edit) falls back to
	 * the bundled free_token path rather than reaching an unknown branch.
	 */
	private function get_active_provider(): string {
		$provider = (string) Settings::get( 'ai_active_provider' );
		return in_array( $provider, self::ALLOWED_PROVIDERS, true )
			? $provider
			: self::FALLBACK_PROVIDER;
	}

	/**
	 * Per-user sliding window cap. Any logged-in user with `edit_posts` can
	 * hit /ai/generate, so without this a single account could drain the
	 * site's API quota with a tight loop.
	 *
	 * Returns an error response when the limit is exhausted, or null when
	 * the caller may proceed.
	 *
	 * @return \WP_HTTP_Response|null
	 */
	private function check_rate_limit() {
		$user_id = get_current_user_id();
		if ( $user_id <= 0 ) {
			// Permission check already requires a logged-in user; bail safely.
			return $this->error( __( 'Authentication required.', 'optiontics' ), 401, 'not_authenticated' );
		}

		$key   = 'optiontics_ai_rl_' . $user_id;
		$count = (int) get_transient( $key );

		if ( $count >= self::RATE_LIMIT_MAX ) {
			return $this->error(
				__( 'Too many AI requests. Please wait a few minutes and try again.', 'optiontics' ),
				429,
				'rate_limited'
			);
		}

		set_transient( $key, $count + 1, self::RATE_LIMIT_WINDOW );
		return null;
	}

	/**
	 * Resolve the model for a provider from settings, falling back to the
	 * default. Honours a provider-specific filter so sites can override.
	 */
	private function resolve_model( string $provider ): string {
		$model_keys = [
			'free_token'    => '',           // legacy OpenRouter key has no settings field
			'google_gemini' => 'ai_google_gemini_model',
			'openai'        => 'ai_openai_model',
		];

		$stored = '';
		if ( ! empty( $model_keys[ $provider ] ) ) {
			$stored = (string) Settings::get( $model_keys[ $provider ] );
		}

		if ( '' === trim( $stored ) ) {
			$stored = self::DEFAULT_MODELS[ $provider ] ?? '';
		}

		return trim( $stored );
	}

	/**
	 * API key used by the "Free Token" provider.
	 *
	 * The Settings page (Free Token card) writes the key into the Settings
	 * store under `optiontics_openrouter_api_key`. Lookup order:
	 *
	 *   1. Settings store key `optiontics_openrouter_api_key`  (where the UI writes).
	 *   2. Standalone `optiontics_openrouter_api_key` option   (legacy / wp-cli installs).
	 *   3. `optiontics_openrouter_api_key` filter              (code override).
	 *   4. `OPTIONTICS_OPENROUTER_API_KEY` constant            (env / local dev).
	 */
	private function get_free_token_key(): string {
		$key = trim( (string) Settings::get( 'optiontics_openrouter_api_key' ) );

		if ( '' === $key ) {
			$key = trim( (string) get_option( 'optiontics_openrouter_api_key', '' ) );
		}

		$key = (string) apply_filters( 'optiontics_openrouter_api_key', $key );

		if ( '' === $key && defined( 'OPTIONTICS_OPENROUTER_API_KEY' ) ) {
			$key = (string) OPTIONTICS_OPENROUTER_API_KEY;
		}

		return trim( $key );
	}

	/**
	 * OpenAI-style chat completions payload — shared by OpenAI and OpenRouter.
	 */
	private function build_chat_payload( string $prompt, string $model ): array {
		return [
			'model'           => $model,
			'temperature'     => 0.3, 
			'response_format' => [ 'type' => 'json_object' ],
			'messages'        => [
				[ 'role' => 'system', 'content' => $this->get_system_prompt() ],
				[ 'role' => 'user',   'content' => $prompt ],
			],
		];
	}

	/**
	 * Handle a wp_remote_post() result from any OpenAI-compatible chat API,
	 * extracting the assistant text and handing it off for normalization.
	 *
	 * @param  mixed  $response    wp_remote_post return value.
	 * @param  string $label       Human-readable provider name for error messages.
	 * @param  string $code        Short slug used in error `type` fields.
	 * @param  array  $debug_details  Optional extra data to surface in the
	 *                                 `error.details` field of upstream errors.
	 *                                 Do not include secrets.
	 * @return \WP_HTTP_Response
	 */
	private function consume_chat_response( $response, string $label, string $code, array $debug_details = [] ) {
		if ( is_wp_error( $response ) ) {
			return $this->error(
				sprintf(
					/* translators: 1: provider name, 2: transport error */
					__( 'Unable to reach %1$s: %2$s', 'optiontics' ),
					$label,
					$response->get_error_message()
				),
				502,
				$code . '_transport_error',
				$debug_details
			);
		}

		$status  = (int) wp_remote_retrieve_response_code( $response );
		$raw     = (string) wp_remote_retrieve_body( $response );
		$decoded = json_decode( $raw, true );

		if ( $status < 200 || $status >= 300 ) {
			$message = is_array( $decoded ) && ! empty( $decoded['error']['message'] )
				? (string) $decoded['error']['message']
				: sprintf(
					/* translators: 1: provider name, 2: HTTP status */
					__( '%1$s returned status %2$d.', 'optiontics' ),
					$label,
					$status
				);
			return $this->error( $message, 502, $code . '_error', $debug_details );
		}

		$content = $decoded['choices'][0]['message']['content'] ?? null;
		if ( ! is_string( $content ) || '' === trim( $content ) ) {
			return $this->error( __( 'AI returned an empty response.', 'optiontics' ), 502, 'empty_response' );
		}

		return $this->finish_with_content( $content );
	}

	/**
	 * Parse the provider's raw text, normalize to the editor layout shape,
	 * and return the final REST response (or an error if unusable).
	 */
	private function finish_with_content( string $content ) {
		$parsed = $this->parse_layout_json( $content );
		if ( null === $parsed ) {
			return $this->error(
				__( 'AI returned invalid JSON. Try rephrasing the prompt.', 'optiontics' ),
				502,
				'invalid_json'
			);
		}

		$suggestions = $this->normalize_suggestions( $parsed );
		if ( empty( $suggestions ) ) {
			return $this->error(
				__( 'AI response did not contain any usable fields. Try a more specific prompt.', 'optiontics' ),
				502,
				'no_fields'
			);
		}

		return $this->response( [ 'suggestions' => $suggestions ] );
	}

	/**
	 * The system prompt that instructs the model to emit our JSON schema.
	 */
	private function get_system_prompt(): string {
		$allowed_types = implode( ', ', $this->get_allowed_types() );
		return <<<PROMPT
You are an assistant that designs WooCommerce product add-on forms.
Given the user's request, output exactly TWO JSON suggestion objects inside a "suggestions" array.
The first suggestion should be the most feature-rich recommended layout; the second should be a simpler alternative approach.

Schema (strict):
{
  "suggestions": [
    {
      "title": "Short title",
      "badge": "Recommended",
      "description": "One-sentence description",
      "fields": [
        {
          "type": "<one of: {$allowed_types}>",
          "label": "Field label",
          "description": "optional help text",
          "placeholder": "optional placeholder (only for textfield/textarea/number)",
          "required": true|false,
          "options": [
            { "label": "Option A", "price": 0, "price_type": "fixed" }
          ]
        }
      ]
    },
    {
      "title": "Short title",
      "badge": null,
      "description": "One-sentence description",
      "fields": [ ... ]
    }
  ]
}

Rules:
- Respond with JSON only. No code fences, no prose.
- Always include exactly 2 suggestions.
- "badge" must be "Recommended" on the first suggestion and null on the second.
- "options" is required for radio/checkbox/select; omit it for other types.
- "price_type" is one of "fixed", "percentage", or "no_cost".
- HARD LIMIT: each suggestion must have at most 5 fields. Pick only the most essential fields.
- The second suggestion is a simpler alternative — 2-3 fields.
- Omit "description" and "placeholder" unless they add real value. Keep labels short.
- Labels and option text should be human-friendly and avoid jargon.
- Do not invent types outside the allowed list.
PROMPT;
	}

	/**
	 * Parse the model's raw content as JSON. Handles stray markdown fences.
	 */
	private function parse_layout_json( string $content ): ?array {
		$trimmed = trim( $content );

		// Strip ```json ... ``` / ``` ... ``` fences if the model added them.
		if ( 0 === strpos( $trimmed, '```' ) ) {
			$trimmed = preg_replace( '/^```[a-zA-Z0-9_+-]*\s*/', '', $trimmed );
			$trimmed = preg_replace( '/\s*```$/', '', (string) $trimmed );
			$trimmed = trim( (string) $trimmed );
		}

		$data = json_decode( $trimmed, true );
		return is_array( $data ) ? $data : null;
	}

	/**
	 * Normalise the top-level parsed JSON into a suggestions array.
	 * Handles both the new multi-suggestion shape and the old single-layout
	 * shape so responses from models that ignore the new prompt still work.
	 *
	 * @param  array $parsed
	 * @return array<int, array{title:string, badge:string|null, description:string, fields:array}>
	 */
	private function normalize_suggestions( array $parsed ): array {
		// New shape: { suggestions: [...] }
		if ( isset( $parsed['suggestions'] ) && is_array( $parsed['suggestions'] ) ) {
			$out = [];
			foreach ( $parsed['suggestions'] as $raw ) {
				if ( ! is_array( $raw ) ) {
					continue;
				}
				$layout = $this->normalize_layout( $raw );
				if ( ! empty( $layout['fields'] ) ) {
					$out[] = $layout;
				}
			}
			if ( ! empty( $out ) ) {
				return $out;
			}
		}

		// Fallback: old single-layout shape { title, description, fields }
		if ( isset( $parsed['fields'] ) ) {
			$layout = $this->normalize_layout( $parsed );
			if ( ! empty( $layout['fields'] ) ) {
				return [ $layout ];
			}
		}

		return [];
	}

	/**
	 * Sanitise + validate a single layout object. Unknown types and malformed
	 * fields are dropped rather than failing the entire response.
	 */
	private function normalize_layout( array $layout ): array {
		$fields        = [];
		$allowed_types = $this->get_allowed_types();

		// Hard cap — mirrors the MAX_FIELDS rule in the prompt. If the model
		// over-produces, we clip here so the frontend never has to cope with it.
		$raw_fields = is_array( $layout['fields'] ?? null ) ? $layout['fields'] : [];
		$raw_fields = array_slice( $raw_fields, 0, self::MAX_FIELDS_PER_LAYOUT );

		foreach ( $raw_fields as $raw ) {
			if ( ! is_array( $raw ) ) {
				continue;
			}
			$type = sanitize_key( (string) ( $raw['type'] ?? '' ) );
			if ( ! in_array( $type, $allowed_types, true ) ) {
				continue;
			}

			$field = [
				'type'        => $type,
				'label'       => sanitize_text_field( (string) ( $raw['label'] ?? '' ) ),
				'description' => sanitize_text_field( (string) ( $raw['description'] ?? '' ) ),
				'placeholder' => sanitize_text_field( (string) ( $raw['placeholder'] ?? '' ) ),
				'required'    => ! empty( $raw['required'] ),
			];

			// Choice-type fields carry options.
			if ( in_array( $type, [ 'radio', 'checkbox', 'select' ], true ) ) {
				$field['options'] = $this->normalize_options( $raw['options'] ?? [] );
				if ( empty( $field['options'] ) ) {
					// Seed a default so the editor doesn't render an empty group.
					$field['options'] = [
						[ 'label' => 'Option 1', 'price' => 0, 'price_type' => 'no_cost' ],
					];
				}
			}

			$fields[] = $field;
		}

		$raw_badge = $layout['badge'] ?? null;
		$badge     = is_string( $raw_badge ) && '' !== trim( $raw_badge )
			? sanitize_text_field( trim( $raw_badge ) )
			: null;

		return [
			'title'       => sanitize_text_field( (string) ( $layout['title'] ?? 'Generated layout' ) ),
			'badge'       => $badge,
			'description' => sanitize_text_field( (string) ( $layout['description'] ?? '' ) ),
			'fields'      => $fields,
		];
	}

	/**
	 * @param mixed $raw
	 * @return array<int, array{label:string, price:float, price_type:string}>
	 */
	private function normalize_options( $raw ): array {
		if ( ! is_array( $raw ) ) {
			return [];
		}

		$allowed_price_types = [ 'fixed', 'percentage', 'no_cost' ];
		$out                 = [];

		foreach ( $raw as $item ) {
			if ( ! is_array( $item ) ) {
				continue;
			}
			$label = sanitize_text_field( (string) ( $item['label'] ?? $item['value'] ?? '' ) );
			if ( '' === $label ) {
				continue;
			}

			$price_type = sanitize_key( (string) ( $item['price_type'] ?? 'fixed' ) );
			if ( ! in_array( $price_type, $allowed_price_types, true ) ) {
				$price_type = 'fixed';
			}

			$out[] = [
				'label'      => $label,
				'price'      => (float) ( $item['price'] ?? 0 ),
				'price_type' => $price_type,
			];
		}

		return $out;
	}
}
