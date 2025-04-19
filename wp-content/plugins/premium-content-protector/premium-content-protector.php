<?php
/*
Plugin Name: Premium Content Protector
Plugin URI: https://your-website.com/premium-content-protector
Description: Protect and monetize your WordPress content with membership levels
Version: 1.0.0
Author: Your Name
License: GPLv2 or later
Text Domain: premium-content-protector
*/

if (!defined('ABSPATH')) exit;

define('PCP_VERSION', '1.0.0');
define('PCP_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('PCP_PLUGIN_URL', plugin_dir_url(__FILE__));

class PremiumContentProtector {
    private $db_version = '1.0';
    private $content_protection;
    private $payment_gateway;

    public function __construct() {
        // Add error handling for required files
        $required_files = array(
            PCP_PLUGIN_DIR . 'includes/class-content-protection.php',
            PCP_PLUGIN_DIR . 'includes/class-payment-gateway.php'
        );

        foreach ($required_files as $file) {
            if (!file_exists($file)) {
                add_action('admin_notices', function() use ($file) {
                    echo '<div class="error"><p>Premium Content Protector Error: Missing required file ' . esc_html($file) . '</p></div>';
                });
                return;
            }
        }

        add_action('init', array($this, 'init'));
        add_action('admin_menu', array($this, 'admin_menu'));
        register_activation_hook(__FILE__, array($this, 'activate'));
        
        require_once PCP_PLUGIN_DIR . 'includes/class-content-protection.php';
        require_once PCP_PLUGIN_DIR . 'includes/class-payment-gateway.php';
        
        $this->content_protection = new PCP_Content_Protection();
        $this->payment_gateway = new PCP_Payment_Gateway();
    }

    public function init() {
        load_plugin_textdomain('premium-content-protector');
    }

    public function admin_menu() {
        add_menu_page(
            'Premium Content Protector',
            'Content Protector',
            'manage_options',
            'premium-content-protector',
            array($this, 'admin_page'),
            'dashicons-lock'
        );
        
        add_submenu_page(
            'premium-content-protector',
            'Members',
            'Members',
            'manage_options',
            'pcp-members',
            array($this, 'members_page')
        );
        
        add_submenu_page(
            'premium-content-protector',
            'Settings',
            'Settings',
            'manage_options',
            'pcp-settings',
            array($this, 'settings_page')
        );
    }

    public function activate() {
        // Create necessary database tables
        $this->create_tables();
        // Add default roles
        $this->create_roles();
    }

    private function create_tables() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = array();
        
        $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}pcp_subscriptions (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) NOT NULL,
            plan_id varchar(50) NOT NULL,
            status varchar(20) NOT NULL,
            start_date datetime NOT NULL,
            end_date datetime NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";
        
        $sql[] = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}pcp_access_log (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) NOT NULL,
            content_id bigint(20) NOT NULL,
            access_time datetime NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        foreach($sql as $query) {
            dbDelta($query);
        }
        
        add_option('pcp_db_version', $this->db_version);
    }

    private function create_roles() {
        add_role('pcp_premium', 'Premium Member');
        add_role('pcp_vip', 'VIP Member');
        
        // Add capabilities
        $premium_caps = array(
            'read_premium_content' => true,
            'download_premium_files' => true
        );
        
        $vip_caps = array_merge($premium_caps, array(
            'access_vip_content' => true,
            'access_live_support' => true
        ));
        
        $premium_role = get_role('pcp_premium');
        $vip_role = get_role('pcp_vip');
        
        foreach($premium_caps as $cap => $grant) {
            $premium_role->add_cap($cap);
        }
        
        foreach($vip_caps as $cap => $grant) {
            $vip_role->add_cap($cap);
        }
    }

    public function admin_page() {
        $debug_info = $this->get_debug_info();
        
        echo '<div class="wrap">';
        echo '<h1>Premium Content Protector</h1>';
        
        if (!empty($debug_info['errors'])) {
            echo '<div class="error"><p>Setup Issues Found:</p><ul>';
            foreach ($debug_info['errors'] as $error) {
                echo '<li>' . esc_html($error) . '</li>';
            }
            echo '</ul></div>';
        }
        
        echo '<div class="card">';
        echo '<h2>Plugin Test Status</h2>';
        echo $this->test_plugin_setup() ? 
             '<p style="color: green;">✓ Plugin is working correctly</p>' : 
             '<p style="color: red;">⨯ Plugin setup incomplete</p>';
        
        echo '<h3>System Information:</h3>';
        echo '<pre>' . print_r($debug_info['system'], true) . '</pre>';
        echo '</div></div>';
    }

    private function get_debug_info() {
        $debug = array(
            'errors' => array(),
            'system' => array(
                'WordPress Version' => get_bloginfo('version'),
                'PHP Version' => phpversion(),
                'Plugin Version' => PCP_VERSION,
                'Database Version' => get_option('pcp_db_version'),
                'Required Files Present' => array(
                    'class-content-protection.php' => file_exists(PCP_PLUGIN_DIR . 'includes/class-content-protection.php'),
                    'class-payment-gateway.php' => file_exists(PCP_PLUGIN_DIR . 'includes/class-payment-gateway.php')
                )
            )
        );

        // Check for common issues
        global $wpdb;
        if (!$wpdb->get_var("SHOW TABLES LIKE '{$wpdb->prefix}pcp_subscriptions'")) {
            $debug['errors'][] = 'Subscriptions table is missing';
        }
        
        if (!get_role('pcp_premium')) {
            $debug['errors'][] = 'Premium Member role is missing';
        }

        return $debug;
    }

    private function test_plugin_setup() {
        global $wpdb;
        
        // Test database tables
        $subscription_table = $wpdb->prefix . 'pcp_subscriptions';
        $access_log_table = $wpdb->prefix . 'pcp_access_log';
        
        $tables_exist = $wpdb->get_var("SHOW TABLES LIKE '$subscription_table'") && 
                       $wpdb->get_var("SHOW TABLES LIKE '$access_log_table'");
        
        // Test roles
        $premium_role = get_role('pcp_premium');
        $vip_role = get_role('pcp_vip');
        
        $roles_exist = $premium_role && $vip_role;
        
        return $tables_exist && $roles_exist;
    }

    // Add new method for members page
    public function members_page() {
        include PCP_PLUGIN_DIR . 'admin/members-page.php';
    }

    // Add new method for settings page
    public function settings_page() {
        include PCP_PLUGIN_DIR . 'admin/settings-page.php';
    }
}

$premium_content_protector = new PremiumContentProtector();
