// import { QuestCreate } from "jsQUEST";
import { initJsPsych } from "jspsych";
import Papa from "papaparse";

/* set user mode */
const queryString = new URL(window.location).search;
const urlParams = new URLSearchParams(queryString);
const userMode = urlParams.get("mode") || "default";
const taskVariant = urlParams.get("variant") || "default";
const pid = urlParams.get("participant");

/* set dashboard redirect URLs: school as default */
const redirectInfo = {
  pilot: "https://reading.stanford.edu?g=910&c=1",
  default: "https://reading.stanford.edu?g=937&c=1",
};

function configTaskInfo() {
  let taskInfo;
  if (userMode === "default") {
    taskInfo = {
      taskId: "mep",
      taskName: "Multiple element processing",
      variantName: userMode,
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

export const config = {
  userMode: userMode,
  pid: pid,
  taskVariant: taskVariant,
  sessionId: `${taskVariant}-${userMode}`,
  userMetadata: {},
  testingOnly: userMode === "test" || userMode === "demo" || taskVariant === "pilot",
  timing: {
    targetDuration: 240, // milliseconds
    targetOnset: 600, // milliseconds
    postMaskOnset: 840, // milliseconds
    responseOnset: 940, // milliseconds
  },

  /* record date */
  startTime: new Date(),
};

export const jsPsych = initJsPsych({
  show_progress_bar: true,
  auto_update_progress_bar: false,
  message_progress_bar: "Progress Complete",
  on_finish: () => {
    // jsPsych.data.displayData();
    if (userMode !== "demo") {
      window.location.href = redirectInfo[taskVariant] || "https://reading.stanford.edu?g=901&c=1";
    }
  },
});

/* simple variable for calculating sum of an array */
const arrSum = (arr) => arr.reduce((a, b) => a + b, 0);

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

export const updateProgressBar = () => {
  const curr_progress_bar_value = jsPsych.getProgressBarCompleted();
  jsPsych.setProgressBar(curr_progress_bar_value + 1 / arrSum(config.stimulusCountList));
};
