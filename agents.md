# Agent Guidelines for pdf-ocr-ts

This document provides comprehensive guidelines for AI agents working on the pdf-ocr-ts repository.

## Repository Overview

**pdf-ocr-ts** is a JavaScript/TypeScript library that creates searchable PDF files from PDF files containing only scanned document images. It is a pure JavaScript solution that works without external system dependencies.

### Key Features
- Converts scanned PDFs to searchable PDFs with OCR
- Pure JavaScript implementation (no system dependencies)
- Supports buffer-based and file-based operations
- Configurable logging support
- Size-optimized output with JPEG compression

### Technology Stack
- **Language**: TypeScript
- **Runtime**: Node.js
- **PDF Rendering**: pdf.js (Mozilla)
- **Image Processing**: Jimp
- **OCR Engine**: tesseract.js
- **PDF Manipulation**: pdf-lib
- **Canvas**: node-canvas
- **Testing**: Jest with TypeScript support
- **Build**: TypeScript compiler (tsc)

## Architecture

### Core Components

#### 1. PdfOcr (Main Entry Point)
**File**: `src/PdfOcr.ts`

Main wrapper class that orchestrates the OCR workflow:
- `createSearchablePdf(inputPdf, outputPdf, log?)`: File-based operation
- `getSearchablePdfBufferBased(inputPdf, log?, sizeOptimized?)`: Buffer-based operation

#### 2. Pdf2Png
**File**: `src/Pdf2Png.ts`

Converts PDF pages to PNG image buffers:
- Uses pdf.js for rendering PDF pages
- Employs NodeCanvasFactory for canvas operations
- Renders at 4x scale for better OCR accuracy
- Returns array of PNG buffers

#### 3. OcrPng2Pdf
**File**: `src/OcrPng2Pdf.ts`

Performs OCR on images and generates searchable PDFs:
- Uses tesseract.js for OCR
- Supports multiple languages (default: 'eng+deu')
- Generates single-page PDF with text overlay
- Returns both text and PDF buffer

#### 4. PdfMerge
**File**: `src/PdfMerge.ts`

Merges multiple single-page PDFs into final output:
- Uses pdf-lib for PDF manipulation
- Preserves all pages and content
- Returns merged PDF buffer

#### 5. Logger Utility
**File**: `src/utils/Logger.ts`

Provides logging abstraction:
- Type: `(level: string, message: string) => void`
- Supports custom logging frameworks
- Includes simple built-in logger (`simpleLog`)
- Log levels: `info`, `error`, `debug`

#### 6. NodeCanvasFactory
**File**: `src/utils/NodeCanvasFactory.ts`

Canvas factory for pdf.js rendering in Node.js environment

### Data Flow

```
Input PDF (Uint8Array)
    ↓
Pdf2Png.returnPagesAsPngFileBuffers()
    ↓
PNG Buffers (one per page)
    ↓
[Optional] Jimp compression (PNG → JPEG)
    ↓
OcrPng2Pdf.ocrPngBuffer2PdfBuffer() [per page]
    ↓
Single-page searchable PDFs + extracted text
    ↓
PdfMerge.mergePDFBuffers()
    ↓
Final searchable PDF (Uint8Array) + combined text
```

## Development Workflow

### Setup
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Format code
npm run format

# Run the demo
npm start
```

### Project Structure
```
pdf-ocr-ts/
├── src/                    # TypeScript source files
│   ├── PdfOcr.ts          # Main entry point
│   ├── Pdf2Png.ts         # PDF to PNG conversion
│   ├── OcrPng2Pdf.ts      # OCR and PDF generation
│   ├── PdfMerge.ts        # PDF merging
│   ├── ocrMyPdf.ts        # Demo script
│   └── utils/             # Utility modules
│       ├── Logger.ts      # Logging interface
│       └── NodeCanvasFactory.ts
├── test.js/               # Test files
│   ├── PdfOcr.test.ts
│   ├── OcrPng2Pdf.test.ts
│   └── input/             # Test input files
├── build/                 # Compiled JavaScript (generated)
├── input/                 # Demo input files
├── output/                # Demo output files
└── [config files]
```

### Code Style
- TypeScript with strict type checking
- Uses Prettier for formatting
- ESLint for code quality
- Configuration in:
  - `tsconfig.json` (TypeScript)
  - `.prettierrc` (Prettier)
  - `eslint.config.js` (ESLint)

### Building
- Run `npm run build` to compile TypeScript to JavaScript
- Output directory: `./build/`
- Uses `rimraf` to clean build directory before compilation
- Entry point for npm package: `./build/PdfOcr.js`

## Testing Strategy

### Test Framework
- **Framework**: Jest
- **Test Location**: `test.js/` directory
- **Configuration**: `jest.config.js`, `babel.config.js`

### Test Coverage
- `PdfOcr.test.ts`: Tests main OCR workflow
- `OcrPng2Pdf.test.ts`: Tests OCR functionality

### Running Tests
```bash
npm test                # Run all tests with coverage
npm run test:watch      # Watch mode for development
```

### Test Configuration
- Timeout: 120 seconds (OCR operations are slow)
- Uses `@swc/jest` for TypeScript transformation
- Includes coverage reporting
- Special handling for `pdfjs-dist` module transformation

### Important Notes for Testing
- Tests require internet access (tesseract.js downloads language data from CDN)
- OCR tests are slow (2+ minutes per test)
- Uses test PDFs in `test.js/input/` directory

## CI/CD Pipeline

### GitHub Actions Workflows

#### 1. Test Workflow (`.github/workflows/test.yml`)
**Trigger**: Pull requests and pushes to any branch

Steps:
1. Checkout code
2. Setup Node.js 18
3. Install dependencies (`npm ci`)
4. Run tests (`npm test`)

**Purpose**: Validate code changes before merge

#### 2. Publish Workflow (`.github/workflows/publish.yml`)
**Trigger**: Pushes to `main` branch (excluding `[skip ci]` commits)

Steps:
1. Checkout code with full history
2. Setup Node.js 18 with npm registry
3. Install dependencies (`npm ci`)
4. Build package (`npm run build`)
5. Configure Git for automation
6. Bump patch version (`npm version patch`)
7. Push version commit and tag
8. Publish to npm with provenance
9. Create GitHub release

**Requirements**:
- `NPM_TOKEN` secret in repository settings
- Permissions: `contents: write`, `id-token: write`

**Version Management**:
- Automatic patch version bump on each release
- Manual minor/major bumps done locally before push
- Uses `[skip ci]` to prevent infinite loops

## Release Process

### Automated Releases
This repository uses **fully automated releases** to npm. See `RELEASING.md` for details.

**Normal Workflow** (patch version):
1. Merge PR to `main` branch
2. Publish workflow automatically:
   - Bumps patch version (e.g., 1.0.24 → 1.0.25)
   - Builds the package
   - Publishes to npm
   - Creates GitHub release

**Manual Version Bump** (minor/major):
```bash
# For minor version (e.g., 1.0.24 → 1.1.0)
npm version minor
git push --follow-tags

# For major version (e.g., 1.0.24 → 2.0.0)
npm version major
git push --follow-tags
```

### Published Package
- **Package Name**: `pdf-ocr-ts`
- **Registry**: npm
- **Files Included**: `build/` directory only (see `package.json` "files" field)
- **Entry Point**: `./build/PdfOcr.js`

## Contributing Guidelines

### Code Changes

#### Making Changes
1. **Minimal modifications**: Change only what's necessary
2. **Preserve working code**: Don't remove or modify working code unless absolutely required
3. **Maintain consistency**: Follow existing patterns and style
4. **Test changes**: Ensure all tests pass before submitting

#### Before Submitting
1. Build successfully: `npm run build`
2. All tests pass: `npm test`
3. Code is formatted: `npm run format`
4. No linting errors

### Adding Dependencies

#### Security Scanning
Always check new dependencies for vulnerabilities before adding them. The repository uses GitHub's advisory database for security scanning.

Supported ecosystems for vulnerability checking:
- npm (primary package manager)
- actions (GitHub Actions)

#### Adding a New Dependency
```bash
# Add to package.json
npm install <package-name>

# Build and test
npm run build
npm test

# Ensure it works as expected
```

### Pull Request Process

1. **Create feature branch** from `main`
2. **Make changes** following the guidelines above
3. **Test thoroughly**: `npm test`
4. **Build successfully**: `npm run build`
5. **Open PR** against `main` branch
6. **Test workflow runs** automatically on PR
7. **Merge to main** after approval
8. **Publish workflow** runs automatically after merge

### Documentation Updates

When making changes:
- Update README.md if API changes
- Update this agents.md if architecture changes
- Update RELEASING.md if release process changes
- Add code comments for complex logic

## Common Tasks

### Adding a New Feature

1. **Understand the architecture**: Review the data flow and component structure
2. **Identify the component**: Determine which file needs changes
3. **Make minimal changes**: Modify only what's necessary
4. **Add/update tests**: Ensure new functionality is tested
5. **Update documentation**: If API changes, update README.md
6. **Test thoroughly**: Run `npm test` and `npm run build`

### Fixing a Bug

1. **Reproduce the issue**: Add a failing test if possible
2. **Identify root cause**: Use logging and debugging
3. **Make targeted fix**: Change only what's needed
4. **Verify fix**: Ensure test passes and no regressions
5. **Test edge cases**: Consider similar scenarios

### Improving Performance

1. **Measure first**: Identify actual bottlenecks
2. **Focus on hot paths**: PDF rendering and OCR are the slowest parts
3. **Maintain correctness**: Don't sacrifice accuracy for speed
4. **Test thoroughly**: Ensure output quality is preserved

### Updating Dependencies

1. **Check compatibility**: Review breaking changes
2. **Update package.json**: Use appropriate version constraints
3. **Run security check**: Verify no new vulnerabilities
4. **Test thoroughly**: Ensure all functionality works
5. **Update lock file**: Commit `package-lock.json`

## Troubleshooting

### Build Failures
- Ensure all dependencies are installed: `npm install`
- Clear build directory: `rm -rf build`
- Check TypeScript version compatibility

### Test Failures
- Tests require internet access for tesseract.js language data
- Increase timeout for slow systems (default: 120 seconds)
- Check test input files exist in `test.js/input/`

### Runtime Issues
- Check Node.js version (18+ recommended)
- Verify canvas native dependencies are installed
- Ensure sufficient memory for large PDFs
- Check file paths are absolute when needed

## Dependencies Overview

### Production Dependencies
- **canvas** (^2.11.2): Native canvas for Node.js
- **jimp** (^1.6.0): Image processing for compression
- **pdf-lib** (^1.17.1): PDF manipulation
- **pdfjs-dist** (4.5.136): PDF rendering (pinned version)
- **tesseract.js** (^5.0.5): OCR engine
- **prettier** (^3.2.5): Code formatting
- **punycode** (^2.3.1): Unicode encoding/decoding
- **rimraf** (^5.0.5): Cross-platform rm -rf
- **ts-jest** (^29.1.2): TypeScript preprocessor for Jest
- **ts-node** (^10.9.2): TypeScript execution for Node.js

### Development Dependencies
- **TypeScript** (^5.3.3): Language compiler
- **Jest** (^29.7.0): Testing framework
- **@swc/jest** (^0.2.27): Fast Jest transformer
- **@babel/core** (^7.24.9): JavaScript transpilation core
- **@babel/preset-env** (^7.25.0): Babel environment preset
- **@babel/preset-typescript** (^7.24.7): Babel TypeScript preset
- **babel-jest** (^29.7.0): Jest Babel transformer
- **@swc/core** (^1.3.70): Fast TypeScript/JavaScript compiler
- **@types/jest** (^29.5.12): TypeScript definitions for Jest
- **jest-esm-transformer** (^1.0.0): ESM support for Jest

## Security Considerations

### Input Validation
- Validate PDF buffers before processing
- Handle malformed PDFs gracefully
- Limit memory usage for large files

### Dependencies
- Regular updates for security patches
- Automated vulnerability scanning via GitHub
- No secrets in code or configuration

### Publishing
- Uses npm provenance for package authenticity
- Automated token rotation recommended
- Protected main branch prevents unauthorized changes

## Performance Characteristics

### Expected Performance
- **PDF Rendering**: ~5-10 seconds per page (4x scale)
- **OCR**: ~60-120 seconds per page (depends on content)
- **JPEG Compression**: ~1-2 seconds per page
- **PDF Merging**: ~1 second for typical documents

### Memory Usage
- Peak memory: ~200-500 MB per page
- Scales with page dimensions and complexity
- Uses streaming where possible to reduce memory

### Optimization Opportunities
- Parallel page processing (not currently implemented)
- Configurable render scale (currently fixed at 4x)
- Optional JPEG compression (already implemented)
- Worker pool for tesseract.js (currently single worker)

## API Reference

### PdfOcr.createSearchablePdf()
```typescript
static async createSearchablePdf(
  inputPdf: string,      // Path to input PDF
  outputPdf: string,     // Path for output PDF
  log?: Logger           // Optional logger
): Promise<string>       // Returns extracted text
```

### PdfOcr.getSearchablePdfBufferBased()
```typescript
static async getSearchablePdfBufferBased(
  inputPdf: Uint8Array,      // Input PDF buffer
  log?: Logger,              // Optional logger
  sizeOptimized?: boolean    // Enable JPEG compression (default: true)
): Promise<{
  pdfBuffer: Uint8Array,     // Searchable PDF buffer
  text: string               // Extracted text
}>
```

## Future Improvements

Potential areas for enhancement:
1. **Parallel Processing**: Process multiple pages concurrently
2. **Progress Callbacks**: Report progress during long operations
3. **Configurable Scale**: Allow customization of render scale
4. **Language Detection**: Auto-detect document language
5. **Worker Pool**: Reuse tesseract.js workers for better performance
6. **Streaming API**: Process very large PDFs with limited memory
7. **CLI Tool**: Command-line interface for direct usage
8. **Browser Support**: Adapt for browser environments

## Conclusion

This repository provides a focused, well-architected solution for PDF OCR in Node.js. When working on this codebase:

- Respect the existing architecture
- Make minimal, focused changes
- Test thoroughly
- Maintain documentation
- Follow automated workflows
- Prioritize code quality and security

For questions or clarifications, refer to the README.md, existing code, or test files for examples.
