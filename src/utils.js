import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import { jsPsych } from "./config";
import { characters } from "./preload";
import { nStimuli } from "./corpus";

const buttonHtml = (nChoices, isResponse, correctResponseIdx = 0) => {
  const buttonHtmlString = '<button class="jspsych-btn" type="button"><img src="%choice%" width="100%" height="100%"/></button>';
  const buttonHtmlArray = Array(nChoices).fill(buttonHtmlString);

  // We assume that nChoices is even
  buttonHtmlArray[nChoices / 2 - 1] = '<button class="jspsych-btn" style="margin-right: 1.91%;" type="button"><img src="%choice%" width="100%" height="100%"/></button>';
  buttonHtmlArray[nChoices / 2] = '<button class="jspsych-btn" style="margin-left: 1.91%;" type="button"><img src="%choice%" width="100%" height="100%"/></button>';

  if (isResponse) {
    return buttonHtmlArray;
  }

  let style;
  if (correctResponseIdx === nChoices / 2 - 1) {
    style = '"margin-right: 1.91% !important; border-color: black;"';
  } else if (correctResponseIdx === nChoices / 2) {
    style = '"margin-left: 1.91% !important; border-color: black;"';
  } else {
    style = '"border-color: black;"';
  }
  buttonHtmlArray[correctResponseIdx] = `<button class="jspsych-btn" style=${style} type="button"><img src="%choice%" width="100%" height="100%"/></button>`;

  return buttonHtmlArray;
};

const updateProgressBar = () => {
  const curr_progress_bar_value = jsPsych.getProgressBarCompleted();
  jsPsych.setProgressBar(curr_progress_bar_value + 1 / nStimuli);
};

const disablePlus = () => {
  const buttonNodes = Array.from(document.querySelectorAll('.jspsych-html-button-response-button'));
  const plusButton = buttonNodes.filter((node) => (node.firstChild.firstChild.currentSrc.includes("plus.svg")))[0];
  const clonedButton = plusButton.cloneNode(true);
  plusButton.parentNode.replaceChild(clonedButton, plusButton);
};

const makeRoarTrial = ({
  fixation, stimulus, isPractice,
}) => {
  const timeline = [];

  const fixationTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
      return `<div id="fixation-prompt">
        <h2 style="padding-bottom: 20px;">Please click on the underlined character</h2>
        <img class="jspsych-html-button-response-button" src="${characters["plus.svg"]}"/>
      </div>`;
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
    stimulus_duration: null,
    trial_duration: stimulus.stimulusDuration,
    button_html: buttonHtml(stimulus.choices.length, false, stimulus.correctResponseIdx),
    data: {
      task: "stimulus",
    },
    margin_vertical: "inherit",
    margin_horizontal: "inherit",
    on_load: disablePlus,
  };
  timeline.push(stimulusTrial);

  const responseTrial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: stimulus.source,
    choices: stimulus.choices,
    stimulus_duration: null,
    trial_duration: stimulus.trialDuration,
    button_html: buttonHtml(stimulus.choices.length, true, stimulus.correctResponseIdx),
    data: {
      task: isPractice ? "practice_response" : "test_response",
      choices: stimulus.choices,
      correctResponse: stimulus.correctResponse,
      correctResponseIdx: stimulus.correctResponseIdx,
    },
    margin_vertical: "inherit",
    margin_horizontal: "inherit",
    on_load: disablePlus,
    on_finish: updateProgressBar,
  };

  timeline.push(responseTrial);

  return timeline;
};

export default makeRoarTrial;
