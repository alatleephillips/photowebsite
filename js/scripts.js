(function($){
"use strict";

$(document).ready(function() {


	var win_h 						= $(window).height(),
		win_w 						= $(window).width(),
		win_m 						= parseInt($("body").css('border-bottom-width')) * 2,
		win_w_c 					= win_w - win_m,
		win_h_c 					= win_h - win_m,
		win_h_m 					= $(window).height() - (parseInt($("body").css('border-bottom-width')) * 2),
		win_w_m						= $(window).width() - (parseInt($("body").css('border-bottom-width')) * 2),
		headerHeight 				= $('header').height(),
		footerHeight 				= $('footer').height(),
		is_animating 				= false,
		resizeTimer,
		landing_slides_arr 			= [],
		hori_str_scroll,
		lightbox,
		lightbox_imgs 				= [],
		browser 					= detect_browser(),
		is_desktop 					= true,
		is_tablet 					= false,
		is_mobile 					= false;



	// ----------------------
	// Global
	// ----------------------
		
		// Responsiveness
			$("html").addClass(browser);

			if(win_w > 1680) {

				is_desktop 			= true;
				is_tablet 			= false;
				is_mobile 			= false;
			}
			else if(win_w <= 1300 && win_w > 1024) {

				is_desktop 			= false;
				is_tablet 			= true;
				is_mobile 			= false;
			}
			else if(win_w <= 1024) {

				is_desktop 			= false;
				is_tablet 			= false;
				is_mobile 			= true;
			}

		// Preloader
			Pace.options = {
				ajax: false,
				elements: false,
				eventLag: false
			};

			Pace.on('done', function() {

				$("body > .loader").addClass('loaded');
				$(".pace").addClass('loaded');

				$("body > .loader").delay(1100).fadeOut(100, function() {
		    		$("body").addClass('done-loading');
		    	});

				// Drawing layouts after loading all images.
				draw();
			});

		// Resize
			$(window).resize(function() {
				
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(function() {
					draw(true);
				}, 100);
			});

		// Videos
			$("body").fitVids();

	/*
	===========================================================
	===========================================================
		Events
	===========================================================
	===========================================================
	*/


		// ----------------------
		// Menu - Responsive
		// ----------------------

			//Mobile/Tablet Menu Icon
				$("header .menu-icon").on("click",function() {

					if(!$("header").hasClass('showNav')){

						$("body, html, header, footer").addClass("showNav");

						if($("header nav > ul").height() < (win_h-300)) {

							var wantedHeight = (win_h/2) - ($("header nav ul").height()/2);

							$("header nav > ul").css('padding', wantedHeight+'px 0');
						}
					}
					else {

						$(this).siblings('nav').find('ul').attr('style', '');

						$("body, html, header, footer").removeClass("showNav");
					}
				});

			//Mobile/Tablet Menu Link Toggle animation
				$("body").on('click', 'header.showNav nav a', function(event) {

			        if($(this).siblings("ul").length > 0) {
			            event.preventDefault();
			        }

			        if($(this).next().hasClass('active')) {

				        $(this).next().slideToggle(500);
				        $(this).next().removeClass('active');
			        }
			        else {

			        	$(this).parent().siblings('li').find('> ul.active').slideToggle(500);
			        	$(this).parent().siblings('li').find('> ul.active').removeClass('active');

				        $(this).next().addClass('active');
				        $(this).next().slideToggle(500);
			        }
			    });


		// ----------------------
		// Tools
		// ----------------------

			// Back To Top
				if($(".global-tools .back-to-top").length > 0) {

					$(window).on('scroll', function() {

						var height = $(this).height(),
							scroll_amount = $(this).scrollTop();

						if(scroll_amount > height) {
							if(!$(".global-tools .back-to-top").hasClass('active')) {
								$(".global-tools .back-to-top").addClass('active');
							}
						}
						else {
							$(".global-tools .back-to-top").removeClass('active');
						}
					});
				}
				$(".global-tools .back-to-top").on('click', function(event) {
					event.preventDefault();

					$("html, body").animate({
						scrollTop: 0
					}, 1500, 'easeOutExpo');
				});
			
			// Search
				if($(".global-tools .search").length > 0) {

					$(window).on('scroll', function() {

						var height = $(this).height(),
							scroll_amount = $(this).scrollTop();

						if(scroll_amount > height) {
							if(!$(".global-tools .search").hasClass('active')) {
								$(".global-tools .search").addClass('active');
							}
						}
						else {
							$(".global-tools .search").removeClass('active');
						}
					});
				}
				$(".global-tools .search").on('click', function(event) {
					event.preventDefault();
				});


		// ----------------------
		// Elements
		// ----------------------

			// Lightbox
				$(".lightbox a").on('click', function(event) {

					if (!is_animating) {
					    event.preventDefault();
					     
					    var $index = $(this).parents('article').index();
					    var options = {
					        index: $index,
					        bgOpacity: 0.85,
					        showHideOpacity: true,
					        shareButtons: [
							    {id:'download', label:'Download image', url:'{{raw_image_url}}', download:true}
							]
					    };
					     
					    // Initialize PhotoSwipe
					    var lightBoxObj = new PhotoSwipe(lightbox, PhotoSwipeUI_Default, lightbox_imgs, options);
					    lightBoxObj.init();
				    }
				});

			// Horizontal Strips

				// Navigation - Left Arrow
				$(".horizontal-strips .nav .prev").on('click', function(event) {
					event.preventDefault();

					var columnsCount 	= parseInt($(".horizontal-strips").attr('data-columns'));
						columnsCount 	= (win_w <= 1280 && columnsCount >= 4)? 3 : columnsCount;
						columnsCount 	= (win_w <= 768)? 1 : columnsCount;
					var	scroll_amount 	= win_w_c / columnsCount;

					hori_str_scroll.doScrollLeftBy(scroll_amount);
				});

				// Navigation - Right Arrow
				$(".horizontal-strips .nav .next").on('click', function(event) {
					event.preventDefault();

					var columnsCount 	= parseInt($(".horizontal-strips").attr('data-columns')),
						columnsCount 	= (win_w <= 1280 && columnsCount >= 4)? 3 : columnsCount,
						columnsCount 	= (win_w <= 768)? 1 : columnsCount,
						scroll_amount 	= win_w_c / columnsCount;
					
					hori_str_scroll.doScrollLeftBy(scroll_amount * -1);
				});

				// Navigation - Keybaord Press
				if($(".horizontal-strips").length > 0) {

					$(document).on('keydown',function(e) {

						// Right button
					    if((e.keyCode || e.which) == 39) {

							$(".horizontal-strips .nav .next").trigger('click');
					    }
						// Left button
					    else if((e.keyCode || e.which) == 37) {

							$(".horizontal-strips .nav .prev").trigger('click');
					    }
					});
				}

			// Slideshow

				// Navigation Controls - Previous
				$(".slideshow .nav .prev").on('click', function(event) {
					event.preventDefault();

					$(".slideshow").flexslider('prev');
				});

				// Navigation Controls - Next
				$(".slideshow .nav .next").on('click', function(event) {
					event.preventDefault();

					$(".slideshow").flexslider('next');
				});

			// Grid

				// Filters
				$(".grid-filters li").on('click', function(event) {
					event.preventDefault();

					var target = $(this).attr('data-filter');

					if(!$(this).hasClass('active')) {

						$(".grid-filters").addClass('filtered');
						$(".grid-filters li.active").removeClass('active');
						$(this).addClass('active');

						if(target != "*") {
							target = "."+$(this).attr('data-filter');
						}

						$(".grid").isotope({ 
							filter: target 
						});
					}
				});

			// Video Player
				$(".video-player .icon").on('click', function(event) {
					event.preventDefault();

					if($(".video-player").hasClass('vimeo')) {

						var iframe = $(this).parent().siblings('.player').find('iframe')[0],
							player = new Vimeo.Player(iframe);

						$(this).parent().fadeOut(300, function() {

							player.play();
						});
					}
					else if($(".video-player").hasClass('youtube')) {

						var iframe = $(this).parent().siblings('.player').find('iframe');


						$(this).parent().fadeOut(300, function() {

						});
					}
				});
		
			// Accordion
				$(".accordion h3").on('click', function(event) {
					event.preventDefault();

						if(!$(this).parent().hasClass('active')) {

							var active_height = $(this).parent().find('.inner-content').totalHeight() + 'px';

							if(!$(this).parents(".accordion").hasClass('toggle')) {

								$(this).parent().siblings(".active").find('.content').transition({
									height: '0px',
									duration: 400,
									easing: 'easeOutExpo'
								});

								$(this).parent().siblings(".active").removeClass("active");
							}

							$(this).parent().addClass('active');

							$(this).parent().find('.content').transition({
								height: active_height,
								duration: 400,
								easing: 'easeOutExpo'
							});
						}
						else if($(this).parents(".accordion").hasClass('toggle')) {

							$(this).parent().removeClass("active");

							$(this).parent().find('.content').transition({
								height: '0px',
								duration: 400,
								easing: 'easeOutExpo'
							});

						}
					
				});

			// Tabs
				$(".tabs .head li").on('click', function(event) {
					event.preventDefault();

					var tab = $(this).parents(".tabs");

					if(!$(this).hasClass('active')) {

						$(this).siblings('.active').removeClass('active');
						$(this).addClass('active');

						tab.find('.content .tab-content.active').removeClass('active');
						tab.find('.content .tab-content#'+ $(this).attr('id')).addClass('active');
					}
				});

	/*
	===========================================================
	===========================================================
		Functions
	===========================================================
	===========================================================
	*/

		// Drawing layouts after loading all images.
		function draw(resize = false) {


			// ----------------------
			// Global
			// ----------------------
				win_h 			= $(window).height();
				win_w 			= $(window).width();
				headerHeight 	= $('header').height();
				footerHeight 	= $('footer').height();
				win_w_c 		= win_w - win_m;
				win_h_c 		= win_h - win_m;

				$("main.fullwidth").height( win_h_c - (headerHeight+footerHeight) );

				if(win_w > 1280) {

					$("body, html").removeClass("showNav");

					if(is_tablet || is_mobile) {
						window.location.reload(false);
					}

					is_desktop 	= true;
					is_tablet 	= false;
					is_mobile 	= false;
				}
				else if(win_w <= 1280 && win_w > 768) {

					if(is_desktop || is_mobile) {
						window.location.reload(false);
					}

					is_desktop 	= false;
					is_tablet 	= true;
					is_mobile 	= false;
				}
				else if(win_w <= 768) {

					if(is_desktop || is_tablet) {
						window.location.reload(false);
					}

					is_desktop 	= false;
					is_tablet 	= false;
					is_mobile 	= true;
				}


			// ----------------------
			// Header & Footer
			// ----------------------

				// Wide Screens (Desktop)
				if(is_desktop) {

					// Global
						$("body, html").removeClass("showNav");

					// Header
						$("header").removeClass("mobile-tablet showNav");
						$("header nav ul").attr('style','');

					// Footer
						$("footer").removeClass("showNav");
				}
				// Medium & Small Screens (Tablet & Mobile)
				else if(!is_desktop) {
				}


			// ----------------------
			// Global Tools
			// ----------------------

				// Back To Top
					if($(".global-tools").length > 0) {
						$(".global-tools .back-to-top").addClass(detect_browser());
					}


			// ----------------------
			// Landing
			// ----------------------

				// Horizontal Slider
					if($(".landing .horizontal-slider").length > 0) {

						var slider = $(".landing .horizontal-slider.centered > .swiper-container"),
							slider_id = '#' + slider.attr('id'),
							active_slide = 0;

						active_slide = slider.find('article.active').index() || 0;

						if(!resize) {
							
							var swiper1 = new Swiper(slider_id, {
								slidesPerView: 'auto',
								centeredSlides: true,
								speed: 850,
								spaceBetween: 30,
								initialSlide: active_slide,
								grabCursor: false,
								loop: true,
								allowTouchMove: false,
								keyboard: {
									enabled: false,
									onlyInViewport: true,
								},
								mousewheel: false
							});

							setInterval(function(){

								swiper1.slideNext();
							},3000);
						}
					}

				// Horizontal Strips
					if($(".landing-strips").length > 0) {

						var slideshow_speed = parseInt($(".landing-strips").attr('data-ss-speed')),
							animation_speed = parseInt($(".landing-strips").attr('data-an-speed')),
							strips_slides_interval,
							cols = $(".landing-strips .flexslider").length;


						strips_slides_interval = setInterval(function(){
							random_slide(cols);
						},slideshow_speed);

						$(".landing-strips .slideshow").flexslider({
						  
						    prevText: "",
						    nextText: "",
						    animation: 'fade',
						    easing: "linear",
						    slideshow: true,
						    slideshowSpeed: slideshow_speed,
						    animationSpeed: animation_speed,
						    controlNav: false,
						    directionNav: false
						});
					}


			// ----------------------
			// Page
			// ----------------------

				// Sliced
					if($(".page.style-sliced").length > 0) {

						var content_height = $(".page.style-sliced .inner-wrapper").totalHeight();

						if(content_height < $(".page.style-sliced").height()) {
							$(".page.style-sliced .inner-wrapper").addClass('small');
						}
						else {
							$(".page.style-sliced .inner-wrapper").removeClass('small');
						}
					}


			// ----------------------
			// Elements
			// ----------------------

				// Horizontal Slider
					if($(".horizontal-slider.centered:not(.for-landing) > .swiper-container, .horizontal-slider.full:not(.for-landing) > .swiper-container").length > 0) {

						if(!resize) {

							$(".horizontal-slider.centered > .swiper-container, .horizontal-slider.full > .swiper-container").each(function() {
								
								var slider = $(this),
									slider_id = '#' + slider.attr('id'),
									active_slide = 0,
									mousewheel_status = slider.parent().attr('data-mousewheel') || '',
									mousewheel_obj,
									space_between_slides = 0,
									slides_per_view;

								active_slide = slider.find('article.active').index() || 0;

								if(slider.parent().attr('data-height')) {
									slider.parent().height(slider.parent().attr('data-height'));
								}

								if(slider.parent().hasClass('centered')) {
									space_between_slides = 30;
									slides_per_view = 'auto';
								}
								else {
									space_between_slides = 0;
									slides_per_view = 1;
								}

								if(mousewheel_status.length > 0 && mousewheel_status == 'false') {
									mousewheel_obj = false;
								}
								else {
									mousewheel_obj = {invert: false};
								}

								new Swiper(slider_id, {
									slidesPerView: slides_per_view,
									centeredSlides: true,
									speed: 650,
									spaceBetween: space_between_slides,
									initialSlide: active_slide,
									grabCursor: true,
									loop: true,
									keyboard: {
										enabled: true,
										onlyInViewport: true,
									},
									mousewheel: mousewheel_obj
								});
							});
						}
					}

				// Horizontal Strips
					if($(".horizontal-strips").length > 0) {

						if(!resize) {

							$(".horizontal-strips > .swiper-container").each(function() {
								
								var slider = $(this),
									slider_id = '#' + slider.attr('id'),
									columnsCount = parseInt($(".horizontal-strips").attr('data-columns'));
									columnsCount = (win_w <= 1280 && columnsCount >= 4)? 3 : columnsCount;
									columnsCount = (win_w <= 768)? 1 : columnsCount;

								$(".horizontal-strips").addClass(detect_browser());

								// Resizing articles
								$(".horizontal-strips article").each(function() {
									
									$(this).width(Math.floor((win_w_c/columnsCount) * (98/100)));
								});

								new Swiper(slider_id, {
									slidesPerView: 'auto',
									centeredSlides: false,
									speed: 450,
									spaceBetween: 0,
									initialSlide: 0,
									grabCursor: true,
									loop: true,
									keyboard: {
										enabled: true,
										onlyInViewport: true,
									},
									mousewheel: {invert: false}
								});
							});
						}
					}

				// Slideshow
					if($(".slideshow").length > 0) {

						var slideshow_speed = parseInt($(".slideshow").attr('data-ss-speed')),
							animation_speed = parseInt($(".slideshow").attr('data-an-speed'));


						// Fix for navigation arrows (Chrome & Edge)
						$(".slideshow").addClass(detect_browser());


						// Resize Containers & images
						if($(".slideshow").attr('data-height') == "browser") {
							$(".slideshow").height(win_h_c);
						}
						else {
							$(".slideshow").height(parseInt($(".slideshow").attr('data-height')));
						}


						$(".slideshow").flexslider({
						  
						    prevText: "",
						    nextText: "",
						    animation: 'fade',
						    easing: "linear",
						    slideshow: true,
						    slideshowSpeed: slideshow_speed,
						    animationSpeed: animation_speed,
						    controlNav: false,
						    directionNav: false
						});
					}

				// Slideshow Kenburns
					if($(".slideshow-kenburns").length > 0) {

						var slideshow_speed = parseInt($(".slideshow-kenburns").attr('data-ss-speed')),
							animation_speed = parseInt($(".slideshow-kenburns").attr('data-an-speed')),
							zoom_ratio = $(".slideshow-kenburns").attr('data-zoom-ratio'),
							images = [];

						$(".slideshow-kenburns .images img").each(function() {
							images.push($(this).attr('src'));
						});

						if(resize) {

	                    	$('.slideshow-kenburns #kenburns').remove();
	                    	$('.slideshow-kenburns .gallery-canvas').append('<canvas id="kenburns"><p>Your browser does not support canvas!</p></canvas>');
						}

	                    $('.slideshow-kenburns #kenburns').attr('width', win_w_c);
	                    $('.slideshow-kenburns #kenburns').attr('height', win_h_c);

						$('.slideshow-kenburns #kenburns').kenburns({
	                        images: images,
	                        frames_per_second: 30,
	                        display_time: slideshow_speed,
	                        fade_time: animation_speed,
	                        zoom: zoom_ratio
	                    });
					}

				// Background Video
					if($(".yt-bgvideo").length > 0) {

						$(".yt-bgvideo #bgndVideo").YTPlayer();

						$(".yt-bgvideo #bgndVideo").on("YTPReady",function(){

							setTimeout(function() {
								$(".yt-bgvideo #bgndVideo").YTPUnmute();
							},300);
						});
					}

				// Lightbox
					if($(".lightbox").length > 0) {

						$('.lightbox article').each( function() {
						    var img = $(this);

						    img.find('a').attr('data-width', img.find('img').prop('naturalWidth'));
						    img.find('a').attr('data-height', img.find('img').prop('naturalHeight'));

				            img.find('a').each(function() {
				                var $href   = $(this).attr('href'),
				                    $width  = $(this).attr('data-width'),
				                    $height = $(this).attr('data-height'),
				                    $title  = img.find('img').attr('alt');
				 
				                var item = {
				                    src 	: $href,
				                    w   	: $width,
				                    h   	: $height,
				                    title	: $title
				                };
				 
				                lightbox_imgs.push(item);
				            });
						});
    
						$("footer").after('<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button><button class="pswp__button pswp__button--share" title="Share"></button><button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button><button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div> </div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button><button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>');

						lightbox = $('.pswp')[0];
					}

				// Grid
					if($(".grid").length > 0) {

						$(".grid").isotope({
							layoutMode: 'masonry'
						});
					}

				// Video Players
					if($(".video-player").length > 0) {

						if($(".video-player").hasClass('vimeo')) {
							$("head").append('<script src="https://player.vimeo.com/api/player.js"></script>');
						}
						else if($(".video-player").hasClass('youtube')) {

						}
					}

				// Testimonials
					if($(".testimonials .swiper-container").length > 0) {

			    		var swiper = new Swiper('.testimonials .swiper-container', {
			    			slidesPerView: 1,
			    			speed: 650,
			    			grabCursor: true,
			    			mousewheel: false,
							keyboard: {
								enabled: false,
							},
							pagination: {
								el: '.swiper-pagination',
								clickable: true,
								renderBullet: function (index, className) {
									return '<span class="' + className + '"></span>';
								},
							},
						});
					}
		
				// Skills bars
					if($(".skills-bars").length > 0) {

						$('.skills-bars').appear();

						$(document).on('appear', '.skills-bars', function(e, $affected) {

							$(this).find('.bar').each(function(index, el) {

								var amount = $(this).attr('data-width');

								$(this).css('width', amount+'%');
							});
						});
					}
		
				// Counters
					if($(".counter").length > 0) {

						$('.counter').appear();
						$.force_appear();

						$(document).on('appear', '.counter', function(e, $affected) {

							if(!$(this).hasClass('appeared')) {

								$(this).addClass('appeared');

								var elemente = $(this).find('.number');

								elemente.countTo({
									from: 0,               // the number the element should start at
									to: parseInt(elemente.attr('data-number')),                 // the number the element should end at
									speed: 2500,           // how long it should take to count between the target numbers
									refreshInterval: 100,  // how often the element should be updated
									decimals: 0,           // the number of decimal places to show
									onUpdate: null,        // callback method for every time the element is updated
									onComplete: null       // callback method for when the element finishes updating
								});
							}
						});
					}
		
				// Accordion
					if($(".accordion").length > 0) {

						$(".accordion").each(function(index, el) {
							
							$(this).find('.tab').each(function(index, el) {
								
								$(this).find('.content').attr('data-height', $(this).find('.inner-content').totalHeight());
							});

							var active_height = $(this).find('.tab.active .inner-content').totalHeight() + 'px';

							$(this).find('.tab.active .content').transition({
								height: active_height,
								duration: 100,
								easing: 'easeOutExpo'
							});
						});
					}
		}



		// Landing Strips Slideshow
		function random_slide(num) {

			var rand = Math.floor((Math.random() * num));

			if(landing_slides_arr.length == 0 || landing_slides_arr[0] != rand) {
				landing_slides_arr[0] = rand;
				$(".landing-strips .flexslider:eq("+rand+")").flexslider("next");
			}
			else {
				random_slide(num);
			}
		}

		// Detect browser
		function detect_browser() {
			
			if (navigator.userAgent.match(/Edg/i) ){
			    return "edge";
			}
			else if (navigator.userAgent.match(/chrome/i) ){
			    return "chrome";
			}
			else if (navigator.userAgent.match(/firefox/i) ){
			    return "firefox";
			}
		}


		// Get total floating width of an element
		$.fn.totalWidth = function( ) {
			return $(this)[0].getBoundingClientRect().width;
		};


		// Get total floating height of an element
		$.fn.totalHeight = function( ) {
			return $(this)[0].getBoundingClientRect().height;
		};



});


})(jQuery);