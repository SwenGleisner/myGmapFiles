<?php
/**
* @package    _mygmap
* @author     Swen Gleisner
* @copyright  Copyright (C) 2014
* @license    GNU/GPL
**/
// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );
//Different Class for Ajax Requests
class modmygmapHelper
{
	public static function getAjax() {
		//get the Json-Data from Ajax-Request
		$data = file_get_contents("php://input");
		//Decode Data	
		$objData = json_decode($data);
		if(isset($objData->cmd)) {
			if($objData->cmd == 'selectAllLocation') {
				$row = modmygmapHelper::selectAllLocation();
				return new JResponseJson($row);				
			}
		}
		if(isset($objData->cmd)) {
			if($objData->cmd == 'selectLocationDetails') {
				$result = modmygmapHelper::selectLocationDetails($objData->pid_location);
				return new JResponseJson($result);				
			}
		}
		return;
	}
	
	private static function selectAllLocation() {
		// Get a db connection.
		$db = JFactory::getDbo();
		// Create a new query object.
		$query = $db->getQuery(true); 	 	 	 	 	 	 
		$query
			->select($db->quoteName(array('a.pid_location'
										 ,'a.locationname'
										 ,'a.latitude'
										 ,'a.longitude'
										 ,'a.additiontoaddress'
										 ,'a.street'
										 ,'a.housenr'
										 ,'a.zipcode'
										 ,'a.locality'
										 ,'b.fid_category')))
			->from($db->quoteName('_mygmap_location', 'a'))
			->join('INNER', $db->quoteName('_mygmap_locationcategory', 'b') . ' ON (' . $db->quoteName('a.pid_location') . ' = ' . $db->quoteName('b.fid_location') . ')')
			->order($db->quoteName('zipcode') . ' ASC');
		 
		// Get the query using
		$db->setQuery($query);
		$row = $db->loadAssocList();
		return $row;
	}
	
	private static function selectLocationDetails($pid_location) {
		$result = array();
		$result['timetables'] = NULL;
		$result['services'] = NULL;
		// Get a db connection.
		$db = JFactory::getDbo();
		//First Catch Timetables for Location
		$query = $db->getQuery(true); 	 	 	 	 	 	 
		$query
			->select($db->quoteName(array('b.day'
										 ,'b.from'
										 ,'b.to'
										 ,'c.pid_timetablecategory'
										 ,'c.categoryname')))
			->from($db->quoteName('_mygmap_timetable', 'a'))
			->join('INNER', $db->quoteName('_mygmap_timetabletimes', 'b') . ' ON (' . $db->quoteName('a.pid_timetable') . ' = ' . $db->quoteName('b.fid_timetable') . ')')
			->join('INNER', $db->quoteName('_mygmap_timetablecategory', 'c') . ' ON (' . $db->quoteName('a.fid_category') . ' = ' . $db->quoteName('c.pid_timetablecategory') . ')')
			->where($db->quoteName('fid_location')." = ".$db->quote($pid_location))
			->order($db->quoteName('day') . ' ASC, '.$db->quoteName('from') . ' ASC');
		$db->setQuery($query);
		$row = $db->loadAssocList();
		$result['timetables'] = $row;
		//Catch the services
		  	 	 
		$query = $db->getQuery(true); 	 	 	 	 	 	 
		$query
			->select($db->quoteName(array('a.pid_locationservice'
										 ,'a.fid_service'
										 ,'b.fid_category'
										 ,'b.servicename'
										 ,'b.customergroup'
										 ,'c.pid_servicecategory'
										 ,'c.categoryname')))
			->from($db->quoteName('_mygmap_locationservice', 'a'))
			->join('INNER', $db->quoteName('_mygmap_service', 'b') . ' ON (' . $db->quoteName('a.fid_service') . ' = ' . $db->quoteName('b.pid_service') . ')')
			->join('INNER', $db->quoteName('_mygmap_servicecategory', 'c') . ' ON (' . $db->quoteName('b.fid_category') . ' = ' . $db->quoteName('c.pid_servicecategory') . ')')
			->where($db->quoteName('fid_location')." = ".$db->quote($pid_location))
			->order($db->quoteName('customergroup') . ' ASC, '.$db->quoteName('pid_locationservice') . ' ASC');
		$db->setQuery($query);
		$row = $db->loadAssocList();
		$result['services'] = $row;
		return $result;
	}
}


class mod_mygmapHelper
{
    public static function getAjax($jsondata)
    {
        return 'FUCK OFF!';
    }
}
?>