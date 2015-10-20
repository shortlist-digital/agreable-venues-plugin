<?php namespace AgreableVenuesPlugin\Controllers;

use AgreableVenuesPlugin \Helper;

class RenderController {

  public function single($slug){
    $this->render();
  }

  public function home($slug){
    $this->render();
  }

  public function render(){
    $views = trailingslashit(Helper::get('views')['template']);
    $context = \Timber::get_context();
	  \Timber::render("{$views}template.twig", $context);
  }

}
