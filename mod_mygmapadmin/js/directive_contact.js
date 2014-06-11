mygmapAppDirectives.directive('contact', function() {
    return {
        restrict: 'A,E',
		scope: { 
			allcontact: '='
		},
        templateUrl: 'modules/mod_mygmapadmin/partials/templates/dir_contact.html',
		controller: function($scope,$element, $attrs) {
			$scope.arrayContacts = $scope.allcontact.contacts;
						
			$scope.contactFormData = {
				title: '',
				firstname: '',
				surname: '',
				countrycode: '',
				areacode: '',
				phonenumber: '',
				callthrough: '',
				email: ''		
			};
						
			$scope.clickAddContact = function() {
				if($scope.checkValidForm() == true){
					$scope.allcontact.contacts.push($scope.contactFormData);
					$scope.contactFormData = {
						title: '',
						firstname: '',
						surname: '',
						countrycode: '',
						areacode: '',
						phonenumber: '',
						callthrough: '',
						email: ''		
					};
				} else {
					$scope.showwarning = true;
					$scope.warningmessage = 'Bitte geben Sie einen Vor- und Nachnamen, sowie eine Telefonnummer oder E-Mail an'
				}
			}
			
			$scope.clickDeleteContact = function(contactObject){
				var myindex = -1 ;
				for(var i = 0; i < $scope.allcontact.contacts.length ; i++) {
					if($scope.allcontact.contacts[i].$$hashKey == contactObject.$$hashKey) {
						myindex = i;
					}
				}
				$scope.allcontact.contacts.splice(myindex, 1);		
			}
			
			$scope.clickUpdateContact = function(){
				if($scope.checkValidForm() == true){
					for(var i=0; i < $scope.allcontact.contacts.length; i++) {
						if($scope.contactFormData.hashkey == $scope.allcontact.contacts[i].$$hashKey){
							 $scope.allcontact.contacts[i] = $scope.contactFormData;
						}
					}
					$scope.contactFormData = {
						title: '',
						firstname: '',
						surname: '',
						countrycode: '',
						areacode: '',
						phonenumber: '',
						callthrough: '',
						email: ''		
					};
					$scope.updatebtn = false;				
				} else {
					$scope.showwarning = true;
					$scope.warningmessage = 'Bitte geben Sie eine Anrede, einen Vor- und Nachnamen, sowie Telefon oder E-Mail an'
				}
			}

			$scope.checkValidForm = function(){
				var result = false;
				if($scope.contactFormData.title.length > 0 &&
				   $scope.contactFormData.firstname.length > 0 &&
				   $scope.contactFormData.surname.length > 0 &&
				   (($scope.contactFormData.countrycode.length > 0 &&
				   $scope.contactFormData.areacode.length > 0 &&
				   $scope.contactFormData.phonenumber.length > 0 &&
				   $scope.contactFormData.callthrough.length > 0 )||
				   $scope.contactFormData.email.length > 0 )
				){
					result = true
				}
				console.log(result);
				return result;
			}
						
			$scope.clickEditContact = function(contactObject){
				$scope.updatebtn = true;
				$scope.contactFormData = {
					hashkey: contactObject.$$hashKey,
					fid_contact: contactObject.fid_contact,
					fid_location: contactObject.fid_location,
					pid_contact: contactObject.pid_contact,
					pid_locationcontact: contactObject.pid_locationcontact,
					title: contactObject.title,
					firstname: contactObject.firstname,
					surname: contactObject.surname,
					countrycode: contactObject.countrycode,
					areacode: contactObject.areacode,
					phonenumber: contactObject.phonenumber,
					callthrough: contactObject.callthrough,
					email: contactObject.email		
				};
			}
		}
	};
});