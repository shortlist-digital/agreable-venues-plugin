<?php namespace AgreableVenuesPlugin\Hooks;

use AgreableVenuesPlugin\Helper;
use Herbert\Framework\Notifier;

class Admin {

  public function init() {
    \add_filter('admin_head', array($this, 'missing_settings'));
  }

  public function missing_settings() {

    $ns = Helper::get('agreable_namespace');

    $screen = get_current_screen();

    $app_id = get_field("{$ns}_plugin_parse_app_id", 'options');
    $js_key = get_field("{$ns}_plugin_parse_js_key", 'options');

    if(empty($app_id) || empty($js_key)){
      $options = get_admin_url( null, '/admin.php?page=acf-options#acf-options_group_agreable_venues');
      $missing = empty($app_id) ? "'Parse Application ID'" : '';
      $missing .= (empty($app_id) === true && empty($js_key) === true) ? ' and ' : '';
      $missing .= empty($js_key) ? "'Parse JavaScript Key'" : '';
      Notifier::error("Your are missing options that will cause Venues to not display correctly ($missing). Please visit <a href='$options'>Options</a> page and contact the digital operations team if necessary.");
      return;
    }

  }

}
