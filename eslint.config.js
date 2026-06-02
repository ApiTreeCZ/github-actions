import { base } from '@apitree.cz/eslint-config';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...base,
  {
    files: ['.github/**/*.test.js'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },
]);
