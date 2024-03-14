import {describe, expect, it} from '@jest/globals';
import OcrPng2Pdf from '../src/OcrPng2Pdf';
import path from 'path';
import fs from 'fs';
import { simpleLog } from '../src/utils/Logger';

const inPath = "./input/";
const pngFileName = "scan_test.pdf-1.png";
const pngFileName2 = "scan_test.pdf-2.png";

const testPdfTextFragment2 = "Untitled document - Google Docs";
const testPdfTextFragment3 = "1234 Das ist ein Testdokument mit einem Testtext!";

describe('OcrPng2Pdf', () => {
    it('should return a searchable PDF buffer based on the buffer for the 1st png', async () => {
        console.log(path.resolve(__dirname, inPath + pngFileName,));
        const png = new Uint8Array(fs.readFileSync(path.resolve(__dirname, inPath + pngFileName,)));
        const { data: { text, pdf } } = await OcrPng2Pdf.ocrPngBuffer2PdfBuffer(png);
        simpleLog("info", text);
        expect(pdf).toBeInstanceOf(Uint8Array);
        expect(text.includes(testPdfTextFragment3)).toBeTruthy();
    });
    it('should return a searchable PDF buffer based on the buffer for the 2nd png', async () => {
        const png = new Uint8Array(fs.readFileSync(path.resolve(__dirname, inPath + pngFileName2,)));
        const { data: { text, pdf } } = await OcrPng2Pdf.ocrPngBuffer2PdfBuffer(png);
        simpleLog("info", text);
        expect(pdf).toBeInstanceOf(Uint8Array);
        expect(text.includes(testPdfTextFragment2)).toBeTruthy();
    });
}); 