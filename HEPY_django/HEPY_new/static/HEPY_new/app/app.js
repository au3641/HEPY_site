(function() {
    "use strict";

    var app = angular.module("HEPY", [
        "ngRoute",
		"ngAnimate",
        "ui.bootstrap",
		"ngSanitize",
    ]);

    app.constant("_", window._);
	
	app.config(["$routeProvider",
		function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl : 'app/pages/home.html',
				controller  : 'BlankCtrl'
			})
			.when('/vprasalnik', {
				templateUrl : 'app/pages/survey.html',
				controller  : 'SurveyCtrl'
			})
			.when('/vprasalnik/uvod', {
				templateUrl : 'app/pages/survey-intro.html',
				controller  : 'BlankCtrl'
			})
			.when('/opis-virusnih-hepatitisov/:view?', {
				templateUrl : 'app/pages/hepatitis-info.html',
				controller  : 'HepInfoCtrl'
			})
			.when('/preprecevanje/:view?', {
				templateUrl : 'app/pages/prevention.html',
				controller  : 'PreventionCtrl'
			})
			.when('/kam-po-pomoc', {
				templateUrl : 'app/pages/medical-examination.html',
				controller  : 'BlankCtrl'
			})
			.when('/primeri/:view?', {
				templateUrl : 'app/pages/examples.html',
				controller  : 'ExamplesCtrl'
			})
			.when('/o-hep-y', {
				templateUrl : 'app/pages/about.html',
				controller  : 'BlankCtrl'
			})
			.otherwise({ redirectTo: '/' });
	}]);
})();
