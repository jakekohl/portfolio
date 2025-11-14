import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import pluginCypress from 'eslint-plugin-cypress';
import pluginImport from 'eslint-plugin-import';

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  // Base configuration for all files
  {
    name: 'app/base',
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.node,
      },
    },
  },

  // JavaScript recommended rules
  js.configs.recommended,

  // Vue essential rules
  ...pluginVue.configs['flat/essential'],

  // Import plugin configuration
  {
    name: 'app/import',
    plugins: {
      import: pluginImport,
    },
    rules: {
      // Airbnb-style import rules
      'import/extensions': ['error', 'ignorePackages', {
        js: 'never',
        jsx: 'never',
        vue: 'always',
      }],
      'import/no-unresolved': 'off', // Vue files need special handling
      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': ['error', {
        devDependencies: [
          '**/*.test.js',
          '**/*.spec.js',
          '**/*.cy.js',
          'cypress/**/*',
          'cypress.config.js',
          '**/vite.config.js',
          '**/eslint.config.js',
        ],
      }],
    },
  },

  // Vue-specific rules with Airbnb standards
  {
    name: 'app/vue',
    files: ['**/*.vue'],
    rules: {
      // Vue component structure
      'vue/multi-word-component-names': 'warn',
      'vue/no-unused-vars': 'error',
      'vue/no-unused-components': 'error',
      'vue/require-default-prop': 'error',
      'vue/require-prop-types': 'error',
      'vue/order-in-components': ['error', {
        order: [
          'el',
          'name',
          'key',
          'parent',
          'functional',
          ['delimiters', 'comments'],
          ['components', 'directives', 'filters'],
          'extends',
          'mixins',
          ['provide', 'inject'],
          'ROUTER_GUARDS',
          'layout',
          'middleware',
          'validate',
          'scrollToTop',
          'transition',
          'loading',
          'inheritAttrs',
          'model',
          ['props', 'propsData'],
          'emits',
          'setup',
          'asyncData',
          'data',
          'fetch',
          'head',
          'computed',
          'watch',
          'watchQuery',
          'LIFECYCLE_HOOKS',
          'methods',
          ['template', 'render'],
          'renderError',
        ],
      }],
      // Airbnb-style Vue rules
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/no-template-key': 'error',
      'vue/no-v-html': 'warn',
      'vue/require-v-for-key': 'error',
      'vue/use-v-on-exact': 'error',
    },
  },

  // General JavaScript rules with Airbnb standards
  {
    name: 'app/javascript',
    files: ['**/*.{js,mjs,jsx}'],
    rules: {
      // Airbnb style rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'template-curly-spacing': 'error',
      'arrow-spacing': 'error',
      'comma-dangle': ['error', 'always-multiline'],
      'comma-spacing': 'error',
      'comma-style': 'error',
      'computed-property-spacing': 'error',
      'func-call-spacing': 'error',
      'key-spacing': 'error',
      'keyword-spacing': 'error',
      'object-curly-spacing': ['error', 'always'],
      semi: ['error', 'always'],
      'space-before-blocks': 'error',
      'space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      }],
      'space-in-parens': 'error',
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',
      'spaced-comment': ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'jsx-quotes': ['error', 'prefer-double'],
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
      indent: ['error', 2, { SwitchCase: 1 }],
      'max-len': ['error', {
        code: 100,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],
      'no-multi-spaces': 'error',
      'no-mixed-spaces-and-tabs': 'error',
      'no-tabs': 'error',
      'array-bracket-spacing': ['error', 'never'],
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      camelcase: ['error', { properties: 'never' }],
      'consistent-return': 'error',
      curly: ['error', 'all'],
      'dot-notation': 'error',
      eqeqeq: ['error', 'always'],
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      radix: 'error',
      'wrap-iife': ['error', 'outside'],
      yoda: 'error',
      'no-else-return': 'error',
      'no-empty-function': 'error',
      'no-extra-bind': 'error',
      'no-floating-decimal': 'error',
      'no-iterator': 'error',
      'no-labels': 'error',
      'no-lone-blocks': 'error',
      'no-loop-func': 'error',
      'no-multi-str': 'error',
      'no-new': 'error',
      'no-new-wrappers': 'error',
      'no-octal-escape': 'error',
      'no-proto': 'error',
      'no-return-assign': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unused-expressions': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-void': 'error',
      'no-with': 'error',
      'prefer-promise-reject-errors': 'error',
      'vars-on-top': 'error',
      'wrap-regex': 'error',
      'yield-star-spacing': 'error',
      'no-confusing-arrow': 'error',
      'no-useless-constructor': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'rest-spread-spacing': 'error',
      'no-duplicate-imports': 'error',
      'no-useless-rename': 'error',
      'object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
      'one-var': ['error', 'never'],
      'operator-assignment': 'error',
      'operator-linebreak': ['error', 'after'],
      'padded-blocks': ['error', 'never'],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
      ],
      'quote-props': ['error', 'as-needed'],
      'sort-keys': 'off', // Can be enabled if desired
      'sort-vars': 'error',
    },
  },

  // Cypress-specific configuration
  {
    name: 'app/cypress',
    ...pluginCypress.configs.recommended,
    files: [
      '**/__tests__/*.{cy,spec}.{js,ts,jsx,tsx}',
      'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
      'cypress/support/**/*.{js,ts,jsx,tsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.node,
        // Cypress globals
        cy: 'readonly',
        Cypress: 'readonly',
        expect: 'readonly',
        assert: 'readonly',
      },
    },
    rules: {
      // Cypress best practices (only valid rules from eslint-plugin-cypress 5.1.0)
      'cypress/no-unnecessary-waiting': 'error',
      'cypress/no-assigning-return-values': 'error',
      'cypress/no-async-tests': 'error',
      'cypress/no-async-before': 'error',
      'cypress/no-pause': 'error',
      'cypress/no-debug': 'error',
      // Relax some rules for test files
      'no-console': 'off',
      'max-len': ['error', {
        code: 120, // Slightly longer for test files
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],
      // Allow describe and it to be used without import
      'no-undef': 'off',
    },
  },
]);
