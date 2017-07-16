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
				text: 'Opisi virusnih hepatitisov',
				link: '#/opisi-virusnih-hepatitisov',
				icon: 'virus-css.svg',
				subpages: [
					{
						name: 'Virusni hepatitis',
						link: 'description-viral'
					},
					{
						name: 'Akutni hepatitis',
						link: 'description-acute',
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
						name: 'Splošni ukrepi',
						link: 'general_prevention',
					},
					{
						name: 'Cepljenje',
						link: 'vaccination',
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
