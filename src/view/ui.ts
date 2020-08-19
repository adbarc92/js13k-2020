/*
global
G_model_getCtx
G_model_getScreenSize
G_view_drawText
G_view_drawRect
G_BLACK
G_WHITE
G_ALLEGIANCE_ENEMY
G_ALLEGIANCE_ALLY
*/

const G_CURSOR_WIDTH = 16;
const G_CURSOR_HEIGHT = 16;

const G_view_drawUiBackground = (
  x: number,
  y: number,
  w: number,
  h: number
) => {
  G_view_drawRect(x, y, w, h, G_BLACK);
  G_view_drawRect(x, y, w, h, G_WHITE, true);
};

const G_view_drawMenuCursor = (x: number, y: number) => {
  const ctx = G_model_getCtx();
  const cursorHeight = G_CURSOR_HEIGHT;
  const cursorWidth = G_CURSOR_WIDTH;
  ctx.save();
  ctx.translate(x - G_CURSOR_WIDTH / 2, y - G_CURSOR_HEIGHT / 2);
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
    G_view_drawText(label, x + w / 2, y + ind * lh + lh / 2, {
      align: 'center',
    });
  });
  G_view_drawMenuCursor(x - G_CURSOR_WIDTH, y + i * lh + lh / 2);
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

const G_view_drawInfo = (battle: Battle, allegiance: Allegiance) => {
  // For players, contains name, HP, currentCharge
  const lineHeight = 20;
  const screenSize = G_model_getScreenSize();
  const w = 200;
  const h = 90;
  const x = allegiance === G_ALLEGIANCE_ENEMY ? screenSize - w : 0;
  const y = screenSize - 90;
  G_view_drawUiBackground(x, y, w, h);
  const units =
    allegiance === G_ALLEGIANCE_ENEMY ? battle.enemies : battle.allies;
  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    const { name, bS, cS } = unit;
    if (allegiance === G_ALLEGIANCE_ALLY) {
      G_view_drawText(name.slice(0, 8), x + 10, y + 15 + lineHeight * i);
      G_view_drawText(`${cS.hp}/${bS.hp}`, x + 100, y + 15 + lineHeight * i);
      G_view_drawText(`${cS.cCnt}`, x + 175, y + 15 + lineHeight * i);
    } else {
      G_view_drawText(name.slice(0, 8), x + w / 2, y + 15 + lineHeight * i, {
        align: 'center',
      });
    }
  }
};
