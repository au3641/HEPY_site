(function () {
    "use strict";

    angular.module("HEPY").controller('ExamplesCtrl', ["$scope", "$routeParams",
	function ($scope, $routeParams) {
        var that = this;
		
		$scope.file = !$routeParams.view ? "hepa_example" : $routeParams.view;
		$scope.urlFile = 'app/pages/examples/' + $scope.file + '.md';
		
		$scope.pages = [
		{
			name: 'Hepatitis A',
			link: 'hepa_example',
		},
		{
			name: 'Hepatitis B',
			link: 'hepb_example',
		},
		{
			name: 'Hepatitis C',
			link: 'hepc_example',
		},
		{
			name: 'Hepatitis E',
			link: 'hepe_example',
		}];
	}]);
})();
