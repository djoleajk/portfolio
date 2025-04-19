<?php
if (!defined('ABSPATH')) exit;

class PCP_Content_Protection {
    public function __construct() {
        add_shortcode('premium_content', array($this, 'protect_content'));
    }
    
    public function protect_content($atts, $content = null) {
        if (current_user_can('read_premium_content')) {
            return $content;
        }
        return '<div class="protected-content">This content is for premium members only.</div>';
    }
}
