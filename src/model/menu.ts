/*
global
G_model_getCtx
G_view_drawText
 G_model_actorSetFacing
 G_model_actorSetPosition
 G_view_drawActor
 G_FACING_RIGHT
*/

interface Menu {
  x: number;
  y: number;
  cursorPosition: number;
  menuItems: string[] | Unit[]; // string[] | Unit[];
  shouldDisplayBackground: boolean;
  // menuItemFuncs: () => {}[];
  // itemOffset
}

const G_model_createMenu = (
  x: number,
  y: number,
  menuItems: string[] | Unit[],
  shouldDisplayBackground: boolean
  // menuItemFuncs: () => {}[]
): Menu => {
  return {
    x,
    y,
    cursorPosition: 0,
    menuItems,
    shouldDisplayBackground,
    // menuItemFuncs,
  };
};

const model_getMenuStrWidth = (menuItems: string[]): number => {
  const ctx = G_model_getCtx();
  // menuItems as string[];
  return Math.max(...menuItems.map(el => ctx.measureText(el).width));
};

const model_getMenuStrHeight = (menuItem: string) => {
  const ctx = G_model_getCtx();
  let metrics = ctx.measureText(menuItem);
  return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
};

const G_view_drawUnitHP = (unit: Unit, x: number, y: number) => {
  const ctx = G_model_getCtx();
  ctx.font = '14px monospace';
  ctx.fillStyle = 'white';
  ctx.fillText(`${unit.cS.hp}/${unit.bS.hp}`, x * 2 + 5, y * 2 - 5);
};

const G_view_drawMenu2 = (menu: Menu) => {
  const ctx = G_model_getCtx();
  const { x, y, menuItems, cursorPosition } = menu;
  let w = 0,
    h = 0,
    itemOffset = 0;
  // Get width/height
  if (typeof menuItems[0] !== 'string') {
    itemOffset = 30;
    w = 16;
    h = 16 * menuItems.length;
  } else {
    itemOffset = 18;
    w = model_getMenuStrWidth(menuItems as string[]) * 2;
    h = model_getMenuStrHeight(menuItems[0]) * menuItems.length * 2;
    // h = 120;
    console.log('h:', h);
  }

  if (menu.shouldDisplayBackground) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, w, h);
    console.log('x:', x);
    console.log('y:', y);
    console.log('w:', w);
    console.log('h:', h);
    ctx.fillStyle = 'black';
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  }

  for (
    let i = 0, j = x + w / 4, k = y + itemOffset;
    i < menuItems.length;
    i++, k += itemOffset
  ) {
    if (typeof menuItems[i] === 'string') {
      G_view_drawText(menuItems[i] as string, j, k);
    } else {
      const { actor } = menuItems[i] as Unit;
      // setFacing
      G_model_actorSetFacing(actor, G_FACING_RIGHT);
      G_model_actorSetPosition(actor, j, k);
      G_view_drawActor(actor);
      G_view_drawUnitHP(menuItems[i] as Unit, j, k);
    }
  }

  const cursorOffset = cursorPosition * itemOffset;
  ctx.beginPath();
  ctx.moveTo(x + w / 8, y + h / 12); //
  ctx.lineTo(x + w / 8, y + h / 6);
  ctx.lineTo(x + w / 4 - 5, y + (h * 3) / 24);
  ctx.closePath();
  ctx.fillStyle = 'white';
  ctx.fill();
};
