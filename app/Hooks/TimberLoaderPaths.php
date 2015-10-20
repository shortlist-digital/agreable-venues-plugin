<?php namespace AgreableVenuesPlugin\Hooks;

use AgreableVenuesPlugin\Helper;

class TimberLoaderPaths {

  public function init() {
    \add_filter('timber/loader/paths', array($this, 'addPaths'), 10);
  }

  public function addPaths($paths){
    // Get views specified in herbert.
    $namespaces = Helper::get('views');
    foreach ($namespaces as $namespace => $views){
      foreach ((array) $views as $view){
        // Add to timber $paths array.
        array_unshift($paths, $view);
      }
    }
    return $paths;
  }

}
