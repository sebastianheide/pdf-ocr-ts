import PdfOcr from "./PdfOcr";
import { createLogger, transports, format } from "winston";

const inPath = "../input/";
const outPath = "../output/";
const pdfFileName = "scan_test.pdf";

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

function logHelper(level: string, message: string) {
    logger.log(level, message);
}

PdfOcr.createSearchablePdf(inPath + pdfFileName, outPath + pdfFileName, logHelper);