/**
 * Classification feature declaration
 *
 * @class Numerical
 * @param {String} key Feature name
 */
kNN.feature.Numerical = (function( global, undefined )
{
	"use strict";

	var Numerical;

	Numerical = function Numerical( key )
	{
		kNN.feature.Feature.call(this, key);
		this.minValue = Infinity;
		this.maxValue = -Infinity;
	};

	kNN.util.inherit(Numerical, kNN.feature.Feature);

	/**
	 * Compares a value against feature min
	 * and max values to determine range
	 * for normalization
	 *
	 * @method checkValue
	 * @param  {Number} value A numerical value
	 * @return {Undefined}
	 */
	Numerical.prototype.checkValue = function checkValue( value )
	{
		if( value < this.minValue )
		{
			this.minValue = value;
		}

		if( value > this.maxValue )
		{
			this.maxValue = value;
		}
	};

	/**
	 * Get delta between min and max values
	 * 
	 * @method getRange
	 * @return {Number}
	 */
	Numerical.prototype.getRange = function getRange()
	{
		return this.maxValue - this.minValue;
	};

	/**
	 * Calculates the distance between two
	 * points for a particular dimension.
	 *
	 * The distance is normalised for an
	 * output value between 0.0 and 1.0
	 * 
	 * @param {Point} a
	 * @param {Point} b
	 * @return {Number}
	 */
	Numerical.prototype.calcDistance = function calcDistance( a, b )
	{
		return (a.get( this.key ) - b.get( this.key )) / this.getRange();
	};

	return Numerical;
})( this );