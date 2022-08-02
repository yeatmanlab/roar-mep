// import { QuestCreate } from "jsQUEST";
import { initJsPsych } from "jspsych";
import Papa from "papaparse";

/* set user mode */
const queryString = new URL(window.location).search;
const urlParams = new URLSearchParams(queryString);
const userMode = urlParams.get("mode") || "default";
const taskVariant = urlParams.get("variant") || "default";
const pid = urlParams.get("participant");
const pseudoFont = urlParams.get("latinFont") !== "true";
const redirectTo = urlParams.get("redirectTo") || "refresh";

const redirect = () => {
  if (redirectTo === 'refresh') {
    window.location.reload();
  } else {
    window.location.href = pseudoFont ? "https://reading.stanford.edu/?g=1059&c=1" : "https://reading.stanford.edu/?g=1058&c=1";
  }
};

function configTaskInfo() {
  let taskInfo;
  if (userMode === "default") {
    taskInfo = {
      taskId: "mep",
      taskName: "Multiple element processing",
      variantName: `${userMode}-${pseudoFont ? "pseudo" : "latin"}`,
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
  pid: pid,
  taskVariant: taskVariant,
  sessionId: `${taskVariant}-${userMode}-${pseudoFont ? "pseudo" : "latin"}`,
  userMetadata: {},
  testingOnly: userMode === "test" || userMode === "demo" || taskVariant === "pilot",
  timing: {
    fixationDuration: 600, // milliseconds
    stimulusDuration: 240, // milliseconds
    maskDuration: 100, // milliseconds
  },
  practiceTiming: {
    fixationDuration: 1200, // milliseconds
    stimulusDuration: 1200, // milliseconds
    maskDuration: 100, // milliseconds
  },
  pseudoFont: pseudoFont,
  /* record date */
  startTime: new Date(),
  urlParams: urlParams,
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
