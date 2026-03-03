import { createCanvas } from 'canvas';
import assert from 'assert';

type CanvasAndContext = {
    canvas: ReturnType<typeof createCanvas>;
    context: ReturnType<ReturnType<typeof createCanvas>['getContext']>;
}

export default class NodeCanvasFactory {
    create(width: number, height: number): CanvasAndContext {
        assert(width > 0 && height > 0, "Invalid canvas size");
        const canvas = createCanvas(width, height);
        const context = canvas.getContext("2d");
        return {
            canvas,
            context,
        };
    }

    reset(canvasAndContext: CanvasAndContext, width: number, height: number) {
        assert(canvasAndContext.canvas, "Canvas is not specified");
        assert(width > 0 && height > 0, "Invalid canvas size");
        canvasAndContext.canvas.width = width;
        canvasAndContext.canvas.height = height;
    }

    destroy(canvasAndContext: CanvasAndContext) {
        assert(canvasAndContext.canvas, "Canvas is not specified");
        canvasAndContext.canvas.width = 0;
        canvasAndContext.canvas.height = 0;
    }
}