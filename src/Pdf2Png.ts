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
        if (log !== undefined) {
          log('debug', `page ${i} loaded`);
        }
        const viewport = page.getViewport({ scale: 4.0 });
        if (log !== undefined) {
          log('debug', `viewport for page ${i} calculated`);
        }
       
        const canvasAndContext = canvasFactory.create(
          viewport.width,
          viewport.height
        );
        if (log !== undefined) {
          log('debug', `canvas created for page ${i}`);
        }
        const renderContext = {
          canvasContext: canvasAndContext.context,
          viewport,
        };
        if (log !== undefined) {
          log('debug', `renderContext created for page ${i}`);
        }

        const renderTask = page.render(renderContext);
        if (log !== undefined) {
          log('debug', `renderTask started for page ${i}`);
        }
        await renderTask.promise;
        if (log !== undefined) {
          log('debug', `renderTask completed for page ${i} ... pushing image buffer`);
        }
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