import i18n from 'i18next'

import { initReactI18next } from 'react-i18next'

import LanguageDetector from 'i18next-browser-languagedetector'

import pt from './pt'
import en from './en'

const resources = {
  pt: {
    translation: pt,
  },

  en: {
    translation: en,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,

    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: [
        'localStorage',
        'navigator',
        'htmlTag',
        'path',
        'subdomain',
      ],

      caches: ['localStorage'],
    },
  })

export default i18n