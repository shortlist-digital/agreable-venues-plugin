<?php

/** @var  \Herbert\Framework\Application $container */

use AgreablePromoPlugin\Hooks\TimberLoaderPaths;

if(class_exists('AgreablePromoPlugin\Hooks\TimberLoaderPaths')){
  (new TimberLoaderPaths)->init();
}
