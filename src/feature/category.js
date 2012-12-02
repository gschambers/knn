/**
 * Categorical feature definition
 *
 * @class Category
 * @param {String} key Feature name
 * @param {Number} weight Weighting to apply to the feature
 */
kNN.feature.Category = (function( global, undefined )
{
	"use strict";

	var Category;

	Category = function Category( key, weight )
	{
		kNN.feature.Feature.call(this, key);
		this.values = [];
		this.weight = weight || 1.0;
	};

	kNN.util.inherit(Category, kNN.feature.Feature);

	/**
	 * Add category value to internal enum
	 *
	 * @method checkValue
	 * @param {String} value Category label
	 * @return {Undefined}
	 */
	Category.prototype.checkValue = function addValue( value )
	{
		var hasValue,
			i;

		hasValue = false;
		i = this.values.length;

		while( i-- )
		{
			if( this.values[i] === value )
			{
				hasValue = true;
				break;
			}
		}

		if( !hasValue )
		{
			this.values.push( value );
		}
	};

	/**
	 * Calculates a weighted distance between
	 * two points for a particular dimension.
	 * 
	 * @param {Point} a
	 * @param {Point} b
	 * @return {Number}
	 */
	Category.prototype.calcDistance = function calcDistance( a, b )
	{
		return a.get( key ) === b.get( key ) ?
			0 : this.weight / this.values.length;
	};

	return Category;
})( this );