/*
global
G_controller_doBattle
G_model_actorGetPosition
G_model_actorSetFacing
G_model_actorSetPosition
G_model_actorSetVelocity
G_model_createBattle
G_model_getCurrentWorld
G_model_partyGetProtag
G_model_worldSetState
G_model_worldGetState
G_model_worldOnce

G_view_renderDialogBox
G_view_hideDialog
G_view_playSound
G_utils_waitMs

G_model_worldGetCurrentRoom
G_model_roomRemoveCharacter
G_model_partyAddItem
G_model_partyGetItem
G_model_partyRemoveItem
G_FACING_LEFT
G_FACING_RIGHT
G_COMPLETION_VICTORY
G_COMPLETION_INCONCLUSIVE
*/

const SIGN = (text: string) => [`This sign says: "${text}"`];
const ACQUIRE_ITEM = (text: string, text2: string) => [
  `You acquired: ${text}`,
  text2,
];

const showDialog = async (text: string, omitSound?: boolean) => {
  if (!omitSound) {
    G_view_playSound('cutscene');
  }
  return new Promise(resolve => {
    G_view_renderDialogBox(text, resolve);
  });
};
const G_controller_playLinearCutscene = async (
  lines: string[],
  openSound?: string
) => {
  G_view_playSound(openSound || 'menuConfirm');
  showDialog('', true);
  const world = G_model_getCurrentWorld();
  world.pause = true;
  await G_utils_waitMs(250);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      await showDialog(line);
    }
  }
  G_view_playSound('menuCancel');
  world.pause = false;
};

const G_controller_playSignCutscene = async (text: string) => {
  const lines = SIGN(text);
  await G_controller_playLinearCutscene(lines);
  G_view_hideDialog();
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

const G_controller_playStatueCutscene = async (
  statueCh: Character,
  itemDef: ItemDef,
  plaqueText: string
) => {
  let lines = [''];
  const defaultText = 'This statue appears to be missing a something...';

  const world = G_model_getCurrentWorld();
  const party = world.party;
  const item = G_model_partyGetItem(party, itemDef);
  const stateKey = itemDef.name + '_fixed';

  if (G_model_worldGetState(stateKey)) {
    lines = ['You have fixed this statue.'];
  } else if (item) {
    await G_controller_playLinearCutscene(
      `
You place the '${item.name}' inside the statue.
...
Something awakens inside it.
`.split('\n')
    );
    G_model_partyRemoveItem(party, item);
    await G_utils_waitMs(150);
    G_view_playSound('item');
    statueCh.actor.spriteIndex = 12;
    await G_utils_waitMs(2000);
    lines = ['You have fixed the statue!'];
    G_model_worldSetState(stateKey, true);
  } else {
    lines = `
There's a plaque beneath this statue.
It says, "${plaqueText}"
${defaultText}
`.split('\n');
  }

  await G_controller_playLinearCutscene(lines);
  G_view_hideDialog();
};

const G_controller_startBattle = async (
  roamer: Character,
  encounter: EncounterDef,
  items?: ItemDef[]
) => {
  const world = G_model_getCurrentWorld();
  world.pause = true;
  const party = world.party;
  const protag = G_model_partyGetProtag(world.party);
  const [x, y] = G_model_actorGetPosition(protag.actor);
  const battle = G_model_createBattle(party, encounter);
  await G_controller_doBattle(battle);
  const room = G_model_worldGetCurrentRoom(world);
  G_model_roomRemoveCharacter(room, roamer);
  G_model_actorSetPosition(protag.actor, x, y);
  G_model_actorSetVelocity(protag.actor, 0, 0);
  if (battle.completionState === G_COMPLETION_VICTORY) {
    if (items) {
      for (let i in items) {
        await G_controller_acquireItem(items[i]);
      }
    }
  } else if (battle.completionState === G_COMPLETION_INCONCLUSIVE) {
    for (let i = 0; i < party.characters.length; i++) {
      (party.characters[i].unit as Unit).cS.spd -= 3;
    }
  } else {
    await G_controller_playLinearCutscene(['Game Over']);
    window.location.reload();
  }
  world.pause = false;
};

const G_controller_acquireItem = async (
  itemTemplate: ItemDef,
  character?: Character
) => {
  const world = G_model_getCurrentWorld();
  const { name, dsc } = itemTemplate;
  const lines = ACQUIRE_ITEM(name, dsc);

  world.pause = true;

  await G_controller_playLinearCutscene(lines, 'item');
  G_view_hideDialog();

  const room = G_model_worldGetCurrentRoom(world);
  if (character) {
    G_model_roomRemoveCharacter(room, character);
  }

  G_model_partyAddItem(world.party, itemTemplate);
};
