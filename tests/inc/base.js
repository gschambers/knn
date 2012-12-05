asyncTest("Training data validation", function()
{
	$.getJSON("datasets/trainA.json", function(data)
	{
		data.forEach(function(testCase, n)
		{
			var model,
				point,
				trainingData;

			trainingData = [].slice.call(data)
			trainingData.splice(n, 1);

			model = new kNN.Model(trainingData);
			point = new kNN.Point(null, testCase[1]);

			equal(model.classify(point, 5), testCase[0], "Point is classified correctly");
		});

		start();
	});
});