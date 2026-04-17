<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class HajjFlow_Auth {

	public static function init() {
		// Nothing to hook — methods called by API class
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Salt-based HMAC request signature verification
	// React app signs: HMAC-SHA256( timestamp:nonce, LOGGED_IN_KEY + AUTH_SALT )
	// Headers: X-HajjFlow-Timestamp, X-HajjFlow-Nonce, X-HajjFlow-Sig
	// ─────────────────────────────────────────────────────────────────────────
	public static function verify_app_signature( WP_REST_Request $request ) {
		$timestamp = (int) $request->get_header( 'X-HajjFlow-Timestamp' );
		$nonce     = $request->get_header( 'X-HajjFlow-Nonce' );
		$sig       = $request->get_header( 'X-HajjFlow-Sig' );

		if ( ! $timestamp || ! $nonce || ! $sig ) {
			return new WP_Error( 'missing_sig', 'Missing signature headers.', [ 'status' => 401 ] );
		}

		// Reject stale requests (> 5 min drift)
		if ( abs( time() - $timestamp ) > 300 ) {
			return new WP_Error( 'stale_request', 'Request timestamp expired.', [ 'status' => 401 ] );
		}

		$secret   = LOGGED_IN_KEY . AUTH_SALT;
		$message  = $timestamp . ':' . $nonce;
		$expected = base64_encode( hash_hmac( 'sha256', $message, $secret, true ) );

		if ( ! hash_equals( $expected, $sig ) ) {
			return new WP_Error( 'invalid_sig', 'Invalid request signature.', [ 'status' => 401 ] );
		}

		return true;
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Google ID token verification (via Google tokeninfo endpoint)
	// ─────────────────────────────────────────────────────────────────────────
	public static function verify_google_id_token( string $id_token ) {
		$response = wp_remote_get(
			'https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode( $id_token ),
			[ 'timeout' => 10 ]
		);

		if ( is_wp_error( $response ) ) {
			return new WP_Error( 'google_unreachable', 'Cannot verify Google token.', [ 'status' => 503 ] );
		}

		$code = wp_remote_retrieve_response_code( $response );
		if ( 200 !== (int) $code ) {
			return new WP_Error( 'invalid_google_token', 'Google token invalid.', [ 'status' => 401 ] );
		}

		$data = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( empty( $data['email'] ) || empty( $data['sub'] ) ) {
			return new WP_Error( 'google_token_incomplete', 'Token missing email/sub.', [ 'status' => 401 ] );
		}

		// Verify audience
		if ( ! empty( HAJJFLOW_GOOGLE_CLIENT_ID ) && $data['aud'] !== HAJJFLOW_GOOGLE_CLIENT_ID ) {
			return new WP_Error( 'google_token_audience', 'Token audience mismatch.', [ 'status' => 401 ] );
		}

		if ( 'true' !== ( $data['email_verified'] ?? '' ) ) {
			return new WP_Error( 'email_not_verified', 'Google email not verified.', [ 'status' => 401 ] );
		}

		return $data; // ['email', 'sub', 'name', 'picture', 'aud', ...]
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Lightweight JWT (no library) — signed with AUTH_KEY + SECURE_AUTH_SALT
	// ─────────────────────────────────────────────────────────────────────────
	public static function generate_jwt( int $user_id ): string {
		$header  = self::b64url( json_encode( [ 'alg' => 'HS256', 'typ' => 'JWT' ] ) );
		$payload = self::b64url( json_encode( [
			'sub' => $user_id,
			'iat' => time(),
			'exp' => time() + ( 7 * DAY_IN_SECONDS ),
		] ) );
		$sig = self::b64url(
			hash_hmac( 'sha256', $header . '.' . $payload, AUTH_KEY . SECURE_AUTH_SALT, true )
		);
		return $header . '.' . $payload . '.' . $sig;
	}

	public static function verify_jwt( string $token ) {
		$parts = explode( '.', $token );
		if ( 3 !== count( $parts ) ) return false;

		[ $header, $payload, $sig ] = $parts;
		$expected = self::b64url(
			hash_hmac( 'sha256', $header . '.' . $payload, AUTH_KEY . SECURE_AUTH_SALT, true )
		);
		if ( ! hash_equals( $expected, $sig ) ) return false;

		$data = json_decode( self::b64url_decode( $payload ), true );
		if ( ! $data || $data['exp'] < time() ) return false;

		return (int) $data['sub'];
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Get WP user_id from Bearer JWT in Authorization header
	// ─────────────────────────────────────────────────────────────────────────
	public static function get_user_from_request( WP_REST_Request $request ) {
		$auth = $request->get_header( 'Authorization' );
		if ( ! $auth || ! str_starts_with( $auth, 'Bearer ' ) ) {
			return new WP_Error( 'no_auth', 'Missing Bearer token.', [ 'status' => 401 ] );
		}
		$token   = substr( $auth, 7 );
		$user_id = self::verify_jwt( $token );
		if ( ! $user_id ) {
			return new WP_Error( 'invalid_token', 'Invalid or expired JWT.', [ 'status' => 401 ] );
		}
		$user = get_user_by( 'id', $user_id );
		if ( ! $user ) {
			return new WP_Error( 'user_not_found', 'User not found.', [ 'status' => 401 ] );
		}
		return $user;
	}

	private static function b64url( string $data ): string {
		return rtrim( strtr( base64_encode( $data ), '+/', '-_' ), '=' );
	}

	private static function b64url_decode( string $data ): string {
		return base64_decode( strtr( $data, '-_', '+/' ) . str_repeat( '=', 3 - ( 3 + strlen( $data ) ) % 4 ) );
	}
}
