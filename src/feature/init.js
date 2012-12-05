/**
 * Abstract base class for model features.
 *
 * @param {String} key Feature name
 * @class Feature
 */
kNN.feature = {};
kNN.feature.Feature = (function( global, undefined )
{
	"use strict";

	var Feature;

	Feature = function Feature( key )
	{
		this.key = key;
	};

	/**
	 * This must be implemented by a subclass,
	 * or a NotImplementedError will be raised.
	 *
	 * The subclass method will calculate the
	 * distance between two points for a single
	 * dimension.
	 *
	 * @param  {Point} a
	 * @param  {Point} b
	 * @return {Undefined}
	 */
	Feature.prototype.calcDistance = function calcDistance( a, b )
	{
		throw {
			name: "NotImplementedError",
			message: "Feature#calcDistance must be implemented by a subclass"
		};
	};

	return Feature;
})( this );