<?php namespace AgreableVenuesPlugin;

use AgreableVenuesPlugin\Helper;
/** @var \Herbert\Framework\Router $router */

$ns = Helper::get('agreable_namespace');
// Get configured route with default. Alphanumeric and '-', '_' only.
$slug = get_field("venues_map_slug", 'option') ?: 'map';
$slug = preg_replace("/[^A-Za-z0-9-_ ]/", '', $slug);

// Home.
$router->get([
  'as'   => 'venuesMapHomeRoute',
  'uri'  => "/$slug",
  'uses' => function(){
    return 'Venues home';
  },
  'uses' => __NAMESPACE__ . '\Controllers\RenderController@home'
]);

// Single.
$router->get([
  'as'   => 'venuesMapSingleRoute',
  'uri'  => "/$slug/{venue}",
  'uses' => function(){
    return 'Venue single';
  },
  'uses' => __NAMESPACE__ . '\Controllers\RenderController@single'
]);
