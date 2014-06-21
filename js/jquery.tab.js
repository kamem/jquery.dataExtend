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
 *	* timer : {Number} 1000
 *	* num : {Number} Initial position Number
 *	* isSessionStorage : {Object} 一をsession storageに保存する
 *	
 *	@class dataExtend
 */

(function($,global){
$.fn.tab = function(options) {
	options = $['extend']({
		timer: false,
		num: 0,
		isSessionStorage: false
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
			};
	
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
		
		/**
		 *	movement of the tab
		 *	
		 *	@method reset
		 *	@param {Number} Number to move the tab
		 */
		function move(index) {
			var index = index < 0 ? contentLength - 1 : 
				index >= contentLength ? 0 : index;
	
			reset();
			$double.each(function(){
				$(this).find('> *').eq(index).addClass('on').removeClass('off');
			});
	
			contentNum = index;
			
			sessionStorage[storageName] = contentNum;
		}
		
		/**
		 *	I want to off all on the class
		 *	
		 *	@method reset
		 */
		function reset() {
			$double.find('> *').addClass('off').removeClass('on');
		}
	});
};
}(jQuery,this));