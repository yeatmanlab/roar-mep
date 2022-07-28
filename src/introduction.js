import jsPsychAudioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";
import { config } from "./config";
import { imgContent, audioContent } from "./preload";

/* define instructions trial */
const intro_1 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.intro1,
  choices: "ALL_KEYS",
  response_allowed_while_playing: config.testingOnly,
  prompt: `<h1>Welcome to ROAR-MEP!</h1>
        <div class="button">Press <span class="yellow">ANY KEY</span> to continue </div>`,
  data: {
    start_time: config.startTime.toLocaleString("PST"),
    start_time_unix: config.startTime.getTime(),
  },
  on_start: function () {
    document.body.style.cursor = "none";
  },
};

const intro_2 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.intro2,
  response_allowed_while_playing: config.testingOnly,
  prompt: `
    <h1>Here is introduction header 2</h1>
    <div class="button">Press <span class="yellow">ANY KEY</span> to continue</div>
      `,
  // post_trial_gap: 2000,
  choices: "ALL_KEYS",
};

// class = stimulus_div style = "margin-top:20%">
const intro_3 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.intro3,
  response_allowed_while_playing: config.testingOnly,
  prompt: `
    <h1>Here is introduction header 3</h1>
    <div class="button">Press <span class="yellow">ANY KEY</span> to practice</div>`,
  choices: "ALL_KEYS",
};

export const introduction_trials = {
  timeline: [intro_1, intro_2, intro_3],
};

export const post_practice_intro = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.coinIntro,
  response_allowed_while_playing: config.testingOnly,
  prompt: `
    <h1>Great work, you are ready to begin the journey! </h1>
      <div>
        <p class="center"> You will earn gold coins along the way.</p>
        <img class = "coin" src="${imgContent.goldCoin}" alt="gold">
      </div>
    <div class="button">Press <span class="yellow">ANY KEY</span> to begin</div>`,
  choices: "ALL_KEYS",
};

// Countdown trial
const countdown_trial_3 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.countdown3,
  prompt: `<div class = stimulus_div><p class = 'stimulus'>3</p></div>`,
  choices: "NO_KEYS",
  trial_duration: 1000,
  data: {
    task: "countdown",
  },
};

const countdown_trial_2 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.countdown2,
  prompt: function () {
    return `<div class = stimulus_div><p class = 'stimulus'>2</p></div>`;
  },
  choices: "NO_KEYS",
  trial_duration: 1000,
  data: {
    task: "countdown",
  },
};

const countdown_trial_1 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.countdown1,
  prompt: function () {
    return `<div class = stimulus_div><p class = 'stimulus'>1</p></div>`;
  },
  choices: "NO_KEYS",
  trial_duration: 1000,
  data: {
    task: "countdown",
  },
};

const countdown_trial_0 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: audioContent.countdown0,
  prompt: function () {
    return `<div class = stimulus_div><p class = 'stimulus'>0</p></div>`;
  },
  choices: "NO_KEYS",
  trial_duration: 1000,
  data: {
    task: "countdown",
  },
};

export const countdown_trials = {
  timeline: [
    countdown_trial_3,
    countdown_trial_2,
    countdown_trial_1,
    countdown_trial_0,
  ],
};
