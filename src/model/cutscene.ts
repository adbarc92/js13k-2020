/*
global
G_view_renderDialogBox
G_view_hideDialog
G_model_worldSetState
G_model_worldGetState
G_model_worldOnce
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

const showDialog = async (text: string) => {
  return new Promise(resolve => {
    G_view_renderDialogBox(text, resolve);
  });
};
const playLines = async (lines: string[]) => {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      await showDialog(line);
    }
  }
};

const G_playCutsceneOldMan = async () => {
  const lines = `
Hello there.
I see you've arrived with your wits about you.
That's very good.  You'll need them.
If you examine the statues in this cave, you'll notice that they're all...
...missing something.
If you seek refuge from this place, it may be prudent to find what is not found.
`.split('\n');

  await playLines(lines);
  G_view_hideDialog();
};

const G_playCutsceneRunnerWithoutLegs = async () => {
  let lines = [''];
  if (G_model_worldOnce('examined_runner_without_legs')) {
    lines = `
There's a plack beneath this statue.
It says, "The Runner."
This statue appears to be missing a pair of legs.
`.split('\n');
  } else {
    lines = `
This statue appears to be missing a pair of legs.
`.split('\n');
  }

  await playLines(lines);
  G_view_hideDialog();
};
