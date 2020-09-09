// Should contain all content

//

/*
global
G_model_createStats
G_AI_STRIKER
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

const createItem = (
  name: string,
  description: string,
  effect: () => void
): Item => {
  return { name, description, effect };
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
  stats?: StatsDef;
  name: string;
  sprI: number;
  // talk?:
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
    bS: G_model_createStats(50, 30, 20, 10, 5),
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
  name: 'Runner',
  stats: {
    bS: G_model_createStats(100, 25, 15, 5, 10),
    ai: G_AI_PLAYER,
  },
  sprI: 0,
};

const G_CHARACTER_STRIKER: CharacterDef = {
  name: 'Striker',
  stats: {
    bS: G_model_createStats(70, 12, 6, 6, 12),
    ai: G_AI_PLAYER,
  },
  sprI: 0,
};

const G_CHARACTER_DEFENDER: CharacterDef = {
  name: 'Defender',
  stats: {
    bS: G_model_createStats(100, 12, 13, 4, 6),
    ai: G_AI_PLAYER,
  },
  sprI: 0,
};

const G_CHARACTER_SPEEDSTER: CharacterDef = {
  name: 'Speedster',
  stats: {
    bS: G_model_createStats(80, 10, 7, 7, 15),
    ai: G_AI_PLAYER,
  },
  sprI: 0,
};

const G_CHARACTER_SLAYER: CharacterDef = {
  name: 'Slayer',
  stats: {
    bS: G_model_createStats(70, 20, 7, 7, 10),
    ai: G_AI_PLAYER,
  },
  sprI: 0,
};
