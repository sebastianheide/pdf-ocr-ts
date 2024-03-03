import {describe, expect, it} from '@jest/globals';
import PdfOcr from '../src/PdfOcr';
import fs from 'fs';
import { simpleLog } from '../src/utils/Logger';

const inPath = "./input/";
const outPath = "./output/";
const pdfFileName = "scan_test.pdf";
const testPdfTextFragment1 = "03.02.23, 12:29"; 
const testPdfTextFragment2 = "Untitled document - Google Docs";
const testPdfTextFragment3 = "1234 Das ist ein Testdokument mit einem Testtext!";

describe('PdfOcr', () => {
    jest.setTimeout(120000);
    it('should return a searchable PDF buffer based on the buffer of a scanned PDF', async () => {
        simpleLog("info", new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() + ":" + new Date(Date.now()).getSeconds() + " Test start");
        const data = new Uint8Array(fs.readFileSync(inPath + pdfFileName));
        const { pdfBuffer, text } = await PdfOcr.getSearchablePdfBufferBased(data, simpleLog, false);
        simpleLog("info", new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() + ":" + new Date(Date.now()).getSeconds() + " Test finished");
        expect(pdfBuffer).toBeInstanceOf(Uint8Array);
        expect(text.includes(testPdfTextFragment1)).toBeTruthy();
        expect(text.includes(testPdfTextFragment2)).toBeTruthy();
        expect(text.includes(testPdfTextFragment3)).toBeTruthy();
    });
    it('should create a searchable PDF based on the path of a scanned PDF', async () => {
        simpleLog("info", new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() + ":" + new Date(Date.now()).getSeconds() + " Test start");
        const text = await PdfOcr.createSearchablePdf(inPath + pdfFileName, outPath + pdfFileName, simpleLog);
        simpleLog("info", new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() + ":" + new Date(Date.now()).getSeconds() + " Test finished");
        expect(text.includes(testPdfTextFragment1)).toBeTruthy();
        expect(text.includes(testPdfTextFragment2)).toBeTruthy();
        expect(text.includes(testPdfTextFragment3)).toBeTruthy();
    });
}); 