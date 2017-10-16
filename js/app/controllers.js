mmeApp.controller('MeasuresCtrl', ['$scope', '$rootScope', '$firebaseArray', '$firebaseAuth',
	function($scope, $rootScope, $firebaseArray, $firebaseAuth ){

		var auth = $firebaseAuth();
		auth.$onAuthStateChanged( function(authUser){
    		if(authUser){
				console.log("MeasuresCtrl - Initialization");
				let weightHistoryQuery = firebase.database().ref().child('members')
					.child(authUser.uid).child('measures/weight');
				let weightArray = $firebaseArray( weightHistoryQuery );
				$scope.weightRecords = weightArray;
			}else{
				console.log("MeasuresCtrl - No User Authenticated");
			}
		} );

		$scope.addWeight = function(){
			saveWeight({
				weight: $scope.newWeight, unit: 'lbs', date: firebase.database.ServerValue.TIMESTAMP
			});
			$scope.newWeight = "";
		};

		$scope.deleateRecord = function(obj){
			$scope.weightRecords.$remove(obj).then(function(ref) {
			  //console.log(ref.key === obj.$id); // true
			});
		};

		saveWeight = function(data){
			$scope.weightRecords.$add(data).then(function() {
				console.log('Synchronization succeeded');
			});
		};

		/*$scope.loadDummyData = function(){
			console.log("Here")
			records = [
				{weight: 178, unit: 'lb', date: 1508111148211},
				{weight: 180, unit: 'lb', date: 1508212158311},
				{weight: 182, unit: 'lb', date: 1508313168211},
				{weight: 180, unit: 'lb', date: 1508414188211},
				{weight: 176, unit: 'lb', date: 1508515188211},
				{weight: 172, unit: 'lb', date: 1508616148211},
				{weight: 173, unit: 'lb', date: 1508717148211},
			].forEach(function(element) {
			    saveWeight(element);;
			});
		};*/
	}
]);

/*mmeApp.controller('MembersCtrl', ['$scope', '$rootScope',
	function($scope, $rootScope){

		let allmembersFolder = firebase.database().ref().child('members');

		$scope.createTestUser = function(){
			allmembersFolder.child("gilf").set({
				firstname: "Fer", lastname: "Gil",
				userid: "gilf", date: firebase.database.ServerValue.TIMESTAMP
			}).then(function() {
				console.log('Synchronization succeeded');
			});
		};
	}
]);
*/