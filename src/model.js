kNN.Model = (function( global, undefined )
{
	var Model,
		extractFeatures;

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
		var i, j,

			features,

			feature,
			point;

		i = points.length;
		features = {};

		pointLoop:
		while( i-- )
		{
			point = points[ i ];

			featureLoop:
			for( j in point.keys() )
			{
				if( !features.hasOwnProperty(j) )
				{
					switch( typeof point.get(j) )
					{
						case "number":
							feature = new kNN.feature.Numerical( j );
							break;

						case "string":
							feature = new kNN.feature.Category( j );
							break;

						default:
							continue featureLoop;
					}

					features[ j ] = feature;
				}

				features[ j ].checkValue( point.get(j) );
			}
		}

		return features;
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
		var i;

		this.points = [];

		i = data.length;

		while( i-- )
		{
			this.points.push(
				new kNN.Point( data[i][0], data[i][1] )
			);
		}

		this.features = extractFeatures( this.points );
	};

	/**
	 * Classifies a point based on the
	 * dimensions of the training data.
	 * 
	 * @param {Point} point
	 * @return {String}
	 */
	Model.prototype.classify = function classify( point )
	{
		var distance,
			last,
			nearest,
			f, i, j, p;

		i = this.points.length;
		j = this.features.length;

		last = Infinity;
		nearest = null;

		while( i-- )
		{
			p = this.points[ i ];
			distance = 0;

			for( j in this.features )
			{
				f = this.features[ j ];
				distance += Math.pow(f.calcDistance( point, p ), 2);
			}

			distance = Math.sqrt( distance );

			if( distance < last )
			{
				last = distance;
				nearest = p;
			}
		}

		return nearest.category;
	};

	return Model;
	/**
	 * Arrange a list of points by
	 * ascending distance.
	 *
	 * @param {Array} points A multi-dimensional
	 *     array containing [ point<Point>, distance<Number> ]
	 * @return {Array} Sorted array of points
	 */
	sortPoints = function sortPoints( points )
		return points.sort(function(a, b)
		{
			return a[1] < b[1] ? -1 : 1;
	};
	/**
	 * Predict the category for a point
	 * based on its K-nearest neighbors
	 * @param  {Number} K How many points to compare
	 * @param  {Point} point
	 * @param  {Array} neighbors An array of points
	 * @return {String}
	 */
	{

			bestScore,
			force,
			key,
			i, n;

		categories = {};
		i = 0;

		for( ; i < K; i++ )
		{
			n = neighbors[i];
			if( !categories.hasOwnProperty(n.category) )
				categories[ n.category ] = 0;


		{
			// choose randomly between the two

			{
				{
					force = true;
				}
			}

			if( force || categories[key] > bestScore )
			{
				bestScore = categories[key];
			}
		}

		return prediction;
	};
	/**
	 * Classifies a point based on the
	 * dimensions of the training data.
	 * @param {Number} K How many adjacent points to compare
	 * @param {Point} point
	 */
	{
		var distance,
			f, i, j, p;

		i = this.points.length;

		points = [];

		while( i-- )
			p = this.points[ i ];
			distance = 0;

			{
				f = this.features[ j ];
				distance += Math.pow(
					f.calcDistance( point, p ),
					2
				);

			distance = Math.sqrt( distance );
		}
		points = sortPoints( points );
		return predictCategory( K, point, points );
	};
})( this );