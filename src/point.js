/**
 * Data point constructor
 *
 * @class Point
 * @constructor
 * @param {String} category
 * @param {Object} data
 */
kNN.Point = (function( global, undefined )
{
	"use strict";

	var Point;

	Point = function Point( category, data )
	{
		var key;

		this.category = category;
		this.values = {};

		for( key in data )
		{
			this.set(key, data[ key ]);
		}
	};

	/**
	 * Get the value associated with
	 * the specified key
	 *
	 * @method get
	 * @param {String} key
	 * @return {Mixed}
	 */
	Point.prototype.get = function get( key )
	{
		return this.values[ key ];
	};

	/**
	 * Set the dimension referenced by
	 * `key` to `value`
	 *
	 * @method set
	 * @param {String} key
	 * @param {Mixed} value
	 */
	Point.prototype.set = function set( key, value )
	{
		this.values[ key ] = value;
	};

	/**
	 * Return a list of dimension keys
	 * associated with this point
	 *
	 * @method keys
	 * @return {Array}
	 */
	Point.prototype.keys = function keys()
	{
		var k,
			keys;

		if( Object.keys )
		{
			return Object.keys( this.values );
		}

		keys = [];

		for( k in this.values )
		{
			keys.push(k);
		}

		return keys;
	};

	return Point;
})( this );