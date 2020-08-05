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
*/

/* Event Flags */
let BATTLE_INPUT_ENABLED = false;
let BATTLE_IN_BATTLE = false;
// let BATTLE_ADVANCE = false;

window.addEventListener('keydown', ev => {
  G_model_setKeyDown(ev.key);

  if (ev.key === 'q') {
    (window as any).running = false;
  }

  console.log('keypress!!!', ev);
  if (ev.key === ' ') {
    console.log('thing');
  }

  if (ev.key === 'b') {
    console.log('SIMULATE ROUND BENJAMIN');
    G_controller_battleSimulateNextRound(G_model_getCurrentBattle());
  }

  if (BATTLE_INPUT_ENABLED && BATTLE_IN_BATTLE) {
    if (ev.key === '1') {
      // useStrike
    }
  }
});

window.addEventListener('keyup', ev => {
  G_model_setKeyUp(ev.key);
});
