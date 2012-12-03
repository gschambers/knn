kNN.util = (function( global, undefined )
{
	"use strict";

	var util;

	util = {

		/**
		 * Implement prototypal inheritance
		 * 
		 * @param  {Function} Child  Child class constructor
		 * @param  {Function} Parent Parent class constructor
		 * @return {Undefined}
		 */
		inherit: function inherit( Child, Parent )
		{
			Child.prototype = new Parent();
			Child.prototype.constructor = Child;
		}

	};

	return util;
})( this );