export default class PdfMerge {
  public static async mergePDFBuffers(pdfBuffers: Uint8Array[]) {
    const pdfLib = require('pdf-lib');
    const outPdfDoc = await pdfLib.PDFDocument.create();

    for (const pdfBuffer of pdfBuffers) {
      const inputPdf = await pdfLib.PDFDocument.load(pdfBuffer);
      const copiedPages = await outPdfDoc.copyPages(inputPdf, inputPdf.getPageIndices());
      copiedPages.forEach((page: any) => outPdfDoc.addPage(page));
    }
    return await outPdfDoc.save();
  }
}