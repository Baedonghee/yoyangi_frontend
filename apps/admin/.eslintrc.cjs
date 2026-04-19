const styledComponentArrowFn = 'TaggedTemplateExpression > TemplateLiteral > ArrowFunctionExpression';

const ignoredNodes = [styledComponentArrowFn, `${styledComponentArrowFn} > BlockStatement`];

module.exports = {
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh', 'simple-import-sort'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx'],
        moduleDirectory: ['src', 'node_modules'],
      },
    },
  },
  rules: {
    'react-refresh/only-export-components': 'warn',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    indent: [
      'error',
      2,
      {
        ignoredNodes,
      },
    ],
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'react/self-closing-comp': 'error',
    'react/no-unknown-property': 'error',
    'import/no-unresolved': 'off',
    'import/no-named-as-default': 0,
    'react/jsx-closing-bracket-location': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    'no-useless-catch': 'off',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Packages `react` related packages come first.
          ['^react', '^@?\\w'],
          // Internal packages.
          ['^(@|components)(/.*|$)'],
          // Side effect imports.
          ['^\\u0000'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports.
          ['^.+\\.?(css)$'],
        ],
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'react/prop-types': [
      0,
      {
        ignore: ['ignore'],
        customValidators: ['customValidator'],
        skipUndeclared: true,
      },
    ],
  },
};
