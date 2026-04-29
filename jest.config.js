module.exports = {
  transform: {
    '^.+\.(ts|tsx|js|jsx|mjs)$': ['@swc/jest'],
  },
  transformIgnorePatterns: ['/node_modules/(?!(pdfjs-dist|file-type)/)'],
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
