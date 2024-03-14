import tesseract from 'tesseract.js';
import fs from 'fs';
import path from 'path';
const { createWorker } = tesseract;

export default class OcrPng2Pdf {

    public static async ocr(imageFileName: string, imagePath = "../output/", languageString: string = 'eng+deu') {
        const data = new Uint8Array(fs.readFileSync(path.resolve(__dirname, imageFileName)));
        const { data: { text, pdf } } = await this.ocrPngBuffer2PdfBuffer(data);
        const outFileName = `${imagePath}${imageFileName.substring(0, imageFileName.lastIndexOf("."))}.pdf`;
        if (pdf !== null)
        {
            fs.writeFileSync(fs.readFileSync(path.resolve(__dirname, outFileName)), new Uint8Array(pdf));
        }
        return outFileName;
    }

    public static async ocrPngBuffer2PdfBuffer(pngBuffer: Uint8Array, languageString: string = 'eng+deu') {
        const worker = await createWorker(languageString);
//        await worker.loadLanguage(languageString);
//        await worker.initialize(languageString);
        const data = await worker.recognize(pngBuffer, {}, {pdf: true});
        await worker.terminate();  
        return data;
    }
}
