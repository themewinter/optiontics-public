<?php
namespace Optiontics\Abstract;

use Optiontics\Contracts\Shortcode_Interface;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Shortcode abstract class
 */
abstract class Base_Shortcode implements Shortcode_Interface {
    /**
     * Register shortcode
     *
     * @return  void
     */
    public function register() {
        add_shortcode($this->tag(), [$this, 'render']);
    }

    /**
     * Shortcode tag name
     *
     * @return  string
     */
    abstract public function tag();

    /**
     * Render shortcode content
     *
     * @param   array  $atts     [$atts description]
     * @param   string  $content  [$content description]
     *
     * @return  string            [return description]
     */
    public function render($atts = [], $content = null) {
        return '';
    }
}
