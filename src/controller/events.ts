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
G_model_roundGetActingUnit
G_view_drawMenu
G_controller_battleActionCharge
G_controller_battleActionHeal
BATTLE_MENU
G_controller_battle
G_model_battleGetCurrentRound
*/

/* Event Flags */

window.addEventListener('keydown', ev => {
  G_model_setKeyDown(ev.key);

  console.log('keypress!!!', ev);

  if (ev.key === 'q') {
    (window as any).running = false;
  }

  if (G_model_getBattleInputEnabled()) {
    if (ev.key === ' ' || ev.key === 'b') {
      G_controller_battleSimulateNextRound(G_model_getCurrentBattle());
    }

    const battle = G_model_getCurrentBattle();
    const round = G_model_battleGetCurrentRound(battle);
    const actor = G_model_roundGetActingUnit(round) as Unit;

    if (ev.key === 'ArrowDown') {
      const index = G_model_getCursorIndex();
      G_model_setCursorIndex((index + 1) % 6);
      G_view_drawMenu(BATTLE_MENU);
    }

    if (ev.key === 'ArrowUp') {
      const index = G_model_getCursorIndex();
      const newIndex = index - 1 < 0 ? 5 : index - 1;
      G_model_setCursorIndex(newIndex);
      G_view_drawMenu(BATTLE_MENU);
    }

    // if (ev.key === '1') {
    //   const battle = G_model_getCurrentBattle();
    //   G_model_roundGetActingUnit(battle.rounds[battle.roundIndex]);

    // }

    if (ev.key == '2') {
      G_controller_battleActionCharge(actor);
    }

    if (ev.key === '5') {
      G_controller_battleActionHeal(actor);
    }

    // if (ev.key === 'Enter') {}
  }
});

window.addEventListener('keyup', ev => {
  G_model_setKeyUp(ev.key);
});
