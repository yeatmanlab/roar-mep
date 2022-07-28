import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import { config } from "./config";
import { audioContent } from "./preload";

/* mid block page */
const mid_block_page_1 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.midBlock1,
  response_allowed_while_playing: config.testingOnly,
  choices: "ALL_KEYS",
  prompt: ` 
    <div>
        <h1>Good work!</h1>
    </div>
    <div class="button">Press <span class="yellow">ANY KEY</span> to continue</div>
   `,
};

const mid_block_page_2 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.midBlock2,
  response_allowed_while_playing: config.testingOnly,
  prompt: `
    <div>
      <h1>Amazing!</h1>
    </div>
    <div class="button">Press <span class="yellow">ANY KEY</span> to continue</div>
    `,
  choices: "ALL_KEYS",
};

const mid_block_page_3 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.midBlock3,
  response_allowed_while_playing: config.testingOnly,
  prompt: `
    <div>
      <h1>Fantastic Work!</h1>
    </div>
    <div class="button">Press <span class="yellow">ANY KEY</span> to continue</div>
    `,
  choices: "ALL_KEYS",
};

// post block page
const post_block_page_1 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.endBlock1,
  response_allowed_while_playing: config.testingOnly,
  prompt: `
    <div>
      <h1>Congratulations!</h1>
    </div>
    <div class="button">Press <span class="yellow">ANY KEY</span> to continue</div>
    `,
  choices: "ALL_KEYS",
};

const post_block_page_2 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.endBlock2,
  response_allowed_while_playing: config.testingOnly,
  prompt: `
    <div>
      <h1>Congratulations!</h1>
    </div>
    <div class="button">Press <span class="yellow">ANY KEY</span> to continue</div>
    `,
  choices: "ALL_KEYS",
};

const mid_block_page_list = [
  mid_block_page_1,
  mid_block_page_2,
  mid_block_page_3,
];

const post_block_page_list = [post_block_page_1, post_block_page_2];

const final_page = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.endGame,
  response_allowed_while_playing: config.testingOnly,
  prompt: `
    <div>
      <h1>Congratulations! You have finished!</h1>
    </div>
    <div class="button">Press <span class="yellow">ANY KEY</span> to save your work</div>
    `,
  choices: "ALL_KEYS",
  on_finish: function () {
    document.body.style.cursor = "auto";
  },
};

export { mid_block_page_list, post_block_page_list, final_page };
