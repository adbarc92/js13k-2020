/*
global
G_controller_battleActionCharge
G_controller_roundApplyAction
G_controller_unitLives
G_model_createVerticalMenu
G_model_getScreenSize
G_model_getSprite
G_model_menuSetNextCursorIndex
G_model_unitLives
G_view_drawBattle
G_view_drawMenu
G_utils_areAllUnitsDead
G_utils_isAlly
G_utils_getRandArrElem

G_ACTION_CHARGE
G_CURSOR_WIDTH
G_CURSOR_HEIGHT
*/

interface Round {
  turnOrder: Unit[];
  nextTurnOrder: Unit[];
  currentIndex: number;
}

interface Battle {
  allies: Unit[];
  enemies: Unit[];
  rounds: Round[];
  roundIndex: 0;
  actionMenuStack: Menu[];
  text: string;
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
  'Interrupt',
  'Defend',
  'Heal',
  'Use',
  'Flee',
];

type Allegiance = 0 | 1;
const G_ALLEGIANCE_ALLY = 0;
const G_ALLEGIANCE_ENEMY = 1;

const G_SCALE = 2;

const playerPos = [
  [40, 70] as [number, number],
  [40, 100] as [number, number],
  [40, 130] as [number, number],
  [40, 160] as [number, number],
];

const enemyPos = [
  [200, 70] as [number, number],
  [200, 100] as [number, number],
  [200, 130] as [number, number],
  [200, 160] as [number, number],
];

const G_model_createBattle = (allies: Unit[], enemies: Unit[]): Battle => {
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
  return {
    allies,
    enemies,
    rounds: [],
    roundIndex: 0,
    actionMenuStack,
    text: '',
  };
};

const G_model_battleGetScreenPosition = (
  i: number,
  allegiance: Allegiance
): [number, number] => {
  return allegiance === G_ALLEGIANCE_ALLY ? playerPos[i] : enemyPos[i];
};

const selectTarget = async (battle: Battle): Promise<Unit | null> => {
  return new Promise(resolve => {
    const targets = battle.enemies;

    const [startX, startY] = G_model_battleGetScreenPosition(
      0,
      G_ALLEGIANCE_ENEMY
    );

    const x = startX * G_SCALE - G_CURSOR_WIDTH;
    const y = startY * G_SCALE - 16; // offset by -16 so the cursor is centered on the sprite
    const h = 30 * G_SCALE; // "30" is the difference in y values of the unit positions from the unit variables
    const targetMenu = G_model_createVerticalMenu(
      x,
      y,
      100, // set this to 100 so I could debug by turning on the background
      Array(targets.length).fill(''), // wtf, that exists?  i never knew that...
      // this function is called when a target is selected
      (i: number) => {
        battle.actionMenuStack.shift(); // returns input to the last menu
        if (i >= 0) {
          resolve(targets[i]);
        } else {
          resolve(null);
        }
      },
      battle.enemies
        .filter(unit => {
          return !G_model_unitLives(unit);
        })
        .map((_, i) => {
          return i;
        }),
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
      const target: Unit | null = await selectTarget(battle);
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
    nextTurnOrder: [],
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
