const brain = require('brain.js');
const { writeFile } = require('fs/promises');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

function writeTrainedModel (net, dest) {
  const json = net.toJSON();
  return writeFile(dest, JSON.stringify(json), 'utf-8');
}

async function readTrainingData (source) {
  const data = [];
  const fileStream = fs.createReadStream(source);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  for await (const line of rl) {
    const [input, output] = line.split('|');
    const inputTokens = input.split(',');
    data.push({ input: inputTokens, output });
  }
  return data;
}

async function main () {
  const net = new brain.recurrent.LSTM();
  const trainingData = await readTrainingData(path.resolve(process.cwd(), argv['training-set']));
  net.train(trainingData, { log: true, errorThresh: 0.012, iterations: 5000 });
  await writeTrainedModel(net, path.resolve(process.cwd(), 'out', 'trained-model.json'));
}

main();
