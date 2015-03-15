/**
 *	jQuery tab.
 *	jQuery required.
 *
 *	* Copyright 2015 (c) kamem
 *	* http://develo.org/
 *	* Licensed Under the MIT.
 *
 *	Date: 2015.03.16
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
	var options = $['extend']({
			timer: false,
			num: 0,
			isSessionStorage: false,
			type: 'normal',
			speed: 400,
			easing: 'linear',
			isRoop: false
		}, options);

	var isSessionStorage = options.isSessionStorage;
	var speed = options.speed;
	var easing = options.easing;
	var isRoop = options.isRoop;
	var timerNum = options.timer;
	var typeName = options.type;

	$(this).each(function(){
		var $nav =$(this);
		var $navChild = $nav.find('> *');

		var contentLength = $navChild.size();
		var contentLengthHalf = Math.floor((contentLength - 1) / 2);
		var contentClassName = $nav.prop('class').match(/content_([^(\s||")]+)/)[1];

		var $contentNav = $('.content_' + contentClassName);
		var $content = $('.' + contentClassName);
		var $double = $contentNav.add($content);
		var $assist = $('.' + contentClassName + '_assist');
		var $assistChild = $assist.find('> *');

		var storageName = contentClassName + 'TabNum';
		var selectedIndex = isSessionStorage && sessionStorage[storageName] ? Number(sessionStorage[storageName]) : options.num;

		var width = $content.width();
		var isFirstMoveFinished = false;
		var isMove = true;

		var timer = {
			content: '',
			start: function(){
				this.content = setInterval(this.main, timerNum);
			},
			stop: function() {
				clearInterval(this.content);
			},
			main: function() {
				var index = selectedIndex + 1;
				move(index);
			}
		};

		/**
		 * returns the objects that function with the name that matches the typeName entered.
		 *
		 * @method type
		 * @return {Object} obje:cts of the function name that matches the typeName is included.
		 */
		var type = (function(){
			/**
			 * position of the content at the time of the movement.
			 *
			 * @method slideshow
			 * @param  {Number} index Number to move the tab
			 */
			function slideshow(index) {
				if(isRoop) {
					isMove = false;
					var AmountOfMovement = getPositionNum(index - selectedIndex);
				}

				$content.each(function() {
					$(this).find('> *').css({zIndex:0}).each(function(j) {
						var positionNum = j - index;

						if(isRoop) {
							positionNum = getPositionNum(positionNum);
							$(this).css({
								left: (positionNum + AmountOfMovement) * width
							})
						}

						var position = positionNum * width;

						$(this).queue([]).stop()
						.animate({
							left: position
						},
						isFirstMoveFinished ? speed : 0,
						easing,
						function(){
							isMove = true;
						});
					});
				});
			}

			function getPositionNum(positionNum) {
				if(Math.abs(positionNum) > contentLengthHalf) {
					if(0 < positionNum) {
						return positionNum + -contentLength;
					} else {
						return positionNum + contentLength
					}
				} else {
					return positionNum;
				}
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
		classNameReset();
		move(selectedIndex);
		isFirstMoveFinished = true;

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
			if(isMove) {
				move($(this).index());
			}
		});

		$assistChild.click(function(){
			var className = $(this).prop('class');
			if(isMove){
				if(className === 'prev') {
					move(selectedIndex - 1);
				} else if(className === 'next') {
					move(selectedIndex + 1);
				}
			}
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

			classNameReset();
			$double.each(function(){
				$(this).find('> *').eq(index).addClass('on').removeClass('off');
			});

			if(typeName !== 'normal') {
				type[typeName](index);
			}

			selectedIndex = index;

			if(typeof sessionStorage !== 'undefind') {
				sessionStorage[storageName] = selectedIndex;
			}
		}

		/**
		 *	I want to off all on the class.
		 *
		 *	@method classNameReset
		 */
		function classNameReset() {
			$double.find('> *').addClass('off').removeClass('on');
		}
	});
};
}(jQuery,this));