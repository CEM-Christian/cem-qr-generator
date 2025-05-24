import type { LocaleObject } from '@nuxtjs/i18n'

const locales: LocaleObject[] = [
  {
    code: 'zh-CN',
    file: 'zh-CN.json',
    name: '简体中文',
    emoji: '🇨🇳',
  },
  {
    code: 'zh-TW',
    file: 'zh-TW.json',
    name: '繁體中文',
    emoji: '🇹🇼',
<<<<<<< HEAD
  },
  
  {
    code: 'en-US',
    file: 'en-US.json',
    name: 'English',
    emoji: '🇺🇸',
=======
>>>>>>> 76e4022 (style: eslint)
  },
  {
<<<<<<< HEAD
    code: 'fr-FR',
    file: 'fr-FR.json',
    name: 'Français',
    emoji: '🇫🇷',
  },
=======
    code: 'vi-VN',
    file: 'vi-VN.json',
    name: 'Tiếng Việt',
    emoji: '🇻🇳',
<<<<<<< HEAD
  }
>>>>>>> 7594366 (feat: add Vietnamese translation)
=======
  },
  {
    code: 'de-DE',
    file: 'de-DE.json',
    name: 'Deutsch',
    emoji: '🇩🇪',
  },
>>>>>>> 89ce335 (feat: add German translation)
]

function buildLocales() {
  const useLocales = Object.values(locales).reduce((acc, data) => {
    acc.push(data)

    return acc
  }, <LocaleObject[]>[])

  return useLocales.sort((a, b) => a.code.localeCompare(b.code))
}

export const currentLocales = buildLocales()
