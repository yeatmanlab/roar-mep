import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import { config, jsPsych } from "./config";
import { nStimuli } from "./corpus";
import { characters } from "./preload";

const buttonHtml = '<button class="jspsych-btn" type="button"><img src="%choice%" width="100%" height="100%"/></button>';

const updateProgressBar = () => {
  const curr_progress_bar_value = jsPsych.getProgressBarCompleted();
  jsPsych.setProgressBar(curr_progress_bar_value + 1 / nStimuli);
};

export const buildStimulusHtml = (stimuli) => {
  let outputHtml = '<div class="center">';
  stimuli.forEach((stimulus) => {
    outputHtml += `<img src="${stimulus}" class="mep-stimulus"/>`;
  });
  outputHtml += "</div>";
  return outputHtml;
};

export const buildLocationCueHtml = (stimLength, correctResponseIdx) => {
  let outputHtml = '<div class="center">';
  const stimuli = Array(stimLength).fill(characters["white.svg"]);
  stimuli.splice(Math.floor(stimLength / 2), 1, characters["plus.svg"]);
  stimuli.forEach((stimulus, index) => {
    if (index === correctResponseIdx) {
      outputHtml += `<img src="${stimulus}" class="mep-stimulus bottom-border-blue"/>`;
    } else {
      outputHtml += `<img src="${stimulus}" class="mep-stimulus"/>`;
    }
  });
  outputHtml += "</div>";
  return outputHtml;
};

export const makeRoarTrial = ({
  fixation, stimulus, isPractice,
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

  const stimulusTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: buildStimulusHtml(stimulus.source),
    choices: "NO_KEYS",
    stimulus_duration: null,
    trial_duration: stimulus.stimulusDuration,
    data: {
      task: "stimulus",
    },
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
      pid: config.pid,
      urlQueryString: config.urlParams.toString(),
    },
    margin_vertical: "inherit",
    margin_horizontal: "inherit",
    on_finish: updateProgressBar,
  };

  timeline.push(responseTrial);

  return timeline;
};
