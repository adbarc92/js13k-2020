/*
global
*/

let model_cutsceneVisible = false;
let model_interactCb: (() => any) | null = null;

const G_model_isCutsceneVisible = () => {
  return model_cutsceneVisible;
};
const G_model_setCutsceneVisible = (v: boolean) => {
  model_cutsceneVisible = v;
};

const G_model_setInteractCb = (v: (() => any) | null) => (model_interactCb = v);
const G_model_getInteractCb = () => model_interactCb;
