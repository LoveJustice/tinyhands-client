import i18n, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as en from '../src/translations/en.json';

const initializei18n = async () => {
  const options = {
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en,
    },
    lng: 'en', // if you're using a language detector, do not define the lng option
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
    returnNull: false,
  } as InitOptions;
  await i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init(options, null);
};

export default initializei18n;
