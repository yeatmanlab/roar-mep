import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";

const makeRoarTrial = ({
  fixation, stimulus, isPractice,
}) => {
  const timeline = [];

  const fixationTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
      return `<div class = stimulus_div><p class = 'stimulus'>+</p></div>`;
    },
    choices: "NO_KEYS",
    trial_duration: fixation.duration,
    data: {
      task: "fixation",
    },
  };
  timeline.push(fixationTrial);

  const stimulusTrial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: stimulus.source,
    choices: stimulus.choices,
    stimulus_duration: stimulus.stimulusDuration,
    trial_duration: stimulus.trialDuration,
    data: {
      task: isPractice ? "practice_response" : "test_response",
      choices: stimulus.choices,
      correctResponse: stimulus.correctResponse,
    },
  };
  timeline.push(stimulusTrial);

  return timeline;
};

export default makeRoarTrial;
