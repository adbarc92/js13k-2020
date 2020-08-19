/*
global
G_model_getCtx
G_model_getScreenSize
G_view_drawText
G_view_drawRect
G_BLACK
G_WHITE
*/

const G_CURSOR_WIDTH = 16;
const G_CURSOR_HEIGHT = 16;

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
    G_view_drawRect(x, y, w, h, G_BLACK);
    G_view_drawRect(x, y, w, h, G_WHITE, true);
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

  G_view_drawRect(x, y, w, h, G_BLACK);

  G_view_drawText(text, G_model_getScreenSize() / 2, 16, {
    align: 'center',
  });
};
