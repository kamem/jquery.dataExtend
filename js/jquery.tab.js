/**
 *	jQuery tab.
 *	jQuery required.
 *
 *	* Copyright 2014 (c) kamem
 *	* http://develo.org/
 *	* Licensed Under the MIT.
 *
 *	Date: 2014.06.21
 *
 *	* timer: {Number} 1000
 *	* num: {Number} Initial position Number.
 *	* isSessionStorage: {Boolean} Save the session storage.
 *	* type: {String} type of movement. (slideshow or opacity)
 *	* speed: {Number} speed ​​at the time of the animation.
 *	* easing: {String} easing name.
 *
 *	@class tab
 */

(function($,global){
$.fn.tab = function(options) {
	options = $['extend']({
		timer: false,
		num: 0,
		isSessionStorage: false,
		type: 'normal',
		speed: 400,
		easing: 'linear'
	}, options);

	$(this).each(function(){
		var $nav =$(this),
			$navChild = $nav.find('> *'),

			contentLength = $navChild.size(),
			contentClassName = $nav.prop('class').match(/content_([^(\s||")]+)/)[1],
			$contentNav = $('.content_' + contentClassName),
			$content = $('.' + contentClassName),
			$contentChild = $content.find('> *'),
			$double = $contentNav.add($content),
			$assist = $('.' + contentClassName + '_assist'),
			$assistChild = $assist.find('> *'),

			storageName = contentClassName + 'TabNum',

			isSessionStorage = options.isSessionStorage,
			contentNum = isSessionStorage && sessionStorage[storageName] ? Number(sessionStorage[storageName]) : options.num,

			speed = options.speed,
			easing = options.easing,
			width = $content.width(),

			timerNum = options.timer,
			timer = {
				content: '',
				start: function(){
					this.content = setInterval(this.main, timerNum);
				},
				stop: function() {
					clearInterval(this.content);
				},
				main: function() {
					var index = contentNum + 1;
					move(index);
				}
			},

			typeName = options.type,

			/**
			 * returns the objects that function with the name that matches the typeName entered.
			 *
			 * @method type
			 * @return {Object} objects of the function name that matches the typeName is included.
			 */
			type = (function(){
				/**
				 * position of the content at the time of the movement.
				 *
				 * @method slideshow
				 * @param  {Number} index Number to move the tab
				 */
				function slideshow(index) {
					$content.each(function() {
						$(this).find('> *').each(function(j) {
							$(this).queue([]).stop().animate({
								left: j * width - (index * width)
							},speed,easing);
						});
					});
				}

				/**
				 * move in feed-in feed-out.
				 *
				 * @method opacity
				 */
				function opacity() {
					$content.each(function() {
						$(this).find('> *.off').queue([]).stop().animate({
								opacity: 0
						},speed)
						$(this).find('> *.on').animate({
							opacity: 1
						},speed,easing);
					});
				}

				return {
					slideshow: slideshow,
					opacity: opacity
				}
			})();

		//------------------------------
		// init
		//------------------------------
		reset();
		move(contentNum);

		if(typeof timerNum === 'number') {
			timer.start();
			$double.hover(function(){
				timer.stop();
			},function(){
				timer.start();
			});
		}

		//------------------------------
		// event
		//------------------------------
		$navChild.click(function(){
			var $this = $(this),
				index = $this.index();

			move(index);
		});

		$assistChild.click(function(){
			var className = $(this).prop('class'),
				index = className === 'prev' ? contentNum - 1 :
					className === 'next' ? contentNum + 1 : 0;

			move(index);
		});

		//------------------------------
		// function
		//------------------------------
		/**
		 *	movement of the tab.
		 *
		 *	@method reset
		 *	@param {Number} index Number to move the tab
		 */
		function move(index) {
			var index = index < 0 ? contentLength - 1 :
				index >= contentLength ? 0 : index;

			reset();
			$double.each(function(){
				$(this).find('> *').eq(index).addClass('on').removeClass('off');
			});

			if(typeName !== 'normal') {
				type[typeName](index);
			}

			contentNum = index;

			if(typeof sessionStorage !== 'undefind') {
				sessionStorage[storageName] = contentNum;
			}
		}

		/**
		 *	I want to off all on the class.
		 *
		 *	@method reset
		 */
		function reset() {
			$double.find('> *').addClass('off').removeClass('on');
		}
	});
};
}(jQuery,this));