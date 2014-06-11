<?php
/**
* @package    _mygmap
* @author     Swen Gleisner
* @copyright  Copyright (C) 2014
* @license    GNU/GPL
**/
//no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

//All what is needed from Joomla Rendering is this little Container, the Rest will be managed by
//the Angular-Way
echo '<div ng-app="mygmapFrontendDemo">';
echo '<div ng-view></div>';
echo '</div>';
?>