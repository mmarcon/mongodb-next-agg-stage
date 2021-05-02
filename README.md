# MongoDB Next Aggregation Stage

Suggests the next stage of a MongoDB aggregation pipeline based on the previous two.

This is just an experiment to see how good a LSTM is at recommending an aggregation stage based on the
previous two in the pipeline.

It's mostly a toy and it's not used anywhere. It was also an opportunity to play around with [brain.js](https://github.com/BrainJS/brain.js).

In the `example-data` folder you can find some example data to train the model and some to test it.

**Disclaimer:** I know very little of neural networks and machine learning. This experiment is put together by
scrolling through tutorials and documentation as I was mostly interested in the use case and getting to something
that kind of works as quickly as possible with as little code as possible.

## Train the model

You can train the model by running:

```
$ node train.js --training-set ./example-data/training-set.txt
```

This will print out the training error every 10 iterations and the resulting model
will be stored as a JSON file in `out/trained-model.json`.

## Test the model

You can test your model with:

```
$ node test.js --model ./out/trained-model.json --test-set ./example-data/test-set.txt

$$, $match → $group
$match, $group → $project
$match, $lookup → $unwind
$group, $project → $count
$project, $group → $project
```

`$$` indicates a missing stage and it's used as a placeholder for when we are trying to
recommend the second stage of an aggregation given only the first one.
