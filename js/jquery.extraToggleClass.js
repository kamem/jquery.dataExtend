/**
 *	jQuery extraToggleClass.
 *	jQuery required.
 *
 *	* Copyright 2015 (c) kamem
 *	* http://develo.org/
 *	* Licensed Under the MIT.
 *
 *	Date: 2015.03.16
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
		}, options);

	var name = options.name;
	var isSessionStorage = options.isSessionStorage;
	var rangeMatch = new RegExp('content_([^(\\s||")]+)');

	$(this).each(function(){
		var $this =$(this);

		var className = $this.prop('class');
		var contentClassMatch = className.match(rangeMatch);
		var contentClassName = contentClassMatch ? $this.prop('class').match(rangeMatch)[1] : '';

		var storageName = (contentClassName ? contentClassName: '') + 'extraToggle';
		var isContent = isSessionStorage && sessionStorage[storageName] ? sessionStorage[storageName] === 'true' : false;

		if(contentClassMatch) {
			var $toggle = $('.content_' + contentClassName);
			var $content = $('.' + contentClassName);
			var $double = $toggle.add($content);
		}

		setClassName();

		function setClassName() {
			var $changeContent = typeof $double !== 'undefined' ? $double : $this;
			$changeContent[(isContent ? 'add' : 'remove') + 'Class'](name);
		}

		$this.on('click',function(){
			isContent = !isContent;

			setClassName();

			if(typeof sessionStorage !== 'undefind') {
				sessionStorage[storageName] = isContent;
			}
		});
	});
};
}(jQuery,this));