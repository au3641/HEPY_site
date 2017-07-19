$(document).ready(function () {	
	setTimeout(function() {
		$("#navbar a.dropdown-toggle").on('click', function(){
			$('.collapse').collapse('hide');
			$("html, body").animate({ scrollTop: 0 }, "slow");
		});
	}, 100);
	
	var offset = 64; // show after offset px
	var offset_opacity = 10000; // decares opacity after offset_opacity px
	var scroll_top_duration = 700; // delay after which to show back to top
	
	var back_to_top = $('.back-to-top');

	$(window).scroll(function(){
		var opacity = 1;
		
		if($(this).scrollTop() < offset)
			opacity = 0;
		
		back_to_top.css({'opacity': opacity});
	});

	back_to_top.on('click', function(event){
		event.preventDefault();
		$('body,html').animate({ scrollTop: 0 }, "slow");
	});
	
	if (typeof String.prototype.startsWith != 'function') {
		// see below for better implementation!
		String.prototype.startsWith = function (str){
			return this.indexOf(str) === 0;
		};
	}
	
	if (typeof String.prototype.endsWith != 'function') {
		String.prototype.endsWith = function (str){
			return this.slice(-str.length) == str;
		};
	}
	
	String.prototype.splice = function( idx, rem, s ) {
		return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
	};
});



function openDialog(img, txt, appropriate) {
	$.featherlight("<img class='lightbox-img img-responsive center-block col-md-12' src='" + img + "'/><p>" + txt + "</p>");
}