import antfu from '@antfu/eslint-config'
import pluginNext from '@next/eslint-plugin-next'
import youMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect'

export default antfu({
  formatters: true,
  react: true,
  plugins: {
    '@next/next': pluginNext,
    'react-you-might-not-need-an-effect': youMightNotNeedAnEffect,
  },
  rules: {
    ...pluginNext.configs.recommended.rules,
    ...pluginNext.configs['core-web-vitals'].rules,
    'node/prefer-global/process': 'off',
    'react-you-might-not-need-an-effect/you-might-not-need-an-effect': 'warn',
  },
  ignores: [
    'public/**/*',
  ],
})
