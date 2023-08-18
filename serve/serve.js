import { RoarAppkit, initializeFirebaseProject } from '@bdelab/roar-firekit';
import store from 'store2';
import RoarMEP from "../src/index";
import { roarConfig } from "./firebaseConfig";
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'

// Import necessary for async in the top level of the experiment script
import "regenerator-runtime/runtime";

const queryString = new URL(window.location).search;
const urlParams = new URLSearchParams(queryString);
const userMode = urlParams.get("mode") || "default";
const taskVariant = urlParams.get("variant") || "default";
const pid = urlParams.get("participant") || null;
const language = urlParams.get("language") || "en";
const redirectTo = urlParams.get("redirectTo") || null;
const pipeline = urlParams.get("pipeline") || "rc";
const dots = urlParams.get("dots") || false;
const precue = dots ? true : (urlParams.get("precue") === "true") || false;
const pseudoFont = precue ? false : urlParams.get("latinFont") !== "true";

store.session.set("pid", pid);

// @ts-ignore
const appKit = await initializeFirebaseProject(roarConfig.firebaseConfig, 'assessmentApp', 'none');

onAuthStateChanged(appKit.auth, (user) => {
  if (user) {
    const userInfo = {
      pid,
      assessmentUid: user.uid,
      userMetadata: { },
    };

    const userParams = {
      taskVariant,
      urlParams,
    }

    const gameParams = {
      userMode,
      language,
      redirectTo,
      pipeline,
      precue,
      pseudoFont,
    };

    const taskInfo = {
      taskId: 'mep',
      variantParams: gameParams,
    }

    const firekit = new RoarAppkit({
      firebaseProject: appKit,
      taskInfo,
      userInfo,
    })

    const roarApp = new RoarMEP(firekit, gameParams, userParams);

    roarApp.run();
  }
});

await signInAnonymously(appKit.auth);
