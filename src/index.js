/* eslint-disable no-param-reassign */

// jsPsych imports
import jsPsychFullScreen from "@jspsych/plugin-fullscreen";
import jsPsychCallFunction from "@jspsych/plugin-call-function";
import surveyText from '@jspsych/plugin-survey-text';

// Import necessary for async in the top level of the experiment script
import "regenerator-runtime/runtime";

// Session storage
import store from "store2";

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

timeline.push({
  type: jsPsychCallFunction,
  async: true,
  func: function (done) {
    const display_element = document.getElementById('jspsych-content');

    display_element.innerHTML = "<p>Click on the screen to start...</p>";
    // var init_button = display_element.querySelector('#safari_audio_init');

    function init_audio_files() {
      jsPsych.pluginAPI.audioContext();
      done();
    }

    document.addEventListener('touchstart', init_audio_files, { once: true });
    document.addEventListener('click', init_audio_files, { once: true });
  },
});

const enter_fullscreen = {
  type: jsPsychFullScreen,
  fullscreen_mode: true,
  message: `<div><h1>The experiment will switch to full screen mode. <br> Click the button to continue. </h1></div>`,
  delay_after: 0,
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
  const mepTimeline = [];
  corpus.forEach((stimulus) => {
    let stimuli = stimulus.stimulus;
    let stimulusString = stimulus.stimulus.join("");
    stimulusString = `${stimulusString.substring(0, stimuli.length / 2)}+${stimulusString.substring(stimuli.length / 2)}`;

    let choices = config.precue ? ["B", "F", "H", "K", "L", "N", "P", "T", "V", "X", "Y", "Z"] : ["K", "D", "P", "F", "G", "H"];
    choices = config.dots ? ["left", "right"] : choices;
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

    let correctResponseIdx = choicesString.indexOf(stimulus.correctResponse);
    if (config.dots) {
      correctResponseIdx = cueLocationIdx === 1 ? 0 : 1;
    }

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
      preCueDuration: config[timingKey].preCueDuration,
      preCueLocation: stimulus.preCueLocation ? cueLocations[stimulus.preCueLocation] : null,
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
      preCue: config.precue,
      dots: config.dots,
      opacity: config.opacity,
    }));
  });
  return mepTimeline;
};

if (config.dots) {
  timeline.push(...videoTrials.intro1);
  timeline.push(...videoTrials.intro2);
  timeline.push(...videoTrials.intro3);
  // TODO (Maha) Uncomment this line if you want to add a fourth intro video.
  // timeline.push(...videoTrials.intro4);
  timeline.push(...pushMEPTrials(corpora.practice, true));
  timeline.push(...videoTrials.postPractice);
  timeline.push(...pushMEPTrials(corpora.b1, false));
  timeline.push(...videoTrials.postBlock1);
  timeline.push(...pushMEPTrials(corpora.b2, false));
  timeline.push(...videoTrials.postBlock2);
  timeline.push(...pushMEPTrials(corpora.b3, false));
  timeline.push(...videoTrials.postBlock3);
  timeline.push(...pushMEPTrials(corpora.b4, false));
  timeline.push(...videoTrials.postBlock4);
  timeline.push(...pushMEPTrials(corpora.b5, false));
  timeline.push(...videoTrials.end);
} else if (config.precue) {
  timeline.push(...videoTrials.intro);
  timeline.push(...pushMEPTrials(corpora.practice, true));
  timeline.push(...videoTrials.postPractice);
  timeline.push(...pushMEPTrials(corpora.b1a, false));
  timeline.push(...videoTrials.midBlock1);
  timeline.push(...pushMEPTrials(corpora.b1b, false));
  timeline.push(...videoTrials.postBlock1);
  timeline.push(...pushMEPTrials(corpora.b2a, false));
  timeline.push(...videoTrials.midBlock2);
  timeline.push(...pushMEPTrials(corpora.b2b, false));
  timeline.push(...videoTrials.postBlock2);
  timeline.push(...pushMEPTrials(corpora.b3a, false));
  timeline.push(...videoTrials.midBlock3);
  timeline.push(...pushMEPTrials(corpora.b3b, false));
  timeline.push(...videoTrials.postBlock3);
  timeline.push(...pushMEPTrials(corpora.b4a, false));
  timeline.push(...videoTrials.midBlock4);
  timeline.push(...pushMEPTrials(corpora.b4b, false));
  timeline.push(...videoTrials.postBlock4);
  timeline.push(...pushMEPTrials(corpora.b5a, false));
  timeline.push(...videoTrials.midBlock5);
  timeline.push(...pushMEPTrials(corpora.b5b, false));
  timeline.push(...videoTrials.end);
} else {
  const fourElementBlocks = [];
  timeline.push(...videoTrials.intro);
  timeline.push(...pushMEPTrials(corpora.practice, true));
  timeline.push(...videoTrials.postPractice);
  timeline.push(...pushMEPTrials(corpora.n2a, false));
  timeline.push(...videoTrials.postTwoLetterBlock);
  timeline.push(...pushMEPTrials(corpora.n2b, false));
  fourElementBlocks.push(...videoTrials.postBlock1);
  fourElementBlocks.push(...pushMEPTrials(corpora.n4a, false, fourElementBlocks));
  fourElementBlocks.push(...videoTrials.rewardAnimation1);
  fourElementBlocks.push(...pushMEPTrials(corpora.n4b, false, fourElementBlocks));

  // Add a conditional timeline to terminate when accuracy is < 4/24 correct for the easy trials
  const if4ElementBlocks = {
    timeline: fourElementBlocks,
    conditional_function: function () {
      // get the data from the previous trials,
      // and check whether we should continue
      const correctTrials = jsPsych.data.get().filter({ correct: true, task: "test_response" });
      return correctTrials.trials.length > 4;
    },
  };

  timeline.push(if4ElementBlocks);

  timeline.push(...videoTrials.end);
}

const exit_fullscreen = {
  type: jsPsychFullScreen,
  fullscreen_mode: false,
  delay_after: 450,
};

timeline.push(exit_fullscreen);

jsPsych.run(timeline);
