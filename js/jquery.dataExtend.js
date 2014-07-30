/**
 *	jQuery dataExtend.
 *	jQuery required.
 *
 *	* Copyright 2014 (c) kamem
 *	* http://develo.org/
 *	* Licensed Under the MIT.
 *
 *	Date: 2014.06.21
 *
 *	I can be replaced by the data attribute Parameta of jQuery plug-in.
 *	ex) [js] $('.tab').tab({timer:1000,num1}) = [html] <ul class="tab" data-timer="1000" data-num="1">...</ul>
 *	* camelcase : isSessionStorage = is-session-storage
 *
 *	@class dataExtend
 */

(function($,global){

$.fn.dataExtend = function(pluginName) {
	$this = this;

	$this.each(function(){
		var $this = $(this);

		/**
		 *	data attributes array.
		 *
		 *	@property data
		 * @type {Array}
		 */
		var data = (function(){
			var tagAry = $this[0].outerHTML.match(/<([^(>)]+)/)[1].split(/[\s,||>]+/),
				dataAry = [];

			for(var i = 0;i < tagAry.length;i++) {
				if(tagAry[i].indexOf('data') >= 0) {
					dataAry.push(tagAry[i].replace(/"|data-/g, ''));
				};
			};

			return dataAry;
		})();

		/**
		 *	jQuery plug-in object
		 *
		 *	@property dataObj
		 * @type {Object}
		 */
		var dataObj = (function(){
			var dataObj = {};
			for(var i = 0;i < data.length;i++) {
				var dataAry = data[i].split('=');
					subscript = dataAry[0].replace(/-(.)/g, function(e){
						return e.replace('-', '').toUpperCase();
					}),
					value = dataAry[1];

				dataObj[subscript] = !isNaN(value) ? Number(value) :
					value === 'true' ? true :
					value === 'false' ? false :
					typeof window[value] === 'function' ? window[value] : value;
			};

			return dataObj;
		})();

		$this[pluginName](dataObj);
	});
};

}(jQuery,this));