/**
 *	jQuery extraToggleClass.
 *	jQuery required.
 *
 *	* Copyright 2014 (c) kamem
 *	* http://develo.org/
 *	* Licensed Under the MIT.
 *
 *	Date: 2014.08.1
 *
 * 	* name: {String} Toggle Class Name
 *	* isSessionStorage: {Boolean} Save the session storage.
 *
 *	@class extraToggleClass
 */

(function($,global){
$.fn.extraToggleClass = function(options) {
	var options = $.extend({
			name: 'on',
			isSessionStorage: false
		}, options),

		name = options.name,
		isSessionStorage = options.isSessionStorage,

    rangeMatch = new RegExp('content_([^(\\s||")]+)');


	$(this).each(function(){
		var $this =$(this),

			className = $this.prop('class'),
			contentClassMatch = className.match(rangeMatch),
			contentClassName = contentClassMatch ? $this.prop('class').match(rangeMatch)[1] : '',

			storageName = (contentClassName ? contentClassName: '') + 'extraToggle',
			isContent = isSessionStorage && sessionStorage[storageName] ? sessionStorage[storageName] === 'true' : false;

		if(contentClassMatch) {
			var $toggle = $('.content_' + contentClassName),
				$content = $('.' + contentClassName),
				$double = $toggle.add($content);
		}

		set();

		function set() {
			var $changeContent = typeof $double !== 'undefined' ? $double : $this;
			$changeContent[(isContent ? 'add' : 'remove') + 'Class'](name);
		}

		$this.on('click',function(){
			isContent = !isContent;

			set();

			if(typeof sessionStorage !== 'undefind') {
				sessionStorage[storageName] = isContent;
			}
		});
	});
};
}(jQuery,this));