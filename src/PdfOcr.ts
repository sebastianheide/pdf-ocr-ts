import Pdf2Png from './Pdf2Png';
import OcrPng2Pdf from './OcrPng2Pdf';
import PdfMerge from './PdfMerge';
import Jimp from 'jimp';
import fs from 'fs';
import path from 'path';
import { Logger } from './utils/Logger';

/**
 * Wrapper-class as default export to perform ocr on a PDF file.
 */
export default class PdfOcr {
  /**
   * Returns a searchable PDF {'pdfBuffer' and 'text'} based on the buffer (e.g. from fs.readFile()) of a scanned PDF
   * @param {Uint8Array} inputPdf - the contents of a PDF file as Uint8Array
   * @returns {{Uint8Array 'pdfBuffer', string 'text'}} with pdfBuffer being the content of the searchable pdf file and the text as 'text'
   */
  public static async getSearchablePdfBufferBased(inputPdf: Uint8Array, log?: Logger | undefined) {
    const imageBuffers = await Pdf2Png.returnPagesAsPngFileBuffers(inputPdf, log);
    if (log !== undefined) {
      log('info', `performing ocr on ${imageBuffers.length} page(s) ...`);
    }
    const pdfsToMerge: Uint8Array[] = [];
    let texts: string = "";
    for (const image of imageBuffers) {
      const png = await Jimp.read(image);
      png.quality(100);
      const jpg = await png.getBufferAsync(Jimp.MIME_JPEG);
      const { data: { text, pdf } } = await OcrPng2Pdf.ocrPngBuffer2PdfBuffer(jpg);
      if (pdf !== null) {
        pdfsToMerge.push(new Uint8Array(pdf));
      }
      texts = texts + text + "\n";
      if (log !== undefined) {
        log('debug', `image done ...`);
      }
    }
    if (log !== undefined) {
      log('info', `merging single page PDFs ...`);
    }
    return {
      'pdfBuffer': await PdfMerge.mergePDFBuffers(pdfsToMerge),
      'text': texts
    };
  };

  /**
   * Reads the inputPdf file, performc ocr on it and writes a searchable PDF file with the name of ourputPdf
   * @param {string} inputPdf - filename of the input PDF file
   * @param {string} outputPdf - filename of the output PDF file
   */
  public static async createSearchablePdf(inputPdf: string, outputPdf: string, log?: Logger | undefined) {
    const data = new Uint8Array(fs.readFileSync(path.resolve(__dirname, inputPdf)));
    const { pdfBuffer, text } = await this.getSearchablePdfBufferBased(data, log);
    if (log !== undefined) {
      log('debug', text);
      log('info', `writing PDF file with size: ${pdfBuffer.length}`);
    }
    fs.writeFile(path.resolve(__dirname, outputPdf), pdfBuffer, (error) => {
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
  }

}