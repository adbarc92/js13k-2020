//draw.ts
/*
This file contains functions that can draw things on the screen
*/
/*
global
G_view_drawMenu
G_model_getCtx
G_model_getCanvas
G_model_getSprite
G_model_actorGetCurrentSprite
G_model_actorGetPosition
G_model_actorSetFacing
G_model_actorSetPosition
G_model_battleGetCurrentRound
G_model_battleGetScreenPosition
G_model_getBattleInputEnabled
G_model_roundGetActingUnit
G_view_drawBattleText
G_FACING_RIGHT
G_FACING_LEFT
G_ALLEGIANCE_ALLY
G_ALLEGIANCE_ENEMY
BATTLE_MENU
*/

const G_BLACK = '#000';
const G_WHITE = '#FFF';

interface DrawTextParams {
  font?: string;
  color?: string;
  size?: string;
  align?: 'left' | 'center' | 'right';
}
const DEFAULT_TEXT_PARAMS = {
  font: 'monospace',
  color: '#fff',
  size: 14,
  align: 'left',
};

// for(let i = 70; i <= 160; i+=30)

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

const G_view_drawRect = (
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  stroke?: boolean,
  ctx?: CanvasRenderingContext2D
) => {
  ctx = ctx || G_model_getCtx();
  ctx[stroke ? 'strokeStyle' : 'fillStyle'] = color;
  ctx[stroke ? 'strokeRect' : 'fillRect'](x, y, w, h);
};

const G_view_drawText = (
  text: string,
  x: number,
  y: number,
  textParams?: DrawTextParams,
  ctx?: CanvasRenderingContext2D
) => {
  const { font, size, color, align } = {
    ...DEFAULT_TEXT_PARAMS,
    ...(textParams || {}),
  };
  ctx = ctx || G_model_getCtx();
  ctx.font = `${size}px ${font}`;
  ctx.fillStyle = color;
  ctx.textAlign = align as CanvasTextAlign;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
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

const G_view_drawBattle = (battle: Battle) => {
  G_view_clearScreen();
  G_view_drawText(`Round: ${battle.roundIndex + 1}`, 10, 40);
  const actingUnit = G_model_roundGetActingUnit(
    G_model_battleGetCurrentRound(battle)
  );
  G_view_drawText(`Turn: ${actingUnit?.name}`, 10, 60);
  const { allies, enemies, actionMenuStack } = battle;
  const actionMenu = actionMenuStack[0];
  for (let i = 0; i < allies.length; i++) {
    const [x, y] = G_model_actorGetPosition(allies[i].actor);
    // const [x, y] = G_model_battleGetScreenPosition(i, G_ALLEGIANCE_ALLY);
    G_model_actorSetPosition(allies[i].actor, x, y);
    G_view_drawActor(allies[i].actor, 2);
    G_view_drawText(
      `${allies[i].name}: ${allies[i].cS.hp}/${allies[i].bS.hp}`,
      x * 2 + 5,
      y * 2 - 5,
      {
        align: 'center',
      }
    );
  }

  for (let i = 0; i < enemies.length; i++) {
    // const [x, y] = G_model_battleGetScreenPosition(i, G_ALLEGIANCE_ENEMY);
    const [x, y] = G_model_actorGetPosition(enemies[i].actor);
    // G_model_actorSetPosition(enemies[i].actor, x, y);
    G_view_drawActor(enemies[i].actor, 2);
    G_view_drawText(
      `${enemies[i].name}: ${enemies[i].cS.hp.toString()}/${enemies[
        i
      ].bS.hp.toString()}`,
      x * 2 + 5,
      y * 2 - 5,
      {
        align: 'center',
      }
    );
  }

  if (G_model_getBattleInputEnabled()) {
    G_view_drawMenu(actionMenu);
  }
  if (battle.text) {
    G_view_drawBattleText(battle.text);
  }
};
