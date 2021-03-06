//draw.ts
/*
This file contains functions that can draw things on the screen
*/
/*
global
G_model_actorSetPosition
G_model_actorGetCurrentSpriteAndOffset
G_model_actorGetPosition
G_model_actorSetFacing
G_model_battleGetCurrentRound
G_model_battleGetScreenPosition
G_model_getCanvas
G_model_getCtx
G_model_getBattleInputEnabled
G_model_getSprite
G_model_roundGetActingUnit
G_model_getCurrentWorld
G_view_drawBattleText
G_view_drawInfo
G_view_drawMenu
G_view_drawTurnOrder
G_view_drawUiBackground

G_ALLEGIANCE_ALLY
G_ALLEGIANCE_ENEMY
G_BATTLE_SCALE
G_FACING_LEFT
G_FACING_RIGHT
G_MAP_TILE_NOTHING
BATTLE_MENU

*/

const G_BLACK = '#000';
const G_WHITE = '#FFF';
const G_ENEMY_COLOR = '#FF004D';
const G_ALLY_COLOR = '#29ADFF';

interface DrawTextParams {
  font?: string;
  color?: string;
  size?: number;
  align?: 'left' | 'center' | 'right';
  strokeColor?: string;
}
const DEFAULT_TEXT_PARAMS = {
  font: 'monospace',
  color: '#fff',
  size: 14,
  align: 'left',
  strokeColor: '',
};

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
  ctx.lineWidth = 1;
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
  const { font, size, color, align, strokeColor } = {
    ...DEFAULT_TEXT_PARAMS,
    ...(textParams || {}),
  };
  ctx = ctx || G_model_getCtx();
  ctx.font = `${size}px ${font}`;
  ctx.fillStyle = color;
  ctx.textAlign = align as CanvasTextAlign;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 0.5;
    ctx.strokeText(text, x, y);
  }
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

const G_view_drawActor = (actor: Actor, isPaused: boolean, scale?: number) => {
  scale = scale || 1;
  const { x, y } = actor;
  const px = x * (scale as number);
  const py = y * (scale as number);
  const [sprite, xPos, yPos] = G_model_actorGetCurrentSpriteAndOffset(
    actor,
    isPaused
  );
  G_view_drawSprite(sprite, px + xPos, py + yPos, scale);
};

const G_view_drawRoom = (room: Room, x: number, y: number, scale?: number) => {
  const world = G_model_getCurrentWorld();
  const scaleV = scale || 1;
  room.tiles.forEach(tile => {
    const { id, x: tx, y: ty, size } = tile;
    const px = (x + tx * size) * scaleV;
    const py = (y + ty * size) * scaleV;
    const bgSprite = room.bgSprite;
    G_view_drawSprite(bgSprite, px, py, scale);

    if (id == G_MAP_TILE_NOTHING) {
      return;
    }

    const tileSprite = `terrain_${id}`;
    G_view_drawSprite(tileSprite, px, py, scale);
  });

  room.characters.forEach(ch => {
    const actor = ch.actor;
    G_view_drawActor(actor, world.pause, scale);
    const { x, y } = actor;
    const px = x * scaleV;
    const py = y * scaleV;

    const actionText = ch.aText;
    if (actionText) {
      G_view_drawText(
        actionText,
        px + (16 * scaleV) / 2,
        py - (16 * scaleV) / 2,
        {
          size: 16,
          align: 'center',
        }
      );
    }
  });
};

const G_view_drawBattle = (battle: Battle) => {
  G_view_clearScreen();
  const actingUnit = G_model_roundGetActingUnit(
    G_model_battleGetCurrentRound(battle)
  );
  G_view_drawUiBackground(5, 15, 150, 20);
  G_view_drawText(`Turn: ${actingUnit?.name}`, 10, 26);
  const { allies, enemies, actionMenuStack } = battle;
  const actionMenu = actionMenuStack[0];
  for (let i = 0; i < allies.length; i++) {
    const [x, y] = G_model_actorGetPosition(allies[i].actor);
    G_model_actorSetPosition(allies[i].actor, x, y);
    G_view_drawActor(allies[i].actor, false, G_BATTLE_SCALE);
    G_view_drawText(`${allies[i].name}`, x * 2 + 16, y * 2 - 5, {
      align: 'center',
    });
  }
  G_view_drawInfo(battle, G_ALLEGIANCE_ALLY);
  G_view_drawInfo(battle, G_ALLEGIANCE_ENEMY);

  for (let i = 0; i < enemies.length; i++) {
    // const [x, y] = G_model_battleGetScreenPosition(i, G_ALLEGIANCE_ENEMY);
    const [x, y] = G_model_actorGetPosition(enemies[i].actor);
    // G_model_actorSetPosition(enemies[i].actor, x, y);
    G_view_drawActor(enemies[i].actor, false, G_BATTLE_SCALE);
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
  G_view_drawTurnOrder(battle);
};
