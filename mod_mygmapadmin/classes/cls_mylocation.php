<?php
/*
TO DO TIMETABLE UPDATE: Count times if timetable can be deleted
*/
class myLocation
{
	private static $instance;
	private static $error = array();
	
	private function __construct() {
		;
	}
	
	public static function getInstance() {
		if(is_null(self::$instance)) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public static function insertLocation($jsonData) {
		//Decode JsonData and extract the Arrays into seperate Vars, after that delete the Arrays in Decoded-Json-Data
		$data = json_decode($jsonData);
		
		$locationcategories = $data->locationcategories;
		$locationcontact = $data->locationcontact;
		$locationservice = $data->locationservice;
		$locationopentime = $data->locationopentime;
		$locationemptytime = $data->locationemptytime;
		
		unset($data->locationcategories);
		unset($data->locationcontact);
		unset($data->locationservice);
		unset($data->locationopentime);
		unset($data->locationemptytime);
		
		$locationid = self::helperLocationData($data,null,'insert');

		if($locationid == false) {
			return "Die Location konnte nicht eingetragen werden";
		} else {
			//Insert Categories
			for($i = 0; $i < sizeof($locationcategories);$i++) {
				self::helperLocationCategoriesData($locationcategories[$i], $locationid, 'insert');	
			}			
			//Insert Contacts
			for($i = 0; $i < sizeof($locationcontact);$i++) {
				self::helperContactData($locationcontact[$i], $locationid, 'insert');	
			}
			//Insert Services
			for($i = 0; $i < sizeof($locationservice);$i++) {
				self::helperServiceData($locationservice[$i], $locationid, 'insert');	
			}
			//Insert Open-Times fid_timtebalecategory for öffnungszeiten = 1
			if(sizeof($locationopentime)> 0) {
				$fid_timetablecategory = 1;
				self::helperTimetableData($locationopentime, $locationid, $fid_timetablecategory, 'insert');
			}
			//Insert Emoty-Times fid_timtebalecategory for Entleerungszeiten = 2
			if(sizeof($locationemptytime)> 0) {
				$fid_timetablecategory = 2;
				self::helperTimetableData($locationemptytime, $locationid, $fid_timetablecategory, 'insert');
			}
		}
		if(sizeof($error) > 0) {
			return $error;
		}	
		return $locationid;
	}

	public static function updateLocation($jsonData) {
		//Decode JsonData and extract the Arrays into seperate Vars, after that delete the Arrays in Decoded-Json-Data
		$data = json_decode($jsonData);
		$updateerrors = array();
		
		$resultcategories = $data->resultcategories;
		$resultservices = $data->resultservices;
		$resultcontacs = $data->resultcontacs;
		$resultemptytimes = $data->resultemptytimes;
		$resultopentimes = $data->resultopentimes;
		
		unset($data->resultcategories);
		unset($data->resultservices);
		unset($data->resultcontacs);
		unset($data->resultemptytimes);
		unset($data->resultopentimes);
		
		$locationid = $data->pid_location;
		
		//first we check if we hav to update the address
		if(sizeof($data->locationname) > 0){
			//The address was changed so update
			$result = self::helperLocationData($data, $locationid, 'update');
			if(!$result){
				$updateerrors[] = 'Fehler beim ändern der Adress- und Geodaten!';
			}	
		}

		//Insert new Categories
		for($i = 0; $i < sizeof($resultcategories->objectsAdd);$i++) {
			self::helperLocationCategoriesData($resultcategories->objectsAdd[$i], $locationid, 'insert');	
		}
		//Delete Categories to delete :)
		for($i = 0; $i < sizeof($resultcategories->objectsToDelete);$i++) {
			self::helperLocationCategoriesData($resultcategories->objectsToDelete[$i], $locationid, 'delete');	
		}

		//Insert new Services
		for($i = 0; $i < sizeof($resultservices->objectsAdd);$i++) {
			self::helperServiceData($resultservices->objectsAdd[$i], $locationid, 'insert');	
		}
		
		//Delete Services
		for($i = 0; $i < sizeof($resultservices->objectsToDelete);$i++) {
			self::helperServiceData($resultservices->objectsToDelete[$i], $locationid, 'delete');	
		}

		//Insert Contacts
		for($i = 0; $i < sizeof($resultcontacs->objectsAdd);$i++) {
			self::helperContactData($resultcontacs->objectsAdd[$i], $locationid, 'insert');	
		}
		//Delete Contacts
		for($i = 0; $i < sizeof($resultcontacs->objectsToDelete);$i++) {
			self::helperContactData($resultcontacs->objectsToDelete[$i], $locationid, 'delete');	
		}
		//Update Contacts
		for($i = 0; $i < sizeof($resultcontacs->objectsToUpdate);$i++) {
			self::helperContactData($resultcontacs->objectsToUpdate[$i], $locationid, 'update');	
		}
		//Insert Open-Times fid_timtebalecategory for öffnungszeiten = 1
		if(sizeof($resultopentimes->objectsAdd)> 0) {
			$fid_timetablecategory = 1;
			self::helperTimetableData($resultopentimes->objectsAdd, $locationid, $fid_timetablecategory, 'insert');
		}
		//Delete Times
		if(sizeof($resultopentimes->objectsToDelete)> 0) {
			$fid_timetablecategory = 1;
			self::helperTimetableData($resultopentimes->objectsToDelete, $locationid, $fid_timetablecategory, 'delete');
		}								
		//Insert Open-Times fid_timtebalecategory for öffnungszeiten = 1
		if(sizeof($resultemptytimes->objectsAdd)> 0) {
			$fid_timetablecategory = 2;
			self::helperTimetableData($resultemptytimes->objectsAdd, $locationid, $fid_timetablecategory, 'insert');
		}
		//Delete Times
		if(sizeof($resultemptytimes->objectsToDelete)> 0) {
			$fid_timetablecategory = 2;
			self::helperTimetableData($resultemptytimes->objectsToDelete, $locationid, $fid_timetablecategory, 'delete');
		}	

		if(sizeof($error) > 0) {
			return $error;
		}	
		return true;
	}

	public static function deleteLocation($jsonData) {
		$data = json_decode($jsonData);
				
		$pidlocation = NULL;
		//Fish out the pid
		foreach ($data as $key => $value) {
			if($key == 'pid_location') {
				$pidlocation = $value;
			}
		}
		
		//var_dump($timetablesToDelete);
		
		//start to delete the Shit
		if(sizeof($data->opentimes > 0)) {
			$fid_timetablecategory = 1;
			$resultopentimes = self::helperTimetableData($data->opentimes, $pidlocation, $fid_timetablecategory, 'delete');
		}		
		if(sizeof($data->emptytimes > 0)) {
			$fid_timetablecategory = 2;
			self::helperTimetableData($data->emptytimes, $pidlocation, $fid_timetablecategory, 'delete');
		}		
		//Delete Contacts
		for($i = 0; $i < sizeof($data->contacs);$i++) {
			self::helperContactData($resultcontacs->objectsToDelete[$i], $locationid, 'delete');	
		}		
		
		// Get a db connection.
		$db = JFactory::getDbo();
		$conditionspid = array();
		$conditionspid[] = $db->quoteName('pid_location') . ' = ' . $pidlocation;		
		$conditionsfid = array();
		$conditionsfid[] = $db->quoteName('fid_location') . ' = ' . $pidlocation;	
				
		// delete
		$query = $db->getQuery(true);		 
		$query->delete($db->quoteName('_mygmap_timetable'));
		$query->where($conditionsfid); 
		$db->setQuery($query);
		$result = $db->query();
		if(!$result){
			self::$error[] = $data;
			return false;		
		}
		$query = $db->getQuery(true);		 
		$query->delete($db->quoteName('_mygmap_locationservice'));
		$query->where($conditionsfid); 
		$db->setQuery($query);
		$result = $db->query();
		if(!$result){
			self::$error[] = $data;
			return false;		
		}
		$query = $db->getQuery(true);		 
		$query->delete($db->quoteName('_mygmap_locationcategory'));
		$query->where($conditionsfid); 
		$db->setQuery($query);
		$result = $db->query();
		if(!$result){
			self::$error[] = $data;
			return false;		
		}
		$query = $db->getQuery(true);		 
		$query->delete($db->quoteName('_mygmap_location'));
		$query->where($conditionspid); 
		$db->setQuery($query);
		$result = $db->query();
		if(!$result){
			self::$error[] = $data;
			return false;		
		}			
		return $result;	

	}
		
	private static function helperLocationData($data,$locationid,$action) {
		$db = JFactory::getDbo();
		$query = $db->getQuery(true);	
		
		$columns = array();
		$values = array();

		//prepare longitude and latitude float for Decimal
		if(is_float($data->longitude) && is_float($data->latitude)) {
			$data->longitude = number_format( $data->longitude, 9); 
			$data->latitude = number_format( $data->latitude, 8);
		}
			
		if($action == 'insert'){
			foreach ($data as $key => $value) {
				if($value != NULL && $key != 'pid_location') {
					$columns[] = $key;
					if(is_string($value)) {
						$values[] = $db->quote($value);
					}else{
						$values[] = $value;
					}
				}
			}
			$query
				->insert($db->quoteName('_mygmap_location'))
				->columns($db->quoteName($columns))
				->values(implode(',', $values));
			// Get the query using
			$db->setQuery($query);
			$result = $db->query();
			$lastid = $db->insertid();
			if(!$result) {
				return $result;
			} else {		
				//Insert Into LocationContact
				return $lastid;
			}
		}
		if($action == 'update'){
			$conditions[] = $db->quoteName('pid_location') . ' = ' . $locationid;
			$fields = array();
			//var_dump($data);
			foreach ($data as $key => $value) {
				if($value != NULL && $key != 'pid_service') {
					$columns[] = $key;
					if(is_string($value)) {
						$fields[] = $db->quoteName($key) . ' = ' . $db->quote($value);
					}else{
						$fields[] = $db->quoteName($key) . ' = ' . $value;
					}
				}
			}
			$query->update($db->quoteName('_mygmap_location'))->set($fields)->where($conditions);
			$db->setQuery($query);		 
			$result = $db->query();
			if(!$result) {
				return $result;
			} else {		
				//Insert Into LocationContact
				return $result;
			}
		}
	}

	private static function helperContactData($data,$locationid,$action) {
		$db = JFactory::getDbo();
		$query = $db->getQuery(true);	
		
		$columns = array();
		$values = array();
		
		if($action == 'insert'){
			foreach ($data as $key => $value) {
				if($value != NULL) {
					$columns[] = $key;
					if(is_string($value)) {
						$values[] = $db->quote($value);
					}else{
						$values[] = $value;
					}
				}
			}
			$query
				->insert($db->quoteName('_mygmap_contact'))
				->columns($db->quoteName($columns))
				->values(implode(',', $values));
			// Get the query using
			$db->setQuery($query);
			$result = $db->query();
			$lastid = $db->insertid();
	
			if(!$result) {
				self::$error[] = $data;
				return false;
			} else {
				$query = $db->getQuery(true);
				$locationcontactcolumns = array('fid_location','fid_contact');
				$locationcontactvalues = array($locationid,$lastid);
				$query
					->insert($db->quoteName('_mygmap_locationcontact'))
					->columns($db->quoteName($locationcontactcolumns))
					->values(implode(',', $locationcontactvalues));		
				$db->setQuery($query);
				$result = $db->query();
				if(!$result) {
					self::$error[] = $data;
				}
				return $result;
			}
		}
		if($action == 'delete'){
			for($i=0;$i<sizeof($data);$i++){
				$conditions = array();
				$conditionscontact = array();
				//First we delete in location contact
				foreach ($data as $key => $value) {
					if($key == 'pid_locationcontact') {
						$conditions[] = $db->quoteName('pid_locationcontact') . ' = ' . $value;
					}
					if($key == 'pid_contact') {
						$conditionscontact[] = $db->quoteName('pid_contact') . ' = ' . $value;
					}
				}		 
				$query->delete($db->quoteName('_mygmap_locationcontact'));
				$query->where($conditions);		 
				$db->setQuery($query);
				$result = $db->query();			
				if(!$result) {
					self::$error[] = $data;
					return false;
				} else {
					return $result;
				}
				//Then Contact
				$query = $db->getQuery(true);
				$query->delete($db->quoteName('_mygmap_contact'));
				$query->where($conditionscontact);		 
				$db->setQuery($query);
				$result = $db->query();			
				if(!$result) {
					self::$error[] = $data;
					return false;
				} else {
					return $result;
				}
			}
		}
		if($action == 'update'){
			$fields = array();
			$conditions = array();
			foreach ($data as $key => $value) {
				if($value != NULL 
				   && $key != 'pid_contact' 
				   && $key != 'hashkey'
				   && $key != 'fid_contact'
				   && $key != 'fid_location'
				   && $key != 'pid_locationcontact'
				   ) {
					$columns[] = $key;
					if(is_string($value)) {
						$fields[] = $db->quoteName($key) . ' = ' . $db->quote($value);
					}else{
						$fields[] = $db->quoteName($key) . ' = ' . $value;
					}
				}
				if($key == 'pid_contact') {
					$conditions[] = $db->quoteName('pid_contact') . ' = ' . $value;
				}
			}	 
			$query->update($db->quoteName('_mygmap_contact'))->set($fields)->where($conditions);	 
			$db->setQuery($query);
			$result = $db->query();			
			if(!$result) {
				self::$error[] = $data;
				return false;
			} else {
				return $result;
			}
		}
	}
	
	private static function helperLocationCategoriesData($data,$locationid,$action) {
		$db = JFactory::getDbo();
		$query = $db->getQuery(true);	
		
		if($action == 'insert'){
			$columns = array('fid_location','fid_category');
			$values = array($locationid,$data);
			$query
				->insert($db->quoteName('_mygmap_locationcategory'))
				->columns($db->quoteName($columns))
				->values(implode(',', $values));
			// Get the query using
			$db->setQuery($query);
			$result = $db->query();
			$lastid = $db->insertid();
	
			if(!$result) {
				self::$error[] = $data;
				return false;
			} else {
				return $result;
			}
		}
		if($action == 'delete'){
			$conditions = array();
			foreach ($data as $key => $value) {
				if($key == 'pid_locationcategory') {
					$conditions[] = $db->quoteName('pid_locationcategory') . ' = ' . $value;
				}
			}		 
			$query->delete($db->quoteName('_mygmap_locationcategory'));
			$query->where($conditions);		 
			$db->setQuery($query);
			$result = $db->query();			
			if(!$result) {
				self::$error[] = $data;
				return false;
			} else {
				return $result;
			}
		}
	}

	private static function helperServiceData($data,$locationid,$action) {
		$db = JFactory::getDbo();
		$query = $db->getQuery(true);	
		
		if($action == 'insert'){
			$columns = array('fid_location','fid_service');
			$values = array($locationid,$data);
			$query
				->insert($db->quoteName('_mygmap_locationservice'))
				->columns($db->quoteName($columns))
				->values(implode(',', $values));
			// Get the query using
			$db->setQuery($query);
			$result = $db->query();
			$lastid = $db->insertid();
	
			if(!$result) {
				self::$error[] = $data;
				return false;
			} else {
				return $result;
			}
		}
		if($action == 'delete'){
			$conditions = array();
			foreach ($data as $key => $value) {
				if($key == 'pid_locationservice') {
					$conditions[] = $db->quoteName('pid_locationservice') . ' = ' . $value;
				}
			}		 
			$query->delete($db->quoteName('_mygmap_locationservice'));
			$query->where($conditions);		 
			$db->setQuery($query);
			$result = $db->query();		
			if(!$result) {
				self::$error[] = $data;
				return false;
			} else {
				return $result;
			}
		}
	}

	private static function helperTimetableData($data,$locationid, $fid_timetablecategory, $action) {
		$db = JFactory::getDbo();
		$lastid = 0;
		if($action == 'insert'){
			//First check if there is a guilty timetable
			$query = $db->getQuery(true);
			$conditions = array();
			$conditions[] = $db->quoteName('fid_location') . ' = ' . $locationid;
			$conditions[] = $db->quoteName('fid_category') . ' = ' . $fid_timetablecategory;
			$query
				->select($db->quoteName(array('a.pid_timetable')))
				->from($db->quoteName('_mygmap_timetable', 'a'))
				->where($conditions);
			 
			// Get the query using
			$db->setQuery($query);
			$chkresult = $db->query();
			$rows = $db->getNumRows();
			$result = $db->loadAssocList();
			//a timetable is found
			if($rows > 0){
				$lastid = $result[0]['pid_timetable'];
			} else {
				$query = $db->getQuery(true);		
				$columns = array('fid_category','fid_location');
				$values = array($fid_timetablecategory,$locationid);
				$query
					->insert($db->quoteName('_mygmap_timetable'))
					->columns($db->quoteName($columns))
					->values(implode(',', $values));
				// Get the query using
				$db->setQuery($query);
				$insresult = $db->query();
				$lastid = $db->insertid();
			}
			
			if(!$insresult && !$chkresult) {
				self::$error[] = $data;
				return false;
			} else {
				for($i=0;$i<sizeof($data);$i++){
					$timecolumns = array('fid_timetable');
					$timevalues = array($lastid);
					$time = $data[$i];
					foreach($time as $key => $value) {
						if($value != NULL) {
							$timecolumns[] = $key;
							if(is_string($value)) {
								$timevalues[] = $db->quote($value);
							}else{
								$timevalues[] = $value;
							}
						}
					}
					$query = $db->getQuery(true);
					$query
						->insert($db->quoteName('_mygmap_timetabletimes'))
						->columns($db->quoteName($timecolumns))
						->values(implode(',', $timevalues));		
					$db->setQuery($query);
					$result = $db->query();
					if(!$result) {
						self::$error[] = $data;
					}
				}
			}
		}
		if($action == 'delete'){
			for($i=0;$i<sizeof($data);$i++){
				$conditions = array();
				foreach ($data[$i] as $key => $value) {
					if($key == 'pid_time') {
						$conditions[] = $db->quoteName('pid_time') . ' = ' . $value;
					}
				}
				$query = $db->getQuery(true);		 
				$query->delete($db->quoteName('_mygmap_timetabletimes'));
				$query->where($conditions);		 
				$db->setQuery($query);
				$result = $db->query();
			}
			if(!$result) {
				self::$error[] = $data;
				return false;
			} else {
				return $result;
			}
		}
	}

	public static function selectThisLocationCategory($pid_location) {
		// Get a db connection.
		$db = JFactory::getDbo();
		// Create a new query object.
		$query = $db->getQuery(true);
		$query
			->select($db->quoteName(array('a.pid_locationcategory'
										 ,'a.fid_location'
										 ,'a.fid_category'
										 )))
			->from($db->quoteName('_mygmap_locationcategory', 'a'))
			->where($db->quoteName('fid_location') . ' = '. $db->quote($pid_location))
			->order($db->quoteName('fid_category') . ' ASC');
		 
		// Get the query using
		$db->setQuery($query);
		$row = $db->loadAssocList();
		return $row;
	}

	public static function selectThisLocationContact($pid_location) {
		// Get a db connection.
		$db = JFactory::getDbo();
		// Create a new query object.
		$query = $db->getQuery(true);
		$query	 	 	 	 	 	 	 
			->select($db->quoteName(array('a.pid_contact'
										 ,'a.title'
										 ,'a.firstname'
										 ,'a.surname'
										 ,'a.countrycode'
										 ,'a.areacode'
										 ,'a.phonenumber'
										 ,'a.callthrough'
										 ,'a.email'
										 ,'b.pid_locationcontact'
										 ,'b.fid_location'
										 ,'b.fid_contact'
										 )))
			->from($db->quoteName('_mygmap_contact', 'a'))
			->join('INNER', $db->quoteName('_mygmap_locationcontact', 'b') . ' ON (' . $db->quoteName('a.pid_contact') . ' = ' . $db->quoteName('b.fid_contact') . ')')
			->where($db->quoteName('b.fid_location') . ' = '. $db->quote($pid_location))
			->order($db->quoteName('surname') . ' ASC');
		 
		// Get the query using
		$db->setQuery($query);
		$row = $db->loadAssocList();
		return $row;
	}

	public static function selectThisLocationTimetable($pid_location,$fid_category) {
		// Get a db connection.
		$db = JFactory::getDbo();
		// Create a new query object.
		$query = $db->getQuery(true);
		$query	 	 	 	 	   	 	   	 	 	 	 	 	 
			->select($db->quoteName(array('a.pid_timetable'
										 ,'a.fid_category'
										 ,'a.fid_location'
										 ,'b.pid_time'
										 ,'b.day'
										 ,'b.from'
										 ,'b.to'
										 ,'b.fid_timetable'
										 )))
			->from($db->quoteName('_mygmap_timetable', 'a'))
			->join('INNER', $db->quoteName('_mygmap_timetabletimes', 'b') . ' ON (' . $db->quoteName('a.pid_timetable') . ' = ' . $db->quoteName('b.fid_timetable') . ')')
			->where($db->quoteName('a.fid_location') . ' = '. $db->quote($pid_location) .' AND '.$db->quoteName('a.fid_category').' = '. $db->quote($fid_category))
			->order($db->quoteName('day') . ' ASC');
		// Get the query using
		$db->setQuery($query);
		$row = $db->loadAssocList();
		return $row;
	}

	public static function selectThisLocationService($pid_location) {
		// Get a db connection.
		$db = JFactory::getDbo();
		// Create a new query object.
		$query = $db->getQuery(true);
		$query	 	 	 	 	   	 	    	 	   	  	 	 	   	 	 	 	 	 	 
			->select($db->quoteName(array('a.pid_locationservice'
										 ,'a.fid_location'
										 ,'a.fid_service'
										 ,'b.pid_service'
										 ,'b.fid_category'
										 ,'b.servicename'
										 ,'b.customergroup'
										 ,'c.pid_servicecategory'
										 ,'c.categoryname'
										 )))
			->from($db->quoteName('_mygmap_locationservice', 'a'))
			->join('INNER', $db->quoteName('_mygmap_service', 'b') . ' ON (' . $db->quoteName('a.fid_service') . ' = ' . $db->quoteName('b.pid_service') . ')')
			->join('INNER', $db->quoteName('_mygmap_servicecategory', 'c') . ' ON (' . $db->quoteName('b.fid_category') . ' = ' . $db->quoteName('c.pid_servicecategory') . ')')
			->where($db->quoteName('a.fid_location') . ' = '. $db->quote($pid_location))
			->order($db->quoteName('fid_category') . ' ASC, '.$db->quoteName('customergroup') . ' ASC');
		// Get the query using
		$db->setQuery($query);
		$row = $db->loadAssocList();
		return $row;
	}
				
	public static function selectAllLocation() {
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
										 )))
			->from($db->quoteName('_mygmap_location', 'a'))
			->order($db->quoteName('locationname') . ' ASC');
		 
		// Get the query using
		$db->setQuery($query);
		$row = $db->loadAssocList();
		return $row;
	}
}
?>




