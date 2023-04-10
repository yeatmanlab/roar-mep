/* eslint-disable no-plusplus */
import { arrSum, config, readCSV } from "./config";

// Word corpus imports
import practiceCorpus from "./corpora/practice_block.csv";
import nchar2CorpusA from "./corpora/nchar-2_block-1.csv";
import nchar2CorpusB from "./corpora/nchar-2_block-2.csv";
import nchar4CorpusA from "./corpora/nchar-4_block-1.csv";
import nchar4CorpusB from "./corpora/nchar-4_block-2.csv";

import preCuePracticeCorpus from "./corpora/precue/precue_practice_block.csv";
import preCueBlock1a from "./corpora/precue/precue_block-1a.csv";
import preCueBlock1b from "./corpora/precue/precue_block-1b.csv";
import preCueBlock2a from "./corpora/precue/precue_block-2a.csv";
import preCueBlock2b from "./corpora/precue/precue_block-2b.csv";
import preCueBlock3a from "./corpora/precue/precue_block-3a.csv";
import preCueBlock3b from "./corpora/precue/precue_block-3b.csv";
import preCueBlock4a from "./corpora/precue/precue_block-4a.csv";
import preCueBlock4b from "./corpora/precue/precue_block-4b.csv";
import preCueBlock5a from "./corpora/precue/precue_block-5a.csv";
import preCueBlock5b from "./corpora/precue/precue_block-5b.csv";

// addAsset :: (k, Promise a) -> Promise (k, a)
const addAsset = ([name, assetPromise]) =>
  assetPromise.then((asset) => [name, asset]);

// loadAll :: {k: Promise a} -> Promise {k: a}
const loadAll = (assets) =>
  Promise.all(Object.entries(assets).map(addAsset)).then(Object.fromEntries);

let csvPromises;

if (config.precue) {
  csvPromises = {
    practice: readCSV(preCuePracticeCorpus),
    b1a: readCSV(preCueBlock1a),
    b1b: readCSV(preCueBlock1b),
    b2a: readCSV(preCueBlock2a),
    b2b: readCSV(preCueBlock2b),
    b3a: readCSV(preCueBlock3a),
    b3b: readCSV(preCueBlock3b),
    b4a: readCSV(preCueBlock4a),
    b4b: readCSV(preCueBlock4b),
    b5a: readCSV(preCueBlock5a),
    b5b: readCSV(preCueBlock5b),
  };
} else {
  csvPromises = {
    practice: readCSV(practiceCorpus),
    n2a: readCSV(nchar2CorpusA),
    n2b: readCSV(nchar2CorpusB),
    n4a: readCSV(nchar4CorpusA),
    n4b: readCSV(nchar4CorpusB),
  };
}

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
      block: row.blockNum || null,
      preCueLocation: row.preCueLocation || null,
      cueToTargetInterval: row.cueTargetISI !== undefined ? row.cueTargetISI * 1000 : null,
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
