kNN.Model = (function( global, undefined )
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