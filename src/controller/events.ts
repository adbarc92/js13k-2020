/*
This file contains logic for what happens when an event occurs: a keypress, button click, .etc
*/
/*
global
G_model_setKeyDown
G_model_setKeyUp
G_model_getCurrentBattle
G_model_getBattleInputEnabled
G_model_getCursorIndex
G_model_setCursorIndex
G_model_roundGetActingUnit
G_model_battleGetCurrentRound
G_model_menuSetNextCursorIndex
G_model_menuSelectCurrentItem
G_model_menuSelectNothing
G_view_drawBattle
G_controller_battleSimulateNextRound
G_controller_battleActionCharge
G_controller_battleActionHeal
G_view_hideDialogBox
G_model_getShowingDialogue
*/

window.addEventListener('keydown', ev => {
  if (!G_model_getShowingDialogue()) G_model_setKeyDown(ev.key);
  // console.log('KEY', ev.key);

  if (ev.key === 'q') {
    (window as any).running = false;
  }

  // if (ev.key === ' ') {
  //   G_view_hideDialogBox();
  // }

  const battle = G_model_getCurrentBattle();
  if (G_model_getBattleInputEnabled() && battle) {
    const key = ev.key;

    const menu = battle.actionMenuStack[0];
    if (key === 'ArrowDown') {
      G_model_menuSetNextCursorIndex(menu, 1);
    } else if (key === 'ArrowUp') {
      G_model_menuSetNextCursorIndex(menu, -1);
    } else if (key === 'Enter') {
      G_model_menuSelectCurrentItem(menu);
    } else if (key === 'Escape') {
      if (battle.actionMenuStack.length > 1) {
        G_model_menuSelectNothing(menu);
      }
    }
  }
});

window.addEventListener('keyup', ev => {
  G_model_setKeyUp(ev.key);
});
