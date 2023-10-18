import { generateAssetObject, createPreloadTrials } from "@bdelab/roar-utils";
import store from "store2";
import assets from '../../assets.json';
import 'regenerator-runtime/runtime';
import { makeRoarTrial } from "./utils";
// import { imgContent, mediaAssets.video, mediaAssets } from "../../preload";

const bucketURI = 'https://storage.googleapis.com/roar-mep';
export const mediaAssets = generateAssetObject(assets, bucketURI);
export const preloadTrials = createPreloadTrials(assets, bucketURI).default;
const characters = mediaAssets.images;
const svgName = (letter, pseudoFont = true) => {
  if (pseudoFont) {
    return `latinSmall${letter}`;
  }
  return `latinCapital${letter}`;
};

export const pushMEPTrials = (corpus, isPractice) => {
  const mepTimeline = [];
  const config = store.session.get("config");
  corpus.forEach((stimulus) => {
    let stimuli = stimulus.stimulus;
    let stimulusString = stimulus.stimulus.join("");
    stimulusString = `${stimulusString.substring(0, stimuli.length / 2)}+${stimulusString.substring(stimuli.length / 2)}`;

    let choices = config.precue ? ["B", "F", "H", "K", "L", "N", "P", "T", "V", "X", "Y", "Z"] : ["K", "D", "P", "F", "G", "H"];
    const choicesString = choices.join("");

    choices = choices.map(
      (choice) => characters[svgName(choice, config.pseudoFont)],
    );

    stimuli = stimuli.map(
      (stim) => characters[svgName(stim, config.pseudoFont)],
    );
    stimuli.splice(stimuli.length / 2, 0, characters.plus);
    const cueLocationIdx = stimuli.indexOf(
      characters[svgName(stimulus.correctResponse, config.pseudoFont)],
    );
    const correctResponseIdx = choicesString.indexOf(stimulus.correctResponse);
    const timingKey = isPractice ? "practiceTiming" : "timing";
    const cueLocations = {
      1: "left",
      2: "right",
      7: "both",
    };

    const inputStimulus = {
      stimulusString: stimulusString,
      source: stimuli,
      choices: choices,
      choicesString: choicesString,
      stimulusDuration: config[timingKey].stimulusDuration,
      cueDuration: config[timingKey].maskDuration,
      precueDuration: config[timingKey].precueDuration,
      precueLocation: stimulus.precueLocation ? cueLocations[stimulus.precueLocation] : null,
      cueToTargetInterval: stimulus.cueToTargetInterval,
      cueLocationIdx: cueLocationIdx,
      correctResponse: stimulus.correctResponse,
      correctResponseIdx: correctResponseIdx,
      block: stimulus.block,
    };
    const fixation = {
      duration: config[timingKey].fixationDuration,
    };

    mepTimeline.push(...makeRoarTrial({
      fixation,
      stimulus: inputStimulus,
      isPractice,
      precue: config.precue,
    }));
  });
  return mepTimeline;
};

export const waitFor = (conditionFunction) => {
  const poll = (resolve) => {
    if (conditionFunction()) resolve();
    // eslint-disable-next-line no-unused-vars
    else setTimeout((_) => poll(resolve), 400);
  };

  return new Promise(poll);
};
