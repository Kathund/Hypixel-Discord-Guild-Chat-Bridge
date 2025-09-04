import { sortJSON } from '../src/Utils/JSONUtils';
import { writeFileSync } from 'node:fs';
import type { Language } from '../src/types/main';
import { getSupportedLanguages, getTranslations } from '../src/Private/Translate';

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
    if (mainCheck) this.saveTranslations();
  }

  getTimezones(): string[] {
    const timezones = Intl.supportedValuesOf('timeZone');
    timezones.push('UTC');
    return timezones;
  }

  injectTimezones() {
    const timezones = this.getTimezones();
    timezones.forEach((timezone) => {
      if (this.translations[`config.options.misc.timezone.${timezone.replaceAll('/', '.')}`] === undefined) {
        this.translations[`config.options.misc.timezone.${timezone.replaceAll('/', '.')}`] = timezone;
      }
    });
  }

  cleanKeys() {
    const english = new Lang('en_us');
    const keys = Object.keys(english.translations);
    const currentLang = this.translations;
    this.translations = {};
    Object.keys(currentLang)
      .filter((key) => this.getTimezones().includes(key) === false)
      .filter((key) => !key.startsWith('config.options.misc.timezone.'))
      .forEach((key) => {
        if (keys.includes(key)) this.translations[key] = currentLang[key];
      });
  }

  saveTranslations() {
    writeFileSync(`./translations/${this.lang}.json`, JSON.stringify(sortJSON(this.translations), null, 2) + '\n');

    const currentLang = Object.keys(this.translations).filter(
      (key) => !key.startsWith('config.options.misc.timezone.')
    );
    const englishLang = Object.keys(new Lang('en_us').translations).filter(
      (key) => !key.startsWith('config.options.misc.timezone.')
    );

    const amount = Math.floor((currentLang.length / englishLang.length) * 100);
    console.log(`Updated translations for ${this.lang}. (${amount}% translated from english)`);
    if (this.index !== this.array.length - 1) console.log('\n');
  }
}

getSupportedLanguages().forEach((lang, index, array) => new Lang(lang, true, index, array));
