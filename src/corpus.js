/* eslint-disable no-plusplus */
import { arrSum, readCSV } from "./config";

// Word corpus imports
import practiceCorpus from "./corpora/practice_block.csv";
import nchar2CorpusA from "./corpora/nchar-2_block-1.csv";
import nchar2CorpusB from "./corpora/nchar-2_block-2.csv";
import nchar4CorpusA from "./corpora/nchar-4_block-1.csv";
import nchar4CorpusB from "./corpora/nchar-4_block-2.csv";

// addAsset :: (k, Promise a) -> Promise (k, a)
const addAsset = ([name, assetPromise]) =>
  assetPromise.then((asset) => [name, asset]);

// loadAll :: {k: Promise a} -> Promise {k: a}
const loadAll = (assets) =>
  Promise.all(Object.entries(assets).map(addAsset)).then(Object.fromEntries);

const csvPromises = {
  practice: readCSV(practiceCorpus),
  n2a: readCSV(nchar2CorpusA),
  n2b: readCSV(nchar2CorpusB),
  n4a: readCSV(nchar4CorpusA),
  n4b: readCSV(nchar4CorpusB),
};

const csvAssets = await loadAll(csvPromises);

export const svgName = (letter, pseudoFont = true) => {
  if (pseudoFont) {
    return `latinSmall${letter}.svg`;
  }
  return `latinCapital${letter}.svg`;
};

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

export const nStimuli = arrSum(Object.values(corpora).map((corpus) => corpus.length));

export { corpora };
