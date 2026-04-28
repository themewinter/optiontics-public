<?php
namespace Optiontics\Models;

use Optiontics\Database\Post_Model;

if ( ! defined( 'ABSPATH' ) ) exit;

class Block_Model extends Post_Model {
    /**
     * Store fillable attributes
     *
     * @var array
     */
    protected array $fillable = [
        'title'         => '',
        'content'       => '',
        'fields'        => [],
        'status'        => 'draft',
        'product_type'  => '',
        'exclude_products' => [],
        'include_products' => [],
        'exclude_categories' => [],
        'include_categories' => [],
        'exclude_tags' => [],
        'include_tags' => [],
        'exclude_brands' => [],
        'include_brands' => [],
        'craft_data' => [],
    ];

    /**
     * Get the post type
     *
     * @return  string  Post type
     */
    public function get_post_type() {
        return 'optiontics-block';
    }
}
