module.exports = {
  transform: {
    '^.+\.(ts|tsx|js|jsx|mjs)$': ['@swc/jest'],
  },
  transformIgnorePatterns: ['/node_modules/(?!(pdfjs-dist|file-type)/)'],
  testEnvironment: 'node',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'require', 'default', 'import'],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
