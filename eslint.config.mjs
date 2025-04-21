import antfu from '@antfu/eslint-config'
import pluginNext from '@next/eslint-plugin-next'

export default antfu({
  formatters: true,
  react: true,
  plugins: {
    '@next/next': pluginNext,
  },

  rules: {
    ...pluginNext.configs.recommended.rules,
    ...pluginNext.configs['core-web-vitals'].rules,
  },
  ignores: [
    'public/**/*',
  ],
})
