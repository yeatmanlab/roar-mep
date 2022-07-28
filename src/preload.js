import jsPsychPreload from "@jspsych/plugin-preload";

// Audio files
import countdown0 from "./assets/audio/countdown0.mp3";
import countdown1 from "./assets/audio/countdown1.mp3";
import countdown2 from "./assets/audio/countdown2.mp3";
import countdown3 from "./assets/audio/countdown3.mp3";

// Image files
// import image1 from "./assets/image1.gif";
// import image2 from "./assets/image2.png";
// import image3 from "./assets/image3.png";
// Character svg images

function importAll(r) {
  const chars = {};
  r.keys().forEach((char) => { chars[char.replace('./', '')] = r(char); });
  return chars;
}

export const characters = importAll(require.context('./assets/svg', false, /\.(svg)$/));

const audioBlocks = {
  1: [
    countdown0,
    countdown1,
    countdown2,
    countdown3,
  ],
};

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

export const audioContent = preloadObj2contentObj(audioBlocks);

const preload_audio_trials = Object.entries(audioBlocks).map((element) => {
  const idx = element[0];
  const audio_block = element[1];
  return {
    type: jsPsychPreload,
    audio: audio_block,
    auto_preload: false,
    message: `${idx} Please wait while the experiment loads.`,
    show_progress_bar: true,
    show_detailed_errors: true,
  };
});

const imageBlocks = {
  2: [
    // image1, image2, image3
  ],
};

// Automatically populate the audioContent object with the audio files
export const imgContent = preloadObj2contentObj(imageBlocks);

const preload_img_trials = Object.entries(imageBlocks).map((element) => {
  const idx = element[0];
  const img_block = element[1];
  return {
    type: jsPsychPreload,
    images: img_block,
    auto_preload: false,
    message: `${idx} Please wait while the experiment loads. This may take a few minutes.`,
    show_progress_bar: true,
    show_detailed_errors: true,
  };
});

export const preload_trials = [...preload_audio_trials, ...preload_img_trials];
