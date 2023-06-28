// import { QuestCreate } from "jsQUEST";
import { initJsPsych } from "jspsych";
import Papa from "papaparse";
import store from "store2";

/* set user mode */
const queryString = new URL(window.location).search;
const urlParams = new URLSearchParams(queryString);
const userMode = urlParams.get("mode") || "default";
const taskVariant = urlParams.get("variant") || "default";
const pid = urlParams.get("participant") || null;
const language = urlParams.get("language") || "en";
const redirectTo = urlParams.get("redirectTo") || null;
const pipeline = urlParams.get("pipeline") || "rc";
const dots = urlParams.get("dots") || false;
const preCue = dots ? true : (urlParams.get("precue") === "true") || false;
const pseudoFont = preCue ? false : urlParams.get("latinFont") !== "true";

store.session.set("pid", pid);

// Set up different redirects if preCue is true
const redirect = () => {
  if (redirectTo === 'refresh') {
    window.location.reload();
  } else if (pseudoFont) {
    if (pipeline === "rc") {
      window.location.href = "https://reading.stanford.edu/?g=1084&c=1";
    } else if (pipeline === "multitudes") {
      window.location.reload();
    } else if (pipeline === "ucsfdc") {
      window.location.href = "https://reading.stanford.edu?g=1059&c=1";
    } else if (pipeline === "school") {
      window.location.href = "https://reading.stanford.edu/?g=1095&c=1";
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (pipeline === "rc") {
      window.location.href = "https://reading.stanford.edu?g=1058&c=1";
    } else if (pipeline === "multitudes") {
      window.location.reload();
    } else if (pipeline === "ucsfdc") {
      window.location.href = "https://reading.stanford.edu/?g=1175&c=1";
    } else if (pipeline === "school") {
      window.location.href = "https://reading.stanford.edu?g=898&c=1";
    }
  }
};

function configTaskInfo() {
  let taskInfo;
  if (userMode === "default") {
    taskInfo = {
      taskId: "mep",
      taskName: "Multiple element processing",
      variantName: `${pseudoFont ? "pseudo" : "letters"}-${pipeline}`,
      taskDescription: "This is a task measuring the automaticity of single character recognition.",
      variantDescription:
          "This variant uses one two-element block, two four-element blocks, and two six-element blocks.",
      blocks: [
        {
          blockNumber: 0,
          trialMethod: "fixed",
          corpus: "practice_block",
        },
        {
          blockNumber: 1,
          trialMethod: "fixed",
          corpus: "nchar-2_block-1",
        },
        {
          blockNumber: 2,
          trialMethod: "fixed",
          corpus: "nchar-4_block-1",
        },
        {
          blockNumber: 3,
          trialMethod: "fixed",
          corpus: "nchar-4_block-2",
        },
        {
          blockNumber: 4,
          trialMethod: "fixed",
          corpus: "nchar-6_block-1",
        },
        {
          blockNumber: 5,
          trialMethod: "fixed",
          corpus: "nchar-6_block-2",
        },
      ],
    };
  }
  return taskInfo;
}

export const taskInfo = configTaskInfo();

export const arrSum = (arr) => arr.reduce((a, b) => a + b, 0);

export const config = {
  userMode: userMode,
  taskVariant: taskVariant,
  sessionId: `${taskVariant}-${userMode}-${pseudoFont ? "pseudo" : "latin"}`,
  userMetadata: {},
  testingOnly: userMode === "test" || userMode === "demo" || taskVariant === "pilot",
  timing: {
    fixationDuration: 600, // milliseconds
    stimulusDuration: 240, // milliseconds
    maskDuration: 100, // milliseconds
    preCueDuration: 50, // milliseconds
  },
  practiceTiming: {
    fixationDuration: 1200, // milliseconds
    stimulusDuration: 1200, // milliseconds
    maskDuration: 100, // milliseconds
    preCueDuration: 50, // milliseconds
  },
  pseudoFont: pseudoFont,
  language: language.toLowerCase(),
  /* record date */
  startTime: new Date(),
  urlParams: urlParams,
  precue: preCue,
};

export const jsPsych = initJsPsych({
  show_progress_bar: true,
  auto_update_progress_bar: false,
  message_progress_bar: "Progress Complete",
  on_finish: () => {
    redirect();
  },
});

/* csv helper function */
export const readCSV = (url) =>
  new Promise((resolve) => {
    Papa.parse(url, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function (results) {
        const csv_stimuli = results.data;
        resolve(csv_stimuli);
      },
    });
  });
