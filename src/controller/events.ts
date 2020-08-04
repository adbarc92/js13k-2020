/*
This file contains logic for what happens when an event occurs: a keypress, button click, .etc
*/
/*
global
G_model_setKeyDown
G_model_setKeyUp
G_battleGenerateRound
G_BATTLE_CURRENT_BATTLE
mainBattle
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

  if (ev.key === '32') {
    console.log('thing');
    G_battleGenerateRound();
    console.log(G_BATTLE_CURRENT_BATTLE.rounds);
    // mainBattle();
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
