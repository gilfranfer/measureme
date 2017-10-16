mmeApp.controller('AuthenticationCntrl',
	['$scope', '$rootScope', 'AuthenticationSvc',

	function($scope, $rootScope, AuthenticationSvc ){
		
		$scope.login = function(){
			AuthenticationSvc.loginUser($scope.user);
		};
		
		$scope.logout = function(){
			AuthenticationSvc.logout();
		};
		
		$scope.register = function(){
			AuthenticationSvc.register($scope.regUser);
		};

	}]//function
);

mmeApp.factory( 'AuthenticationSvc', 
	['$rootScope','$location','$firebaseObject','$firebaseAuth',
	
	function($rootScope, $location,$firebaseObject,$firebaseAuth){

		var auth = $firebaseAuth();
		var usersFolder = firebase.database().ref().child('members');
		var loginSuccessPage = '/dashboard';

		auth.$onAuthStateChanged( function(authUser){
    		if(authUser && !$rootScope.currentUser){
				console.log("AuthSvc - Initialization");
				$rootScope.currentUser = $firebaseObject(usersFolder.child(authUser.uid));
				usersFolder.child(authUser.uid).update({lastlogin: firebase.database.ServerValue.TIMESTAMP});
			}else{
				console.log("AuthSvc - No User Authenticated");
				cleanRootScope();
			}
		} );
			
		var cleanRootScope = function(){
			for (var prop in $rootScope) {
			    if (prop.substring(0,1) !== '$') {
					//console.log("Rootscope Prop: "+prop);
			        delete $rootScope[prop];
			    }
			}
		};

		return{
			loginUser: function(user){
				auth.$signInWithEmailAndPassword( user.email,user.pwd)
					.then( function (user){
						console.log( "Sucessful Login!");
						$location.path( loginSuccessPage );
					}).catch( function(error){
						$rootScope.loginErrorMsg = error.message;
					});
			},
			logout: function(){
				auth.$signOut();
				$location.path( "/home" );
			},
			isUserLoggedIn: function(){
				return auth.$requireSignIn();
			},
			register: function(user, currentAppVersion){
				auth.$createUserWithEmailAndPassword(user.email, user.pwd)
					.then(
						function(regUser){
							usersFolder.child(regUser.uid).set({
								firstname: user.firstname,
								lastname: user.lastname,
								email: user.email,
								userid: regUser.uid,
								date: firebase.database.ServerValue.TIMESTAMP,
							});
							$location.path( loginSuccessPage );
						}
					).catch( function(error){
						$rootScope.registerErrorMsg = error.message;
					});
			}
		};//return
	}
]);
