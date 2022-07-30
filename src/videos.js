import jsPsychVideoButtonResponse from "@jspsych/plugin-video-button-response";
import { config } from "./config";
import { imgContent, videos } from "./preload";

const buttonHtml = `<button><img src="${imgContent.star}" /></button>`;
const kwargs = {
  type: jsPsychVideoButtonResponse,
  choices: [""],
  button_html: buttonHtml,
  response_allowed_while_playing: config.testingOnly,
  on_start: function () {
    document.body.style.cursor = "none";
  },
};

/* define instructions trial */
const introTrial = {
  stimulus: videos["pseudoIntro.mp4"],
  ...kwargs,
};

const postPracticeTrial = {
  stimulus: videos["pseudoPostPractice.mp4"],
  ...kwargs,
};

const postTwoLetterBlockTrial = {
  stimulus: videos["pseudoPost2Block.mp4"],
  ...kwargs,
};

const postBlock1Trial = {
  type: jsPsychVideoButtonResponse,
  stimulus: videos["pseudoBlock1.mp4"],
  ...kwargs,
};

const rewardAnimation1Trial = {
  type: jsPsychVideoButtonResponse,
  stimulus: videos["pseudoRewardAnimation1.mp4"],
  ...kwargs,
};

const rewardAnimation2Trial = {
  type: jsPsychVideoButtonResponse,
  stimulus: videos["pseudoRewardAnimation2.mp4"],
  ...kwargs,
};

const endTrial = {
  type: jsPsychVideoButtonResponse,
  stimulus: videos["pseudoEnd.mp4"],
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
