import store from "store2";
import jsPsychVideoKeyboardResponse from "@jspsych/plugin-video-keyboard-response";
import jsPsychImageButtonResponse from "@jspsych/plugin-image-button-response";
import { imgContent, videoContent, mediaAssets } from "../../preload";

const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
console.log(`isMobile: ${isMobile()}`);

// any dynamic state should be run as a arrow FUNCTION

const kwargs = {
  type: jsPsychVideoKeyboardResponse,
  choices: () => (store.session.get("config").testingOnly ? "ALL_KEYS" : "NO_KEYS"),
  trial_ends_after_video: true,
  autoplay: !isMobile(),
  controls: isMobile(),
  width: 1238,
  height: 800,
  response_allowed_while_playing: () => (store.session.get("config").testingOnly),
  on_load: () => {
    const video = document.getElementById("jspsych-video-keyboard-response-stimulus");
    video.setAttribute("playsinline", "");
  },
};

let videoExports;

const buttonHtml = `<button class="star-center transparent"><img draggable="false" style="width: 350px; height: 350px;" src="${imgContent.star}" /></button>`;
const clickStarTrial = {
  type: jsPsychImageButtonResponse,
  stimulus: [mediaAssets.images.advance],
  choices: [""],
  button_html: buttonHtml,
  stimulus_width: 1238,
  data: {
    task: "continue_from_video",
  },
  margin_vertical: "inherit",
  margin_horizontal: "inherit",
};

/* define instructions trial */
if (store.session.get("config").precue) {
  const introTrial = [{
    stimulus: [videoContent.intro],
    ...kwargs,
  }, clickStarTrial];

  const postPracticeTrial = [{
    stimulus: [videoContent.postPractice],
    ...kwargs,
  }, clickStarTrial];

  const midBlock1Trial = [{
    stimulus: [videoContent.midBlock1],
    ...kwargs,
  }, clickStarTrial];

  const postBlock1Trial = [{
    stimulus: [videoContent.postBlock1],
    ...kwargs,
  }, clickStarTrial];

  const midBlock2Trial = [{
    stimulus: [videoContent.midBlock2],
    ...kwargs,
  }, clickStarTrial];

  const postBlock2Trial = [{
    stimulus: [videoContent.postBlock2],
    ...kwargs,
  }, clickStarTrial];

  const midBlock3Trial = [{
    stimulus: [videoContent.midBlock3],
    ...kwargs,
  }, clickStarTrial];

  const postBlock3Trial = [{
    stimulus: [videoContent.postBlock3],
    ...kwargs,
  }, clickStarTrial];

  const midBlock4Trial = [{
    stimulus: [videoContent.midBlock4],
    ...kwargs,
  }, clickStarTrial];

  const postBlock4Trial = [{
    stimulus: [videoContent.postBlock4],
    ...kwargs,
  }, clickStarTrial];

  const midBlock5Trial = [{
    stimulus: [videoContent.midBlock5],
    ...kwargs,
  }, clickStarTrial];

  const endTrial = [{
    stimulus: [videoContent.end],
    ...kwargs,
  }, clickStarTrial];

  videoExports = {
    intro: introTrial,
    postPractice: postPracticeTrial,
    midBlock1: midBlock1Trial,
    postBlock1: postBlock1Trial,
    midBlock2: midBlock2Trial,
    postBlock2: postBlock2Trial,
    midBlock3: midBlock3Trial,
    postBlock3: postBlock3Trial,
    midBlock4: midBlock4Trial,
    postBlock4: postBlock4Trial,
    midBlock5: midBlock5Trial,
    end: endTrial,
  };
} else {
  const videoPrefix = store.session.get("config").pseudoFont ? "pseudo" : "latin";

  const introTrial = [{
    stimulus: [videoContent[`${videoPrefix}Intro`]],
    ...kwargs,
  }, clickStarTrial];

  const postPracticeTrial = [{
    stimulus: [videoContent[`${videoPrefix}PostPractice`]],
    ...kwargs,
  }, clickStarTrial];

  const postTwoLetterBlockTrial = [{
    stimulus: [videoContent[`${videoPrefix}Post2Block`]],
    ...kwargs,
  }, clickStarTrial];

  const postBlock1Trial = [{
    stimulus: [videoContent[`${videoPrefix}Block1`]],
    ...kwargs,
  }, clickStarTrial];

  const rewardAnimation1Trial = [{
    stimulus: [videoContent[`${videoPrefix}RewardAnimation1`]],
    ...kwargs,
  }, clickStarTrial];

  const rewardAnimation2Trial = [{
    stimulus: [videoContent[`${videoPrefix}RewardAnimation2`]],
    ...kwargs,
  }, clickStarTrial];

  const endTrial = [{
    stimulus: [videoContent[`${videoPrefix}End`]],
    ...kwargs,
  }, clickStarTrial];

  videoExports = {
    intro: introTrial,
    postPractice: postPracticeTrial,
    postTwoLetterBlock: postTwoLetterBlockTrial,
    postBlock1: postBlock1Trial,
    rewardAnimation1: rewardAnimation1Trial,
    rewardAnimation2: rewardAnimation2Trial,
    end: endTrial,
  };
}
export const videoTrials = videoExports;
