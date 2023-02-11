import PdfOcr from "./PdfOcr";
import { simpleLog } from "./utils/Logger";

const inPath = "../input/";
const outPath = "../output/";
const pdfFileName = "scan_test.pdf";

PdfOcr.createSearchablePdf(inPath + pdfFileName, outPath + pdfFileName, simpleLog);