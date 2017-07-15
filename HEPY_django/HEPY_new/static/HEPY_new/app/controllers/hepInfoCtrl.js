(function () {
    "use strict";

    angular.module("HEPY").controller('HepInfoCtrl', ["$scope", "$routeParams",
	function ($scope, $routeParams) {
        var that = this;
        
        $scope.pages = [
			{
				name: 'Virusni hepatitis',
				link: 'description-viral'
			},
			{
				name: 'Akutni hepatitis',
				link: 'description-acute'
			},
			{
				name: 'Hepatitis A',
				link: 'description-ha'
			},
			{
				name: 'Hepatitis B',
				link: 'description-hb'
			},
			{
				name: 'Hepatitis C',
				link: 'description-hc'
			},
			{
				name: 'Hepatitis D',
				link: 'description-hd'
			},
			{
				name: 'Hepatitis E',
				link: 'description-he'
			},
			{
				name: 'Jetra in prehrana',
				link: 'food-and-liver'
			}];
		
        $scope.file = !$routeParams.view ? $scope.pages[0].link : $routeParams.view;
		$scope.urlFile = 'app/pages/hep-info/' + $scope.file + '.md';
	}]);
})();