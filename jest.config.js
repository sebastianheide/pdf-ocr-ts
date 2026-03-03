module.exports = {
  transform: {
    '^.+\.(ts|tsx|js|jsx|mjs)$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript' },
          target: 'es2020',
        },
        module: {
          type: 'commonjs',
        },
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!(pdfjs-dist)/)'],
  testEnvironment: 'node',
};
