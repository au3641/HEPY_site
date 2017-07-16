(function () {
    "use strict";

    angular.module("HEPY").controller('PreventionCtrl', ["$anchorScroll", "$location", "$scope", "$routeParams", "$document",
function ($anchorScroll, $location, $scope, $routeParams, $document) {
        var that = this;
        
        $scope.pages = [
			{
				name: 'Splošni ukrepi',
				link: 'general_prevention',
				subpages:
					[
						{
							name: 'Splošno',
							link: 'general-prevention'
						},
						{
							name: 'Tvegano vedenje',
							link: 'risky-behaviour'
						},
						{
							name: 'Spolni odnosi',
							link: 'safe-sex'
						},
						{
							name: 'Tetovaža / »piercing«',
							link: 'tattoo'
						},
						{
							name: 'Nesreče',
							link: 'incident'
						}
					]
			},
			{
				name: 'Cepljenje',
				link: 'vaccination',
				subpages:
				[
					{
						name: 'Hepatitis A',
						link: 'vac-hep-a'
					},
					{
						name: 'Hepatitis B',
						link: 'vac-hep-b'
					}
				]
			}
		];
		
		$scope.file = !$routeParams.view ? $scope.pages[0].link : $routeParams.view;
		$scope.urlFile = 'app/pages/prevention/' + $scope.file + '.md';
		$scope.isCollapsed = false;
		$scope.theySeeMeScrollin = function(x)
		{
			//$location.hash('hep-c');
			//$anchorScroll();
			var elementus = angular.element(document.getElementById(String(x)));
			$document.duScrollToElement(elementus, 100, 1000);
    	};
	}]);
})();
