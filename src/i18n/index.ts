import en from '../assets/translations/en.json';
import es from '../assets/translations/es.json';

export const languages = {
  en: 'English',
  es: 'Español',
};

export const defaultLang = 'en';

export type Lang = keyof typeof languages;

const translations = { en, es } as const;

type TranslationValue = string | unknown[];

export function useTranslations(lang: Lang) {
  return function t(key: string): TranslationValue {
    const keys = key.split('.');

    // Try the requested language first
    let value: unknown = translations[lang];
    let found = true;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        found = false;
        break;
      }
    }

    if (found) {
      if (typeof value === 'string') return value;
      if (Array.isArray(value)) return value;
    }

    // Fallback to default language (English)
    if (lang !== defaultLang) {
      value = translations[defaultLang];
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          return key;
        }
      }
      if (typeof value === 'string') return value;
      if (Array.isArray(value)) return value;
    }

    return key;
  };
}

