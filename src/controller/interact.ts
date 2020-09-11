/*
global
G_utils_waitMs
G_view_renderDialogBox
G_view_hideDialog
G_view_playSound
G_model_partyGetProtag
G_model_getCurrentWorld
G_model_actorSetFacing
G_model_worldSetState
G_model_worldGetState
G_model_worldOnce
G_FACING_LEFT
G_FACING_RIGHT
*/

const showDialog = async (text: string, omitSound?: boolean) => {
  if (!omitSound) {
    G_view_playSound('cutscene');
  }
  return new Promise(resolve => {
    G_view_renderDialogBox(text, resolve);
  });
};
const G_controller_playLinearCutscene = async (lines: string[]) => {
  G_view_playSound('menuConfirm');
  showDialog('', true);
  await G_utils_waitMs(250);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      await showDialog(line);
    }
  }
  G_view_playSound('menuCancel');
};

const G_controller_facePlayer = (character: Character) => {
  const world = G_model_getCurrentWorld();
  const protag = G_model_partyGetProtag(world.party);
  const protagActor = protag.actor;
  const characterActor = character.actor;
  if (protagActor.x < characterActor.x) {
    G_model_actorSetFacing(characterActor, G_FACING_LEFT);
  } else {
    G_model_actorSetFacing(characterActor, G_FACING_RIGHT);
  }
};
