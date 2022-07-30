import jsPsychVideoKeyboardResponse from "@jspsych/plugin-video-keyboard-response";
import { config } from "./config";
import { imgContent, videoContent } from "./preload";

const buttonHtml = `<button><img style="width: 3.3%; height: 3.3%;" src="${imgContent.star}" /></button>`;
const kwargs = {
  type: jsPsychVideoKeyboardResponse,
  choices: "NO_KEYS",
  trial_ends_after_video: true,
  button_html: buttonHtml,
  width: 1238,
  height: 800,
  response_allowed_while_playing: config.testingOnly,
};

/* define instructions trial */
const introTrial = {
  stimulus: [videoContent.pseudoIntro],
  ...kwargs,
};

const postPracticeTrial = {
  stimulus: [videoContent.pseudoPostPractice],
  ...kwargs,
};

const postTwoLetterBlockTrial = {
  stimulus: [videoContent.pseudoPost2Block],
  ...kwargs,
};

const postBlock1Trial = {
  type: jsPsychVideoButtonResponse,
  stimulus: [videoContent.pseudoBlock1],
  ...kwargs,
};

const rewardAnimation1Trial = {
  type: jsPsychVideoButtonResponse,
  stimulus: [videoContent.pseudoRewardAnimation1],
  ...kwargs,
};

const rewardAnimation2Trial = {
  type: jsPsychVideoButtonResponse,
  stimulus: [videoContent.pseudoRewardAnimation2],
  ...kwargs,
};

const endTrial = {
  type: jsPsychVideoButtonResponse,
  stimulus: [videoContent.pseudoEnd],
  ...kwargs,
};

const videoTrials = {
  intro: introTrial,
  postPractice: postPracticeTrial,
  postTwoLetterBlock: postTwoLetterBlockTrial,
  postBlock1: postBlock1Trial,
  rewardAnimation1: rewardAnimation1Trial,
  rewardAnimation2: rewardAnimation2Trial,
  end: endTrial,
};

export default videoTrials;
