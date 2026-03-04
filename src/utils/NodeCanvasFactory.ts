import Canvas from 'canvas';
import assert from 'assert';

type CanvasAndContext = {
    canvas: Canvas.Canvas;
    context: Canvas.CanvasRenderingContext2D;
}

export default class NodeCanvasFactory {
    create(width: number, height: number) {
        assert(width > 0 && height > 0, "Invalid canvas size");
        const canvas = Canvas.createCanvas(width, height);
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