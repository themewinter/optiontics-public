<?php

namespace Optiontics\Container\Exception;

use Exception;
use Optiontics\Container\Not_Found_Exception_Interface;

if ( ! defined( 'ABSPATH' ) ) exit;

class Dependency_Has_No_Default_Value_Exception extends Exception implements Not_Found_Exception_Interface {
}
