import antfu from '@antfu/eslint-config'
import pluginNext from '@next/eslint-plugin-next'
import reactYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect'

export default antfu({
  formatters: true,
  react: true,
  plugins: {
    '@next/next': pluginNext,
  },
  rules: {
    ...reactYouMightNotNeedAnEffect.configs.recommended.rules,
    ...pluginNext.configs.recommended.rules,
    ...pluginNext.configs['core-web-vitals'].rules,
    'node/prefer-global/process': 'off',
  },
  ignores: [
    'public/**/*',
  ],
})
