<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class HajjFlow_CPT {

	const POST_TYPE = 'hajjflow';
	const META_KEY  = '_hajjflow_logs';

	public static function init() {
		add_action( 'init', [ __CLASS__, 'register_cpt' ] );
	}

	public static function register_cpt() {
		register_post_type( self::POST_TYPE, [
			'labels'              => [
				'name'          => __( 'Hajj Logs', 'hajjflow' ),
				'singular_name' => __( 'Hajj Log', 'hajjflow' ),
			],
			'public'              => false,
			'publicly_queryable'  => false,
			'show_ui'             => true,
			'show_in_rest'        => false, // controlled via custom endpoints
			'capability_type'     => 'post',
			'map_meta_cap'        => true,
			'hierarchical'        => false,
			'supports'            => [ 'title', 'author', 'custom-fields' ],
			'rewrite'             => false,
			'query_var'           => false,
		] );

		register_post_meta( self::POST_TYPE, self::META_KEY, [
			'type'         => 'string',
			'single'       => true,
			'show_in_rest' => false,
			'auth_callback' => '__return_true',
		] );
	}
}
