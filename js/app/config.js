var mmeApp = angular.module('mmeApp',['ngRoute','firebase']);

mmeApp.config(['$routeProvider',
	function($routeProvider){
		$routeProvider.
			when('/home',{
				templateUrl: 'views/home.html'
			}).
			when('/dashboard', {
				templateUrl: 'views/dash.html',
				controller:  'MeasuresCtrl',
				resolve: {
					currentAuth: function(AuthenticationSvc){
						return AuthenticationSvc.isUserLoggedIn();
					}
				}
			}).
			when('/login',{
				templateUrl: 'views/login.html',
				controller: 'AuthenticationCntrl'
			}).
			when('/register',{
				templateUrl: 'views/register.html',
				controller:  'AuthenticationCntrl'
			}).
			when('/error',{
				templateUrl: 'views/error.html'
			}).
			otherwise({
				redirectTo: 'home'
			});
	}
]);
        
mmeApp.run( ['$rootScope', '$location', function($rootScope,$location){
	$rootScope.$on('$routeChangeError', function( event, next, previous, error){
		if(error == 'AUTH_REQUIRED'){
			$rootScope.errorMessage = "You need to be loged-in to see this content.";	
		}else{		
			$rootScope.errorMessage = error;
		}
		$location.path('/error');
	});
}]);