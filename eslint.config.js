/* eslint-disable */
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-config-prettier';
import sortImports from '@j4cobi/eslint-plugin-sort-imports';
import ts from 'typescript-eslint';
import plugin from './eslint/plugin.js';
import json from '@eslint/json';
import { globalIgnores } from 'eslint/config';

export default [
  ...ts.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  prettier,
  globalIgnores(['./build/']),
  {
    ignores: ['data/config/*.json', 'translations/missing/*.json', 'minecraft-auth-cache/*', 'package.json'],
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    rules: {
      'json/no-duplicate-keys': 'error',
      'json/no-empty-keys': 'error',
      'json/no-unnormalized-keys': 'error',
      'json/no-unsafe-values': 'error',
      'json/sort-keys': 'error'
    }
  },
  {
    ignores: ['**/*.test.ts', 'build/*'],
    files: ['**/*.ts', '**/*.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: { ...globals.es2022, ...globals.node } },
    plugins: { 'sort-imports': sortImports, 'hypixelDiscordGuildChatBridge': plugin },
    rules: {
      'sort-imports/sort-imports': [
        'error',
        { ignoreCase: false, ignoreMemberSort: false, memberSyntaxSortOrder: ['all', 'single', 'multiple', 'none'] }
      ],
      'max-len': ['error', { code: 120, ignoreUrls: true, ignoreComments: true }],
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
      'hypixelDiscordGuildChatBridge/enforce-no-console-log': 'error',
      'hypixelDiscordGuildChatBridge/enforce-config-naming': 'error',
      'no-constant-condition': ['error', { checkLoops: false }],
      'import/enforce-node-protocol-usage': ['error', 'always'],
      'hypixelDiscordGuildChatBridge/enforce-translate': 'warn',
      'no-extend-native': ['warn', { exceptions: ['Object'] }],
      'prefer-const': ['warn', { destructuring: 'all' }],
      'import/no-cycle': ['error', { maxDepth: 1 }],
      'import/no-anonymous-default-export': 'error',
      'import/no-extraneous-dependencies': 'error',
      'curly': ['warn', 'multi-line', 'consistent'],
      '@typescript-eslint/no-explicit-any': 'off',
      'import/no-useless-path-segments': 'error',
      'import/prefer-default-export': 'error',
      'logical-assignment-operators': 'warn',
      'no-template-curly-in-string': 'error',
      'quote-props': ['error', 'as-needed'],
      'import/newline-after-import': 'warn',
      'import/no-dynamic-require': 'warn',
      'comma-dangle': ['error', 'never'],
      'import/no-absolute-path': 'error',
      'import/no-named-default': 'error',
      'no-useless-constructor': 'error',
      'no-useless-assignment': 'error',
      'no-inner-declarations': 'error',
      'import/no-self-import': 'error',
      'no-implicit-coercion': 'error',
      'import/no-deprecated': 'error',
      'import/no-namespace': 'error',
      'no-use-before-define': 'warn',
      'no-underscore-dangle': 'warn',
      'no-unneeded-ternary': 'error',
      'import/exports-last': 'error',
      'default-param-last': 'error',
      'import/no-commonjs': 'error',
      'one-var': ['warn', 'never'],
      'no-inline-comments': 'warn',
      'no-empty-function': 'error',
      'no-useless-return': 'error',
      'no-useless-rename': 'warn',
      'no-useless-concat': 'warn',
      'no-throw-literal': 'error',
      'default-case-last': 'warn',
      'no-self-compare': 'error',
      'no-new-wrappers': 'error',
      'no-lone-blocks': 'error',
      'no-undef-init': 'error',
      'no-else-return': 'warn',
      'no-extra-semi': 'error',
      'yoda': ['error', 'never'],
      'import/first': 'error',
      'require-await': 'warn',
      'default-case': 'error',
      'dot-notation': 'error',
      'no-sequences': 'warn',
      'no-multi-str': 'warn',
      'no-lonely-if': 'warn',
      'no-new-func': 'error',
      'camelcase': 'warn',
      'no-var': 'warn',
      'eqeqeq': 'warn',
      'semi': 'error'
    }
  }
];
