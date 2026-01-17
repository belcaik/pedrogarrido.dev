import en from '../assets/translations/en.json';
import es from '../assets/translations/es.json';

export const languages = {
  en: 'English',
  es: 'Español',
};

export const defaultLang = 'en';

export type Lang = keyof typeof languages;

const translations = { en, es } as const;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

type TranslationValue = string | string[];

export function useTranslations(lang: Lang) {
  return function t(key: string): TranslationValue {
    const keys = key.split('.');
    let value: unknown = translations[lang];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        // Fallback to English
        value = translations[defaultLang];
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = (value as Record<string, unknown>)[fallbackKey];
          } else {
            return key;
          }
        }
        break;
      }
    }

    if (typeof value === 'string') return value;
    if (Array.isArray(value) && value.every((v) => typeof v === 'string')) return value;
    return key;
  };
}

export function getLocalizedPath(path: string, lang: Lang): string {
  return `/${lang}${path.startsWith('/') ? path : '/' + path}`;
}
