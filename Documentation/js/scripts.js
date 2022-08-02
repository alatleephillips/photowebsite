(function($){
"use strict";

$(document).ready(function() {

	var win_h 						= $(window).height(),
		win_w 						= $(window).width(),
		headerHeight 				= $('header').height(),
		footerHeight 				= $('footer').height(),
		nav 						= $("nav"),
		main 						= $("main"),
		animating 					= false,
		scrollAmount 				= 0,
		navOffset 					= $('header').outerHeight() + 60;


	// ----------------------
	// Global
	// ----------------------
		nav.css('top', ($('header').outerHeight() + 80));
		main.css('min-height', win_h - ($('header').outerHeight() + $('footer').outerHeight()));

		$(window).on('scroll', function(event) {

			scrollAmount = $(window).scrollTop();
			navOffset = nav.css('top');

			if(scrollAmount > $('header').outerHeight()) {
				nav.css('top', 80);
				if(!nav.hasClass('fixed')) {
					nav.addClass('fixed');
				}
			}
			else {
				nav.css('top', ($('header').outerHeight() + 80));
				nav.removeClass('fixed');
			}
		});


	// ----------------------
	// Sections
	// ----------------------

	$("nav a").on('click', function(event) {
		event.preventDefault();

		var wanted_tab = $(this).attr('href');

		if( !$(this).hasClass('active') && !(animating) ) {

			animating = true;
			$(window).scrollTo(0, 400);

			$("nav a.active").removeClass('active');
			$(this).addClass('active');

			$("main section.active").fadeOut(250, function() {

				$(this).removeClass('active');

				$("main section"+ wanted_tab +"").fadeIn(250, function() {
					
					$(this).addClass('active');
					animating = false;
				});
			});
		}
	});


});


})(jQuery);