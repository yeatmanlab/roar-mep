/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */

// jsPsych imports
import jsPsychFullScreen from "@jspsych/plugin-fullscreen";

// Import necessary for async in the top level of the experiment script
import "regenerator-runtime/runtime";

// Firebase imports
import { RoarFirekit } from "@bdelab/roar-firekit";
import { roarConfig } from "./firebaseConfig";

// Local modules
import {
  jsPsych,
  config,
  taskInfo,
} from "./config";
import { characters, preload_trials } from "./preload";
// import { countdown_trials } from "./introduction";
import { svgName, corpora } from "./corpus";
import makeRoarTrial from "./utils";

// CSS imports
import "./css/game_v4.css";

let firekit;
const timeline = [];

preload_trials.forEach((trial) => {
  timeline.push(trial);
});

function makeRandomPid() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 16; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const enter_fullscreen = {
  type: jsPsychFullScreen,
  fullscreen_mode: true,
  message: `<div><h1>The experiment will switch to full screen mode. <br> Click the button to continue. </h1></div>`,
  on_finish: async () => {
    config.pid = config.pid || makeRandomPid();
    const userInfo = {
      id: config.pid,
      studyId: config.sessionId,
      userMetadata: config.userMetadata,
    };
    firekit = new RoarFirekit({
      config: roarConfig,
      userInfo: userInfo,
      taskInfo,
    });
    await firekit.startRun();
  },
};

const extend = (fn, code) =>
  function () {
    // eslint-disable-next-line prefer-rest-params
    fn.apply(fn, arguments);
    // eslint-disable-next-line prefer-rest-params
    code.apply(fn, arguments);
  };

jsPsych.opts.on_finish = extend(jsPsych.opts.on_finish, () => {
  firekit.finishRun();
});

jsPsych.opts.on_data_update = extend(jsPsych.opts.on_data_update, (data) => {
  if (["test_response", "practice_response"].includes(data.task)) {
    firekit?.writeTrial(data);
  }
});

timeline.push(enter_fullscreen);
// timeline.push(countdown_trials);

const pushMEPTrials = (corpus, isPractice) => {
  corpus.forEach((stimulus) => {
    const stimuli = stimulus.stimulus;
    const choices = stimuli.map(
      (choice) => characters[svgName(choice, config.pseudoFont)],
    );
    stimuli.splice(stimuli.length / 2, 0, "plus");
    choices.splice(stimuli.length / 2, 0, characters["plus.svg"]);
    const correctResponseIdx = stimuli.indexOf(stimulus.correctResponse);
    const source = '<div><h2>Please click on the underlined character</h2></div>';
    const timingKey = isPractice ? "practiceTiming" : "timing";
    const inputStimulus = {
      source: source,
      choices: choices,
      stimulusDuration: config[timingKey].targetDuration,
      trialDuration: null,
      correctResponse: stimulus.correctResponse,
      correctResponseIdx: correctResponseIdx,
      block: stimulus.block,
    };
    const fixation = {
      duration: config[timingKey].fixationDuration,
    };

    timeline.push(...makeRoarTrial({
      fixation,
      stimulus: inputStimulus,
      isPractice,
    }));
  });
};

// MAHA: Here is where you would insert the intro material
pushMEPTrials(corpora.practice, true);
// MAHA: Here is where you would insert an inter-block break
pushMEPTrials(corpora.n2, false);
// MAHA: Here is where you would insert an inter-block break
pushMEPTrials(corpora.n4a, false);
// MAHA: Here is where you would insert an inter-block break
pushMEPTrials(corpora.n4b, false);
// MAHA: Here is where you would insert an inter-block break
pushMEPTrials(corpora.n6a, false);
// MAHA: Here is where you would insert an inter-block break
pushMEPTrials(corpora.n6b, false);
// MAHA: Here is where you would insert the final material

const exit_fullscreen = {
  type: jsPsychFullScreen,
  fullscreen_mode: false,
  delay_after: 0,
};

timeline.push(exit_fullscreen);

jsPsych.run(timeline);
