/*
global
G_model_battleGetCurrentRound
G_model_getCtx
G_model_getScreenSize
G_utils_isAlly
G_view_drawRect
G_view_drawSprite
G_view_drawText

G_model_setShowingDialogue

G_ALLEGIANCE_ALLY
G_ALLEGIANCE_ENEMY
G_BATTLE_SCALE
G_BLACK
G_GOLD
G_WHITE
*/

const G_CURSOR_WIDTH = 16;
const G_CURSOR_HEIGHT = 16;

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
  const y = 0;
  const w = G_model_getScreenSize();
  const h = 30;

  G_view_drawUiBackground(x, y, w, h);

  G_view_drawText(text, G_model_getScreenSize() / 2, 16, {
    align: 'center',
  });
};

const G_view_drawHeaders = (x: number, y: number) => {
  const w = 200;
  const h = 25;
  const y2 = y - h;
  G_view_drawUiBackground(x, y2, w, h);
  G_view_drawText('Unit', x + 10, y2 + h / 2);
  G_view_drawText('HP', x + 80, y2 + h / 2);
  G_view_drawText('Chg', x + 140, y2 + h / 2);
  G_view_drawText('Int', x + 170, y2 + h / 2);
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
      G_view_drawText(`${cS.hp}/${bS.hp}`, x + 80, y + 15 + lineHeight * i);
      G_view_drawText(`${cS.cCnt}`, x + 145, y + 15 + lineHeight * i);
      G_view_drawText(`${cS.iCnt}`, x + 175, y + 15 + lineHeight * i);
    } else {
      G_view_drawText(name.slice(0, 8), x + w / 2, y + 15 + lineHeight * i, {
        align: 'center',
      });
    }
  }
};

const G_view_drawTurnOrder = (battle: Battle) => {
  const boxHeight = 40; // 30x30 squares where the bottom 10px is the name
  const boxWidth = 30;
  const { turnOrder } = G_model_battleGetCurrentRound(battle);
  const l = turnOrder.length;
  let x = G_model_getScreenSize() / 2 - (l / 2) * boxWidth - 5; // start halfway across the screen, down 30 pixels for battleText
  for (let i = 0; i < l; i++, x += boxWidth + 5) {
    const { name, actor } = turnOrder[i];
    const { sprite, spriteIndex } = actor;
    const round = G_model_battleGetCurrentRound(battle);
    const y = round.currentIndex === i ? 50 : 40;
    G_view_drawUiBackground(x, y, boxWidth, boxHeight);
    const y2 = G_utils_isAlly(battle, turnOrder[i]) ? y : y + boxHeight;
    G_view_drawText(name.slice(0, 5), x + boxWidth / 2, y2, {
      size: '10',
      align: 'center',
      strokeColor: G_WHITE,
    });

    G_view_drawSprite(`${sprite}_${spriteIndex}`, x, y, 2);
  }
};

const G_view_showDialogBox = (text: string) => {
  const dialogElem = document.getElementById('dialogBox') as HTMLElement;
  const screenSize = G_model_getScreenSize();
  const h = 128;
  dialogElem.innerHTML = text;
  dialogElem.style['font-size'] = '24px';
  // dialog;
  dialogElem.style.border = '2px solid white';
  dialogElem.style.height = `${h}px`;
  dialogElem.style.width = `${screenSize - 54}px`;
  dialogElem.style.top = `${screenSize - h}px`;
  G_model_setShowingDialogue();
};

const G_view_hideDialogBox = () => {
  document.getElementById('dialogBox')?.setAttribute('style', 'display: none');
  G_model_setShowingDialogue();
};
