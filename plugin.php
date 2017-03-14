<?php

/**
 * @wordpress-plugin
 * Plugin Name:       Agreable Venues Plugin
 * Plugin URI:        https://bitbucket.org/ShortlistMedia/agreable-venues-plugin
 * Description:       Consume venues from Venues CMS (Parse) and render on map.
 * Version:           0.1.0
 * Author:            Shortlist Media
 * Author URI:        http://shortlistmedia.co.uk
 * License:           MIT
 */

if(file_exists(__DIR__ . '/vendor/autoload.php')){
  require_once __DIR__ . '/vendor/autoload.php';
} else if(file_exists(__DIR__ . '/../../../../vendor/getherbert/')){
  require_once __DIR__ . '/../../../../vendor/autoload.php';
} else {
  throw new Exception('Something went badly wrong');
}

if(file_exists(__DIR__ . '/vendor/getherbert/framework/bootstrap/autoload.php')){
  require_once __DIR__ . '/vendor/getherbert/framework/bootstrap/autoload.php';
} else if(file_exists(__DIR__ . '/../../../../vendor/getherbert/framework/bootstrap/autoload.php')){
  require_once __DIR__ . '/../../../../vendor/getherbert/framework/bootstrap/autoload.php';
} else {
  throw new Exception('Something went badly wrong');
}


use GuzzleHttp\Client;
use GuzzleHttp\Exception\ServerException;
use AgreableVenuesPlugin\Helper;

class AgreableVenuesPlugin
{
	public function __construct()
	{
    $ns = Helper::get('agreable_namespace');
    add_filter("acf/load_field/key={$ns}_plugin_brand", array($this, 'loadBrands'), 11, 3);
  }

  public function loadBrands($field) {
    $baseUri = getenv('KITCHIN_API');

    $client = new Client([
      'base_uri' => $baseUri,
      'timeout'  => 10.0
    ]);

    try {
      $response = $client->get(
        'api/v1/brand'
      );
      $body = (string) $response->getBody();
      $responseObject = json_decode($body, true, JSON_PRETTY_PRINT);
      
      foreach ($responseObject as $key => $brand) {
        $field['choices'][$brand['id']] = $brand['name'];
      }
    } catch (ServerException $exception) {
      $field['choices'][1] = "Loading error. The default Brand will be used.";
    }

    return $field;
  }
}

new AgreableVenuesPlugin();