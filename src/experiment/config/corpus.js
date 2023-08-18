/* eslint-disable no-plusplus */
import store from "store2";
// Word corpus imports
import practiceCorpus from "../corpora/practice_block.csv";
import nchar2CorpusA from "../corpora/nchar-2_block-1.csv";
import nchar2CorpusB from "../corpora/nchar-2_block-2.csv";
import nchar4CorpusA from "../corpora/nchar-4_block-1.csv";
import nchar4CorpusB from "../corpora/nchar-4_block-2.csv";

import precuePracticeCorpus from "../corpora/precue/precue_practice_block.csv";
import precueBlock1a from "../corpora/precue/precue_block-1a.csv";
import precueBlock1b from "../corpora/precue/precue_block-1b.csv";
import precueBlock2a from "../corpora/precue/precue_block-2a.csv";
import precueBlock2b from "../corpora/precue/precue_block-2b.csv";
import precueBlock3a from "../corpora/precue/precue_block-3a.csv";
import precueBlock3b from "../corpora/precue/precue_block-3b.csv";
import precueBlock4a from "../corpora/precue/precue_block-4a.csv";
import precueBlock4b from "../corpora/precue/precue_block-4b.csv";
import precueBlock5a from "../corpora/precue/precue_block-5a.csv";
import precueBlock5b from "../corpora/precue/precue_block-5b.csv";

// // addAsset :: (k, Promise a) -> Promise (k, a)
// const addAsset = ([name, assetPromise]) =>
//   assetPromise.then((asset) => [name, asset]);

// // loadAll :: {k: Promise a} -> Promise {k: a}
// const loadAll = (assets) =>
//   Promise.all(Object.entries(assets).map(addAsset)).then(Object.fromEntries);

let csvAssets;

const arrSum = (arr) => arr.reduce((a, b) => a + b, 0);
const config = () => (store.session.get("config"));

if (config.precue) {
  csvAssets = {
    practice: precuePracticeCorpus,
    b1a: precueBlock1a,
    b1b: precueBlock1b,
    b2a: precueBlock2a,
    b2b: precueBlock2b,
    b3a: precueBlock3a,
    b3b: precueBlock3b,
    b4a: precueBlock4a,
    b4b: precueBlock4b,
    b5a: precueBlock5a,
    b5b: precueBlock5b,
  };
} else {
  csvAssets = {
    practice: practiceCorpus,
    n2a: nchar2CorpusA,
    n2b: nchar2CorpusB,
    n4a: nchar4CorpusA,
    n4b: nchar4CorpusB,
  };
}

export const svgName = (letter, pseudoFont = true) => {
  if (pseudoFont) {
    return `latinSmall${letter}`;
  }
  return `latinCapital${letter}`;
};

const transformCSV = (csvInput) => csvInput.reduce((accum, row) => {
  if (row.string !== null) {
    const newRow = {
      stimulus: row.string.slice(2, -2).toUpperCase().split(''),
      correctResponse: row.CxResp.toUpperCase(),
      block: row.blockNum || null,
      precueLocation: row.precueLocation || null,
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
