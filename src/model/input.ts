/*
This file contains functions that do something when an input is pressed.
 */
/*
global
G_model_getCurrentRoom
G_model_getCurrentBattle
G_model_getBattleInputEnabled
G_model_getCursorIndex
G_model_setCursorIndex
G_model_roundGetActingUnit
G_model_battleGetCurrentRound
G_model_menuSetNextCursorIndex
G_model_menuSelectCurrentItem
G_model_menuSelectNothing
G_model_isCutsceneVisible
G_model_getInteractCb
G_view_drawBattle
G_controller_battleSimulateNextRound
G_controller_battleActionCharge
G_controller_battleActionHeal
G_view_hideDialogBox
*/

type KeysStatus = {
  [key: string]: boolean;
};

const model_keys: KeysStatus = {};

const G_KEY_RIGHT = 'ArrowRight';
const G_KEY_LEFT = 'ArrowLeft';
const G_KEY_UP = 'ArrowUp';
const G_KEY_DOWN = 'ArrowDown';
const G_KEY_SPACE = ' ';
const G_KEY_ENTER = 'Enter';
const G_KEY_ESCAPE = 'Escape';
const G_KEY_X = 'X';

const G_model_setKeyDown = (key: string) => {
  if (key.length === 1) {
    key = key.toUpperCase();
  }
  if (!model_keys[key]) {
    model_keys[key] = true;
    if (key === 'q') {
      (window as any).running = false;
    }

    if (G_model_isCutsceneVisible()) {
      return;
    }
    const battle = G_model_getCurrentBattle();
    if (G_model_getBattleInputEnabled() && battle) {
      const menu = battle.actionMenuStack[0];
      if (key === G_KEY_DOWN) {
        G_model_menuSetNextCursorIndex(menu, 1);
      } else if (key === G_KEY_UP) {
        G_model_menuSetNextCursorIndex(menu, -1);
      } else if (key === G_KEY_ENTER) {
        G_model_menuSelectCurrentItem(menu);
      } else if (key === G_KEY_ESCAPE) {
        if (battle.actionMenuStack.length > 1) {
          G_model_menuSelectNothing(menu);
        }
      }
    } else {
      if (key === G_KEY_X) {
        const cb = G_model_getInteractCb();
        if (cb) {
          cb();
        }
      }
    }
  }
};

const G_model_setKeyUp = (key: string) => {
  if (key.length === 1) {
    key = key.toUpperCase();
  }
  model_keys[key] = false;
};

const G_model_isKeyDown = (key: string) => {
  if (key.length === 1) {
    key = key.toUpperCase();
  }
  return model_keys[key];
};
