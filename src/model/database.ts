// Should contain all content
/*
global
G_controller_playLinearCutscene
G_model_createStats
G_model_createCharacterFromTemplate
G_model_getCurrentWorld
G_model_partyGetProtag
G_model_actorSetFacing
G_model_worldOnce
G_view_hideDialog
G_AI_STRIKER
G_FACING_LEFT
G_FACING_RIGHT
*/

type AI = 0 | 1 | 2 | 3;
const G_AI_PLAYER: AI = 0;
const G_AI_CHARGER: AI = 1;
const G_AI_STRIKER: AI = 2;
const G_AI_BOSS: AI = 3;

type ROAMER_AI = 0 | 1;
const G_ROAMER_AI_STILL: ROAMER_AI = 0;
const G_ROAMER_AI_LEFT_RIGHT: ROAMER_AI = 1;

interface ItemDef {
  name: string;
  description: string;
  effect: () => void;
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
  enc?: EncounterDef; // platforming: when colliding with this character start this encounter
}

interface RoamerDef {
  ch?: CharacterDef;
  encounter?: EncounterDef;
  sprI: number;
  roamAI: ROAMER_AI;
}

const golem: CharacterDef = {
  name: 'Golem',
  stats: {
    bS: G_model_createStats(1, 20, 20, 10, 5),
    ai: G_AI_STRIKER,
  },
  sprI: 5,
};

const fairy: CharacterDef = {
  name: 'Fairy',
  stats: {
    bS: G_model_createStats(20, 8, 5, 10, 15),
    ai: G_AI_STRIKER,
  },
  sprI: 4,
};

const G_ENCOUNTER_0: EncounterDef = { enemies: [golem, golem, golem, golem] };
const G_ENCOUNTER_1: EncounterDef = { enemies: [fairy, golem, fairy] };

const G_CHARACTER_PROTAG: CharacterDef = {
  name: '',
  stats: {
    bS: G_model_createStats(90, 100, 20, 5, 10),
    ai: G_AI_PLAYER,
  },
  sprI: 0,
};
const G_CHARACTER_STRIKER: CharacterDef = {
  name: '',
  stats: {
    bS: G_model_createStats(85, 30, 16, 6, 12),
    ai: G_AI_PLAYER,
  },
  sprI: 0,
};
const G_CHARACTER_DEFENDER: CharacterDef = {
  name: '',
  stats: {
    bS: G_model_createStats(60, 19, 25, 4, 6),
    ai: G_AI_PLAYER,
  },
  sprI: 0,
};
const G_CHARACTER_SPEEDSTER: CharacterDef = {
  name: '',
  stats: {
    bS: G_model_createStats(80, 10, 12, 7, 15),
    ai: G_AI_PLAYER,
  },
  sprI: 0,
};
const G_CHARACTER_SLAYER: CharacterDef = {
  name: '',
  stats: {
    bS: G_model_createStats(75, 23, 7, 7, 10),
    ai: G_AI_PLAYER,
  },
  sprI: 0,
};

const G_CHARACTER_OLD_MAN: CharacterDef = {
  name: 'Old Man',
  sprI: 15,
  action: async (oldMan: Character) => {
    const world = G_model_getCurrentWorld();
    const protag = G_model_partyGetProtag(world.party);
    const protagActor = protag.actor;
    const oldManActor = oldMan.actor;
    if (protagActor.x < oldManActor.x) {
      G_model_actorSetFacing(oldManActor, G_FACING_LEFT);
    } else {
      G_model_actorSetFacing(oldManActor, G_FACING_RIGHT);
    }

    const lines = `
Hello there.
I see you've arrived with your wits about you.
That's very good.  You'll need them.
If you examine the statues in this cave, you'll notice that they're all...
...missing something.
If you seek refuge from this place, it may be prudent to find what is not found.
  `.split('\n');

    await G_controller_playLinearCutscene(lines);
    G_view_hideDialog();
  },
};

const G_CHARACTER_STATUE_RUNNER: CharacterDef = {
  name: 'Runner Without Legs',
  spr: 'terrain',
  sprI: 8,
  action: async () => {
    let lines = [''];
    const defaultText = 'This statue appears to be missing a pair of legs.';
    if (G_model_worldOnce('examined_runner')) {
      lines = `
There's a plaque beneath this statue.
It says, "The Runner."
${defaultText}
  `.split('\n');
    } else {
      lines = `
${defaultText}
  `.split('\n');
    }

    await G_controller_playLinearCutscene(lines);
    G_view_hideDialog();
  },
};
const G_CHARACTER_STATUE_THINKER: CharacterDef = {
  name: 'Thinker Without Mind',
  spr: 'terrain',
  sprI: 8,
  action: async () => {
    let lines = [''];
    const defaultText = 'This statue appears to be missing a brain.';
    if (G_model_worldOnce('examined_thinker')) {
      lines = `
There's a plaque beneath this statue.
It says, "The Thinker."
${defaultText}
  `.split('\n');
    } else {
      lines = `
${defaultText}
  `.split('\n');
    }

    await G_controller_playLinearCutscene(lines);
    G_view_hideDialog();
  },
};
const G_CHARACTER_STATUE_SPEAKER: CharacterDef = {
  name: 'Speaker Without Voice',
  spr: 'terrain',
  sprI: 8,
  action: async () => {
    let lines = [''];
    const defaultText = 'This statue appears to be missing a voice.';
    if (G_model_worldOnce('examined_speaker')) {
      lines = `
There's a plaque beneath this statue.
It says, "The Speaker."
${defaultText}
  `.split('\n');
    } else {
      lines = `
${defaultText}
  `.split('\n');
    }

    await G_controller_playLinearCutscene(lines);
    G_view_hideDialog();
  },
};

const G_SIGN_POT_ROOM: CharacterDef = {
  name: 'Sign',
  spr: 'terrain',
  sprI: 5,
  action: async () => {
    const lines = `
This sign says: "There are pots in this room."
  `.split('\n');

    await G_controller_playLinearCutscene(lines);
    G_view_hideDialog();
  },
};

const G_CHARACTER_POT: CharacterDef = {
  name: 'Pot',
  spr: 'terrain',
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
  spr: 'terrain',
  sprI: 4,
  action: async () => {
    const lines = `
There's something strange about this pot...
You check the pot...
There's nothing inside.
  `.split('\n');

    await G_controller_playLinearCutscene(lines);
    G_view_hideDialog();
  },
};

const G_CHARACTER_POT_REAL: CharacterDef = {
  name: 'Pot',
  spr: 'terrain',
  sprI: 4,
  action: async () => {
    const lines = `
You check the pot...
There's a VOICE inside!
  `.split('\n');

    await G_controller_playLinearCutscene(lines);
    G_view_hideDialog();
  },
};
