import PdfOcr from "./PdfOcr";
import { simpleLog } from "./utils/Logger";

const inPath = "../input/";
const outPath = "../output/";
const pdfFileName = "scan_test.pdf";

PdfOcr.createSearchablePdf(inPath + pdfFileName, outPath + pdfFileName, simpleLog);

/*
(async () => { 
    const data = new Uint8Array(fs.readFileSync(path.resolve(__dirname, inPath + pdfFileName,)));
    const images = await Pdf2Png.returnPagesAsPngFileBuffers(data);
    let i = 0;
    for (const image of images) {
        i++;
        fs.writeFile(path.resolve(__dirname, outPath + pdfFileName + `-${i}.png`), image, (error) => {
            if (error) {
                console.error(error);
            }
        });
    }
})();
*/

