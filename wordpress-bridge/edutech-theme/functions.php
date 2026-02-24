<?php
function edutech_theme_scripts() {
    wp_enqueue_style( 'edutech-style', get_stylesheet_uri() );
    wp_enqueue_style( 'google-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap' );
}
add_action( 'wp_enqueue_scripts', 'edutech_theme_scripts' );
