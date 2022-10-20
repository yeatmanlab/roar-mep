import jsPsychPreload from "@jspsych/plugin-preload";
import { config } from "./config";

// Image files
import star from "./assets/images/star.svg";
import advance from "./assets/images/advance.jpeg";

// Audio files
import feedbackCorrect from "./assets/audio/feedbackCorrect.mp3";
import feedbackIncorrect from "./assets/audio/feedbackIncorrect.mp3";

// Video files
// English language versions 
import pseudoBlock1En from "./assets/video/en/pseudoBlock1.mp4";
import pseudoEndEn from "./assets/video/en/pseudoEnd.mp4";
import pseudoIntroEn from "./assets/video/en/pseudoIntro.mp4";
import pseudoPost2BlockEn from "./assets/video/en/pseudoPost2Block.mp4";
import pseudoPostPracticeEn from "./assets/video/en/pseudoPostPractice.mp4";
import pseudoRewardAnimation1En from "./assets/video/en/pseudoRewardAnimation1.mp4";
import pseudoRewardAnimation2En from "./assets/video/en/pseudoRewardAnimation2.mp4";
import latinBlock1En from "./assets/video/en/latinBlock1.mp4";
import latinEndEn from "./assets/video/en/latinEnd.mp4";
import latinIntroEn from "./assets/video/en/latinIntro.mp4";
import latinPost2BlockEn from "./assets/video/en/latinPost2Block.mp4";
import latinPostPracticeEn from "./assets/video/en/latinPostPractice.mp4";
import latinRewardAnimation1En from "./assets/video/en/latinRewardAnimation1.mp4";
import latinRewardAnimation2En from "./assets/video/en/latinRewardAnimation2.mp4";
// Spanish language versions
import pseudoBlock1Es from "./assets/video/es/pseudoBlock1Es.mp4";
import pseudoEndEs from "./assets/video/es/pseudoEndEs.mp4";
import pseudoIntroEs from "./assets/video/es/pseudoIntroEs.mp4";
import pseudoPost2BlockEs from "./assets/video/es/pseudoPost2BlockEs.mp4";
import pseudoPostPracticeEs from "./assets/video/es/pseudoPostPracticeEs.mp4";
import pseudoRewardAnimation1Es from "./assets/video/es/pseudoRewardAnimation1Es.mp4";
import pseudoRewardAnimation2Es from "./assets/video/es/pseudoRewardAnimation2Es.mp4";
import latinBlock1Es from "./assets/video/es/latinBlock1Es.mp4";
import latinEndEs from "./assets/video/es/latinEndEs.mp4";
import latinIntroEs from "./assets/video/es/latinIntroEs.mp4";
import latinPost2BlockEs from "./assets/video/es/latinPost2BlockEs.mp4";
import latinPostPracticeEs from "./assets/video/es/latinPostPracticeEs.mp4";
import latinRewardAnimation1Es from "./assets/video/es/latinRewardAnimation1Es.mp4";
import latinRewardAnimation2Es from "./assets/video/es/latinRewardAnimation2Es.mp4";

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
    const key = fileName.split(".")[0].replace(/Es$/, "");
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
if (config.language === "en") {
  if (config.pseudoFont) {
    videoBlocks = {
      1: [
        pseudoBlock1En,
        pseudoEndEn,
        pseudoIntroEn,
        pseudoPost2BlockEn,
        pseudoPostPracticeEn,
        pseudoRewardAnimation1En,
        pseudoRewardAnimation2En,
      ],
    };
  } else {
    videoBlocks = {
      1: [
        latinBlock1En,
        latinEndEn,
        latinIntroEn,
        latinPost2BlockEn,
        latinPostPracticeEn,
        latinRewardAnimation1En,
        latinRewardAnimation2En,
      ],
    };
  }
} else {
  // eslint-disable-next-line no-lonely-if
  if (config.pseudoFont) {
    videoBlocks = {
      1: [
        pseudoBlock1Es,
        pseudoEndEs,
        pseudoIntroEs,
        pseudoPost2BlockEs,
        pseudoPostPracticeEs,
        pseudoRewardAnimation1Es,
        pseudoRewardAnimation2Es,
      ],
    };
  } else {
    videoBlocks = {
      1: [
         latinBlock1Es,
         latinEndEs,
         latinIntroEs,
         latinPost2BlockEs,
         latinPostPracticeEs,
         latinRewardAnimation1Es,
         latinRewardAnimation2Es,
      ],
    };
  }
}

console.log(videoBlocks);

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

console.log(videoContent);

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
