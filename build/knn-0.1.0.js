/**
 * Library implementing nearest neighbour
 * classification/regression.
 * 
 * @module kNN
 */
var kNN = this.kNN || {};kNN.util = (function( global, undefined )
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
})( this );/**
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
})( this );/**
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
})( this );/**
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
})( this );/**
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
})( this );kNN.Model = (function( global, undefined )
{
	"use strict";

	var Model,

		extractFeatures,
		predictCategory,
		sortPoints;

	/**
	 * Extract feature definitions from
	 * training dataset.
	 *
	 * @method extractFeatures
	 * @private
	 * @param {Array} points Point objects
	 * @return {Object}
	 */
	extractFeatures = function extractFeatures( points )
	{
		var features;
		features = {};

		points.forEach(function( point )
		{
			point.keys().forEach(function( key )
			{
				var feature;

				if( !features.hasOwnProperty(key) )
				{
					switch( typeof point.get(key) )
					{
						case "number":
							feature = new kNN.feature.Numerical( key );
							break;

						case "string":
							feature = new kNN.feature.Category( key );
							break;

						default:
							return;
					}

					features[ key ] = feature;
				}

				features[ key ].checkValue( point.get(key) );
			});
		});

		return features;
	};

	/**
	 * Arrange a list of points by
	 * ascending distance.
	 *
	 * @param {Array} points A multi-dimensional
	 *     array containing [ point<Point>, distance<Number> ]
	 * @return {Array} Sorted array of points
	 */
	sortPoints = function sortPoints( points )
	{
		return points.sort(function(a, b)
		{
			return a[1] < b[1] ? -1 : 1;
		});
	};

	/**
	 * Predict the category for a point
	 * based on its K-nearest neighbors
	 *
	 * @param  {Number} K How many points to compare
	 * @param  {Point} point
	 * @param  {Array} neighbors An array of points
	 * @return {String}
	 */
	predictCategory = function predictCategory( K, point, neighbors )
	{
		var categories,

			prediction,
			bestScore,

			force,
			key,
			i, n;

		categories = {};
		bestScore = 0;
		i = 0;

		for( ; i < K; i++ )
		{
			n = neighbors[i][0];

			if( !categories.hasOwnProperty(n.category) )
			{
				categories[ n.category ] = 0;
			}

			categories[ n.category ] += 1;
		}

		for( key in categories )
		{
			// If two categories score equally,
			// choose randomly between the two

			if( categories[key] === bestScore )
			{
				if( 1 & Math.random() * 100 >> 0 )
				{
					force = true;
				}
			}

			if( force || categories[key] > bestScore )
			{
				prediction = key;
				bestScore = categories[key];
				force = false;
			}
		}

		return prediction;
	};

	/**
	 * Classification model implementing
	 * kNN on arbitrary training data.
	 *
	 * @param {Object} data Training data
	 * @constructor
	 */
	Model = function Model( data )
	{
		var self;
		self = this;

		this.points = [];

		data.forEach(function( item )
		{
			self.points.push(
				new kNN.Point( item[0], item[1] )
			);
		});

		this.features = extractFeatures( this.points );
	};

	/**
	 * Classifies a point based on the
	 * dimensions of the training data.
	 *
	 * @param {Point} point
	 * @param {Number} K Number of points to compare
	 * @return {String}
	 */
	Model.prototype.classify = function classify( point, K )
	{
		var distance,
			points,
			self;

		self = this;
		points = [];

		this.points.forEach(function( p )
		{
			var key;

			distance = 0;

			for( key in self.features )
			{
				distance += Math.pow(
					self.features[ key ].calcDistance( point, p ),
					2
				);
			}

			distance = Math.sqrt( distance );
			points.push( [p, distance] );
		});

		points = sortPoints( points );
		return predictCategory( K, point, points );
	};

	return Model;
})( this );