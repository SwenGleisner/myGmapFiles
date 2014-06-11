<?php
/**
* @package    _mygmap
* @author     Swen Gleisner
* @copyright  Copyright (C) 2014
* @license    GNU/GPL
**/
// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );
// Include the syndicate functions only once
require_once( dirname(__FILE__).'/helper.php' );
$modulepath = JURI::base().'modules/'.$module->module;
define( 'CSS_BASEPATH',	$modulepath.'/css/');
define( 'NG_JS',		$modulepath.'/ng_js/');
define( 'NG_JSLIB',		$modulepath.'/ng_js/angular/');
define( 'NG_CTRL',		$modulepath.'/ng_js/controller/');
define( 'NG_SRV',		$modulepath.'/ng_js/services/');
define( 'NG_DCV',		$modulepath.'/ng_js/directives/');
define( 'NG_FLR',		$modulepath.'/ng_js/filters/');

// Add Modul Style-Sheets
$document = JFactory::getDocument();
$document->addStyleSheet( CSS_BASEPATH .'mygmap_main.css');

//Let Joomla Check that jQuery is loaded
JHtml::_('jquery.framework');

// Add Google Api first
$document->addScript('https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places');



// Load the Angular lib
$document->addScript(NG_JSLIB . 'angular.js');
$document->addScript(NG_JSLIB . 'angular-route.js');
$document->addScript(NG_JSLIB . 'angular-sanitize.js');
$document->addScript(NG_JSLIB . 'i18n/angular-locale_de-de.js');

// Load Angular App-Files
$document->addScript(NG_JS . 'app.js');
// CONTROLLER
$document->addScript(NG_CTRL . 'view_main_controller.js');
// SERVICES
$document->addScript(NG_SRV . 'service_gmap_geocoder.js');
$document->addScript(NG_SRV . 'service_gmap_database.js');
$document->addScript(NG_SRV . 'service_gmap_paginator.js');
// DIRECTIVES
$document->addScript(NG_DCV . 'directive_gmap_filterbar.js');
$document->addScript(NG_DCV . 'directive_gmap_googlemap.js');
$document->addScript(NG_DCV . 'directive_gmap_locationlist.js');
$document->addScript(NG_DCV . 'directive_gmap_locationdetail.js');
$document->addScript(NG_DCV . 'directive_gmap_paginator.js');
// FILTERS
$document->addScript(NG_FLR . 'filter_gmap_pagination.js');

require( JModuleHelper::getLayoutPath( 'mod_mygmap' ) );
?>
