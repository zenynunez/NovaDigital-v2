(function($) {
	"use strict";
	$('#top_section').height($(window).height());
	
	$.Isotope.prototype._getMasonryGutterColumns = function() {
		var gutter = this.options.masonry && this.options.masonry.gutterWidth || 0;
		var containerWidth = this.element.width();
		 
		this.masonry.columnWidth = this.options.masonry && this.options.masonry.columnWidth ||
		// Or use the size of the first item
		this.$filteredAtoms.outerWidth(true) ||
		// If there's no items, use size of container
		containerWidth;
		 
		this.masonry.columnWidth += gutter;
		this.masonry.cols = Math.floor((containerWidth + gutter) / this.masonry.columnWidth);
		this.masonry.cols = Math.max(this.masonry.cols, 1);
	};
	
	$.Isotope.prototype._masonryReset = function() {
		// Layout-specific props
		this.masonry = {};
		// FIXME shouldn't have to call this again
		this._getMasonryGutterColumns();
		var i = this.masonry.cols;
		this.masonry.colYs = [];
		while (i--) {
		this.masonry.colYs.push(0);
		}
	};
	 
	$.Isotope.prototype._masonryResizeChanged = function() {
		var prevSegments = this.masonry.cols;
		// Update cols/rows
		this._getMasonryGutterColumns();
		// Return if updated cols/rows is not equal to previous
		return (this.masonry.cols !== prevSegments);
	};
	
	// modified Isotope methods for gutters in fitRows
	Number.prototype.roundTo = function(num) {
		var resto = this%num;
		if (resto <= (num/2)) { 
			return this-resto;
		} else {
			return this+num-resto;
		}
	}
	
	$.Isotope.prototype._fitRowsLayout = function($elems) {
		var instance = this,
			containerWidth = this.element.width(),
			props = this.fitRows;

		var gutter = this.options.fitRows && this.options.fitRows.gutterWidth || 0;
		var columnWidth = this.options.fitRows && this.options.fitRows.columnWidth ||
					  // or use the size of the first item
					  this.$filteredAtoms.outerWidth(true) ||
					  // if there's no items, use size of container
					  containerWidth;
		  $elems.each( function() {
			var $this = $(this),
				atomW = $this.outerWidth(true),
				atomH = $this.outerHeight(true);


		if(props.x !== 0 && props.x + atomW + gutter <= containerWidth){
			props.x = props.x.roundTo(columnWidth + gutter);
		}

			if ( props.x !== 0 && atomW + props.x > containerWidth ) {
			  // if this element cannot fit in the current row
			  props.x = 0;
			  props.y = props.height;
			}

			// position the atom
			instance._pushPosition( $this, props.x, props.y );

			props.height = Math.max( props.y + atomH, props.height );
			props.x += atomW;

		});

	};
	
	//-----------------------------------------
	// Parallax Background
	//-----------------------------------------
	
	function setFixedNavigation(){
		if($(document).width()>768){
			if( $(document).scrollTop() > $('.top-navigation').position().top){
				$(".top-navigation-inner").css({position:'fixed', width:'100%'});
				$(".top-navigation").css({position:'static'});
			}else if($(document).scrollTop() < $('.top-navigation').position().top){
				$(".top-navigation-inner").css({position:'static', width:'auto'});
				$(".top-navigation").css({position:'relative'});
			}
		}else{
			$(".top-navigation-inner").css({position:'static', width:'auto'});
			$(".top-navigation").css({position:'relative'});
		}
	}
	
	$('.colorbg').each(function(){
		if($(this).data('bgcolor')){
			$(this).css('background-color', $(this).data('bgcolor'));
		}
	});
	
	$('.vspace').each(function(){
		if($(this).data('vspace'))
			$(this).css('height', $(this).data('vspace'));
	});
	
	$('article.post table').addClass('table');
	
	//-----------------------------------------
	// Rainy Day
	//-----------------------------------------
	$(window).load(function(){
		$('.rainy-background').each(function(){
			var $this = $(this);
			var image = $this.get(0);
			image.onload = function() {
				var engine = new RainyDay({
					image: image,
					parentElement:$this.parent().get(0),
					blur: 20,
					opacity: 1,
					fps: 24
				});
				engine.gravity = engine.GRAVITY_NON_LINEAR;
				engine.trail = engine.TRAIL_SMUDGE;
				engine.rain([
					[6, 6, 0.1],
					[2, 2, 0.1]
				], 50);
			};
			image.crossOrigin = 'anonymous';
			image.src = $this.data('src');
		});
		$(window).resize(function(){
			$('.rainy-background').each(function(){
				$(this).parent().find('canvas').css({width: $(this).width(), height:$(this).height()});
			});
		});
		
		
		$('.parallax-background, .normal-background').each(function(){
			if($(this).data('background')){
				$(this).css('background-image', 'url('+$(this).data('background')+')');
				
				if( $(this).hasClass('parallax-background') ){
					var parallaxspeed = 0.4
					if( $(this).data('parallaxspeed'))
						parallaxspeed = $(this).data('parallaxspeed');
					if(! (navigator.userAgent.match(/iPhone/i) || 
						navigator.userAgent.match(/iPad/i) ||
						navigator.userAgent.match(/iPod/i)
						) )
					{
						$(this).parallax('50%', parallaxspeed, null, true);
					}else{
						$(this).css('background-attachment', 'scroll');
						$(this).css('background-size', 'cover');
						$(this).css('background-position', 'center');
					}
				}
			}
		});
	});
	
	setFixedNavigation();
	
	// ----------------------------------
	// Menu Animation
	// ----------------------------------
	
	$('.top-navigation .menu-top li').hover(function(){
		var topval = 10;
		if($(this).parent().hasClass('menu-top')) topval = 50;
		$(this).find('> ul').css({display:'block'}).stop().animate({opacity:1, top:topval}, {duration:600, queue:false, easing:'easeOutQuart', complete:function(){} });
	}, function(){
		var topval = 20;
		if($(this).parent().hasClass('menu-top')) topval = 60;
		$(this).find('> ul').stop(0).animate({opacity:0, top:topval}, {duration:600, queue:false, easing:'easeOutQuart', complete:function(){
			$(this).css({display:'none'});
		} });
	});
	
	// ----------------------------------
	// Isotope Portfolio 
	// ----------------------------------
	
	$(".isotope-container .thumbnail-portfolio").css('opacity', '0');

	function setportfolio() {
		if($(".isotope-container").hasClass('isotope')){
			$(".isotope-container").isotope('reLayout');
		}
	}
	
	function setFlexSlider(target){
		 $(target +" .slider_flexslider").map(function() {
			var $this = $(this);
			$(this).flexslider({
				animation: "fade",
				controlNav: false,
				animationLoop: false,
				slideshow: false,
				smoothHeight: true,
				directionNav: false,
				sync: ".carousel_flexslider"
			});
			
			$(this).parent().find('.carousel_flexslider').flexslider({
				animation: "slide",
				controlNav: false,
				animationLoop: false,
				slideshow: false,
				itemWidth: 85,
				itemMargin: 5,
				directionNav: false,
				asNavFor: '.slider_flexslider'
			});
			setTimeout(function(){
				$this.parent().find('.carousel_flexslider').animate({opacity:1}, 1000);
			}, 1000);
		});
	}
	
	
	$(window).load(function(){
	
		setFlexSlider('body');
		$('body').fitVids();
		
		$('.body-loading').delay(1000).animate({opacity:0}, {duration:1000, easing:'easeOutQuart', complete:function(){
			$(this).remove();
		}});
		
		setTimeout(function(){
			if($(location.href.split("#")[1])) {
				var anchor = $('#'+location.href.split("#")[1]);
				if (anchor.length>0)
					$('html,body').animate({scrollTop: anchor.offset().top - 80}, 500);
			}
		}, 500);
		
		
		$(".isotope-container").imagesLoaded(function(){
			$(".isotope-container").isotope({
				layoutMode: "perfectMasonry",
				perfectMasonry: {
					liquid: true
				},
				itemSelector: '.thumbnail-portfolio',
			},function(){
				setTimeout(function(){
					setportfolio();
					$(".isotope-container .thumbnail-portfolio").animate({opacity:1}, 300);
				}, 500);
			});
		});
	});
	
	if(! (navigator.userAgent.match(/iPhone/i) || 
		navigator.userAgent.match(/iPad/i) ||
		navigator.userAgent.match(/iPod/i)
		) )
		new WOW().init();

    $(document).ready(function() {		

        //-----------------------------------------
        // Owl Header
        //-----------------------------------------

        $(".Owl-Slider").owlCarousel({
            navigation: false, // Show next and prev buttons
            slideSpeed: 600,
            paginationSpeed: 600,
            singleItem: true,
            autoPlay: 6000,
            pagination: true
        });

        //-----------------------------------------
        // Owl For About
        //-----------------------------------------

        $(".Owl-Slider-about").owlCarousel({
            navigation: false, // Show next and prev buttons
            slideSpeed: 600,
            paginationSpeed: 600,
            singleItem: true,
            pagination: true
        });

        //-----------------------------------------
        // Owl None Pagination
        //-----------------------------------------

        $(".Owl-Slider-Sub-None").map(function() {
            $(this).owlCarousel({
                navigation: false, // Show next and prev buttons
                slideSpeed: 600,
                paginationSpeed: 600,
                singleItem: true,
                pagination: false,
                autoHeight: true,
                autoPlay: 4000,
                stopOnHover: true,
                afterInit: function(slide) {

                }

            });
            $(this).delegate(".fa-angle-right", "click", function() {
                owl.next();
            });
            $(this).delegate(".fa-angle-left", "click", function() {
                owl.prev();
            });
            var owl = $(this).data('owlCarousel');
        });
   

        //-----------------------------------------
        // Owl Slider using Sub
        //-----------------------------------------

        $(".Owl-Slider-Sub").owlCarousel({
            navigation: false, // Show next and prev buttons
            slideSpeed: 600,
            paginationSpeed: 600,
            singleItem: true,
            pagination: true,
            autoHeight: true,
            autoPlay: 4000,
            stopOnHover: true
        });

        //-----------------------------------------
        // Owl For Page Postype Blog
        //-----------------------------------------

        $(".Owl-Slider-Blog").owlCarousel({
            navigation: false, // Show next and prev buttons
            slideSpeed: 600,
            paginationSpeed: 600,
            singleItem: true,
            pagination: true,
            autoHeight: true,
            autoPlay: 4000,
            stopOnHover: true
        });

        //-----------------------------------------
        // Responsive Lightbox
        //-----------------------------------------
	
		$('.lightbox').magnificPopup({
			delegate: 'a',
			type: 'image',
			tLoading: 'Loading image #%curr%...',
			mainClass: 'mfp-img-mobile',
			gallery: {
				enabled: true,
				navigateByImgClick: true,
				preload: [0,1] // Will preload 0 - before current, and 1 after the current image
			},
			image: {
				tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
				titleSrc: function(item) {
					return item.el.attr('title');
				}
			}
		});
		
		$('a img[class*="wp-image"]').not('.nomodal').each(function(){
			if(!$(this).parent().parent().hasClass('lightbox')){
				$(this).parent().magnificPopup({
					type: 'image',
					closeOnContentClick: true,
					image: {
						verticalFit: false
					}
				});
			}
		});
		


		//-----------------------------------------
        // Slide Up Top Header
        //-----------------------------------------

        $(".close-contact").delegate(".fa-angle-double-up", "click", function() {
            $("html,body").animate({scrollTop: 0}, 1000);
        });
		
		//-----------------------------------------
        // Google Map
        //-----------------------------------------
		
		$('.gmap').each(function(){
			if($(this).data('width')!='')
				$(this).css('width', $(this).data('width'));
			if($(this).data('height')!='')
				$(this).css('height', $(this).data('height'));
				
			var infoBoxMessage='';
			if($(this).find('> span').length==1){
				infoBoxMessage = $(this).find('> span').html();
			}
			var latlng = new google.maps.LatLng($(this).data('lat'), $(this).data('lng'));
			var controls = ($.trim($(this).data('controls'))=='true')?false:true;
			var myOptions = { "zoom": $(this).data('zoom'), "disableDefaultUI":controls , "mapTypeId":$(this).data('maptype')};
			myOptions.center = latlng;
			var mapObjName = new google.maps.Map($(this)[0], myOptions);
			var markerName = new google.maps.Marker({
				map: mapObjName, 
				position: mapObjName.getCenter()
			});
			if(infoBoxMessage!=''){
				var infowindowName = new google.maps.InfoWindow();
				infowindowName.setContent(infoBoxMessage);
				google.maps.event.addListener(markerName, 'click', function() {
					infowindowName.open(mapObjName,  markerName);
				});
			}
		});
		
		
		//----------------------------------------
		// Bootstrap Elemens
		//----------------------------------------
		$('a[data-toggle="tooltip"]').tooltip();
		$('a[data-toggle="popover"]').popover();
		
		$('a[data-toggle="tooltipfooter"]').tooltip();
		$('a[data-toggle="tooltipfooter"]').on('hover', function () {
			$('.tooltip').css({marginTop:'-10px'});
		})
		
		$('#contentBox a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
			e.target 
			e.relatedTarget
		});	
		
		$('.accordition-toggle').on('shown.bs.collapse', function (e) {
			$(this).find('.panel-collapse.in').parents('.panel').addClass('active');
		}).on('hidden.bs.collapse', function (e) {
			$(this).find('.panel-collapse').not('.in').parents('.panel').removeClass('active');
		})
		
		$('.accordition-toggle .tab-toggle').click(function(){
			$(this).parents('.panel').find('a[data-toggle="collapse"]').trigger('click');
		});

       
		//-----------------------------------------
        // Navigation Smooth Scrolling
        //-----------------------------------------
		$(".top-navigation-inner").onePageNav({
			currentClass: 'current',
			scrollOffset: 80
		});
		
		$('a[href*=#]:not([href=#])').not('.jsaction').click(function() {
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
				if (target.length) {
					$('html,body').animate({scrollTop: target.offset().top-80}, {duration:1200, queue:false, easing:'easeOutCirc'} );
					return false;
				}
			}
		});
       

        //-----------------------------------------
        // Chart Check Waypoint
        //-----------------------------------------

        $('.chart').waypoint(function(direction) {
		
			var bgcolor = '#ffffff';
			if($(this).data('bgcolor')) bgcolor = $(this).data('bgcolor');

            $(this).easyPieChart({
                size: '200',
                scaleColor: false,
                lineWidth: 20,
                animate: 2000,
                trackColor: bgcolor,
                barColor: $(this).data('color'),
                easing: 'easeOut',
                onStep: function(from, to, percent) {
                    $(this.el).find('.percent').text(Math.round(percent));
                }
            });
        }, {offset: 1000});
		
        $(".Logo-home, .control-sound, .control-down").hide();
        setTimeout(function() {
            if ($('.tp-banner').hasClass('tp-banner')) {
                $(".Logo-home").css({'top': $('.tp-banner li').find("div.start.tp-caption").offset().top - $(".Logo-home").height() - 50}).fadeIn();
                $(".control-down").css({'top': $(".tp-bullets").offset().top - $(".control-down").height() - 50}).fadeIn();
            }
			
			$(".control-sound").css({'top': $(".control-sound").parents('section').height() - $(".control-sound").height() - 150}).fadeIn();
        }, 3000);
		

       
		$('.paralax-revslider .tp-bgimg').each(function(key, data) {
			if(! (navigator.userAgent.match(/iPhone/i) || 
				navigator.userAgent.match(/iPad/i) ||
				navigator.userAgent.match(/iPod/i)
				) ){
				$(data).parallax("50%", 0.2);
				 setTimeout(function() {
					$(data).css({'background-attachment': 'fixed', 'background-size': 'cover'});
				}, 1000);
			}
		});
           
        

        //-----------------------------------------
        // Owl slider Header For Page Video and Pattern
        //-----------------------------------------

        $(".Owl-Slider .item").height($(window).height() + 50);
        $(".Owl-Slider .item").each(function(key, data) {

            $(".content-video").css({
                'z-index': 3,
                'top': '50%',
                'left': '50%',
                'margin-top': -$(data).find(".content-video").height() / 2 - 15,
                'margin-left': -$(data).find(".content-video").width() / 2 - 15
            });
        });

        //-----------------------------------------
        // Add Parallax
        //-----------------------------------------

        if ($(document).find(".video-parallax").hasClass('video-parallax')) {
            $(".Owl-Slider .item").height($(window).height() + 50);
            $(".Owl-Slider .item").each(function(key, data) {

                $(".content-video").css({
                    'z-index': 3,
                    'top': '50%',
                    'left': '50%',
                    'margin-top': -$(data).find(".content-video").height() / 2 - 15,
                    'margin-left': -$(data).find(".content-video").width() / 2 - 15
                });
            });
        }


        //-----------------------------------------
        // Navigation And Fixed Bug Video Page
        //-----------------------------------------
		
		setFixedNavigation();
        $(document).scroll(function() {
			setFixedNavigation();
        });
		
		

        //-----------------------------------------
        // Add Flickr
        //-----------------------------------------
         $('.widget-flickr-images').each(function() {
            var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
			var $this = $(this);
            $.getJSON(flickerAPI, {
                id:$this.data('userid'),
                format: "json"
            }).done(function(data) {
                $.each(data.items, function(i, item) {
                    $("<img>").attr({
						src:item.media.m,
						alt:item.title,
						}).appendTo($this.find('.row')).wrap('<a href="'+item.link+'" target="_blank"></a>');
                    if (i === parseInt($this.data('limit'))-1) {
                        return false;
                    }
                });
            });
        });
		
		
		$('.thumbnail-portfolio .fa-heart').click(function(event){
			event.preventDefault();
			event.stopImmediatePropagation();
		
			var $this = $(this);
			
			// Retrieve post ID from data attribute
			var post_id = $this.data("post-id");
			
			// We have added below code as an example. You should according your server side script.
			// $.ajax({
				// type: "post",
				// url: 'like.php',
				// data: "post_id="+post_id,
				// success: function(count){
					// if(count != "already")
					// {
						// $this.parents('.thumbnail-portfolio').find('.voteCount').text(count);
						// $this.parents('.thumbnail-portfolio').find('.fa-heart').addClass('votedIcon');
					// }
				// }
			// });
			
			return false;
		});
		
		
		//-----------------------------------------
        // WP Default Gallery
        //-----------------------------------------
	
		function calculateWPGalleryColWidth($container){
			var colcount =  $container.data('col-count');
			if( $container.width()<=720){
				colcount = (colcount>=4)?3:colcount;
			}
			if( $container.width()<=650){
				colcount = (colcount>=3)?2:colcount;
			}
			if( $container.width()<=360){
				colcount = (colcount>=2)?1:colcount;
			}
			var colWidth = Math.floor(( $container.width()-((colcount-1)*15))/colcount);
			$container.find('.rb-wp-gallery-item-container').width(colWidth);
			return colWidth;
		}
		$(".rb-wp-gallery").each(function(){
			var $container = $(this);
			$container.imagesLoaded(function(){
				$container.isotope({
					masonry: { 
						columnWidth: calculateWPGalleryColWidth($container),
						gutterWidth: 15,
					},
					itemSelector: '.rb-wp-gallery-item-container',
				},function(){
					$container.find('.rb-wp-gallery-item-container').magnificPopup({
						delegate: 'a',
						type: 'image',
						tLoading: 'Loading image #%curr%...',
						mainClass: 'mfp-img-mobile',
						gallery: {
							enabled: true,
							navigateByImgClick: true,
							preload: [0,1] // Will preload 0 - before current, and 1 after the current image
						},
						image: {
							tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
							titleSrc: function(item) {
								return item.el.data('title');
							}
						}
					});
				});
			});
		});

        //-----------------------------------------
        // Portfolio
        //-----------------------------------------

        $('.isotope-navigation .pagination a').click(function() {
            var selector = $(this).attr('data-filter');
            $(".isotope-container").isotope({filter: selector});
            $('.isotope-navigation .pagination a').removeClass("active");
            $(this).addClass("active");
            return false;
        });

		
		$(".thumbnail-portfolio").delegate('.opento', 'click', function(event) {
			event.stopImmediatePropagation();
			event.preventDefault();
			var $this = $(this);
			$("html,body").animate({scrollTop: $(".window-portfolio").offset().top -270 }, 500);
			$(".window-portfolio").stop().slideUp('slow', function(){
				$.ajax({
					type: "get",
					url: $this.attr('href'),
					success: function(data){
						var $htmlContent = $("<div/>").html(data);
						$(".window-portfolio").html($htmlContent.find('.portfolio-item').html());
						$(".window-portfolio").imagesLoaded(function(){
							$('.window-portfolio').fitVids();
							if($('.window-portfolio .slider_flexslider').length>0){
								setTimeout( function(){
									setFlexSlider('.window-portfolio');
								}, 500 );
							}
							$(".window-portfolio").stop().slideDown('slow');
						});
						
						$(".window-portfolio .detail-portfolio").delegate('i.close', 'click', function() {
							$(".window-portfolio").slideUp('slow');
						});
					}
				});
			});
		});

        //-----------------------------------------
        // Set Height Contact
        //-----------------------------------------

        $(".box-contact").map(function() {
            $(this).css({'min-height': $(".img-background img").height()});
        });

        //-----------------------------------------
        // Window Resize
        //-----------------------------------------

        $(window).bind('resize', function() {
            setportfolio();
            $(".box-contact").css({'min-height': $(".img-background img").height()});
        });

        //-----------------------------------------
        // YTPlayer JS
        //-----------------------------------------
		$(".player").mb_YTPlayer();
		
		
		//-----------------------------------------
        // Search Form
        //-----------------------------------------
		
		$('.form-search form').submit(function(event){
			if($.trim( $(this).find('.searchbox').val() ).length<1){
				event.preventDefault();
				return false;
			}
		});
		$('.form-search button').click(function(event){
			event.preventDefault();
			$(this).parents('form').submit();
		});


        //-----------------------------------------
        // Control Sound Video YTPlayer
        //-----------------------------------------

        $(".control-sound").find("img").click(function() {
            if ($(".control-sound").find("img").hasClass("mute")) {
                $('#bgndVideo').unmuteYTPVolume();
                $(".control-sound").find("img").attr("src", 'images/playing.png');
                $(".control-sound").find("img").removeClass('mute');
                $(".control-sound").find("img").addClass('unmute');
            } else {
                $('#bgndVideo').muteYTPVolume();
                $(".control-sound").find("img").attr("src", 'images/mute.png');
                $(".control-sound").find("img").removeClass('unmute');
                $(".control-sound").find("img").addClass('mute');
            }
        });


        //-----------------------------------------
        // Add Pattern Height For HomePage
        //-----------------------------------------
        if ($(".landinghome").hasClass("landinghome")) {
            $(".landinghome").height($(document).height());
        }

        //-----------------------------------------
        // jsplayer
        //-----------------------------------------
		$("#jquery_jplayer_1").jPlayer({
			ready: function () {
			 $(this).jPlayer("setMedia", {
				mp3:$("#jquery_jplayer_1").data('mp3')
			  }).jPlayer("play");
			},
			swfPath: "/js",
			supplied: "mp3"
		});
		
		//-----------------------------------------
		// Add Twitter Feeds
		//-----------------------------------------
		$('.rb-twitter-feed').each(function(){
			var params = '';
			var $this = $(this);
			params = 'limit='+$(this).data('limit');
			$.post('twitter-widget/twitter.php', params, function(data){
				$this.html(data);
				
				$this.owlCarousel({
					navigation: false, // Show next and prev buttons
					slideSpeed: 600,
					paginationSpeed: 600,
					singleItem: true,
					pagination: true,
					autoHeight: true,
					autoPlay: 4000,
					stopOnHover: true
				});
				
			});
		});
		
		//-----------------------------------------
		// Add Widget Twitter Feeds
		//-----------------------------------------
		$('.twitter-box').each(function(){
			var params = '';
			var $this = $(this);
			params = '&limit='+$(this).data('limit');
			$.post('twitter-widget/twitter2.php', params, function(data){
				$this.find('ul').html(data);	
			});
		});
  
        //-----------------------------------------
        // check contact form
        //-----------------------------------------
       $(".form-contact").submit(function(e) {
			e.preventDefault();
            var thisForm = $(".form-contact");
            var check = false;
            if (thisForm.find('.name').val() === "") {
                thisForm.find('.name').addClass("error");
                thisForm.find('.name').focus();
                thisForm.find('.name').attr("placeholder", "Empty Name.");
                check = true;
            } else {
                if (thisForm.find('.name').hasClass('error')) {
                    thisForm.find('.name').removeClass("error");
                    thisForm.find('.name').attr("placeholder", "Name");
                }
            }
			
            if (thisForm.find('.email').val() === "") {
                thisForm.find('.email').addClass("error");
                thisForm.find('.email').focus();
                thisForm.find('.email').attr("placeholder", "Empty Email.");
                check = true;
            } else {

                if (isValidEmailAddress(thisForm.find('.email').val()) === false) {
                    thisForm.find('.email').addClass("error");
                    thisForm.find('.email').focus();
                    thisForm.find('.email').val("");
                    thisForm.find('.email').attr("placeholder", "Correct Email.");
                    check = true;
                } else {
                    if (thisForm.find('.email').hasClass('error')) {
                        thisForm.find('.email').removeClass("error");
                        thisForm.find('.email').attr("placeholder", "Email");
                    }
                }

            }

            if (thisForm.find('.phone').val() === "") {
                thisForm.find('.phone').addClass("error");
                thisForm.find('.phone').focus();
                thisForm.find('.phone').attr("placeholder", "Empty Phone.");
                check = true;
            } else {
                if (thisForm.find('.phone').hasClass('error')) {
                    thisForm.find('.phone').removeClass("error");
                    thisForm.find('.phone').attr("placeholder", "Phone");
                }
            }
			
            if (thisForm.find('.website').val() === "") {
                thisForm.find('.website').addClass("error");
                thisForm.find('.website').focus();
                thisForm.find('.website').attr("placeholder", "Empty Website.");
                check = true;
            } else {
                if (thisForm.find('.website').hasClass('error')) {
                    thisForm.find('.website').removeClass("error");
                    thisForm.find('.website').attr("placeholder", "Website");
                }
            }
			
            if (thisForm.find('.message-contact').val() === "") {
                thisForm.find('.message-contact').addClass("error");
                thisForm.find('.message-contact').focus();
                thisForm.find('.message-contact').attr("placeholder", "Empty Message.");
                check = true;
            } else {
                if (thisForm.find('.message').hasClass('error')) {
                    thisForm.find('.message').removeClass("error");
                    thisForm.find('.message').attr("placeholder", "Message");
                }
            }

            if (check === true) {
                return false;
            } else {
				thisForm.fadeOut(function(){
				  thisForm.parent().find('.loading').fadeIn(function(){
					$.ajax({
					  type: 'POST',
					  url: 'form-sender.php',
					  data: thisForm.serialize(),
					  success: function(data){
						data = $.parseJSON(data);
						if(data.status=='OK'){
							thisForm.parent().find(".loading").fadeOut(function(){
								thisForm.parent().find(".success").text(data.message).fadeIn();
							});
						}else{
							thisForm.parent().find(".loading").fadeOut(function(){
								thisForm.parent().find(".success").text(data.error).fadeIn();
							});
						}
						
						setTimeout(function(){
							thisForm.parent().find('.success').fadeOut(function(){
								thisForm.fadeIn();
							});
						}, 2000);
					  }
					});
				  });
				});
            }
			
			return false;
        });

        function isValidEmailAddress(emailAddress) {
            var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
            return pattern.test(emailAddress);
        }
		
    });

})(jQuery);

