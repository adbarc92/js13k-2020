/*
global
G_model_battleGetCurrentRound
G_model_getCtx
G_model_getScreenSize
G_model_setCutsceneVisible
G_utils_isAlly
G_view_drawRect
G_view_drawSprite
G_view_drawText

G_model_setShowingDialogue

G_KEY_SPACE
G_KEY_ENTER
G_KEY_X
G_ALLEGIANCE_ALLY
G_ALLEGIANCE_ENEMY
G_BATTLE_SCALE
G_BLACK
G_GOLD
G_WHITE
G_ALLY_COLOR
G_ENEMY_COLOR
*/

const G_CURSOR_WIDTH = 16;
const G_CURSOR_HEIGHT = 16;
const G_TURN_ORDER_BOX_HEIGHT = 40;
const G_TURN_ORDER_BOX_WIDTH = 30;

const G_view_drawUiBackground = (
  x: number,
  y: number,
  w: number,
  h: number,
  color?: string
) => {
  color = color || G_BLACK;
  G_view_drawRect(x, y, w, h, color);
  G_view_drawRect(x, y, w, h, G_WHITE, true);
};

const G_view_drawMenuCursor = (x: number, y: number) => {
  const ctx = G_model_getCtx();
  const cursorHeight = G_CURSOR_HEIGHT;
  const cursorWidth = G_CURSOR_WIDTH;
  ctx.save();
  ctx.translate(x + 2, y);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, cursorHeight);
  ctx.lineTo(cursorWidth, cursorHeight / 2);
  ctx.closePath();
  ctx.fillStyle = G_WHITE;
  ctx.fill();
  ctx.restore();
};

const G_view_drawMenu = (menu: Menu) => {
  const { x, y, w, h, i, bg, items, lineHeight: lh } = menu;
  if (bg) {
    G_view_drawUiBackground(x, y, w, h);
  }

  items.forEach((label, ind) => {
    let color = G_WHITE;
    if (menu.disabledItems.includes(ind)) {
      color = '#999';
    }
    G_view_drawText(label, x + w / 2, y + ind * lh + lh / 2, {
      align: 'center',
      color,
    });
  });
  G_view_drawMenuCursor(x, y + lh * i);
};

const G_view_drawBattleText = (text: string) => {
  const x = 0;
  const y = 90;
  const w = G_model_getScreenSize();
  const h = 50;

  G_view_drawUiBackground(x, y, w, h);

  G_view_drawText(text, G_model_getScreenSize() / 2, y + 26, {
    align: 'center',
    size: 20,
  });
};

const G_view_drawHeaders = (x: number, y: number) => {
  const w = 200;
  const h = 25;
  const y2 = y - h;
  G_view_drawUiBackground(x, y2, w, h);
  G_view_drawText('Unit', x + 10, y2 + h / 2);
  G_view_drawText('HP', x + 70, y2 + h / 2);
  G_view_drawText('Chg', x + 117, y2 + h / 2);
  G_view_drawText('Brk/Hl', x + 150, y2 + h / 2);
};

const G_view_drawInfo = (battle: Battle, allegiance: Allegiance) => {
  // For players, contains name, HP, currentCharge
  const lineHeight = 20;
  const screenSize = G_model_getScreenSize();
  const w = 200;
  const h = 90;
  const x = allegiance === G_ALLEGIANCE_ENEMY ? screenSize - w : 0;
  const y = screenSize - 90;
  G_view_drawUiBackground(x, y, w, h);
  G_view_drawHeaders(0, y);
  const units =
    allegiance === G_ALLEGIANCE_ENEMY ? battle.enemies : battle.allies;
  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    const { name, bS, cS } = unit;
    if (allegiance === G_ALLEGIANCE_ALLY) {
      G_view_drawText(name.slice(0, 8), x + 10, y + 15 + lineHeight * i);
      G_view_drawText(`${cS.hp}/${bS.hp}`, x + 70, y + 15 + lineHeight * i);
      G_view_drawText(`${cS.cCnt}`, x + 125, y + 15 + lineHeight * i);
      G_view_drawText(`${cS.iCnt}`, x + 168, y + 15 + lineHeight * i);
    } else {
      G_view_drawText(name.slice(0, 8), x + w / 2, y + 15 + lineHeight * i, {
        align: 'center',
      });
    }
  }
};

// const G_view_drawSpeedBar = (
//   x: number,
//   y: number,
//   unit: Unit,
//   battle: Battle
// ) => {
//   const { spd } = unit.cS;
//   const enemyTopSpeed = G_model_battleGetHighestSpeed(
//     battle,
//     ((unit.allegiance + 1) % 2) as Allegiance
//   );
//   const spdDif = spd - enemyTopSpeed;
//   const pxHeight = G_utils_normalizeClamp(
//     spdDif,
//     -8,
//     8,
//     -G_TURN_ORDER_BOX_HEIGHT,
//     G_TURN_ORDER_BOX_HEIGHT
//   );
//   if (pxHeight < 0) {
//     G_view_drawUiBackground(
//       x,
//       y,
//       G_TURN_ORDER_BOX_WIDTH,
//       -pxHeight,
//       G_NEGATIVE_SPEED_COLOR,
//       G_NEGATIVE_SPEED_COLOR
//     );
//   } else {
//     G_view_drawUiBackground(
//       x,
//       y + G_TURN_ORDER_BOX_HEIGHT - pxHeight,
//       G_TURN_ORDER_BOX_WIDTH,
//       pxHeight,
//       G_POSITIVE_SPEED_COLOR,
//       G_POSITIVE_SPEED_COLOR
//     );
//   }
// };

const G_view_drawTurnOrder = (battle: Battle) => {
  const boxHeight = G_TURN_ORDER_BOX_HEIGHT;
  const boxWidth = G_TURN_ORDER_BOX_WIDTH;
  const { turnOrder } = G_model_battleGetCurrentRound(battle);
  const l = turnOrder.length;
  const top = 10;
  const totalWidth = (boxWidth + 5) * l;
  let left =
    G_model_getScreenSize() - G_model_getScreenSize() / 3 - totalWidth / 2;
  G_view_drawUiBackground(left - 5, top - 5, totalWidth + 5, boxHeight + 40);
  for (let i = 0; i < l; i++, left += boxWidth + 5) {
    const { name, actor } = turnOrder[i];
    const { sprite, spriteIndex } = actor;
    const round = G_model_battleGetCurrentRound(battle);
    const y = top + (round.currentIndex === i ? 20 : 10);
    G_view_drawUiBackground(
      left,
      y,
      boxWidth,
      boxHeight,
      G_utils_isAlly(battle, turnOrder[i]) ? G_ALLY_COLOR : G_ENEMY_COLOR
    );
    const y2 = G_utils_isAlly(battle, turnOrder[i]) ? y - 5 : y + boxHeight + 8;
    G_view_drawText(name.slice(0, 5), left + boxWidth / 2, y2, {
      size: 12,
      align: 'center',
      strokeColor: G_WHITE,
    });

    G_view_drawSprite(`${sprite}_${spriteIndex}`, left, y + 5, 2);
  }
};

let dialogCb: any = null;
const KEYPRESS = 'keypress';
let G_view_hideDialog = () => {
  const dialogElem = document.getElementById('dialogBox') as HTMLElement;
  window.removeEventListener(KEYPRESS, dialogCb);
  dialogElem.style.opacity = '0';
  dialogElem.style.width = '0';
  G_model_setCutsceneVisible(false);
};

const G_view_renderDialogBox = (text: string, cb: () => void) => {
  const dialogElem = document.getElementById('dialogBox') as HTMLElement;
  window.removeEventListener(KEYPRESS, dialogCb);
  dialogElem.innerHTML = `<div style="width:476px">${text}</div>`;
  dialogElem.style.opacity = '1';
  dialogElem.style.width = '512px';
  dialogCb = (ev: any) => {
    const key = ev.key.length > 1 ? ev.key : ev.key.toUpperCase();
    if (key === G_KEY_SPACE || key === G_KEY_X || key === G_KEY_ENTER) {
      window.removeEventListener(KEYPRESS, dialogCb);
      cb();
    }
  };
  setTimeout(() => {
    window.addEventListener(KEYPRESS, dialogCb);
  }, 25);
  G_model_setCutsceneVisible(true);
};

const G_view_renderItemsBox = (items: Item[], visible: boolean) => {
  const itemBox = document.getElementById('itemBox') as HTMLElement;
  itemBox.innerHTML = `<span class="item">${
    items.length ? 'Items:' : ''
  }</span>`;
  for (let i = 0; i < items.length; i++) {
    const span = document.createElement('span');
    span.innerHTML = items[i].name + (i < items.length - 1 ? ',' : '');
    span.className = 'item';
    itemBox.appendChild(span);
  }

  if (!visible) {
    itemBox.style.display = 'none';
  } else {
    itemBox.style.display = 'flex';
  }
};
