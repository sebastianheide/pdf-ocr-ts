import NodeCanvasFactory from './utils/NodeCanvasFactory';
import { Logger } from './utils/Logger';

//import pdfjsLib from 'pdfjs-dist';
//import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export default class Pdf2Png {
  public static async returnPagesAsPngFileBuffers(data: Uint8Array, log?: Logger | undefined) {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    
    const CMAP_URL = "../../../node_modules/pdfjs-dist/cmaps/";
    const CMAP_PACKED = true;    // 
    const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
   
    const STANDARD_FONT_DATA_URL = "../../../node_modules/pdfjs-dist/standard_fonts/";

    const canvasFactory = new NodeCanvasFactory();
    const loadingTask = getDocument({
      data,
      cMapUrl: CMAP_URL,
      cMapPacked: CMAP_PACKED,
      standardFontDataUrl: STANDARD_FONT_DATA_URL,
    });

    const images = [];
    try {
      const pdfDocument = await loadingTask.promise;
      for (let i = 1; i <= pdfDocument.numPages; i++) {
        if (log !== undefined) {
          log('info', `processing page ${i} of ${pdfDocument.numPages}`);
        }
        const page = await pdfDocument.getPage(i);
        const viewport = page.getViewport({ scale: 4.0 });
       
        const canvasAndContext = canvasFactory.create(
          viewport.width,
          viewport.height
        );
        const renderContext = {
          canvasContext: canvasAndContext.context,
          viewport,
        };
        const renderTask = page.render(renderContext);
        await renderTask.promise;
        images.push(canvasAndContext.canvas.toBuffer());
        page.cleanup();
      }
    } catch (reason) {
      if (log !== undefined) {
        if (typeof reason === 'string') {
          log('error', reason);
        } else if (reason instanceof Error) {
          log('error', reason.message);
        }
      }
    }
    return images;
  }
}