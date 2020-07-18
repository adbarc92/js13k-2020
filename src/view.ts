/*
global
G_model_getCtx
G_model_getCanvas
G_model_getSprite
*/

const G_view_clearScreen = () => {
  const ctx = G_model_getCtx();
  const canvas = G_model_getCanvas();
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const G_view_drawSprite = (
  sprite: string | Sprite,
  x: number,
  y: number,
  scale?: number,
  ctx?: CanvasRenderingContext2D
) => {
  scale = scale || 1;
  ctx = ctx || G_model_getCtx();
  const [image, sprX, sprY, sprW, sprH] =
    typeof sprite === 'string' ? G_model_getSprite(sprite) : sprite;
  ctx.drawImage(
    image,
    sprX,
    sprY,
    sprW,
    sprH,
    x,
    y,
    sprW * scale,
    sprH * scale
  );
};
