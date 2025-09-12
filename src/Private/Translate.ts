import HypixelDiscordGuildBridgeError from './Error';
// eslint-disable-next-line import/no-cycle
import MiscConfig from '../Config/Configs/MiscConfig';
import StringOption from '../Config/Options/String';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import type { Language } from '../Types/Data';

function parseKeyForTranslation(key: string): string {
  return key.replaceAll('/', '.');
}

// eslint-disable-next-line import/exports-last
export function getSupportedLanguages(): Language[] {
  try {
    if (!existsSync('./translations')) throw new Error('Translations are missing');
    const translations = readdirSync('./translations');
    return translations.filter((lang) => lang.endsWith('.json')).map((lang) => lang.split('.')[0] as Language);
  } catch (error) {
    console.error(error);
    return [];
  }
}

// eslint-disable-next-line import/exports-last
export function getUserLanguage(): Language {
  if (process.platform !== 'linux') return 'en_us';
  if (process.env.LANG === undefined) return 'en_us';
  const userLang = process.env.LANG.split('.')[0].trim().toLowerCase() as Language;
  if (getSupportedLanguages().includes(userLang)) return userLang;
  return 'en_us';
}

// eslint-disable-next-line import/exports-last
export function getSelectedLanguage(): Language {
  try {
    const lang = (new MiscConfig().getValue('lang') || new StringOption('en_us')).getValue() as Language;
    if (!getSupportedLanguages().includes(lang)) {
      throw new Error("Invalid language found. Please reset you're config");
    }
    return lang;
  } catch (error) {
    // eslint-disable-next-line hypixelDiscordGuildChatBridge/enforce-no-console-log
    console.log(error);
    return 'en_us';
  }
}

function logMissingTranslation(key: string, lang: Language = getSelectedLanguage()) {
  if (!existsSync('./translations')) mkdirSync('./translations/', { recursive: true });
  if (!existsSync('./translations/missing')) mkdirSync('./translations/missing/', { recursive: true });
  if (!existsSync(`./translations/missing/${lang}.json`)) {
    writeFileSync(`./translations/missing/${lang}.json`, JSON.stringify({}));
  }
  const missingFile = readFileSync(`./translations/missing/${lang}.json`);
  if (!missingFile) throw new HypixelDiscordGuildBridgeError("The missing translations file doesn't exist");
  const missing = JSON.parse(missingFile.toString('utf8'));
  if (!missing) throw new HypixelDiscordGuildBridgeError('The missing translations file is malformed.');
  missing[key] = `Could not find translation for \`${key}\` in \`${lang}\``;
  writeFileSync(`./translations/missing/${lang}.json`, JSON.stringify(missing, null, 2));
}

export function getTranslations(lang: Language = getSelectedLanguage()): { [key: string]: string } {
  try {
    if (!getSupportedLanguages().includes(lang)) {
      throw new HypixelDiscordGuildBridgeError(`Translations are missing for ${lang} language`);
    }
    const translationsFile = readFileSync(`./translations/${lang}.json`);
    if (!translationsFile) throw new HypixelDiscordGuildBridgeError(`The ${lang} translations file doesn't exist`);
    const translations = JSON.parse(translationsFile.toString('utf8'));
    if (!translations) throw new HypixelDiscordGuildBridgeError(`The ${lang} translations file is malformed`);
    return translations;
  } catch (error) {
    console.error(error);
    return {};
  }
}

export function unTranslate(translation: string, lang: Language = getSelectedLanguage()): string {
  const supportedLanguages = getSupportedLanguages();
  if (!supportedLanguages.includes(lang)) return `Unsupported Language | ${translation}`;
  const translations = getTranslations(lang);
  const entry = Object.entries(translations).find(([, value]) => value === translation);
  if (!entry) {
    return lang === 'en_us' ? `Unknown Key | ${translation}` : unTranslate(translation, 'en_us');
  }
  return entry[0];
}

export default function Translate(key: string, lang: Language = getSelectedLanguage()): string {
  key = parseKeyForTranslation(key);
  const supportedLanguages = getSupportedLanguages();
  if (!supportedLanguages.includes(lang)) return `Unsupported Language | ${key}`;
  const translations = getTranslations(lang);
  if (translations[key] === undefined) {
    logMissingTranslation(key, lang);
    return lang === 'en_us' ? `Unknown Translation | ${key}` : Translate(key, 'en_us');
  }
  return translations[key];
}
