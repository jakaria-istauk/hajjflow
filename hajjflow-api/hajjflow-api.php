<?php
/**
 * Plugin Name: HajjFlow
 * Description: Headless WP backend for HajjFlow – Hajj Amal tracking app.
 * Version:     1.0.0
 * Author:      Jakaria Istauk
 * Author UI:   https://jakaria.com.bd/
 * License:     GPL-2.0-or-later
 * Text Domain: hajjflow
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'HAJJFLOW_VERSION', '1.0.0' );
define( 'HAJJFLOW_FILE', __FILE__ );
define( 'HAJJFLOW_DIR', plugin_dir_path( __FILE__ ) );
define( 'HAJJFLOW_URL', plugin_dir_url( __FILE__ ) );
define( 'HAJJFLOW_NAMESPACE', 'hajjflow/v1' );

// Google OAuth Client ID — set in wp-config.php as HAJJFLOW_GOOGLE_CLIENT_ID
if ( ! defined( 'HAJJFLOW_GOOGLE_CLIENT_ID' ) ) {
	define( 'HAJJFLOW_GOOGLE_CLIENT_ID', '' );
}

require_once HAJJFLOW_DIR . 'includes/class-cpt.php';
require_once HAJJFLOW_DIR . 'includes/class-auth.php';
require_once HAJJFLOW_DIR . 'includes/class-user-log.php';
require_once HAJJFLOW_DIR . 'includes/class-api.php';
require_once HAJJFLOW_DIR . 'includes/class-admin.php';

add_action( 'plugins_loaded', function () {
	HajjFlow_CPT::init();
	HajjFlow_Auth::init();
	HajjFlow_API::init();
	if ( is_admin() ) {
		HajjFlow_Admin::init();
	}
} );

// CORS — allow React dev/prod origins
add_action( 'rest_api_init', function () {
	remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
	add_filter( 'rest_pre_serve_request', function ( $value ) {
		$origin  = get_http_origin();
		$allowed = array_filter( array_merge(
			[
				'http://localhost:5173',
				'http://localhost:3000',
				defined( 'HAJJFLOW_REACT_ORIGIN' ) ? HAJJFLOW_REACT_ORIGIN : getenv( 'HAJJFLOW_REACT_ORIGIN' ),
			],
			(array) get_option( 'hajjflow_react_origins', [] )
		) );
		if ( in_array( $origin, array_filter( $allowed ), true ) ) {
			header( 'Access-Control-Allow-Origin: ' . esc_url_raw( $origin ) );
			header( 'Access-Control-Allow-Credentials: true' );
			header( 'Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS' );
			header( 'Access-Control-Allow-Headers: Authorization, Content-Type, X-HajjFlow-Sig, X-HajjFlow-Timestamp, X-HajjFlow-Nonce' );
		}
		return $value;
	} );
}, 15 );

add_action( 'init', function () {
	if ( isset( $_SERVER['REQUEST_METHOD'] ) && 'OPTIONS' === $_SERVER['REQUEST_METHOD'] ) {
		status_header( 200 );
		exit();
	}
} );
