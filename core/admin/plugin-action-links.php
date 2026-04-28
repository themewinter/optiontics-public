<?php
namespace Optiontics\Admin;

use Optiontics\Contracts\Hookable_Service_Contract;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Adds row-action links (Options, Go Pro) on the Plugins screen.
 *
 * @package Optiontics/Admin
 */
class Plugin_Action_Links implements Hookable_Service_Contract {

    public function register() {
        $basename = plugin_basename( OPTIONTICS_FILE );
        add_filter( "plugin_action_links_{$basename}", [ $this, 'add_action_links' ] );
    }

    /**
     * Prepend an Options link and, when Pro is not active, append a Go Pro CTA.
     *
     * @param array $links Existing action links.
     * @return array
     */
    public function add_action_links( $links ) {
        $options_link = sprintf(
            '<a href="%s">%s</a>',
            esc_url( admin_url( 'admin.php?page=optiontics' ) ),
            esc_html__( 'Options', 'optiontics' )
        );

        $links = array_merge( [ 'options' => $options_link ], $links );

        if ( ! $this->is_pro_active() ) {
            $links['go_pro'] = sprintf(
                '<a href="%s" target="_blank" rel="noopener noreferrer" style="color:#d63638;font-weight:600;">%s</a>',
                esc_url( 'https://themewinter.com/optiontics' ),
                esc_html__( 'Go Pro', 'optiontics' )
            );
        }

        return $links;
    }

    /**
     * @return bool
     */
    protected function is_pro_active() {
        return defined( 'OPTIONTICS_PRO_VERSION' );
    }
}
