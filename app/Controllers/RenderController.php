<?php namespace AgreableVenuesPlugin\Controllers;

use AgreableVenuesPlugin\Helper;

class RenderController {

  public function single($slug){
    $this->render();
  }

  public function home($slug){
    $this->render();
  }

  public function render(){

    $css_string = @file_get_contents(Helper::path('/resources/assets/styles.css'));
    $js_string = @file_get_contents(Helper::path('/resources/assets/app.js'));
    $webpack_port = null;
    $environment = getenv('WP_ENV');

    if ($environment === 'development') {
      try {
        $webpack_port = $this->getDevelopmentWebpackPort(Helper::path(''));
      } catch(Exception $e) {
        // If exception the developer hasn't run webpack so may not be
        // 'developing' this particular plugin, force 'production'
        $environment = 'production';
      }
    }

    $views = trailingslashit(Helper::get('views')['template']);
    $context = \Timber::get_context();

    $context['environment'] = $environment;
    // $context['common_css_path'] = Helper::asset('styles.css');
    $context['js_string'] =  $js_string;
    $context['css_string'] =  $css_string;
    $context['webpack_plugin_port'] = $webpack_port;
    $context['initial_state'] = array(
      'app' => array(
        'parse' => array(
          'parse_app_id'  => get_field('venues_parse_app_id', 'option'),
          'parse_js_key'  => get_field('venues_parse_js_key', 'option'),
          'brands'        => array("emerald-street"),
        ),
        'map' => array(
          'mapboxToken' => get_field('venues_map_mapbox_token', 'option'),
          'mapboxMapId' => get_field('venues_map_mapbox_mapid', 'option'),
          'tileUrl'     => get_field('venues_map_tiles_url', 'option'),
        )
      )
    );

	  \Timber::render("{$views}template.twig", $context);
  }

  protected function getDevelopmentWebpackPort($plugin_root) {
    $port_file = 'webpack-current-port.tmp';
    $port_file_location = $plugin_root . '/' . $port_file;
    if (!file_exists($port_file_location)) {
      throw new \Exception('Expected ' . $port_file . ' to be available.');
    }

    return file_get_contents($port_file_location);
  }

}
