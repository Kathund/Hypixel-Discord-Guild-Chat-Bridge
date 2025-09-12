/* eslint-disable hypixelDiscordGuildChatBridge/enforce-no-console-log */
import Translate, { getSupportedLanguages, getTranslations } from '../src/Private/Translate';
import { getSupportedTimezones } from '../src/Private/TimeZones';
import { sortJSON } from '../src/Utils/JSONUtils';
import { writeFileSync } from 'node:fs';
import type { Language } from '../src/Types/Data';

const args: string[] = process.argv.slice(2);

class Lang {
  lang: Language;
  translations: Record<string, string | undefined>;
  index: number;
  array: string[];
  constructor(lang: Language, mainCheck: boolean = false, index: number = 0, array: string[] = []) {
    if (mainCheck) console.log(`Checking Translations for ${lang}`);
    this.lang = lang;
    this.translations = getTranslations(this.lang);
    this.translations['!!'] = 'DO NOT TRANSLATE ANYTHING IN {example}';
    this.translations['!!!'] = 'THEY ARE VARIABLES';
    this.index = index;
    this.array = array;
    if (this.lang === 'en_us') this.injectTimezones();
    if (this.lang !== 'en_us') this.cleanKeys();
    if (this.lang !== 'en_us' && args.includes('--missing')) this.generateMissing();
    if (mainCheck) this.saveTranslations();
  }

  injectTimezones() {
    getSupportedTimezones().forEach((timezone) => {
      if (this.translations[`config.options.misc.timezone.${timezone.replaceAll('/', '.')}`] === undefined) {
        this.translations[`config.options.misc.timezone.${timezone.replaceAll('/', '.')}`] = timezone;
      }
    });
  }

  filterTimezoneKeys(keys: string[]): string[] {
    return keys
      .filter((key) => getSupportedTimezones().includes(key) === false)
      .filter(
        (key) => key === 'config.options.misc.timezone.description' || !key.startsWith('config.options.misc.timezone.')
      );
  }

  cleanKeys() {
    const english = new Lang('en_us');
    const keys = Object.keys(english.translations);
    const currentLang = this.translations;
    this.translations = {};
    this.filterTimezoneKeys(Object.keys(currentLang)).forEach((key) => {
      if (keys.includes(key)) this.translations[key] = currentLang[key];
    });
  }

  generateMissing() {
    this.filterTimezoneKeys(Object.keys(new Lang('en_us').translations)).forEach((key) => Translate(key, this.lang));
  }

  saveTranslations() {
    writeFileSync(`./translations/${this.lang}.json`, JSON.stringify(sortJSON(this.translations), null, 2) + '\n');

    const currentLang = this.filterTimezoneKeys(Object.keys(this.translations));
    const englishLang = this.filterTimezoneKeys(Object.keys(new Lang('en_us').translations));

    const amount = Math.floor((currentLang.length / englishLang.length) * 100);
    console.log(`Updated translations for ${this.lang}. (${amount}% translated from english)`);
    if (this.index !== this.array.length - 1) console.log('\n');
  }
}

getSupportedLanguages().forEach((lang, index, array) => new Lang(lang, true, index, array));
