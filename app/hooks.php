<?php

/** @var  \Herbert\Framework\Application $container */

use AgreableVenuesPlugin\Hooks\TimberLoaderPaths;
use AgreableVenuesPlugin\Hooks\Admin;

if(class_exists('AgreableVenuesPlugin\Hooks\TimberLoaderPaths')){
  (new TimberLoaderPaths)->init();
}

if(class_exists('AgreableVenuesPlugin\Hooks\Admin')){
  (new Admin)->init();
}
