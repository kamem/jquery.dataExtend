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
		easing: 'linear',
		isRoop: false
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
			isRoop = options.isRoop,
			width = $content.width(),
			isFirstMoveFinished = false,
			isMove = true,


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
			 * @return {Object} obje:cts of the function name that matches the typeName is included.
			 */
			type = (function(){
				/**
				 * position of the content at the time of the movement.
				 *
				 * @method slideshow
				 * @param  {Number} index Number to move the tab
				 */
				function slideshow(index) {
					var half = Math.floor((contentLength - 1) / 2);
					if(isRoop) {
						isMove = false;
						var indexParentPosition = (index - contentNum)
						if(Math.abs(indexParentPosition) > half) {
							indexParentPosition = 0 < indexParentPosition ? indexParentPosition - contentLength :
								indexParentPosition + contentLength;
						}
						var isPlus = 0 < indexParentPosition ? true : false;
					}

					$content.each(function() {
						$(this).find('> *').css({zIndex:0}).each(function(j) {
							var positionIndex = (j - index),
								parentPositionIndex = (j - contentNum);

							if(isRoop) {
								if(Math.abs(positionIndex) > half) {
									positionIndex = 0 < positionIndex ? positionIndex - contentLength :
										positionIndex + contentLength;
								}

								if(Math.abs(parentPositionIndex) > half) {
									parentPositionIndex = 0 < parentPositionIndex ? parentPositionIndex - contentLength :
										parentPositionIndex + contentLength;
								}

								$(this).css({
									zIndex: 0 < parentPositionIndex && 0 > positionIndex ? (isPlus? -1 :-2) :
										0 > parentPositionIndex && 0 < positionIndex ? (isPlus ? -2 :-1) : 0
								})

								isSpeedZero = 0 < parentPositionIndex && 0 > positionIndex ? (isPlus? false : true) :
									0 > parentPositionIndex && 0 < positionIndex ? (isPlus ? true : false) : false;
							}

							var position = positionIndex * width;

							$(this).queue([]).stop().animate({
								left: position
							},
							isFirstMoveFinished ? isSpeedZero ? 0 : speed : 0,
							easing,
							function(){
								isMove = true;
							});
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
			var $this = $(this),
				index = $this.index();


			if(isMove) {
				move(index);
			}
		});

		$assistChild.click(function(){
			var className = $(this).prop('class'),
				index = className === 'prev' ? contentNum - 1 :
					className === 'next' ? contentNum + 1 : 0;
			if(isMove){
				move(index);
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