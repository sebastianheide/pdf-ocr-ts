# pdf-ocr-ts
pdf-ocr-ts creates searchable PDF files out of PDF files that only contain images of scanned documents.
It is javascript-only and hence works without the need to install further tools.
Under the hood it uses [pdf.js](https://www.npmjs.com/package/pdf.js) to render the pages within a pdf to png files, [Jimp](https://www.npmjs.com/package/jimp) to create compressed jpeg images, [tesseract.js](https://www.npmjs.com/package/tesseract.js) to perform ocr and [pdf-lib](https://www.npmjs.com/package/pdf-lib) to merge the single page pdfs tesseract.js is creating into a final searchable output PDF file.
## Usage
To create a searchable PDF with filename `outputFilename` from `inputFilename` use:
```javascript
const { default: PdfOcr } = require('pdf-ocr-ts');

const inputFilename = './input/scan_test.pdf';
const outputFilename = './output/scan_test-searchable.pdf';

PdfOcr.createSearchablePdf(inputFilename, outputFilename);
```
In certain contexts it might be more handy to read the input file in some other function and also output the searchable PDF in another component. In these cases pdf-ocr-ts offers the function `getSearchablePdfBufferBased(Uint8Array)` that takes a `Uint8Array` (e.g. created by fs.readFile()), performs ocr and returns the searchable PDF file as `Uint8Array`. Which can than be used again in fs.writeFile().
```javascript
const { default: PdfOcr } = require('pdf-ocr-ts');
const fs = require('fs');
const path = require('path');

const inputFilename = './input/scan_test.pdf';
const outputFilename = './output/scan_test-searchable.pdf';

(async () => {
    const pdf = new Uint8Array(fs.readFileSync(path.resolve(__dirname, inputFilename)));
    const { pdfBuffer, text } = await PdfOcr.getSearchablePdfBufferBased(pdf);
    fs.writeFile(path.resolve(__dirname, outputFilename), pdfBuffer, (error) => {
      if (error) {
          console.error(`Error: ${error}`);
      } else {
          console.log(`Finished merging PDFs into ${outputFilename}.`);
      }
    });
})();
```
To generate log output, pdf-ocr-ts supports logging frameworks. It ships with the most simple logger `simpleLog` and supports any logger with the call signature `(level: string, message: string) => void;` (see `./utils/Logger.ts`).
```javascript
const { default: PdfOcr } = require('pdf-ocr-ts');
const { simpleLog } = require("pdf-ocr-ts/build/utils/Logger");

const inputFilename = './input/scan_test.pdf';
const outputFilename = './output/scan_test-searchable.pdf';

PdfOcr.createSearchablePdf(inputFilename, outputFilename, simpleLog);
```
Here's an example for the log library `winston.js` via a simple wrapper like `logHelper(level: string, message: string)`. Internally pdf-ocr-ts uses the log levels: `info`, `error` and `debug`.
```javascript
const { default: PdfOcr } = require('pdf-ocr-ts');
const { createLogger, transports, format } = require("winston");

// create the winston logger
const logger = createLogger({
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
});

// wrap winston logger in logHelper to comply with the call signature 
// (level: string, message: string) => void;
function logHelper(level: string, message: string) {
  logger.log(level, message);
}

// pass the logHelper function
PdfOcr.createSearchablePdf(inputFilename, outputFilename, logHelper);
```

To build the module from source run `npm run build`.

## Releases

This package uses automated releases to npm. When changes are pushed to the `main` branch, a GitHub Actions workflow automatically:
1. Bumps the patch version
2. Builds the package
3. Publishes to npm
4. Creates a GitHub release

The npm package requires an `NPM_TOKEN` secret to be configured in the repository settings for authentication.
