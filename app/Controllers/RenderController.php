<?php namespace AgreableVenuesPlugin\Controllers;

use AgreableVenuesPlugin\Helper;
// use Parse\ParseClient;
// use Parse\ParseQuery;

class RenderController {

  function __construct() {
  //   $app_id = get_field('venues_parse_app_id', 'option');
  //   $rest_key = get_field('venues_parse_rest_key', 'option');
  //   $master_key = get_field('venues_parse_master_key', 'option');

  //   ParseClient::initialize( $app_id, $rest_key, $master_key );
  }

  public function single($application, $slug){
    // $query = new ParseQuery("Venue");
    // $query->equalTo("slug", $slug);
    // $results = $query->find();
    // $venue = $results[0];

    $this->render();
  }

  public function home(){
    $this->render();
  }

  public function render($venue=null){

    $css_string = @file_get_contents(Helper::path('/resources/assets/styles.css'));
    $js_string = @file_get_contents(Helper::path('/resources/assets/app.js'));
    $webpack_port = null;
    $environment = getenv('WP_ENV');

    if ($environment === 'development') {
      try {
        $webpack_port = $this->get_webpack_port(Helper::path(''));
      } catch(\Exception $e) {
        // If exception the developer hasn't run webpack so may not be
        // 'developing' this particular plugin, force 'production'
        $environment = 'production';
      }
    }

    $views = trailingslashit(Helper::get('views')['template']);
    $context = \Timber::get_context();

    $context['body_class'] = $context['body_class'] . ' agreable-venues-plugin';
    $context['env'] = $environment;
    // $context['common_css_path'] = Helper::asset('styles.css');
    $context['js_string'] =  $js_string;
    $context['css_string'] =  $css_string;
    $context['css_path'] = '/resources/assets/styles.css';
    $context['js_path'] = '/resources/assets/app.js';
    $context['webpack_plugin_port'] = $webpack_port;
    $brand_str = strtolower(get_field('venues_brand', 'option'));
    $brands = ! empty($brand_str) ?
      array_map('trim', explode(',', $brand_str)) :
      array();
    $context['initial_state'] = array(
      'app' => array(
        'site' => array(
          'sitename'  => get_bloginfo('name'),
          'env'       => $environment,
          'terms'     => get_field('venues_promo_terms', 'option'),
        ),
        'firebase' => array(
          'api_key'        => get_field('venues_firebase_api_key', 'option'),
          'auth_domain'    => get_field('venues_firebase_auth_domain', 'option'),
          'db_url'         => get_field('venues_firebase_db_url', 'option'),
          'storage_bucket' => get_field('venues_firebase_storage_bucket', 'option'),
          'brands'         => $brands
        ),
        'map' => array(
          'mapboxToken' => get_field('venues_map_mapbox_token', 'option'),
          'mapboxMapId' => get_field('venues_map_mapbox_mapid', 'option'),
          'slug'        => get_field('agreable_venues_plugin_map_slug', 'option'),
          'tileUrl'     => get_field('venues_map_tiles_url', 'option'),
          'locationDetails' => get_field('map_initial_locations', 'option'),
        ),
        'display_vouchers' => get_field('field_578dff0210320', 'option'), // only for burger day
      )
    );
    $context['calais_domain'] = 'https://calaisapi.com';

    if(isset($venue)){
      // If on single venue page we set all meta data accordingly.
      $context['wp_title'] = htmlentities($venue->get('name'));
      $context['post'] = $this->get_post_meta_data($venue);
    }

	  \Timber::render("{$views}template.twig", $context);
  }

  protected function get_post_meta_data($venue){

    $post = array();

    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
    $domain =  $_SERVER['HTTP_HOST'];
    if(getenv('WP_ENV') === 'development'){
      $domain = str_replace('local', 'staging', $domain);
    }

    $route_base = get_field("venues_map_slug", 'option') ?: 'map';
    $route_base = preg_replace("/[^A-Za-z0-9-_ ]/", '', $route_base);
    $slug = $venue->get('slug');
    $title = $venue->get('name');
    $review = strip_tags($venue->get('review'));
    $images = $venue->get('images');

    $post = array(
      'share_description' => $review,
      'sell' => htmlentities(substr($review, 0, 155)),
      'share_title' => htmlentities($title) . ' - ' . get_bloginfo('name').' Venues',
      'permalink' => "$protocol$domain/$route_base/$slug"
    );

    if(!empty($images)){
      $post['share_image'] = $images[0]['landscape']['url'];
    }
    return $post;
  }

  protected function get_webpack_port($plugin_root) {
    $port_file = 'webpack-current-port.tmp';
    $port_file_location = $plugin_root . '/' . $port_file;
    if (!file_exists($port_file_location)) {
      throw new \Exception('Expected ' . $port_file . ' to be available. You may need to fire up webpack in this plugin.');
    }

    return file_get_contents($port_file_location);
  }

}
