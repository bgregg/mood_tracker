angular.module('mood_tracker.controllers').controller('mood_inputController', function($scope,$window, $stateParams, $ionicPopup, $location) {
	//get theme color
	// localforage.getItem('mood_logs').then(function(response){
	// 	console.log(JSON.stringify(response));
	// )};
	$scope.appTheme = 'positive';
  var selectedTheme = $window.localStorage.appTheme;
    if (selectedTheme) {
        $scope.appTheme = selectedTheme;
    } else {
        $scope.appTheme = 'positive';
    }

		$scope.changeMood = function(){
			$scope.newestMood = document.getElementById('mood_select').value;
		};
	//main data arrays
	localforage.getItem('moods').then(function(value){
		$scope.moods = value;
	});


	$scope.moodScore = 5;
	$scope.triggers = [];
	$scope.beliefs = [];
	$scope.behaviors = [];

	//misc variables
	$scope.position = 0;
	$scope.show = [false, false, false, false];
	$scope.buttons = [true, false, false, false];
	$scope.prompt = "Please provide an input.";

	$scope.edit = function(itemToEdit, array){

		var index = $scope.$eval(array).indexOf(itemToEdit);

		$scope.data = {};
		$scope.data.item = $scope.$eval(array)[index];

		//prompts the user with the clicked text, allows the user to edit text
		var myPopup = $ionicPopup.show({
		    template: '<input type="text" data-ng-model="data.item">',
		    title: "Edit the item below",
		    scope: $scope,
		    buttons: [
		      { text: 'Cancel',
		      	onTap: function(e) {
		        	return $scope.data.item;
		        }
		      },
		      {
		        text: '<b>Save</b>',
		        type: 'button-positive',
		        onTap: function(e) {
		        	return $scope.data.item;
		        }
		      }
		    ]
		});

		//saves the edited text back into the array
		myPopup.then(function(response){
			array.splice(index, 1, response);
		});
	}


	//get input from user then add input to specified array
	$scope.popUp = function(inputName, array){
		$scope.data = {};
		var saved = false;

		var myPopup = $ionicPopup.show({
		    template: '<input type="text" data-ng-model="data.input">',
		    title: 'Enter a ' + inputName + ' for your Mood',
		    scope: $scope,
		    buttons: [
		      { text: 'Cancel' },
		      {
		        text: '<b>Save</b>',
		        type: 'button-positive',
		        onTap: function(e) {
		        	if(!$scope.data.input){
		        		//prevent users from submitting empty strings
		        		e.preventDefault();
		        	}
		        	else{
		        		saved = true;

		        		//return input as promise
		        		return $scope.data.input;
		        	}
		        }
		      }
		    ]
		});

		myPopup.then(function(response){
			if(saved){
				array.push(response);
				if(inputName == "Mood"){
					localforage.getItem('moods').then(function(value){
						value.push($scope.data.input);
						localforage.setItem('moods', value);
				 	});
					$scope.newestMood = response;
				}
			}
		});
	}

	//keeps track of which next button should be visible
	$scope.next = function(){
		$scope.show[$scope.position] = true;
		$scope.buttons[$scope.position] = false;

		$scope.position++;
		$scope.buttons[$scope.position] = true;
	};

	$scope.submit = function(){

		//input information into the database

		console.log("Newest Mood: " + $scope.newestMood);

		var newLog = {
			datetime: new Date(Date.now()),
			mood: $scope.newestMood,
			intensity: $scope.moodScore,
			triggers: $scope.triggers,
			beliefs: $scope.beliefs,
			behaviors: $scope.behaviors
		};

		localforage.getItem('mood_logs').then(function(response){
			response.push(newLog);
			localforage.setItem('mood_logs', response).then(function(res){
				JSON.stringify(res);
			});
		});

		//reset variables then go back to the home page
		$scope.position = 0;
		$scope.show = [false, false, false, false];
		$scope.buttons = [true, false, false, false];
		$scope.beliefs = [];
		$scope.triggers = [];
		$scope.behaviors = [];

		$location.path("app/home");
	};

	//remove an input from specified array
	$scope.remove = function(object, array){
		array.splice(array.indexOf(object),1);
	};
});
