// @ts-check
import antfu from '@antfu/eslint-config'
import nuxt from './.nuxt/eslint.config.mjs'

export default nuxt(
  antfu(
    {
      unocss: true,
      formatters: true,
      rules: {
        'no-console': 'off',
        'style/max-statements-per-line': 'off',
        'node/prefer-global/process': 'off', // 允许使用 process
      },
    },
  ),
)
