import jsPsychPreload from "@jspsych/plugin-preload";
import { config } from "./config";

// Image files
import star from "./assets/images/star.svg";
import flower from "./assets/images/flower.png";
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
// Precue versions
import preCueIntro from "./assets/video/en/precue/intro.mp4";
import preCuePostPractice from "./assets/video/en/precue/postPractice.mp4";
import preCueMidBlock1 from "./assets/video/en/precue/midBlock1.mp4";
import preCueMidBlock2 from "./assets/video/en/precue/midBlock2.mp4";
import preCueMidBlock3 from "./assets/video/en/precue/midBlock3.mp4";
import preCueMidBlock4 from "./assets/video/en/precue/midBlock4.mp4";
import preCueMidBlock5 from "./assets/video/en/precue/midBlock5.mp4";
import preCuePostBlock1 from "./assets/video/en/precue/postBlock1.mp4";
import preCuePostBlock2 from "./assets/video/en/precue/postBlock2.mp4";
import preCuePostBlock3 from "./assets/video/en/precue/postBlock3.mp4";
import preCuePostBlock4 from "./assets/video/en/precue/postBlock4.mp4";
import preCueEnd from "./assets/video/en/precue/end.mp4";
// Generic visual attention versions (dots only)
// TODO (Maha): If you rename or add video assets, be sure to import them in the lines below
import genericIntro1 from "./assets/video/en/generic/intro1Generic.mp4";
import genericIntro2 from "./assets/video/en/generic/intro2Generic.mp4";
import genericIntro3 from "./assets/video/en/generic/intro3Generic.mp4";
import genericIntro4 from "./assets/video/en/generic/intro4Generic.mp4";
import genericPostPractice from "./assets/video/en/generic/postPracticeGeneric.mp4";
import genericPostBlock1 from "./assets/video/en/generic/postBlock1Generic.mp4";
import genericPostBlock2 from "./assets/video/en/generic/postBlock2Generic.mp4";
import genericPostBlock3 from "./assets/video/en/generic/postBlock3Generic.mp4";
import genericPostBlock4 from "./assets/video/en/generic/postBlock4Generic.mp4";
import genericEnd from "./assets/video/en/generic/endGeneric.mp4";
// Spanish language versions
import genericIntro1Es from "./assets/video/es/generic/intro1GenericEs.mp4";
import genericIntro2Es from "./assets/video/es/generic/intro2GenericEs.mp4";
import genericIntro3Es from "./assets/video/es/generic/intro3GenericEs.mp4";
import genericIntro4Es from "./assets/video/es/generic/intro4GenericEs.mp4";
import genericPostPracticeEs from "./assets/video/es/generic/postPracticeGenericEs.mp4";
import genericPostBlock1Es from "./assets/video/es/generic/postBlock1GenericEs.mp4";
import genericPostBlock2Es from "./assets/video/es/generic/postBlock2GenericEs.mp4";
import genericPostBlock3Es from "./assets/video/es/generic/postBlock3GenericEs.mp4";
import genericPostBlock4Es from "./assets/video/es/generic/postBlock4GenericEs.mp4";
import genericEndEs from "./assets/video/es/generic/endGenericEs.mp4";

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
  if (config.dots) {
    // Any video assets that were imported above should also be
    // included in the array below, by referencing the variable name that you
    // used in the import statement.
    videoBlocks = {
      1: [
        genericIntro1,
        genericIntro2,
        genericIntro3,
        genericIntro4,
        genericPostPractice,
        genericPostBlock1,
        genericPostBlock2,
        genericPostBlock3,
        genericPostBlock4,
        genericEnd,
      ],
    };
  } else if (config.precue) {
    videoBlocks = {
      1: [
        preCueIntro,
        preCuePostPractice,
        preCueMidBlock1,
        preCueMidBlock2,
        preCueMidBlock3,
        preCueMidBlock4,
        preCueMidBlock5,
        preCuePostBlock1,
        preCuePostBlock2,
        preCuePostBlock3,
        preCuePostBlock4,
        preCueEnd,
      ],
    };
  } else if (config.pseudoFont) {
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
  if (config.dots) {
    videoBlocks = {
      1: [
        genericIntro1Es,
        genericIntro2Es,
        genericIntro3Es,
        genericIntro4Es,
        genericPostPracticeEs,
        genericPostBlock1Es,
        genericPostBlock2Es,
        genericPostBlock3Es,
        genericPostBlock4Es,
        genericEndEs,
      ]
    }
  } else if (config.pseudoFont) {
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

const imageBlocks = {
  2: [
    star,
    advance,
    flower,
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
