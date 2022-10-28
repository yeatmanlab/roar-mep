/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */

// jsPsych imports
import jsPsychFullScreen from "@jspsych/plugin-fullscreen";
import surveyText from '@jspsych/plugin-survey-text';

// Import necessary for async in the top level of the experiment script
import "regenerator-runtime/runtime";

// Firebase imports
import { RoarFirekit } from "@bdelab/roar-firekit";
import { roarConfig } from "./firebaseConfig";

// Session storage
import store from "store2";

// Local modules
import {
  jsPsych,
  config,
  taskInfo,
} from "./config";
import { characters, preload_trials } from "./preload";
// import { countdown_trials } from "./introduction";
import { svgName, corpora } from "./corpus";
import { makeRoarTrial } from "./utils";
import videoTrials from "./videos";

// CSS imports
import "./css/game_v4.css";

let firekit;
const timeline = [];

if (store.session("pid") !== null) {
  const userInfo = {
    id: store.session("pid"),
    studyId: config.sessionId,
    classId: config.classId || null,
    schoolId: config.schoolId || null,
    userMetadata: config.userMetadata,
  };

  firekit = new RoarFirekit({
    config: roarConfig,
    userInfo: userInfo,
    taskInfo,
  });

  await firekit.startRun();
}

preload_trials.forEach((trial) => {
  timeline.push(trial);
});

const getPid = {
  type: surveyText,
  questions: [
    {
      prompt: 'Participant ID:',
      name: 'pid',
      placeholder: '0000',
      required: true,
    },
    {
      prompt: 'Class ID:',
      name: 'ClassId',
      placeholder: '0000',
      required: true,
    },
    {
      prompt: 'School ID',
      name: 'SchoolId',
      placeholder: '0000',
      required: true,
    },
  ],
  on_finish: (data) => {
    store.session.set("pid", [data.response.SchoolId, data.response.ClassId, data.response.pid].join("-"));
    config.classId = data.response.ClassId;
    config.schoolId = data.response.SchoolId;
  },
};

const ifGetPid = {
  timeline: [getPid],
  conditional_function: function () {
    return store.session("pid") === null;
  },
  on_timeline_finish: async () => {
    const userInfo = {
      id: store.session("pid"),
      studyId: config.sessionId,
      classId: config.classId || null,
      schoolId: config.schoolId || null,
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

timeline.push(ifGetPid);

const enter_fullscreen = {
  type: jsPsychFullScreen,
  fullscreen_mode: true,
  message: `<div><h1>The experiment will switch to full screen mode. <br> Click the button to continue. </h1></div>`,
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
    let stimuli = stimulus.stimulus;
    let stimulusString = stimulus.stimulus.join("");
    stimulusString = `${stimulusString.substring(0, stimuli.length / 2)}+${stimulusString.substring(stimuli.length / 2)}`;

    let choices = ["K", "D", "P", "F", "G", "H"];
    const choicesString = choices.join("");
    choices = choices.map(
      (choice) => characters[svgName(choice, config.pseudoFont)],
    );
    stimuli = stimuli.map(
      (stim) => characters[svgName(stim, config.pseudoFont)],
    );
    stimuli.splice(stimuli.length / 2, 0, characters["plus.svg"]);
    const cueLocationIdx = stimuli.indexOf(
      characters[svgName(stimulus.correctResponse, config.pseudoFont)],
    );
    const correctResponseIdx = choicesString.indexOf(stimulus.correctResponse);
    const timingKey = isPractice ? "practiceTiming" : "timing";
    const inputStimulus = {
      stimulusString: stimulusString,
      source: stimuli,
      choices: choices,
      choicesString: choicesString,
      stimulusDuration: config[timingKey].stimulusDuration,
      cueDuration: config[timingKey].maskDuration,
      cueLocationIdx: cueLocationIdx,
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

timeline.push(...videoTrials.intro);
pushMEPTrials(corpora.practice, true);
timeline.push(...videoTrials.postPractice);
pushMEPTrials(corpora.n2, false);
timeline.push(...videoTrials.postTwoLetterBlock);
pushMEPTrials(corpora.n4a, false);
timeline.push(...videoTrials.rewardAnimation1);
pushMEPTrials(corpora.n4b, false);
timeline.push(...videoTrials.postBlock1);
pushMEPTrials(corpora.n6a, false);
timeline.push(...videoTrials.rewardAnimation2);
pushMEPTrials(corpora.n6b, false);
timeline.push(...videoTrials.end);

const exit_fullscreen = {
  type: jsPsychFullScreen,
  fullscreen_mode: false,
  delay_after: 0,
};

timeline.push(exit_fullscreen);

jsPsych.run(timeline);
