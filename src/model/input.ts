/*
This file contains functions that do something when an input is pressed.
 */
/*
global
G_model_getCurrentRoom
*/

let model_dialogVisible = false;

const G_model_getShowingDialogue = () => {
  return model_dialogVisible;
};

const G_model_setShowingDialogue = (v: boolean) => {
  model_dialogVisible = v;
};

type KeysStatus = {
  [key: string]: boolean;
};

const model_keys: KeysStatus = {};

const G_KEY_RIGHT = 'ArrowRight';
const G_KEY_LEFT = 'ArrowLeft';
const G_KEY_UP = 'ArrowUp';
const G_KEY_DOWN = 'ArrowDown';
const G_KEY_SPACE = ' ';

const G_model_setKeyDown = (key: string) => {
  if (!model_keys[key]) {
    model_keys[key] = true;
  }
};

const G_model_setKeyUp = (key: string) => {
  model_keys[key] = false;
};

const G_model_isKeyDown = (key: string) => {
  return model_keys[key];
};
