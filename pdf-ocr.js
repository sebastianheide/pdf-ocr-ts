const { default: PdfOcr } = require('pdf-ocr-ts');
const fs = require('fs');
const path = require('path');
const { simpleLog } = require("pdf-ocr-ts/build/utils/Logger");

const inputFilename = './input/scan_test.pdf';
const outputFilename = './output/scan_test-searchable.pdf';

console.log('Starting PDF OCR...');

PdfOcr.createSearchablePdf(inputFilename, outputFilename, simpleLog);

/*
(async () => {
    const pdf = new Uint8Array(fs.readFileSync(path.resolve(__dirname, inputFilename)));
    const { pdfBuffer, text } = await PdfOcr.getSearchablePdfBufferBased(pdf);
    console.log(text);
    console.log(pdfBuffer.length)
    fs.writeFile(path.resolve(__dirname, outputFilename), pdfBuffer, (error) => {
      if (error) {
          console.error(`Error: ${error}`);
      } else {
          console.log(`Finished merging PDFs into ${outputFilename}.`);
      }
    });
})(); 
*/