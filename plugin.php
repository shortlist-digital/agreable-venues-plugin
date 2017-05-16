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
  const FILE_LOCATION = "/tmp/kitchin-brand-response.json";

	public function __construct()
	{
    $ns = Helper::get('agreable_namespace');
    add_filter("acf/load_field/key={$ns}_plugin_brand", array($this, 'loadBrands'), 11, 3);
    add_action('acf/save_post', array($this, 'clearCachedResponse'), 20);
  }

  public function clearCachedResponse() {
    $screen = get_current_screen();
    if (strpos($screen->id, "acf-options") == true) {
      unlink($this::FILE_LOCATION);
    }
}

  public function loadBrands($field) {
    $baseUri = getenv('KITCHIN_API');

    $client = new Client([
      'base_uri' => $baseUri,
      'timeout'  => 10.0
    ]);

    try {
      if (file_exists($this::FILE_LOCATION)) {
        $body = file_get_contents($this::FILE_LOCATION);
      } else {
        $response = $client->get(
          'api/v1/brand'
        );
        $body = (string) $response->getBody();
        file_put_contents($this::FILE_LOCATION, $body);
      }
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
