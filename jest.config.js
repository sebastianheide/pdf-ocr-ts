module.exports = {
  //    preset: 'ts-jest',
  //    testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx|js|jsx|mjs)$': ['babel-jest', { configFile: './babel.config.js' }],
    '^.+\\.tsx?$': ['@swc/jest'],
  },
  transformIgnorePatterns: ['/node_modules/(?!(pdfjs-dist)/)'],
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
//  transform: {
//    '^.+\\.tsx?$': ['@swc/jest'],
//  },
};
