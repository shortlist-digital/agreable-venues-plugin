<?php namespace AgreableVenuesPlugin;

use AgreableVenuesPlugin\Helper;
$ns = Helper::get('agreable_namespace');

if( function_exists('register_field_group') ):

register_field_group(array (
  'key' => "options_group_{$ns}",
  'title' => 'Venues Settings',
  'fields' => array (
    array (
      'key' => "{$ns}_plugin_map_slug",
      'label' => 'Venues Map URL prefix',
      'name' => 'venues_map_slug',
      'type' => 'text',
      'required' => 0,
      'conditional_logic' => 0,
      'default_value' => 'map',
      'readonly' => 0,
      'disabled' => 0,
    ),
    array (
      'key' => "{$ns}_plugin_brand",
      'label' => 'Brand - Choose which brand to filter Venues by',
      'name' => 'venues_brand',
      'type' => 'select',
      'instructions' => 'The Brand to select Venues for.',
      'required' => 1,
      'choices' => array(

      ),
    ),
    array (
      'key' => "{$ns}_plugin_map_tiles_url",
      'label' => 'Map Tiles URL',
      'name' => 'venues_map_tiles_url',
      'type' => 'text',
      'required' => 1,
      'conditional_logic' => 0,
      'default_value' => 'https://{s}.tiles.mapbox.com/v4/{mapId}/{z}/{x}/{y}.png?access_token={token}',
      'readonly' => 0,
      'disabled' => 0,
    ),
    array (
      'key' => "{$ns}_plugin_map_mapbox_token",
      'label' => 'Mapbox Access Token',
      'name' => 'venues_map_mapbox_token',
      'type' => 'text',
      'required' => 0,
      'conditional_logic' => 0,
      'readonly' => 0,
      'disabled' => 0,
    ),
    array (
      'key' => "{$ns}_plugin_map_mapbox_mapid",
      'label' => 'Mapbox Map ID',
      'name' => 'venues_map_mapbox_mapid',
      'type' => 'text',
      'required' => 0,
      'conditional_logic' => 0,
      'readonly' => 0,
      'disabled' => 0,
    ),
    array (
      'key' => "{$ns}_initial_locations",
      'label' => 'Map Initial Locations',
      'name' => 'map_initial_locations',
      'type' => 'repeater',
      'required' => 0,
      'conditional_logic' => 0,
      'layout' => 'table',
      'button_label' => 'Add Row',
      'sub_fields' => array (
        array (
          'key' => "{$ns}_location_name",
          'label' => 'Location Name',
          'name' => 'location_name',
          'type' => 'text',
          'required' => 0,
          'conditional_logic' => 0,
        ),
        array (
          'key' => "{$ns}_location_latitude",
          'label' => 'Location Latitude',
          'name' => 'location_latitude',
          'type' => 'text',
          'required' => 0,
          'conditional_logic' => 0,
        ),
        array (
          'key' => "{$ns}_location_longitude",
          'label' => 'Location Longitude',
          'name' => 'location_longitude',
          'type' => 'text',
          'required' => 0,
          'conditional_logic' => 0,
        ),
      ),
    ),
    array (
      'key' => "{$ns}_plugin_terms",
      'label' => 'Venues Promotion Terms and Conditions',
      'name' => 'venues_promo_terms',
      'type' => 'wysiwyg',
      'required' => 0,
      'conditional_logic' => 0,
      'readonly' => 0,
      'disabled' => 0,
    ),
  ),
  'location' => array (
    array (
      array (
        'param' => 'options_page',
        'operator' => '==',
        'value' => 'acf-options',
      ),
      array (
        'param' => 'current_user_role',
        'operator' => '==',
        'value' => 'administrator',
      ),
    ),
  ),
  'menu_order' => 1,
  'position' => 'normal',
  'style' => 'default',
  'label_placement' => 'top',
  'instruction_placement' => 'label',
));

endif;
