<?php

namespace Optiontics\Container\Exception;

use Exception;
use Optiontics\Container\Container_Exception_Interface;

if ( ! defined( 'ABSPATH' ) ) exit;

class Dependency_Is_Not_Instantiable_Exception extends Exception implements Container_Exception_Interface {
}
