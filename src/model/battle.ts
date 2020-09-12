/*
global
G_controller_battleActionCharge
G_controller_roundApplyAction
G_model_actorSetFacing
G_model_createVerticalMenu
G_model_createCharacterFromTemplate
G_model_getScreenSize
G_model_getSprite
G_model_menuSetNextCursorIndex
G_model_unitLives
G_model_unitResetPosition
G_view_drawBattle
G_view_playSound
G_utils_areAllUnitsDead
G_utils_isAlly
G_utils_getRandArrElem
G_utils_getRandNum

G_BATTLE_SCALE
G_CURSOR_WIDTH
G_CURSOR_HEIGHT
G_FACING_LEFT
*/

interface Round {
  turnOrder: Unit[];
  currentIndex: number;
}

interface Battle {
  party: Party;
  allies: Unit[];
  enemies: Unit[];
  rounds: Round[];
  roundIndex: 0;
  actionMenuStack: Menu[];
  text: string;
  aiSeed: number;
}

type RoundAction = 0 | 1 | 2 | 3 | 4 | 5 | 6;
const G_ACTION_STRIKE: RoundAction = 0; // requires target
const G_ACTION_CHARGE: RoundAction = 1;
const G_ACTION_INTERRUPT: RoundAction = 2; // requires target
const G_ACTION_DEFEND: RoundAction = 3;
const G_ACTION_HEAL: RoundAction = 4;
const G_ACTION_USE: RoundAction = 5; // may require target
const G_ACTION_FLEE: RoundAction = 6;
const G_BATTLE_MENU_LABELS = [
  // make sure these indices match above
  'Strike',
  'Charge',
  'Break',
  'Defend',
  'Heal',
  'Item',
  'Flee',
];

type Allegiance = 0 | 1;
const G_ALLEGIANCE_ALLY = 0;
const G_ALLEGIANCE_ENEMY = 1;

type BattlePosition = [number, number];

const INIT_OFFSET = 80; // temp
const G_UNIT_OFFSET = 28; // temp
const generateBattleCoords = (x: number) => {
  const coords: BattlePosition[] = [];
  for (let i = 0; i < 4; i++) {
    coords.push([x, i * G_UNIT_OFFSET + INIT_OFFSET]);
  }
  return coords;
};
const playerPos = generateBattleCoords(40);
const enemyPos = generateBattleCoords(200);

const makeAllies = (characters: Character[]) => {
  const battleParty: Unit[] = [];
  for (let i = 0; i < characters.length; i++) {
    const { unit, name } = characters[i];
    if (!unit) {
      throw new Error('Character has no unit when making battle party');
    }
    unit.name = name;
    unit.i = i;
    unit.allegiance = G_ALLEGIANCE_ALLY;
    G_model_unitResetPosition(unit);
    battleParty.push(unit);
  }
  return battleParty;
};

const makeEnemies = (monsters: CharacterDef[]) => {
  const monsterParty: Unit[] = [];
  for (let i = 0; i < monsters.length; i++) {
    const ch = G_model_createCharacterFromTemplate(monsters[i]);
    const unit = ch.unit as Unit;
    unit.i = i;
    unit.allegiance = G_ALLEGIANCE_ENEMY;
    G_model_actorSetFacing(unit.actor, G_FACING_LEFT);
    G_model_unitResetPosition(unit);
    monsterParty.push(unit);
  }
  return monsterParty;
};

const G_model_createBattle = (
  party: Party,
  encounter: EncounterDef
): Battle => {
  const screenSize = G_model_getScreenSize();
  const menuWidth = 100;
  const lineHeight = 20;
  const x = screenSize / 2 - menuWidth / 2;
  const y = screenSize - lineHeight * G_BATTLE_MENU_LABELS.length;
  const actionMenuStack = [
    G_model_createVerticalMenu(
      x,
      y,
      menuWidth,
      G_BATTLE_MENU_LABELS,
      handleActionMenuSelected,
      [],
      true,
      lineHeight
    ),
  ];

  const allies = makeAllies(party.characters);
  const enemies = makeEnemies(encounter.enemies);
  const battle: Battle = {
    party,
    allies,
    enemies,
    rounds: [],
    roundIndex: 0,
    actionMenuStack,
    text: '',
    aiSeed: G_utils_getRandNum(3) + 1,
  };

  const firstRound = G_model_createRound(allies.concat(enemies));
  G_model_battleAddRound(battle, firstRound);
  return battle;
};

const G_model_battleGetScreenPosition = (
  i: number,
  allegiance: Allegiance
): [number, number] => {
  return allegiance === G_ALLEGIANCE_ALLY ? playerPos[i] : enemyPos[i];
};

const G_model_battleSetText = (text: string) => {
  const battle = G_model_getCurrentBattle();
  battle.text = text;
};

const selectTarget = async (battle: Battle): Promise<Unit | null> => {
  return new Promise(resolve => {
    const targets = battle.enemies;

    const [startX, startY] = G_model_battleGetScreenPosition(
      0,
      G_ALLEGIANCE_ENEMY
    );

    const disabledItems = battle.enemies
      .map((_, i) => {
        return i;
      })
      .filter(i => {
        return !G_model_unitLives(battle.enemies[i]);
      });

    const x = startX * G_BATTLE_SCALE - G_CURSOR_WIDTH;
    const y = startY * G_BATTLE_SCALE + G_CURSOR_HEIGHT / 2; // ???
    const h = G_UNIT_OFFSET * G_BATTLE_SCALE; // lineHeight in pixels
    const targetMenu = G_model_createVerticalMenu(
      x,
      y,
      100, // set this to 100 so I could debug by turning on the background
      Array(targets.length).fill(''),
      // this function is called when a target is selected
      (i: number) => {
        battle.actionMenuStack.shift(); // returns input to the last menu
        if (i >= 0) {
          resolve(targets[i]);
        } else {
          resolve(null);
        }
      },
      disabledItems,
      false,
      h
    );
    targetMenu.i = -1;
    G_model_menuSetNextCursorIndex(targetMenu, 1);
    battle.actionMenuStack.unshift(targetMenu); // transfers input to the newly-created menu
  });
};

const handleActionMenuSelected = async (i: RoundAction) => {
  const battle = G_model_getCurrentBattle();
  const round = G_model_battleGetCurrentRound(battle);

  switch (i) {
    case G_ACTION_STRIKE:
      // here we could 'await' target selection instead of randomly picking one
      let target: Unit | null = await selectTarget(battle);
      // handles the case where ESC (or back or something) is pressed while targeting
      if (!target) {
        return;
      }
      G_controller_roundApplyAction(G_ACTION_STRIKE, round, target);
      break;
    case G_ACTION_CHARGE:
      G_controller_roundApplyAction(G_ACTION_CHARGE, round, null);
      break;
    case G_ACTION_DEFEND:
      G_controller_roundApplyAction(G_ACTION_DEFEND, round, null);
      break;
    case G_ACTION_HEAL:
      G_controller_roundApplyAction(G_ACTION_HEAL, round, null);
      break;
    case G_ACTION_INTERRUPT:
      const target2: Unit | null = await selectTarget(battle); // QUESTION: cannot reassign within scope?!
      // handles the case where ESC (or back or something) is pressed while targeting
      if (!target2) {
        return;
      }
      G_controller_roundApplyAction(G_ACTION_INTERRUPT, round, target2);
      break;
    default:
      console.error('Action', i, 'Is not implemented yet.');
  }
};

// This global variable holds the current battle.  It should only be accessed through
// the following getters and setters
let model_currentBattle: Battle | null = null;
const G_model_setCurrentBattle = (battle: Battle) => {
  model_currentBattle = battle;
};
const G_model_getCurrentBattle = (): Battle => {
  return model_currentBattle as Battle;
};

let model_battleInputEnabled = false;
const G_model_setBattleInputEnabled = (v: boolean) => {
  model_battleInputEnabled = v;
};
const G_model_getBattleInputEnabled = () => {
  return model_battleInputEnabled;
};

let model_battlePostActionCb = () => {};
const G_model_setBattlePostActionCb = (cb: () => void) => {
  model_battlePostActionCb = cb;
};
const G_model_getBattlePostActionCb = () => model_battlePostActionCb;

const G_model_battleAddRound = (battle: Battle, round: Round) => {
  battle.rounds.push(round);
};

const G_model_battleGetCurrentRound = (battle: Battle): Round => {
  return battle.rounds[battle.roundIndex];
};

const G_model_createRound = (turnOrder: Unit[]): Round => {
  return {
    turnOrder,
    currentIndex: 0,
  };
};

const G_model_roundIncrementIndex = (round: Round) => {
  round.currentIndex++;
};

const G_model_battleIncrementIndex = (battle: Battle) => {
  battle.roundIndex++;
};

const G_model_roundGetActingUnit = (round: Round): Unit | null => {
  return round.turnOrder[round.currentIndex] || null;
};

const G_model_roundIsOver = (round: Round): boolean => {
  return G_model_roundGetActingUnit(round) === null;
};

const G_model_battleIsComplete = (battle: Battle) => {
  return (
    G_utils_areAllUnitsDead(battle.enemies) ||
    G_utils_areAllUnitsDead(battle.allies)
  );
};

const G_model_actionToString = (i: number): string => {
  return G_BATTLE_MENU_LABELS[i];
};

// const G_model_battleGetHighestSpeed = (
//   battle: Battle,
//   allegiance: Allegiance
// ) => {
//   const { allies, enemies } = battle;
//   const units = allegiance === G_ALLEGIANCE_ALLY ? allies : enemies;
//   let greatestSpeed = 0;
//   for (let i = 0; i < units.length; i++) {
//     if (units[i].cS.spd > greatestSpeed) {
//       greatestSpeed = units[i].cS.spd;
//     }
//   }
//   return greatestSpeed;
// };

const G_model_sumLostHealth = (battle: Battle) => {
  const { allies } = battle;
  let sum = 0;
  for (let i = 0; i < allies.length; i++) {
    sum += allies[i].bS.hp - allies[i].cS.hp;
  }
  console.log('Lost HP:', sum);
};
