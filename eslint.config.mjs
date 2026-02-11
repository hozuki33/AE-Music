import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      }
    }
  },

  js.configs.recommended,
  configPrettier,

  ...tseslint.configs.recommended,

  pluginReact.configs.flat.recommended,

  {
    plugins: { prettier: pluginPrettier },
    rules: {
      ...pluginPrettier.configs.recommended.rules, // 应用 Prettier 规则
      'prettier/prettier': 'error', // 格式问题报 ESLint 错误
      '@typescript-eslint/no-var-requires': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    }
  }
])
