const prettierConfig = require('./.prettierrc.js');

module.exports = {
  root: true,
  extends: ['@react-native-community', 'prettier'],
  rules: {
    'prettier/prettier': ['error', prettierConfig],
    'react-hooks/exhaustive-deps': 'off',
  },
  ignorePatterns: ['node_modules/', 'dist/', 'copied-src/'],
};
