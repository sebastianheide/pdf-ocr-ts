# pdf-ocr-ts
pdf-ocr-ts creates searchable PDF files out of PDF files that only have images (e.g. scanned documents).
It is javascript-only and hence works without the need to install further tools.
Under the hood it uses pdf.js to render the pages within a pdf to png files, Jimp to create compressed jpeg images, tesseract.js to perform ocr and pdf-lib to merge the single page pdfs tesseract.js is creating into the final searchable output PDF file.
## Usage
To create a searchable PDF with filename `outputFilename` from `inputFilename` use:
```javascript
import PdfOcr from './PdfOcr';

const inputFilename = '../input/scan_test.pdf';
const outputFilename = '../output/scan_test.pdf';

PdfOcr.createSearchablePdf(inputFilename, outputFilename);
```
In certain contexts it might be more handy to read the input file in some other function and also output the searchable PDF in another component. In these cases pdf-ocr-ts offers the function `getSearchablePdfBufferBased(Uint8Array)` that takes a `Uint8Array` (e.g. created by fs.readFile()), performce ocr and returns the searchable PDF file as `Uint8Array`. Which can than be used again in fs.writeFile().
```javascript
import PdfOcr from "./PdfOcr";

const inputFilename = '../input/scan_test.pdf';
const outputFilename = '../output/scan_test.pdf';

(async () => {
    const pdf = new Uint8Array(fs.readFileSync(path.resolve(__dirname, inputFilename)));
    const { pdfBuffer, text } = await PdfOcr.getSearchablePdfBufferBased(pdf);
    fs.writeFile(path.resolve(__dirname, outputFilename), pdfBuffer, (error) => {
      if (error) {
        if (log !== undefined) {
          log('error', `Error: ${error}`);
        }
      } else {
        if (log !== undefined) {
          log('info', `Finished merging PDFs into ${outputPdf}.`);
        }
      }
    });
})();
```
To generate log output, pdf-ocr-ts supports logging frameworks. It ships with the most simple logger `simpleLog` and supports any logger with the call signature `(level: string, message: string) => void;` (see `./utils/Logger.ts`).
```javascript
import PdfOcr from "./PdfOcr";
import { simpleLog } from "./utils/Logger";

const inPath = "../input/";
const outPath = "../output/";
const pdfFileName = "scan_test.pdf";

PdfOcr.createSearchablePdf(inPath + pdfFileName, outPath + pdfFileName, simpleLog);
```
Here's an example for the log library `winston.js` via a simple wrapper like `logHelper(level: string, message: string)`. Internally pdf-ocr-ts uses the log levels: `info`, `error` and `debug`.
```javascript
import PdfOcr from "./PdfOcr";
import { createLogger, transports, format } from "winston";

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

// wrap winston logger in logHelper to comply with the call signature <type Logger = (level: string, message: string) => void;>
function logHelper(level: string, message: string) {
  logger.log(level, message);
}

// pass the logHelper function
PdfOcr.createSearchablePdf(inputFilename, outputFilename, logHelper);
```
