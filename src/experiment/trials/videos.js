import store from "store2";
import jsPsychVideoKeyboardResponse from "@jspsych/plugin-video-keyboard-response";
import jsPsychImageButtonResponse from "@jspsych/plugin-image-button-response";
// import { imgContent, mediaAssets.video, mediaAssets } from "../../preload";
import { generateAssetObject } from "@bdelab/roar-utils";
import assetsFile from '../../../assets.json';

const bucketURI = 'https://storage.googleapis.com/roar-mep';
const mediaAssets = generateAssetObject(assetsFile, bucketURI);

const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
console.log(`isMobile: ${isMobile()}`);

const queryString = new URL(window.location).search;
const urlParams = new URLSearchParams(queryString);
const dots = urlParams.get("dots") || false;
const precue = dots ? true : (urlParams.get("precue") === "true") || false;
const pseudoFont = precue ? false : urlParams.get("latinFont") !== "true";

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

const buttonHtml = `<button class="star-center transparent"><img draggable="false" style="width: 350px; height: 350px;" src="${mediaAssets.images.star}" /></button>`;
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
if (precue) {
  const introTrial = [{
    stimulus: [mediaAssets.video.intro],
    ...kwargs,
  }, clickStarTrial];

  const postPracticeTrial = [{
    stimulus: [mediaAssets.video.postPractice],
    ...kwargs,
  }, clickStarTrial];

  const midBlock1Trial = [{
    stimulus: [mediaAssets.video.midBlock1],
    ...kwargs,
  }, clickStarTrial];

  const postBlock1Trial = [{
    stimulus: [mediaAssets.video.postBlock1],
    ...kwargs,
  }, clickStarTrial];

  const midBlock2Trial = [{
    stimulus: [mediaAssets.video.midBlock2],
    ...kwargs,
  }, clickStarTrial];

  const postBlock2Trial = [{
    stimulus: [mediaAssets.video.postBlock2],
    ...kwargs,
  }, clickStarTrial];

  const midBlock3Trial = [{
    stimulus: [mediaAssets.video.midBlock3],
    ...kwargs,
  }, clickStarTrial];

  const postBlock3Trial = [{
    stimulus: [mediaAssets.video.postBlock3],
    ...kwargs,
  }, clickStarTrial];

  const midBlock4Trial = [{
    stimulus: [mediaAssets.video.midBlock4],
    ...kwargs,
  }, clickStarTrial];

  const postBlock4Trial = [{
    stimulus: [mediaAssets.video.postBlock4],
    ...kwargs,
  }, clickStarTrial];

  const midBlock5Trial = [{
    stimulus: [mediaAssets.video.midBlock5],
    ...kwargs,
  }, clickStarTrial];

  const endTrial = [{
    stimulus: [mediaAssets.video.end],
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
  const videoPrefix = pseudoFont ? "pseudo" : "latin";

  const introTrial = [{
    stimulus: [mediaAssets.video[`${videoPrefix}Intro`]],
    ...kwargs,
  }, clickStarTrial];

  const postPracticeTrial = [{
    stimulus: [mediaAssets.video[`${videoPrefix}PostPractice`]],
    ...kwargs,
  }, clickStarTrial];

  const postTwoLetterBlockTrial = [{
    stimulus: [mediaAssets.video[`${videoPrefix}Post2Block`]],
    ...kwargs,
  }, clickStarTrial];

  const postBlock1Trial = [{
    stimulus: [mediaAssets.video[`${videoPrefix}Block1`]],
    ...kwargs,
  }, clickStarTrial];

  const rewardAnimation1Trial = [{
    stimulus: [mediaAssets.video[`${videoPrefix}RewardAnimation1`]],
    ...kwargs,
  }, clickStarTrial];

  const rewardAnimation2Trial = [{
    stimulus: [mediaAssets.video[`${videoPrefix}RewardAnimation2`]],
    ...kwargs,
  }, clickStarTrial];

  const endTrial = [{
    stimulus: [mediaAssets.video[`${videoPrefix}End`]],
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
