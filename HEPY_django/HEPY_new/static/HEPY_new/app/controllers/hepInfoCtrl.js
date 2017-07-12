(function () {
    "use strict";

    angular.module("HEPY").controller('HepInfoCtrl', ["$scope", "$routeParams",
	function ($scope, $routeParams) {
        var that = this;
		
		$scope.file = !$routeParams.view ? "" : $routeParams.view;
		$scope.urlFile = 'app/pages/hep-info/' + $scope.file + '.md';
		
		$scope.pages = [
		{
			name: 'Akutni',
			link: '',
		},
		{
			name: 'Hepatitis A',
			link: 'description-ha',
		},
		{
			name: 'Hepatitis B',
			link: 'description-hb',
		},
		{
			name: 'Hepatitis C',
			link: 'description-hc',
		},
		{
			name: 'Hepatitis D',
			link: 'description-hd',
		},
		{
			name: 'Hepatitis E',
			link: 'description-he',
		},
		{
			name: 'Jetra in prehrana',
			link: 'food-and-liver',
		}];
	}]);
})();