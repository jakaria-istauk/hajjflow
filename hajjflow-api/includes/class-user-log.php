<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class HajjFlow_User_Log {

	// ─────────────────────────────────────────────────────────────────────────
	// Get or create the hajjflow CPT post for a given user (1:1 mapping)
	// ─────────────────────────────────────────────────────────────────────────
	public static function get_or_create_log_post( int $user_id ): int {
		$existing = get_posts( [
			'post_type'      => HajjFlow_CPT::POST_TYPE,
			'author'         => $user_id,
			'posts_per_page' => 1,
			'post_status'    => 'private',
			'fields'         => 'ids',
			'no_found_rows'  => true,
		] );

		if ( ! empty( $existing ) ) {
			return (int) $existing[0];
		}

		$user    = get_user_by( 'id', $user_id );
		$post_id = wp_insert_post( [
			'post_type'   => HajjFlow_CPT::POST_TYPE,
			'post_title'  => 'Hajj Log – ' . $user->display_name,
			'post_status' => 'private',
			'post_author' => $user_id,
		] );

		return is_wp_error( $post_id ) ? 0 : (int) $post_id;
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Fetch full logs: returns assoc array [ 'YYYY-MM-DD' => [ task_id => bool ] ]
	// ─────────────────────────────────────────────────────────────────────────
	public static function get_logs( int $user_id ): array {
		$post_id = self::get_or_create_log_post( $user_id );
		if ( ! $post_id ) return [];

		$raw = get_post_meta( $post_id, HajjFlow_CPT::META_KEY, true );
		if ( empty( $raw ) ) return [];

		$decoded = json_decode( $raw, true );
		return is_array( $decoded ) ? $decoded : [];
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Fetch logs for a single date
	// ─────────────────────────────────────────────────────────────────────────
	public static function get_logs_for_date( int $user_id, string $date ): array {
		$all = self::get_logs( $user_id );
		return $all[ $date ] ?? [];
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Update a single task status for a date
	// $status: 'done' | 'pending'
	// ─────────────────────────────────────────────────────────────────────────
	public static function update_task( int $user_id, string $date, string $task_id, string $status ): bool {
		$post_id = self::get_or_create_log_post( $user_id );
		if ( ! $post_id ) return false;

		// Verify ownership
		$post = get_post( $post_id );
		if ( ! $post || (int) $post->post_author !== $user_id ) return false;

		$logs           = self::get_logs( $user_id );
		$logs[ $date ]  = $logs[ $date ] ?? [];
		$logs[ $date ][ sanitize_key( $task_id ) ] = ( 'done' === $status ) ? 'done' : 'pending';

		update_post_meta( $post_id, HajjFlow_CPT::META_KEY, wp_json_encode( $logs ) );
		return true;
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Bulk update all tasks for a date (full replace for that date's entries)
	// ─────────────────────────────────────────────────────────────────────────
	public static function bulk_update_date( int $user_id, string $date, array $tasks ): bool {
		$post_id = self::get_or_create_log_post( $user_id );
		if ( ! $post_id ) return false;

		$post = get_post( $post_id );
		if ( ! $post || (int) $post->post_author !== $user_id ) return false;

		$logs = self::get_logs( $user_id );
		$sanitized = [];
		foreach ( $tasks as $task_id => $status ) {
			$sanitized[ sanitize_key( $task_id ) ] = ( 'done' === $status ) ? 'done' : 'pending';
		}
		$logs[ sanitize_text_field( $date ) ] = $sanitized;

		update_post_meta( $post_id, HajjFlow_CPT::META_KEY, wp_json_encode( $logs ) );
		return true;
	}
}
