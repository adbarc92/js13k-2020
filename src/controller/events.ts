/*
This file contains logic for what happens when an event occurs: a keypress, button click, .etc
*/
/*
global
G_model_setKeyDown
G_model_setKeyUp
G_model_isCutsceneVisible

*/

window.addEventListener('keydown', ev => {
  if (!G_model_isCutsceneVisible()) G_model_setKeyDown(ev.key);
});

window.addEventListener('keyup', ev => {
  G_model_setKeyUp(ev.key);
});
