(function () {
    "use strict";

    angular.module("HEPY").controller('PageCtrl', ["$location", function ($location) {
        var that = this;
		
		that.menuItems = [
			{
				text: 'Vprašalnik',
				link: '#/vprasalnik/uvod',
				icon: 'questions-css.svg',
			},
			{
				text: 'Opis virusnih hepatitisov',
				link: '#/opis-virusnih-hepatitisov',
				icon: 'virus-css.svg',
				subpages: [
					{
						name: 'Akutni',
						link: '',
					},
					{
						name: 'Hepatitis A',
						link: 'hepatitis-a',
					},
					{
						name: 'Hepatitis B',
						link: 'hepatitis-b',
					},
					{
						name: 'Hepatitis C',
						link: 'hepatitis-c',
					},
					{
						name: 'Hepatitis D',
						link: 'hepatitis-d',
					},
					{
						name: 'Hepatitis E',
						link: 'hepatitis-e',
					},
					{
						name: 'Jetra in prehrana',
						link: 'jetra-in-prehrana',
					}]
			},
			{
				text: 'Kam po pomoč',
				link: '#/kam-po-pomoc',
				icon: 'doctor-css.svg'
			},
			{
				text: 'Preprečevanje',
				link: '#/preprecevanje',
				icon: 'safety-css.svg',
				subpages: [
					{
						name: 'Cepljenje',
						link: 'cepljenje',
					},
					{
						name: 'Zaščita',
						link: 'zascita',
					}]
			},
			{
				text: 'Primeri',
				link: '#/primeri',
			},
			{
				text: 'O HEP-Y',
				link: '#/o-hep-y',
				icon: 'group-css.svg',
			},
		];
		
		that.show = false;
		
		that.close = function() {
			$location.path("/");
			that.show = false;
		};
		
		that.navigate = function() {
			that.show = true;
		};
		
		that.show = $location.url().length > 1 ;
	}]);
})();
