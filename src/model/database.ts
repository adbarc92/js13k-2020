// Should contain all content
/*
global
G_controller_battleEnd
G_controller_doBattle
G_controller_facePlayer
G_controller_playLinearCutscene
G_model_actorGetPosition
G_model_actorSetPosition
G_model_actorSetVelocity
G_controller_doBattle
G_model_createBattle
G_controller_playSignCutscene
G_controller_acquireItem
G_controller_startBattle
G_model_actorSetFacing
G_model_createStats
G_model_createCharacterFromTemplate
G_model_createStats
G_model_getCurrentWorld
G_model_partyGetProtag
G_model_partyAddCharacter
G_model_worldOnce
G_model_partyRemoveItem
G_model_worldResetProtagToStartingPosition
G_model_partyGetItem
G_controller_playStatueCutscene
G_view_hideDialog
G_view_playSound
G_utils_waitMs
G_AI_STRIKER
G_FACING_LEFT
G_FACING_RIGHT
*/

type AI = 0 | 1 | 2 | 3 | 4;
const G_AI_PLAYER: AI = 0;
const G_AI_CHARGER: AI = 1;
const G_AI_STRIKER: AI = 2;
const G_AI_BREAKER: AI = 3;
const G_AI_BOSS: AI = 4;

type ROAMER_AI = 0 | 1;
const G_ROAMER_AI_STILL: ROAMER_AI = 0;
const G_ROAMER_AI_LEFT_RIGHT: ROAMER_AI = 1;

const SPRITESHEET_TERRAIN = 'terrain';

interface ItemDef {
  name: string;
  dsc: string;
  onUse: () => void;
}

const G_model_createStats = (
  hp: number,
  dmg: number,
  def: number,
  mag: number,
  spd: number
): Stats => {
  return { hp, dmg, def, mag, spd, iCnt: mag, cCnt: 0 };
};

interface StatsDef {
  bS: Stats;
  ai: AI;
}

interface EncounterDef {
  enemies: CharacterDef[];
  // items gained
}

interface CharacterDef {
  name: string;
  sprI: number; // sprite index on the spritesheet to use for this character
  stats?: StatsDef;
  spr?: string; // defaults to 'actors'
  label?: string; // platforming: text that appears when moving atop this character
  action?: (ch?: Character) => any; // platforming: function to run when when a player presses 'x' above this character
  col?: (ch?: Character) => any; // platforming: function to run when the protag collides with this character
}

// Items

const G_ITEM_BOMB: ItemDef = {
  name: 'Bomb',
  dsc: 'It destroys all enemies!',
  onUse: () => {},
};
const G_ITEM_STATUE_LEGS: ItemDef = {
  name: "Statue's Legs",
  dsc: 'Good for running.',
  onUse: () => {},
};
const G_ITEM_STATUE_VOICE: ItemDef = {
  name: "Statue's Voice",
  dsc: 'The sound a mouth makes.  Not the game show.',
  onUse: () => {},
};
const G_ITEM_STATUE_MIND: ItemDef = {
  name: "Statue's MIND",
  dsc: 'Arguably necessary to have.',
  onUse: () => {},
};

const G_ITEM_MARBLE: ItemDef = {
  name: 'Radiant Stone',
  dsc: 'A gleaming marble radiating shifting hues',
  onUse: () => {},
};

// Characters

const G_CHARACTER_PROTAG: CharacterDef = {
  name: '',
  stats: {
    bS: G_model_createStats(90, 25, 16, 5, 20),
    ai: G_AI_PLAYER,
  },
  sprI: 0,
};
const G_CHARACTER_STRIKER: CharacterDef = {
  name: '',
  stats: {
    bS: G_model_createStats(85, 25, 13, 6, 15),
    ai: G_AI_PLAYER,
  },
  sprI: 0,
};
const G_CHARACTER_DEFENDER: CharacterDef = {
  name: '',
  stats: {
    bS: G_model_createStats(80, 19, 18, 4, 6),
    ai: G_AI_PLAYER,
  },
  sprI: 0,
};

const G_CHARACTER_SLAYER: CharacterDef = {
  name: '',
  stats: {
    bS: G_model_createStats(75, 23, 12, 7, 10),
    ai: G_AI_PLAYER,
  },
  sprI: 0,
};

// Monsters

const golem: CharacterDef = {
  name: 'Golem',
  stats: {
    bS: G_model_createStats(35, 22, 40, 0, 5),
    ai: G_AI_STRIKER,
  },
  sprI: 5,
};

const fairy: CharacterDef = {
  name: 'Fairy',
  stats: {
    bS: G_model_createStats(30, 23, 9, 2, 15),
    ai: G_AI_CHARGER,
  },
  sprI: 4,
};

const ape: CharacterDef = {
  name: 'Ape',
  stats: {
    bS: G_model_createStats(20, 40, 5, 0, 15),
    ai: G_AI_STRIKER,
  },
  sprI: 6,
};

const breaker: CharacterDef = {
  name: 'Breaker',
  stats: {
    bS: G_model_createStats(35, 30, 14, 1, 14),
    ai: G_AI_BREAKER,
  },
  sprI: 7,
};

const ancientBeing: CharacterDef = {
  name: 'Some Old Guy',
  stats: {
    bS: G_model_createStats(200, 30, 40, 10, 17),
    ai: G_AI_BOSS,
  },
  sprI: 15,
};

const G_ENCOUNTER_0: EncounterDef = { enemies: [golem, golem, golem] };
const G_ENCOUNTER_1: EncounterDef = { enemies: [fairy, golem, fairy, ape] };
const G_ENCOUNTER_2: EncounterDef = { enemies: [fairy, golem, fairy, breaker] };
const G_ENCOUNTER_3: EncounterDef = { enemies: [ape, ape, fairy] };
const G_ENCOUNTER_4: EncounterDef = { enemies: [ape, fairy, golem, golem] };
const G_ENCOUNTER_5: EncounterDef = { enemies: [breaker, ape, golem] };
const G_ENCOUNTER_6: EncounterDef = { enemies: [breaker, ape, fairy] };
const G_ENCOUNTER_7: EncounterDef = { enemies: [fairy, ape, ape, golem] };
const G_ENCOUNTER_FINAL: EncounterDef = {
  enemies: [ancientBeing, ancientBeing],
};

const G_CHARACTER_OLD_MAN: CharacterDef = {
  name: 'Old Man',
  sprI: 15,
  action: async (oldMan: Character) => {
    G_controller_facePlayer(oldMan);
    const lines = `
Hello there.
I see you've arrived with your wits about you.
That's very good.  You'll need them.
If you examine the statues in this cave, you'll notice that they're all...
...missing something.
:)
It may be prudent for you to find what is not found and restore them.
  `.split('\n');

    await G_controller_playLinearCutscene(lines);
    G_view_hideDialog();
  },
};

const G_CHARACTER_STATUE_RUNNER: CharacterDef = {
  name: 'Runner Without Legs',
  spr: SPRITESHEET_TERRAIN,
  sprI: 8,
  action: async (ch: Character) => {
    G_controller_playStatueCutscene(ch, G_ITEM_STATUE_LEGS, 'The Runner.');
  },
};
const G_CHARACTER_STATUE_THINKER: CharacterDef = {
  name: 'Thinker Without Mind',
  spr: SPRITESHEET_TERRAIN,
  sprI: 8,
  action: async (ch: Character) => {
    G_controller_playStatueCutscene(ch, G_ITEM_STATUE_MIND, 'The Thinker.');
  },
};
const G_CHARACTER_STATUE_SPEAKER: CharacterDef = {
  name: 'Speaker Without Voice',
  spr: SPRITESHEET_TERRAIN,
  sprI: 8,
  action: async (ch: Character) => {
    G_controller_playStatueCutscene(ch, G_ITEM_STATUE_VOICE, 'The Speaker.');
  },
};

const G_SIGN_POT_ROOM: CharacterDef = {
  name: 'Sign',
  spr: SPRITESHEET_TERRAIN,
  sprI: 5,
  action: () =>
    G_controller_playSignCutscene('Probably nothing is in these pots.'),
};
const G_SIGN_SPIKES_ARE_DANGEROUS: CharacterDef = {
  name: 'Sign',
  spr: SPRITESHEET_TERRAIN,
  sprI: 5,
  action: () => G_controller_playSignCutscene('SPIKES are dangerous.'),
};
const G_SIGN_POINTLESS_FALL: CharacterDef = {
  name: 'Sign',
  spr: SPRITESHEET_TERRAIN,
  sprI: 5,
  action: () => G_controller_playSignCutscene('This fall is pointless.'),
};
const G_SIGN_POINTY_FALL: CharacterDef = {
  name: 'Sign',
  spr: SPRITESHEET_TERRAIN,
  sprI: 5,
  action: () => G_controller_playSignCutscene('This fall is pointy.'),
};
const G_SIGN_POINTY_FALL_SUCCESS: CharacterDef = {
  name: 'Sign',
  spr: SPRITESHEET_TERRAIN,
  sprI: 5,
  action: () =>
    G_controller_playSignCutscene(
      '(There is a picture of an arrow pointing upwards followed by a `?`)'
    ),
};
const G_SIGN_SHRINE_OF_LEGS: CharacterDef = {
  name: 'Sign',
  spr: SPRITESHEET_TERRAIN,
  sprI: 5,
  action: () => G_controller_playSignCutscene('The SHRINE of LEGS.'),
};
const G_SIGN_MONSTER_ROOM: CharacterDef = {
  name: 'Sign',
  spr: SPRITESHEET_TERRAIN,
  sprI: 5,
  action: () => G_controller_playSignCutscene('Seek seek lest'),
};

const G_CHARACTER_POT: CharacterDef = {
  name: 'Pot',
  spr: SPRITESHEET_TERRAIN,
  sprI: 4,
  action: async () => {
    const lines = `
You check the pot...
There's nothing inside.
  `.split('\n');

    await G_controller_playLinearCutscene(lines);
    G_view_hideDialog();
  },
};
const G_CHARACTER_POT_FAKE: CharacterDef = {
  name: 'Pot!',
  spr: SPRITESHEET_TERRAIN,
  sprI: 4,
  stats: {
    bS: G_model_createStats(85, 25, 13, 6, 15),
    ai: G_AI_PLAYER,
  },
  action: async (ch: Character) => {
    const lines = `
There's something strange about this pot...
You check the pot...
There's a man inside.
'Hello!' He says. 'This pot is lovely, but you look more appealing.'
'I'm coming with you!'
The pot joins your party.
  `.split('\n');

    await G_controller_playLinearCutscene(lines);
    G_view_hideDialog();
    const world = G_model_getCurrentWorld();
    const party = world.party;
    G_model_partyAddCharacter(party, ch);
  },
};
const G_CHARACTER_POT_REAL: CharacterDef = {
  name: 'Pot',
  spr: SPRITESHEET_TERRAIN,
  sprI: 4,
  stats: {
    bS: G_model_createStats(85, 25, 13, 6, 15),
    ai: G_AI_STRIKER,
  },
  action: async (ch: Character) => {
    const lines = `
You check the pot...
  `.split('\n');
    await G_controller_playLinearCutscene(lines);
    await G_controller_acquireItem(G_ITEM_STATUE_VOICE, ch);
    await G_controller_playLinearCutscene(['How did that get in there?']);
    G_view_hideDialog();
  },
};

const G_CHARACTER_JIN: CharacterDef = {
  name: 'Jin',
  sprI: 3,
  stats: {
    bS: G_model_createStats(75, 23, 12, 7, 10),
    ai: G_AI_PLAYER,
  },
  action: async (ch: Character) => {
    G_controller_facePlayer(ch);
    let lines = [''];
    if (G_model_worldOnce('talked_to_jin')) {
      lines = `
Hello friend!
I seem to have misplaced some treasure.
If you'd kindly bring it to me.  I'd be happy to accompany you out of here.
    `.split('\n');
    } else {
      lines = `
Have you found my treasure yet?
      `.split('\n');
    }

    await G_controller_playLinearCutscene(lines);
    G_view_hideDialog();
    const { party } = G_model_getCurrentWorld();

    if (G_model_partyGetItem(party, G_ITEM_MARBLE)) {
      const lines2 = `
      Excellent! I'll take that. Let's be on our way!
      `.split('\n');
      G_model_partyRemoveItem(party, G_ITEM_MARBLE);
      G_model_partyAddCharacter(party, ch);
      await G_controller_playLinearCutscene(lines2);
      G_view_hideDialog();
    }
  },
};

const G_ROAMER_ENCOUNTER_0: CharacterDef = {
  name: '',
  sprI: 5,
  col: async (ch: Character) => {
    await G_controller_startBattle(ch, G_ENCOUNTER_7, [G_ITEM_BOMB]);
  },
};

const G_ROAMER_ENCOUNTER_1: CharacterDef = {
  name: '',
  sprI: 5,
  col: async (ch: Character) => {
    await G_controller_startBattle(ch, G_ENCOUNTER_7, [G_ITEM_BOMB]);
  },
};

const G_ROAMER_ENCOUNTER_2: CharacterDef = {
  name: '',
  sprI: 5,
  col: async (ch: Character) => {
    await G_controller_startBattle(ch, G_ENCOUNTER_4, [G_ITEM_BOMB]);
  },
};

const G_ROAMER_ENCOUNTER_3: CharacterDef = {
  name: '',
  sprI: 5,
  col: async (ch: Character) => {
    await G_controller_startBattle(ch, G_ENCOUNTER_2, [G_ITEM_BOMB]);
  },
};

const G_ROAMER_ENCOUNTER_4: CharacterDef = {
  name: '',
  sprI: 5,
  col: async (ch: Character) => {
    await G_controller_startBattle(ch, G_ENCOUNTER_3, [G_ITEM_BOMB]);
  },
};

const G_ROAMER_ENCOUNTER_5: CharacterDef = {
  name: '',
  sprI: 5,
  col: async (ch: Character) => {
    await G_controller_startBattle(ch, G_ENCOUNTER_5, [G_ITEM_BOMB]);
  },
};

const G_ROAMER_ENCOUNTER_6: CharacterDef = {
  name: '',
  sprI: 5,
  col: async (ch: Character) => {
    await G_controller_startBattle(ch, G_ENCOUNTER_6, [G_ITEM_BOMB]);
  },
};

const G_ROAMER_ENCOUNTER_7: CharacterDef = {
  name: '',
  sprI: 5,
  col: async (ch: Character) => {
    await G_controller_startBattle(ch, G_ENCOUNTER_3, [G_ITEM_BOMB]);
  },
};

const G_CHARACTER_SPIKES: CharacterDef = {
  name: '',
  spr: SPRITESHEET_TERRAIN,
  sprI: 6,
  col: async () => {
    const world = G_model_getCurrentWorld();
    world.pause = true;
    G_view_playSound('spikes');
    await G_utils_waitMs(1000);
    world.pause = false;
    G_model_worldResetProtagToStartingPosition(G_model_getCurrentWorld());
  },
};

const G_CHARACTER_FAKE_WALL: CharacterDef = {
  name: '',
  spr: SPRITESHEET_TERRAIN,
  sprI: 1,
};

const G_CHARACTER_ITEM_MARBLE: CharacterDef = {
  name: 'Shining Stone',
  spr: SPRITESHEET_TERRAIN,
  sprI: 11,
  action: (ch: Character) => G_controller_acquireItem(G_ITEM_MARBLE, ch),
};

const G_CHARACTER_ITEM_BOMB: CharacterDef = {
  name: 'Item',
  spr: SPRITESHEET_TERRAIN,
  sprI: 11,
  action: (ch: Character) => G_controller_acquireItem(G_ITEM_BOMB, ch),
};

const G_CHARACTER_ORANGE: CharacterDef = {
  name: 'Orange',
  sprI: 0,
  stats: {
    bS: G_model_createStats(75, 23, 12, 7, 10),
    ai: G_AI_STRIKER,
  },
  action: async (ch: Character) => {
    G_controller_facePlayer(ch);
    const lines = `
I am the strongest man!
Fight me and I will join you!
    `.split('\n');
    const lines2 = `
    Onward, then!
    `.split('\n');

    await G_controller_playLinearCutscene(lines);
    G_view_hideDialog();
    const G_ENCOUNTER_8: EncounterDef = { enemies: [G_CHARACTER_ORANGE] };
    await G_controller_startBattle(ch, G_ENCOUNTER_8);
    const world = G_model_getCurrentWorld();
    const party = world.party;
    G_model_partyAddCharacter(party, ch);
    await G_controller_playLinearCutscene(lines2);
    G_view_hideDialog();
  },
};

const G_CHARACTER_ITEM_STATUE_LEGS: CharacterDef = {
  name: 'Item',
  spr: SPRITESHEET_TERRAIN,
  sprI: 11,
  action: (ch: Character) => G_controller_acquireItem(G_ITEM_STATUE_LEGS, ch),
};

const G_CHARACTER_ITEM_STATUE_MIND: CharacterDef = {
  name: 'Item',
  spr: SPRITESHEET_TERRAIN,
  sprI: 11,
  action: (ch: Character) => G_controller_acquireItem(G_ITEM_STATUE_MIND, ch),
};
