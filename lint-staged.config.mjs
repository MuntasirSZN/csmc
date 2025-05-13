export default {
  '*': 'eslint .',
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json',
}
