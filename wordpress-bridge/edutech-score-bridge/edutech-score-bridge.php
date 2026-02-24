<?php
/**
 * Plugin Name: EduTech Score Bridge
 * Description: Reliably sends score updates to the external backend API via HMAC-signed webhooks.
 * Version: 1.0.0
 * Author: Antigravity
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Configuration (In a production plugin, these would be in a settings page)
define( 'EDUTECH_API_URL', 'http://your-backend-url.com/api/v1/webhooks/score-update' );
define( 'EDUTECH_WEBHOOK_SECRET', 'your-webhook-hmac-secret' );

/**
 * Send webhook when a score is updated.
 */
function edutech_send_score_webhook( $post_id, $post, $update ) {
    // Only trigger for our 'score' post type
    if ( $post->post_type !== 'score' || $post->post_status !== 'publish' ) {
        return;
    }

    // Prevent infinite loops
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;

    // Get metadata (assuming these keys)
    $student_id   = get_post_meta( $post_id, '_student_id', true );
    $student_name = get_post_meta( $post_id, '_student_name', true );
    $parent_email = get_post_meta( $post_id, '_parent_email', true );
    $subject      = get_post_meta( $post_id, '_subject', true );
    $score        = get_post_meta( $post_id, '_score', true );
    $description  = $post->post_content;

    $payload = array(
        'student_id'   => (int) $student_id,
        'student_name' => $student_name,
        'parent_email' => $parent_email,
        'subject'      => $subject,
        'score'        => $score,
        'description'  => $description,
        'date'         => $post->post_date,
    );

    $json_payload = json_encode( $payload );
    $signature    = hash_hmac( 'sha256', $json_payload, EDUTECH_WEBHOOK_SECRET );

    wp_remote_post( EDUTECH_API_URL, array(
        'method'      => 'POST',
        'timeout'     => 15,
        'redirection' => 5,
        'httpversion' => '1.0',
        'blocking'    => true,
        'headers'     => array(
            'Content-Type'   => 'application/json',
            'X-WP-Signature' => $signature,
        ),
        'body'        => $json_payload,
        'cookies'     => array(),
    ) );
}

add_action( 'save_post', 'edutech_send_score_webhook', 10, 3 );

/**
 * Register Custom Post Type 'Score'
 */
function edutech_register_score_cpt() {
    register_post_type( 'score', array(
        'labels' => array(
            'name'          => 'Scores',
            'singular_name' => 'Score',
        ),
        'public'      => true,
        'has_archive' => true,
        'menu_icon'   => 'dashicons-welcome-learn-more',
        'supports'    => array( 'title', 'editor', 'custom-fields' ),
    ) );
}
add_action( 'init', 'edutech_register_score_cpt' );
