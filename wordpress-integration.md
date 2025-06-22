
# WordPress Integratie Instructies

## Voor WordPress Developers

### 1. Bestanden uploaden
Upload alle bestanden uit de `dist/` map (na build) naar je WordPress theme of plugin directory.

### 2. WordPress Shortcode
Voeg deze PHP code toe aan je `functions.php` of plugin:

```php
function camping_map_shortcode($atts) {
    $atts = shortcode_atts(array(
        'admin' => 'false'
    ), $atts);
    
    // Check if current user can manage options (admin/editor)
    $is_admin = current_user_can('manage_options') ? 'true' : 'false';
    
    wp_enqueue_script('camping-map', get_template_directory_uri() . '/assets/camping-map.js', array(), '1.0.0', true);
    wp_enqueue_style('camping-map', get_template_directory_uri() . '/assets/camping-map.css', array(), '1.0.0');
    
    // Pass WordPress user data to JavaScript
    wp_localize_script('camping-map', 'wpMapEditor', array(
        'isAdmin' => $is_admin === 'true',
        'nonce' => wp_create_nonce('map_editor_nonce'),
        'ajaxUrl' => admin_url('admin-ajax.php')
    ));
    
    return '<div id="camping-map-root"></div>';
}
add_shortcode('camping_map', 'camping_map_shortcode');
```

### 3. AJAX Handlers voor Data Opslag (Optioneel)
```php
// Save map data
function save_map_data() {
    check_ajax_referer('map_editor_nonce', 'nonce');
    
    if (!current_user_can('manage_options')) {
        wp_die('Unauthorized');
    }
    
    $map_data = sanitize_textarea_field($_POST['map_data']);
    update_option('camping_map_data', $map_data);
    
    wp_send_json_success('Map data saved');
}
add_action('wp_ajax_save_map_data', 'save_map_data');

// Load map data
function load_map_data() {
    $map_data = get_option('camping_map_data', '{}');
    wp_send_json_success($map_data);
}
add_action('wp_ajax_load_map_data', 'load_map_data');
add_action('wp_ajax_nopriv_load_map_data', 'load_map_data');
```

### 4. Gebruik in WordPress
```
[camping_map]
```

## Voor Website Eigenaren

### Eenvoudige Implementatie
1. Voeg de shortcode `[camping_map]` toe aan elke pagina waar je de plattegrond wilt tonen
2. Log in als WordPress admin om de plattegrond te kunnen bewerken
3. Bezoekers zien alleen de interactieve plattegrond zonder admin-functies

### Gebruikersrollen
- **Administrators & Editors**: Kunnen de plattegrond bewerken
- **Alle andere rollen + Bezoekers**: Zien alleen de interactieve versie

## Beveiliging
- Authenticatie wordt afgehandeld via WordPress gebruikersrollen
- Alleen gebruikers met `manage_options` rechten kunnen bewerken
- CSRF bescherming via WordPress nonces
- Data wordt opgeslagen in WordPress options tabel
