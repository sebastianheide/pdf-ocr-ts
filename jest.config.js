module.exports = {
  transform: {
    // Only transform TypeScript/JS source files — NOT .mjs files from pdfjs-dist
    '^.+\.(ts|tsx|js|jsx)$': [
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
  // Allow pdfjs-dist .mjs files to pass through Jest's module system untransformed
  // (Jest will load them as CommonJS-compatible modules via the default module resolver)
  transformIgnorePatterns: ['/node_modules/(?!(pdfjs-dist)/)'],
  testEnvironment: 'node',
  // Do NOT set extensionsToTreatAsEsm — we want Jest in CJS mode
};
