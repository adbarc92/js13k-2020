/*
This file contains logic for what happens when an event occurs: a keypress, button click, .etc
*/
/*
global
G_model_setKeyDown
G_model_setKeyUp
*/

/* Event Flags */
let BATTLE_ENABLE_INPUT = false;
let BATTLE_IN_BATTLE = false;

window.addEventListener('keydown', ev => {
  G_model_setKeyDown(ev.key);

  if (ev.key === 'q') {
    (window as any).running = false;
  }

  if (ENABLE_INPUT && IN_BATTLE) {
    if (ev.key === '1') {
      // useStrike
    }
  }
});

window.addEventListener('keyup', ev => {
  G_model_setKeyUp(ev.key);
});
