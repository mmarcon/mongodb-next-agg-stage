const brain = require('brain.js');
const { readFile } = require('fs/promises');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

async function loadTrainedModel (net, source) {
  const fileContent = await readFile(source, 'utf-8');
  const jsonModel = JSON.parse(fileContent);
  net.fromJSON(jsonModel);
}

async function loadTestSet (source) {
  const set = [];
  const fileStream = fs.createReadStream(source);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  for await (const line of rl) {
    const [first, second] = line.split(',');
    set.push(second ? [first, second] : ['$$', first]);
  }
  return set;
}

async function main () {
  const net = new brain.recurrent.LSTM();
  await loadTrainedModel(net, path.resolve(process.cwd(), argv.model));
  const testSet = await loadTestSet(path.resolve(process.cwd(), argv['test-set']));
  for (const test of testSet) {
    console.log(`${test.join(', ')} →`, net.run(test));
  }
}

main();
