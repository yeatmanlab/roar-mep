import i18next from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en/translations.json';
// import enCorpusPractice from "./corpus/practice-sentences.csv";
// import enCorpusLab from "./corpus/sre-lab-sentence-id-lookup.csv";
// import enCorpusTOSREC from "./corpus/sre-tosrec-sentence-id-lookup.csv";
// import enCorpusAI from "./corpus/sre-ai-sentence-id-lookup.csv";

const languageDetector = new LanguageDetector();

languageDetector.addDetector({
  name: 'defaultToEnglish',
  lookup(options) {
    return 'en';
  },
});

// To change the language with a querystring, append "?lng=LANGUAGE" to the the URL
// LANGUAGE here refers to the the language code
// Ex. For Spanish: https://roar-swr-demo.web.app/?lng=es
// With multiple querystrings: https://roar-swr-demo.web.app/?mode=demo&lng=es

i18next
  .use(LanguageDetector)
  // .on('initialized', handleLanguageDetection)
  .init({
    debug: false,
    // which langauage codes to use. Ex. if 'en-US' detected, will use 'en'
    load: 'languageOnly',
    fallbackLng: 'en',
    detection: {
      order: ['defaultToEnglish', 'querystring'],
    },
    resources: {
      en: {
        translation: enTranslations,
      },
      es: {
        translation: 'esTranslations',
      },
      it: {
        translation: 'itTranslations',
      },
    },
  });

// eslint-disable-next-line import/prefer-default-export
// export const sentenceList = {
//   en: {
//     corpusPractice: enCorpusPractice,
//     corpusLab: enCorpusLab,
//     corpusTOSREC: enCorpusTOSREC,
//     corpusAI: enCorpusAI,
//   },
//   es: {
//     corpusPractice: '',
//     corpusLab: '',
//     corpusTOSREC: '',
//     corpusAI: '',
//   },
//   it: {
//     corpusPractice: '',
//     corpusLab: '',
//     corpusTOSREC: '',
//     corpusAI: '',
//   },
// }