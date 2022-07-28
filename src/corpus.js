/* eslint-disable no-plusplus */
import { readCSV } from "./config";

// Word corpus imports
import practiceCorpus from "./corpora/practice_block.csv";
import nchar2Corpus from "./corpora/nchar-2_block-1.csv";
import nchar4CorpusA from "./corpora/nchar-4_block-1.csv";
import nchar4CorpusB from "./corpora/nchar-4_block-2.csv";
import nchar6CorpusA from "./corpora/nchar-6_block-1.csv";
import nchar6CorpusB from "./corpora/nchar-6_block-2.csv";

// addAsset :: (k, Promise a) -> Promise (k, a)
const addAsset = ([name, assetPromise]) =>
  assetPromise.then((asset) => [name, asset]);

// loadAll :: {k: Promise a} -> Promise {k: a}
const loadAll = (assets) =>
  Promise.all(Object.entries(assets).map(addAsset)).then(Object.fromEntries);

// function shuffle(array) {
//   const shuffledArray = [...array];
//   for (let i = shuffledArray.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

//     // swap elements array[i] and array[j]
//     // use "destructuring assignment" syntax
//     // eslint-disable-next-line no-param-reassign
//     [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
//   }
//   return shuffledArray;
// }

const csvPromises = {
  practice: readCSV(practiceCorpus),
  n2: readCSV(nchar2Corpus),
  n4a: readCSV(nchar4CorpusA),
  n4b: readCSV(nchar4CorpusB),
  n6a: readCSV(nchar6CorpusA),
  n6b: readCSV(nchar6CorpusB),
};

const csvAssets = await loadAll(csvPromises);

const transformCSV = (csvInput) => csvInput.reduce((accum, row) => {
  if (row.string !== null) {
    const newRow = {
      stimulus: row.string.slice(2, -2).toUpperCase().split(''),
      correctResponse: row.CxResp.toUpperCase(),
      block: row.block,
    };
    accum.push(newRow);
  }

  return accum;
}, []);

const corpora = {};
Object.keys(csvAssets).forEach((key) => {
  corpora[key] = transformCSV(csvAssets[key]);
});

export default corpora;
