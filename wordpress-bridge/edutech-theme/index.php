<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduTech - Empowering Learning</title>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

<header>
    <div class="container">
        <div class="logo"><strong>EduTech</strong> Bridge</div>
    </div>
</header>

<main>
    <section class="hero">
        <div class="container">
            <h1>Reliable Student Tracking & Performance</h1>
            <p>A modern bridge between academic records and parent engagement.</p>
        </div>
    </section>

    <section class="container features">
        <div class="feature-card">
            <h3>Modern API</h3>
            <p>Fast, predictable data access for mobile apps without taxing WordPress.</p>
        </div>
        <div class="feature-card">
            <h3>Real-time Sync</h3>
            <p>Signed webhooks ensure your data is synchronized instantly and securely.</p>
        </div>
        <div class="feature-card">
            <h3>Parent Notifications</h3>
            <p>Automated weekly summaries keep parents informed and engaged.</p>
        </div>
    </section>
</main>

<footer>
    <div class="container" style="text-align: center; margin-top: 50px; color: #777;">
        <p>&copy; <?php echo date('Y'); ?> EduTech. All rights reserved.</p>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
