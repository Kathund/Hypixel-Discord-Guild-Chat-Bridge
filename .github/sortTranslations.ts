import { getSupportedLanguages, getTranslations } from '../src/Private/Translate';
import { sortJSON } from '../src/Utils/JSONUtils';
import { writeFileSync } from 'node:fs';
import type { Language } from '../src/types/main';

function findTranslations(lang: Language) {
  const translations = getTranslations(lang);
  translations['!!'] = 'DO NOT TRANSLATE ANYTHING IN {example}';
  translations['!!!'] = 'THEY ARE VARIABLES';
  return translations;
}

getSupportedLanguages().forEach((lang) => {
  console.log(`Checking Translations for ${lang}`);
  const sorted = sortJSON(findTranslations(lang));
  const timezones = Intl.supportedValuesOf('timeZone');
  timezones.push('UTC');
  timezones.forEach((timezone) => {
    if (sorted[`config.options.misc.timezone.${timezone.replaceAll('/', '.')}`] === undefined) {
      sorted[`config.options.misc.timezone.${timezone.replaceAll('/', '.')}`] = timezone;
    }
  });

  writeFileSync(`./translations/${lang}.json`, JSON.stringify(sortJSON(sorted), null, 2) + '\n');
});
