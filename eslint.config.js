import airlightNode from 'eslint-config-airlight-node';

export default [
  ...airlightNode,
  {
    name: 'npm-packages-root',
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-implied-eval': 'warn',
      '@typescript-eslint/no-this-alias': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
      'import-x/prefer-default-export': 'off',
      complexity: ['error', 10]
    }
  },
  {
    files: ['**/*.test.js', '**/tests/**', '**/tests/*'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-nested-callbacks': 'off',
      'import-x/no-extraneous-dependencies': 'warn',
      'n/no-extraneous-import': 'warn'
    }
  },
  {
    files: ['**/benchmark/*'],
    rules: {
      'n/no-unpublished-import': 'off',
      'n/no-unpublished-require': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
    }
  }
];
