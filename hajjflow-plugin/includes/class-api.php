<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class HajjFlow_API {

	public static function init() {
		add_action( 'rest_api_init', [ __CLASS__, 'register_routes' ] );
	}

	public static function register_routes() {
		$ns = HAJJFLOW_NAMESPACE;

		// POST /wp-json/hajjflow/v1/auth/google
		register_rest_route( $ns, '/auth/google', [
			'methods'             => 'POST',
			'callback'            => [ __CLASS__, 'handle_google_auth' ],
			'permission_callback' => [ __CLASS__, 'check_app_signature' ],
		] );

		// GET /wp-json/hajjflow/v1/logs?date=YYYY-MM-DD
		register_rest_route( $ns, '/logs', [
			'methods'             => 'GET',
			'callback'            => [ __CLASS__, 'get_logs' ],
			'permission_callback' => [ __CLASS__, 'check_jwt_and_signature' ],
		] );

		// POST /wp-json/hajjflow/v1/update-log
		register_rest_route( $ns, '/update-log', [
			'methods'             => 'POST',
			'callback'            => [ __CLASS__, 'update_log' ],
			'permission_callback' => [ __CLASS__, 'check_jwt_and_signature' ],
		] );

		// GET /wp-json/hajjflow/v1/me
		register_rest_route( $ns, '/me', [
			'methods'             => 'GET',
			'callback'            => [ __CLASS__, 'get_me' ],
			'permission_callback' => [ __CLASS__, 'check_jwt_and_signature' ],
		] );
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Permission callbacks
	// ─────────────────────────────────────────────────────────────────────────

	public static function check_app_signature( WP_REST_Request $request ) {
		$result = HajjFlow_Auth::verify_app_signature( $request );
		return ( true === $result ) ? true : $result;
	}

	public static function check_jwt_and_signature( WP_REST_Request $request ) {
		$sig_check = HajjFlow_Auth::verify_app_signature( $request );
		if ( is_wp_error( $sig_check ) ) return $sig_check;

		$user = HajjFlow_Auth::get_user_from_request( $request );
		if ( is_wp_error( $user ) ) return $user;

		// Stash user on request for callbacks
		$request->set_param( '_hajjflow_user', $user );
		return true;
	}

	// ─────────────────────────────────────────────────────────────────────────
	// POST /auth/google — verify Google ID token, create/find WP user, return JWT
	// ─────────────────────────────────────────────────────────────────────────
	public static function handle_google_auth( WP_REST_Request $request ) {
		$id_token = sanitize_text_field( $request->get_param( 'id_token' ) );
		if ( empty( $id_token ) ) {
			return new WP_Error( 'missing_token', 'id_token required.', [ 'status' => 400 ] );
		}

		$google_data = HajjFlow_Auth::verify_google_id_token( $id_token );
		if ( is_wp_error( $google_data ) ) return $google_data;

		$email   = $google_data['email'];
		$name    = $google_data['name'] ?? '';
		$picture = $google_data['picture'] ?? '';

		// Find or create WP user
		$user = get_user_by( 'email', $email );
		if ( ! $user ) {
			$user_id = wp_create_user(
				sanitize_user( explode( '@', $email )[0] . '_' . wp_generate_password( 4, false ) ),
				wp_generate_password( 24 ),
				$email
			);
			if ( is_wp_error( $user_id ) ) {
				return new WP_Error( 'user_create_failed', 'Could not create user.', [ 'status' => 500 ] );
			}
			wp_update_user( [ 'ID' => $user_id, 'display_name' => $name ] );
			update_user_meta( $user_id, 'hajjflow_google_picture', esc_url_raw( $picture ) );
			$user = get_user_by( 'id', $user_id );
		}

		// Ensure 1:1 log post exists
		HajjFlow_User_Log::get_or_create_log_post( $user->ID );

		$jwt = HajjFlow_Auth::generate_jwt( $user->ID );

		return rest_ensure_response( [
			'token'   => $jwt,
			'user_id' => $user->ID,
			'name'    => $user->display_name,
			'email'   => $user->user_email,
			'picture' => get_user_meta( $user->ID, 'hajjflow_google_picture', true ),
		] );
	}

	// ─────────────────────────────────────────────────────────────────────────
	// GET /logs?date=YYYY-MM-DD  — omit date → full history
	// ─────────────────────────────────────────────────────────────────────────
	public static function get_logs( WP_REST_Request $request ) {
		$user    = $request->get_param( '_hajjflow_user' );
		$date    = sanitize_text_field( $request->get_param( 'date' ) );

		if ( $date ) {
			if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $date ) ) {
				return new WP_Error( 'invalid_date', 'Date must be YYYY-MM-DD.', [ 'status' => 400 ] );
			}
			$logs = HajjFlow_User_Log::get_logs_for_date( $user->ID, $date );
			return rest_ensure_response( [ 'date' => $date, 'tasks' => $logs ] );
		}

		$all = HajjFlow_User_Log::get_logs( $user->ID );
		return rest_ensure_response( [ 'logs' => $all ] );
	}

	// ─────────────────────────────────────────────────────────────────────────
	// POST /update-log  — body: { date, tasks: { task_id: 'done'|'pending' } }
	//                    OR   { date, task_id, status }  (single task)
	// ─────────────────────────────────────────────────────────────────────────
	public static function update_log( WP_REST_Request $request ) {
		$user  = $request->get_param( '_hajjflow_user' );
		$body  = $request->get_json_params();
		$date  = sanitize_text_field( $body['date'] ?? '' );

		if ( ! $date || ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $date ) ) {
			return new WP_Error( 'invalid_date', 'Valid date (YYYY-MM-DD) required.', [ 'status' => 400 ] );
		}

		// Bulk update
		if ( isset( $body['tasks'] ) && is_array( $body['tasks'] ) ) {
			$ok = HajjFlow_User_Log::bulk_update_date( $user->ID, $date, $body['tasks'] );
			return rest_ensure_response( [ 'success' => $ok ] );
		}

		// Single task update
		$task_id = sanitize_key( $body['task_id'] ?? '' );
		$status  = in_array( $body['status'] ?? '', [ 'done', 'pending' ], true )
			? $body['status']
			: 'pending';

		if ( ! $task_id ) {
			return new WP_Error( 'missing_task_id', 'task_id required.', [ 'status' => 400 ] );
		}

		$ok = HajjFlow_User_Log::update_task( $user->ID, $date, $task_id, $status );
		return rest_ensure_response( [ 'success' => $ok ] );
	}

	// GET /me
	public static function get_me( WP_REST_Request $request ) {
		$user = $request->get_param( '_hajjflow_user' );
		return rest_ensure_response( [
			'user_id' => $user->ID,
			'name'    => $user->display_name,
			'email'   => $user->user_email,
			'picture' => get_user_meta( $user->ID, 'hajjflow_google_picture', true ),
		] );
	}
}
