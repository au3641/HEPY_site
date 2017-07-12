(function () {
    "use strict";

    angular.module("HEPY").controller('PreventionCtrl', ["$scope", "$routeParams",
	function ($scope, $routeParams) {
        var that = this;
		
		$scope.file = !$routeParams.view ? "" : $routeParams.view;
		$scope.urlFile = 'app/pages/prevention/' + $scope.file + '.md';
		
		$scope.pages = [
			{
				name: 'Cepljenje',
				link: ''
			},
			{
				name: 'Zaščita',
				link: 'protection'
			}
		]
	}]);
})();
