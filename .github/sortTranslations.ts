import { getSupportedLanguages, getTranslations } from '../src/Private/Translate';
import { sortJSON } from '../src/Utils/JSONUtils';
import { writeFileSync } from 'node:fs';
import type { Language } from '../src/types/main';

const checkOnly = process.argv.includes('--check');
let hasErrors = false;

function findTranslations(lang: Language) {
  const translations = getTranslations(lang);
  translations['!!'] = 'DO NOT TRANSLATE ANYTHING IN {example}';
  translations['!!!'] = 'THEY ARE VARIABLES';
  return translations;
}

getSupportedLanguages().forEach((lang) => {
  console.log(`Checking Translations for ${lang}`);
  const sorted = sortJSON(findTranslations(lang));
  if (checkOnly) {
    if (JSON.stringify(findTranslations(lang)) !== JSON.stringify(sorted)) {
      console.error(`Incorrect sort with ${lang}`);
      hasErrors = true;
    }
  } else {
    writeFileSync(`./translations/${lang}.json`, JSON.stringify(sorted, null, 2) + '\n');
  }
});

if (checkOnly && hasErrors) process.exit(1);
