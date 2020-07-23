/*
This file contains logic for what happens when an event occurs: a keypress, button click, .etc
*/
/*
global
G_model_setKeyDown
G_model_setKeyUp
*/

window.addEventListener('keydown', ev => {
  G_model_setKeyDown(ev.key);

  if (ev.key === 'q') {
    (window as any).running = false;
  }
});

window.addEventListener('keyup', ev => {
  G_model_setKeyUp(ev.key);
});
