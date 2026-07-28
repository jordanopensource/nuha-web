import withNuxt from './.nuxt/eslint.config.mjs'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default withNuxt([
  eslintPluginPrettierRecommended,
  {
    name: 'nuha/primevue-pt-hyphenation',
    rules: {
      // PrimeVue passthrough (`pt:`) attributes must stay camelCase to match
      'vue/attribute-hyphenation': ['warn', 'always', { ignore: ['pt:'] }],
    },
  },
])
