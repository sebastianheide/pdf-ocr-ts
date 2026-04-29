module.exports = {
  transform: {
    '^.+\.(ts|tsx|js|jsx|mjs)$': ['@swc/jest'],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(pdfjs-dist|file-type|strtok3|token-types|uint8array-extras|@borewit|@tokenizer)/)',
  ],
  testEnvironment: 'node',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'require', 'default', 'module-sync'],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
