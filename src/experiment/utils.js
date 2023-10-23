import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import './css/game_v4.css';

// Session storage
import store from "store2";

// Local imports
import { jsPsych } from "./jsPsych";
import { nStimuli } from "./config/corpus";
import { mediaAssets, characters } from "./experimentHelpers";

const buttonHtml = '<button class="jspsych-btn" type="button"><img draggable="false" src="%choice%" width="100%" height="100%"/></button>';

const updateProgressBar = () => {
  const curr_progress_bar_value = jsPsych.getProgressBarCompleted();
  jsPsych.setProgressBar(curr_progress_bar_value + 1 / nStimuli);
};

export const buildStimulusHtml = (stimuli) => {
  let outputHtml = '<div class="center">';
  stimuli.forEach((stimulus) => {
    outputHtml += `<img draggable="false" src="${stimulus}" class="mep-stimulus"/>`;
  });
  outputHtml += "</div>";
  return outputHtml;
};

export const buildLocationCueHtml = (stimLength, correctResponseIdx, precueLocation = null) => {
  let outputHtml = '<div class="center">';
  const stimuli = Array(stimLength).fill(characters["white"]);
  stimuli.splice(Math.floor(stimLength / 2), 1, characters["plus"]);
  // If precueLocation is null, assume this is the post stimulus location cue trial
  if (precueLocation === null) {
    stimuli.forEach((stimulus, index) => {
      if (index === correctResponseIdx) {
        outputHtml += `<img draggable="false" src="${stimulus}" class="mep-stimulus bottom-border-blue"/>`;
      } else {
        outputHtml += `<img draggable="false" src="${stimulus}" class="mep-stimulus"/>`;
      }
    });
  } else if (precueLocation === "left") {
    stimuli.forEach((stimulus, index) => {
      if (index < Math.floor(stimLength / 2)) {
        outputHtml += `<img draggable="false" src="${stimulus}" class="mep-stimulus bottom-border-red"/>`;
      } else {
        outputHtml += `<img draggable="false" src="${stimulus}" class="mep-stimulus"/>`;
      }
    });
  } else if (precueLocation === "right") {
    stimuli.forEach((stimulus, index) => {
      // Here we condition upon greater than half, rather than greater than or
      // equal to because we incremented the length of the stimuli array above
      // by adding the plus sign.
      if (index > Math.floor(stimLength / 2)) {
        outputHtml += `<img draggable="false" src="${stimulus}" class="mep-stimulus bottom-border-red"/>`;
      } else {
        outputHtml += `<img draggable="false" src="${stimulus}" class="mep-stimulus"/>`;
      }
    });
  } else if (precueLocation === "both") {
    stimuli.forEach((stimulus, index) => {
      if (index !== Math.floor(stimLength / 2)) {
        outputHtml += `<img draggable="false" src="${stimulus}" class="mep-stimulus bottom-border-red"/>`;
      } else {
        outputHtml += `<img draggable="false" src="${stimulus}" class="mep-stimulus"/>`;
      }
    });
  }
  outputHtml += "</div>";
  return outputHtml;
};

export const makeRoarTrial = ({
  fixation, stimulus, isPractice, precue,
}) => {
  const timeline = [];

  const fixationTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: buildStimulusHtml([stimulus.source[Math.floor(stimulus.source.length / 2)]]),
    choices: "NO_KEYS",
    stimulus_duration: null,
    trial_duration: fixation.duration,
    data: {
      task: "fixation",
      fixation_duration: fixation.duration,
    },
  };
  timeline.push(fixationTrial);

  if (precue) {
    const precueTrial = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: buildLocationCueHtml(
        stimulus.source.length,
        stimulus.cueLocationIdx,
        stimulus.precueLocation,
      ),
      choices: "NO_KEYS",
      stimulus_duration: null,
      trial_duration: stimulus.precueDuration,
      data: {
        task: "pre_cue",
      },
    };
    timeline.push(precueTrial);

    const cueToTargetIntervalTrial = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: buildStimulusHtml([stimulus.source[Math.floor(stimulus.source.length / 2)]]),
      choices: "NO_KEYS",
      stimulus_duration: null,
      trial_duration: stimulus.cueToTargetInterval,
      data: {
        task: "cue_to_target_interval",
      },
    };
    timeline.push(cueToTargetIntervalTrial);
  }

  let start_time;
  let recorded_stimulus_duration;

  const record_stimulus_duration = () => {
    if (!start_time) { // on_start callback
      start_time = new Date();
    } else { // on_finish callback
      recorded_stimulus_duration = new Date() - start_time;
      start_time = undefined;
    }
  };
  const stimulusTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: buildStimulusHtml(stimulus.source),
    choices: "NO_KEYS",
    stimulus_duration: null,
    trial_duration: stimulus.stimulusDuration,
    data: {
      task: "stimulus",
    },
    on_start: record_stimulus_duration,
    on_finish: record_stimulus_duration,
  };
  timeline.push(stimulusTrial);

  const locationCueTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: buildLocationCueHtml(stimulus.source.length, stimulus.cueLocationIdx),
    choices: "NO_KEYS",
    stimulus_duration: null,
    trial_duration: stimulus.cueDuration,
    data: {
      task: "location_cue",
    },
  };
  timeline.push(locationCueTrial);

  const config = store.session.get("config");
  const responseTrial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: buildLocationCueHtml(stimulus.source.length, stimulus.cueLocationIdx),
    choices: stimulus.choices,
    button_html: buttonHtml,
    data: {
      task: isPractice ? "practice_response" : "test_response",
      isPseudoSloan: config.pseudoFont,
      stimulusString: stimulus.stimulusString,
      choicesString: stimulus.choicesString,
      cueLocationIdx: stimulus.cueLocationIdx,
      correctResponse: stimulus.correctResponse,
      correctResponseIdx: stimulus.correctResponseIdx,
      urlQueryString: config.urlParams.toString(),
    },
    margin_vertical: "inherit",
    margin_horizontal: "inherit",
    response_ends_trial: true,
    on_finish: function (data) {
      updateProgressBar();
      // eslint-disable-next-line no-param-reassign
      data.pid = store.session("pid");
      // eslint-disable-next-line no-param-reassign
      data.correct = data.response === stimulus.correctResponseIdx;
      // eslint-disable-next-line no-param-reassign
      data.recorded_stimulus_duration = recorded_stimulus_duration;

      if (data.correct) {
        new Audio(mediaAssets.audio.feedbackCorrect).play();
      } else {
        new Audio(mediaAssets.audio.feedbackIncorrect).play();
      }
    },
  };

  timeline.push(responseTrial);

  return timeline;
};
