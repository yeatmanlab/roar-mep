// npm run serve:dev
// jsPsych imports
import jsPsychFullScreen from "@jspsych/plugin-fullscreen";
import { jsPsych } from "./jsPsych";

// Import necessary for async in the top level of the experiment script
import "regenerator-runtime/runtime";

// Local modules
import { initRoarJsPsych, initRoarTimeline } from "./config/config";
import "./css/game_v4.css";
import { preloadTrials, pushMEPTrials } from "./experimentHelpers";
import { corpora } from "./config/corpus";
import { videoTrials } from "./trials/videos";
import { exit_fullscreen } from "./trials/fullScreen";

// eslint-disable-next-line import/prefer-default-export
export function buildExperiment(config) {
  initRoarJsPsych(config);
  const initialTimeline = initRoarTimeline(config);

  const timeline = [preloadTrials, ...initialTimeline.timeline];
  if (config.precue) {
    timeline.push(...videoTrials.intro);
    timeline.push(...pushMEPTrials(corpora.practice, true, config));
    timeline.push(...videoTrials.postPractice);
    timeline.push(...pushMEPTrials(corpora.b1a, false, config));
    timeline.push(...videoTrials.midBlock1);
    timeline.push(...pushMEPTrials(corpora.b1b, false, config));
    timeline.push(...videoTrials.postBlock1);
    timeline.push(...pushMEPTrials(corpora.b2a, false, config));
    timeline.push(...videoTrials.midBlock2);
    timeline.push(...pushMEPTrials(corpora.b2b, false, config));
    timeline.push(...videoTrials.postBlock2);
    timeline.push(...pushMEPTrials(corpora.b3a, false, config));
    timeline.push(...videoTrials.midBlock3);
    timeline.push(...pushMEPTrials(corpora.b3b, false, config));
    timeline.push(...videoTrials.postBlock3);
    timeline.push(...pushMEPTrials(corpora.b4a, false, config));
    timeline.push(...videoTrials.midBlock4);
    timeline.push(...pushMEPTrials(corpora.b4b, false, config));
    timeline.push(...videoTrials.postBlock4);
    timeline.push(...pushMEPTrials(corpora.b5a, false, config));
    timeline.push(...videoTrials.midBlock5);
    timeline.push(...pushMEPTrials(corpora.b5b, false), config);
    timeline.push(...videoTrials.end);
  } else {
    const fourElementBlocks = [];
    timeline.push(...videoTrials.intro);
    timeline.push(...pushMEPTrials(corpora.practice, true, config));
    timeline.push(...videoTrials.postPractice);
    timeline.push(...pushMEPTrials(corpora.n2a, false, config));
    timeline.push(...videoTrials.postTwoLetterBlock);
    timeline.push(...pushMEPTrials(corpora.n2b, false, config));
    fourElementBlocks.push(...videoTrials.postBlock1);
    fourElementBlocks.push(...pushMEPTrials(corpora.n4a, false, config, fourElementBlocks));
    fourElementBlocks.push(...videoTrials.rewardAnimation1);
    fourElementBlocks.push(...pushMEPTrials(corpora.n4b, false, config, fourElementBlocks));

    // Add a conditional timeline to terminate when accuracy is < 4/24 correct for the easy trials
    const if4ElementBlocks = {
      timeline: fourElementBlocks,
      conditional_function: function () {
        // get the data from the previous trials,
        // and check whether we should continue
        const correctTrials = jsPsych.data.get().filter({ correct: true, task: "test_response" });
        return correctTrials.trials.length > 4;
      },
    };

    timeline.push(if4ElementBlocks);

    timeline.push(...videoTrials.end);
  }

  timeline.push(exit_fullscreen);

  return { jsPsych, timeline };
}
