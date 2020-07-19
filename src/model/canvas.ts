/*
This file contains functions for creating and getting an HTML Canvas element
*/
/*
global
*/

let model_canvas: HTMLCanvasElement | null = null;
let model_frameMultiplier = 1;
let model_elapsedMs = 0;

// Create a canvas element given a width and a height, returning a reference to the
// canvas, the rendering context, width, and height
const G_model_createCanvas = (
  width: number,
  height: number
): [HTMLCanvasElement, CanvasRenderingContext2D, number, number] => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return [
    canvas,
    canvas.getContext('2d') as CanvasRenderingContext2D,
    width,
    height,
  ];
};

// get a reference to the current canvas.  If it has not been made yet, then create it,
// append it to the body, then return a reference to it.
const G_model_getCanvas = (): HTMLCanvasElement => {
  if (model_canvas) {
    return model_canvas as HTMLCanvasElement;
  } else {
    const [canvas, ctx] = G_model_createCanvas(512, 512);
    canvas.id = 'canv';
    ctx.imageSmoothingEnabled = false;
    document.body.appendChild(canvas);
    model_canvas = canvas;
    return canvas;
  }
};

// get a reference to the current rendering context
const G_model_getCtx = (): CanvasRenderingContext2D => {
  return G_model_getCanvas().getContext('2d') as CanvasRenderingContext2D;
};

// return the value to multiply all position and time values by in order to simulate
// rendering at a consistent speed (as if it were 60 FPS).
// Without this value, the game's physics are tied to the FPS, so a higher FPS results
// in a faster game, while lower FPS results in a slower game.
const G_model_setFrameMultiplier = (v: number) => {
  model_frameMultiplier = v;
};
const G_model_getFrameMultiplier = (): number => {
  return model_frameMultiplier;
};
const G_model_setElapsedMs = (v: number) => {
  model_elapsedMs = v;
};
const G_model_getElapsedMs = (): number => {
  return model_elapsedMs;
};
