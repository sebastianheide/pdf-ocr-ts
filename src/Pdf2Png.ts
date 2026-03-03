import NodeCanvasFactory from './utils/NodeCanvasFactory';
import { Logger } from './utils/Logger';
import { fileURLToPath } from 'url';
import path from 'path';

// Resolve node_modules relative to this source file (works both for src/ and build/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_MODULES = path.resolve(__dirname, '../../node_modules');

export default class Pdf2Png {
  public static async returnPagesAsPngFileBuffers(data: Uint8Array, log?: Logger | undefined) {
    const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');

    const CMAP_URL = path.join(NODE_MODULES, 'pdfjs-dist/cmaps/');
    const CMAP_PACKED = true;
    const STANDARD_FONT_DATA_URL = path.join(NODE_MODULES, 'pdfjs-dist/standard_fonts/');

    const canvasFactory = new NodeCanvasFactory();
    const loadingTask = getDocument({
      data,
      cMapUrl: CMAP_URL,
      cMapPacked: CMAP_PACKED,
      standardFontDataUrl: STANDARD_FONT_DATA_URL,
      canvasFactory,
    });

    const images: Buffer[] = [];
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
          canvasFactory,
        };
        const renderTask = page.render(renderContext);
        await renderTask.promise;
        images.push(canvasAndContext.canvas.toBuffer('image/png'));
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