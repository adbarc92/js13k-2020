/*
This file contains logic for what happens when an event occurs: a keypress, button click, .etc
*/
/*
global
G_model_setKeyDown
G_model_setKeyUp
G_battleGenerateRound
G_BATTLE_CURRENT_BATTLE
G_controller_battleSimulateNextRound
G_model_getCurrentBattle
G_model_getBattleInputEnabled
G_model_getCursorIndex
G_model_setCursorIndex
G_view_drawMenu
*/

/* Event Flags */

window.addEventListener('keydown', ev => {
  G_model_setKeyDown(ev.key);

  if (ev.key === 'q') {
    (window as any).running = false;
  }

  if (G_model_getBattleInputEnabled()) {
    if (ev.key === ' ' || ev.key === 'b') {
      // console.log('keypress!!!', ev);
      G_controller_battleSimulateNextRound(G_model_getCurrentBattle());
    }

    if (ev.key === 'ArrowDown') {
      const index = G_model_getCursorIndex();
      G_model_setCursorIndex((index + 1) % 6);
      G_view_drawMenu(['Strike', 'Charge', 'Defend', 'Use', 'Heal', 'Flee']);
    }

    if (ev.key === 'ArrowUp') {
      const index = G_model_getCursorIndex();
      const newIndex = index - 1 < 0 ? 5 : index - 1;
      G_model_setCursorIndex(newIndex);
      G_view_drawMenu(['Strike', 'Charge', 'Defend', 'Use', 'Heal', 'Flee']);
    }
  }
});

window.addEventListener('keyup', ev => {
  G_model_setKeyUp(ev.key);
});
