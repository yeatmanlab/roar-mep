import jsPsychPreload from "@jspsych/plugin-preload";
import { generateAssetObject, createPreloadTrials } from "@bdelab/roar-utils";
import store from "store2";
import i18next from "i18next";

import assetsFile from '../assets.json';
import 'regenerator-runtime/runtime';

const bucketURI = 'https://storage.googleapis.com/roar-mep';
// eslint-disable-next-line import/no-mutable-exports
export const mediaAssets = generateAssetObject(assetsFile, bucketURI);
// eslint-disable-next-line import/no-mutable-exports
export const preloadTrials = createPreloadTrials(assetsFile, bucketURI).default;

// Character svg images
export const characters = mediaAssets.images;

export const camelCase = (inString) =>
  inString.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

const preload_character_trials = {
  type: jsPsychPreload,
  images: Object.values(characters),
  auto_preload: false,
  message: "0 Please wait while the experiment loads.",
  show_progress_bar: true,
  show_detailed_errors: true,
};

let videoBlocks;
const config = () => (store.session.get("config"));
if (i18next.language === "en") {
  if (config.precue) {
    videoBlocks = {
      1: [
        mediaAssets.video.precueIntro,
        mediaAssets.video.precuePostPractice,
        mediaAssets.video.precueMidBlock1,
        mediaAssets.video.precueMidBlock2,
        mediaAssets.video.precueMidBlock3,
        mediaAssets.video.precueMidBlock4,
        mediaAssets.video.precueMidBlock5,
        mediaAssets.video.precuePostBlock1,
        mediaAssets.video.precuePostBlock2,
        mediaAssets.video.precuePostBlock3,
        mediaAssets.video.precuePostBlock4,
        mediaAssets.video.precueEnd,
      ],
    };
  } else if (config.pseudoFont) {
    videoBlocks = {
      1: [
        mediaAssets.video.pseudoBlock1En,
        mediaAssets.video.pseudoEndEn,
        mediaAssets.video.pseudoIntroEn,
        mediaAssets.video.pseudoPost2BlockEn,
        mediaAssets.video.pseudoPostPracticeEn,
        mediaAssets.video.pseudoRewardAnimation1En,
        mediaAssets.video.pseudoRewardAnimation2En,
      ],
    };
  } else {
    videoBlocks = {
      1: [
        mediaAssets.video.latinBlock1En,
        mediaAssets.video.latinEndEn,
        mediaAssets.video.latinIntroEn,
        mediaAssets.video.latinPost2BlockEn,
        mediaAssets.video.latinPostPracticeEn,
        mediaAssets.video.latinRewardAnimation1En,
        mediaAssets.video.latinRewardAnimation2En,
      ],
    };
  }
} else {
  // eslint-disable-next-line no-lonely-if
  if (config().pseudoFont) {
    videoBlocks = {
      1: [
        mediaAssets.video.pseudoBlock1Es,
        mediaAssets.video.pseudoEndEs,
        mediaAssets.video.pseudoIntroEs,
        mediaAssets.video.pseudoPost2BlockEs,
        mediaAssets.video.pseudoPostPracticeEs,
        mediaAssets.video.pseudoRewardAnimation1Es,
        mediaAssets.video.pseudoRewardAnimation2Es,
      ],
    };
  } else {
    videoBlocks = {
      1: [
        mediaAssets.video.latinBlock1Es,
        mediaAssets.video.latinEndEs,
        mediaAssets.video.latinIntroEs,
        mediaAssets.video.latinPost2BlockEs,
        mediaAssets.video.latinPostPracticeEs,
        mediaAssets.video.latinRewardAnimation1Es,
        mediaAssets.video.latinRewardAnimation2Es,
      ],
    };
  }
}

const imageBlocks = {
  2: [
    mediaAssets.images.star,
    mediaAssets.images.advance,
    mediaAssets.images.gradeKeyboard,
  ],
};

const audioBlocks = {
  3: [
    mediaAssets.audio.feedbackCorrect,
    mediaAssets.audio.feedbackIncorrect,
  ],
};

// Automatically populate the audioContent object with the audio files
export const imgContent = imageBlocks;
export const videoContent = videoBlocks;
export const audioContent = audioBlocks;

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
