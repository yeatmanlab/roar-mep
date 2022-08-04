import jsPsychPreload from "@jspsych/plugin-preload";
import { config } from "./config";

// Image files
import star from "./assets/images/star.svg";
import advance from "./assets/images/advance.jpeg";

// Audio files
import feedbackCorrect from "./assets/audio/feedbackCorrect.mp3";
import feedbackIncorrect from "./assets/audio/feedbackIncorrect.mp3";

// Video files
import pseudoBlock1 from "./assets/video/pseudoBlock1.mp4";
import pseudoEnd from "./assets/video/pseudoEnd.mp4";
import pseudoIntro from "./assets/video/pseudoIntro.mp4";
import pseudoPost2Block from "./assets/video/pseudoPost2Block.mp4";
import pseudoPostPractice from "./assets/video/pseudoPostPractice.mp4";
import pseudoRewardAnimation1 from "./assets/video/pseudoRewardAnimation1.mp4";
import pseudoRewardAnimation2 from "./assets/video/pseudoRewardAnimation2.mp4";
import latinBlock1 from "./assets/video/latinBlock1.mp4";
import latinEnd from "./assets/video/latinEnd.mp4";
import latinIntro from "./assets/video/latinIntro.mp4";
import latinPost2Block from "./assets/video/latinPost2Block.mp4";
import latinPostPractice from "./assets/video/latinPostPractice.mp4";
import latinRewardAnimation1 from "./assets/video/latinRewardAnimation1.mp4";
import latinRewardAnimation2 from "./assets/video/latinRewardAnimation2.mp4";

function importAll(r) {
  const assets = {};
  r.keys().forEach((asset) => { assets[asset.replace('./', '')] = r(asset); });
  return assets;
}

// Character svg images
export const characters = importAll(require.context('./assets/svg', false, /\.(svg)$/));

export const camelCase = (inString) =>
  inString.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

const preloadObj2contentObj = (preloadObj) => {
  const contentArray = [].concat(...Object.values(preloadObj));
  return contentArray.reduce((o, val) => {
    const pathSplit = val.split("/");
    const fileName = pathSplit[pathSplit.length - 1];
    const key = fileName.split(".")[0];
    // eslint-disable-next-line no-param-reassign
    o[camelCase(key)] = val;
    return o;
  }, {});
};

const preload_character_trials = {
  type: jsPsychPreload,
  images: Object.values(characters),
  auto_preload: false,
  message: "0 Please wait while the experiment loads.",
  show_progress_bar: true,
  show_detailed_errors: true,
};

let videoBlocks;
if (config.pseudoFont) {
  videoBlocks = {
    1: [
      pseudoBlock1,
      pseudoEnd,
      pseudoIntro,
      pseudoPost2Block,
      pseudoPostPractice,
      pseudoRewardAnimation1,
      pseudoRewardAnimation2,
    ],
  };
} else {
  videoBlocks = {
    1: [
      latinBlock1,
      latinEnd,
      latinIntro,
      latinPost2Block,
      latinPostPractice,
      latinRewardAnimation1,
      latinRewardAnimation2,
    ],
  };
}

const imageBlocks = {
  2: [
    star,
    advance,
  ],
};

const audioBlocks = {
  3: [
    feedbackCorrect,
    feedbackIncorrect,
  ],
};

// Automatically populate the audioContent object with the audio files
export const imgContent = preloadObj2contentObj(imageBlocks);
export const videoContent = preloadObj2contentObj(videoBlocks);
export const audioContent = preloadObj2contentObj(audioBlocks);

const preload_video_trials = Object.entries(videoBlocks).map(([idx, img_block]) => ({
  type: jsPsychPreload,
  video: img_block,
  auto_preload: false,
  message: `${idx} Please wait while the experiment loads. This may take a few minutes.`,
  show_progress_bar: true,
  show_detailed_errors: true,
}));

const preload_img_trials = Object.entries(imageBlocks).map(([idx, img_block]) => ({
  type: jsPsychPreload,
  images: img_block,
  auto_preload: false,
  message: `${idx} Please wait while the experiment loads. This may take a few minutes.`,
  show_progress_bar: true,
  show_detailed_errors: true,
}));

const preload_audio_trials = Object.entries(audioBlocks).map(([idx, audio_block]) => ({
  type: jsPsychPreload,
  audio: audio_block,
  auto_preload: false,
  message: `${idx} Please wait while the experiment loads. This may take a few minutes.`,
  show_progress_bar: true,
  show_detailed_errors: true,
}));

export const preload_trials = [
  preload_character_trials, ...preload_video_trials, ...preload_img_trials, ...preload_audio_trials,
];
