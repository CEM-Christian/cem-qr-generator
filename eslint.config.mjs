// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu(),
  {
    ignores: [
      'app/components/ui',
      '.data',
      'public/*.json',
      // Exclude documentation files from linting
      'docs/**/*.md',
      '.github/**/*.md',
      '*.md',
      'README.md',
    ],
  },
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-console': 'off',
      'node/prefer-global/process': 'off',
      'vue/no-v-html': 'off',
    },
  },
)
