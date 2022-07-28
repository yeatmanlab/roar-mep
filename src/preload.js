import jsPsychPreload from "@jspsych/plugin-preload";

// Character svg images
function importAll(r) {
  const chars = {};
  r.keys().forEach((char) => { chars[char.replace('./', '')] = r(char); });
  return chars;
}

export const characters = importAll(require.context('./assets/svg', false, /\.(svg)$/));
console.log(characters);

// Audio files
// import intro1 from "./assets/intro1.mp3";
// import intro2 from "./assets/intro2.mp3";
// import intro3 from "./assets/intro3.mp3";

// Image files
// import image1 from "./assets/image1.gif";
// import image2 from "./assets/image2.png";
// import image3 from "./assets/image3.png";

const audioBlocks = {
  1: [
    // intro1,
    // intro2,
    // intro3,
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
