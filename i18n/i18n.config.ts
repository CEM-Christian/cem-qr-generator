import { currentLocales } from './i18n'

export default defineI18nConfig(() => {
  return {
    legacy: false,
    availableLocales: currentLocales.map(l => l.code),
    fallbackLocale: 'en-AU',
    fallbackWarn: true,
    missingWarn: true,
  }
})
