/*
global
G_model_getCtx
G_view_drawText
 G_model_actorSetFacing
 G_model_actorSetPosition
 G_view_drawActor
 G_FACING_RIGHT
*/
const MENU_DEFAULT_LINE_HEIGHT = 16;

type MenuIncrement = -1 | 1;

interface Menu {
  x: number;
  y: number;
  w: number;
  h: number;
  items: string[];
  i: number;
  cb: (i: number) => void;
  disabledItems: number[];
  bg: boolean;
  lineHeight: number;
}

const G_model_createVerticalMenu = (
  x: number,
  y: number,
  w: number,
  items: string[],
  cb: (i: number) => void,
  disabledItems: number[],
  bg?: boolean,
  lineHeight?: number
): Menu => {
  lineHeight = lineHeight || MENU_DEFAULT_LINE_HEIGHT;
  return {
    x,
    y,
    w,
    h: lineHeight * items.length,
    i: 0,
    cb,
    disabledItems,
    items,
    lineHeight,
    bg: !!bg,
  };
};

const G_model_menuSetNextCursorIndex = (menu: Menu, diff: MenuIncrement) => {
  const len = menu.items.length;
  let nextIndex = menu.i + diff;
  if (menu.disabledItems.includes(nextIndex)) {
    nextIndex += diff;
  }
  if (nextIndex < 0) {
    nextIndex = len - 1;
  } else if (nextIndex >= len) {
    nextIndex = 0;
  }
  menu.i = nextIndex;
};

const G_model_menuSelectCurrentItem = (menu: Menu) => {
  menu.cb(menu.i);
};

const G_model_menuSelectNothing = (menu: Menu) => {
  menu.cb(-1);
};
