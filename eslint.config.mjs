import antfu from '@antfu/eslint-config'
import reactYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect'

export default antfu({
  formatters: true,
  react: true,
  nextjs: true,
  plugins: {
    'react-you-might-not-need-an-effect': reactYouMightNotNeedAnEffect,
  },
  rules: {
    ...reactYouMightNotNeedAnEffect.configs.recommended.rules,
    'node/prefer-global/process': 'off',
  },
  ignores: [
    'drizzle/**/*',
    'public/**/*',
  ],
})
