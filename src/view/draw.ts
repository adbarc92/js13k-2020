/*
This file contains functions that can draw things on the screen
*/
/*
global
G_model_getCtx
G_model_getCanvas
G_model_getSprite
G_model_actorGetCurrentSprite
G_model_actorSetFacing
G_model_actorSetPosition
G_FACING_RIGHT
G_FACING_LEFT
*/

const playerPos = [
  [60, 90],
  [45, 105],
  [30, 90],
  [45, 75],
];

const enemyPos = [
  [165, 90],
  [180, 105],
  [195, 90],
  [180, 75],
];

const gradientCache = {};

const G_view_clearScreen = () => {
  const canvas = G_model_getCanvas();
  G_view_drawVerticalGradient(
    0,
    0,
    canvas.width,
    canvas.height,
    '#557',
    '#aaf'
  );
};

const G_view_drawText = (
  text: string,
  x: number,
  y: number,
  color?: string,
  scale?: number,
  ctx?: CanvasRenderingContext2D
) => {
  scale = scale || 2;
  color = color || 'black';
  ctx = ctx || G_model_getCtx();
  ctx.font = '14px monospace';
  ctx.fillStyle = color;
  ctx.fillText(`${text}`, x, y);
};

const G_view_drawVerticalGradient = (
  x: number,
  y: number,
  w: number,
  h: number,
  colorStart: string,
  colorStop: string
) => {
  const ctx = G_model_getCtx();
  const key = `${x},${y},${w},${h},${colorStart},${colorStop}`;
  if (!gradientCache[key]) {
    const grd = ctx.createLinearGradient(0, h, 0, 0);
    grd.addColorStop(0, colorStart);
    grd.addColorStop(1, colorStop);
    gradientCache[key] = grd;
  }
  ctx.fillStyle = gradientCache[key];
  ctx.fillRect(x, y, w, h);
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

const G_view_drawRoom = (room: Room, x: number, y: number, scale?: number) => {
  scale = scale || 1;
  room.tiles.forEach(tile => {
    const { id, x: tx, y: ty, size } = tile;
    if (id < 15) {
      const tileSprite = `terrain_${id}`;
      G_view_drawSprite(
        tileSprite,
        (x + tx * size) * (scale as number),
        (y + ty * size) * (scale as number),
        scale
      );
    }
  });
};

const G_view_drawActor = (actor: Actor, scale?: number) => {
  scale = scale || 1;
  const { x, y } = actor;
  const px = x * (scale as number);
  const py = y * (scale as number);
  const sprite = G_model_actorGetCurrentSprite(actor);
  G_view_drawSprite(sprite, px, py, scale);
};

let model_cursorIndex: number = 1;

const G_model_setCursorIndex = (i: number) => {
  model_cursorIndex = i;
};

const G_model_getCursorIndex = () => {
  return model_cursorIndex;
};

const G_view_drawMenu = (
  options: string[],
  color: string = 'white',
  x: number = 195,
  y: number = 380,
  w: number = 100,
  h: number = 120,
  optionOffset: number = 18
) => {
  const ctx = G_model_getCtx();
  // Create background\
  ctx.fillStyle = 'white';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = 'black';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.strokeStyle = color; // Ben: more general value? Relative to color parameter

  // Populate menu
  for (
    let i = 0, j = x + 30, k = y + 20;
    i < options.length;
    i++, k += optionOffset
  ) {
    G_view_drawText(options[i], j, k, color);
  }

  // draw Cursor
  const cursorOffset = G_model_getCursorIndex() * optionOffset;
  ctx.beginPath();
  ctx.moveTo(x + 15, y + 10 + cursorOffset);
  ctx.lineTo(x + 15, y + 20 + cursorOffset);
  ctx.lineTo(x + 25, y + 15 + cursorOffset);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
};

const G_view_drawBattle = (battle: Battle) => {
  G_view_clearScreen();
  G_view_drawText(`Round: ${battle.roundIndex + 1}`, 20, 20);
  const { allies, enemies } = battle;
  for (let i = 0; i < allies.length; i++) {
    G_model_actorSetFacing(allies[i].actor, G_FACING_RIGHT);
    G_model_actorSetPosition(allies[i].actor, playerPos[i][0], playerPos[i][1]);
    G_view_drawActor(allies[i].actor, 2);

    G_view_drawText(
      `${allies[i].cS.hp}/${allies[i].bS.hp}`,
      playerPos[i][0] * 2 + 5,
      playerPos[i][1] * 2 - 5
    );
  }

  for (let i = 0; i < enemies.length; i++) {
    G_model_actorSetFacing(enemies[i].actor, G_FACING_LEFT);
    G_model_actorSetPosition(enemies[i].actor, enemyPos[i][0], enemyPos[i][1]);

    G_view_drawActor(enemies[i].actor, 2);

    G_view_drawText(
      `${enemies[i].cS.hp.toString()}/${enemies[i].bS.hp.toString()}`,
      enemyPos[i][0] * 2 + 5,
      enemyPos[i][1] * 2 - 5
    );
  }
};
