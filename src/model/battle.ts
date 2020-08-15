/*
global
G_controller_roundApplyAction
G_model_createVerticalMenu
G_model_getScreenSize
G_model_getSprite
G_view_drawBattle
G_view_drawMenu
G_utils_areAllUnitsDead
G_utils_getRandArrElem
G_utils_isAlly
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
}

type RoundAction = 0 | 1 | 2 | 3 | 4 | 5 | 6;
const G_ACTION_STRIKE: RoundAction = 0;
const G_ACTION_CHARGE: RoundAction = 1;
const G_ACTION_INTERRUPT: RoundAction = 2;
const G_ACTION_DEFEND: RoundAction = 3;
const G_ACTION_HEAL: RoundAction = 4;
const G_ACTION_USE: RoundAction = 5;
const G_ACTION_FLEE: RoundAction = 6;
const G_BATTLE_MENU_LABELS = [
  // make sure these indexes match above
  'Strike',
  'Charge',
  'Interrupt',
  'Defend',
  'Heal',
  'Use',
  'Flee',
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
      handleActionMenuInput,
      true,
      lineHeight
    ),
  ];
  return { allies, enemies, rounds: [], roundIndex: 0, actionMenuStack };
};

const G_utils_getSpriteHeight = (unit: Unit): number => {
  // console.log('Unit:', unit);
  const { sprite, spriteIndex } = unit.actor;
  // console.log('Sprite:', `${sprite}_${spriteIndex}`);
  return G_model_getSprite(`${sprite}_${spriteIndex}`)[4];
};

let G_BATTLE_TARGET_INDEX = -1;

const G_controller_setBattleTargetIndex = (i: number) => {
  G_BATTLE_TARGET_INDEX = i;
};

const G_controller_getBattleTargetIndex = () => {
  return G_BATTLE_TARGET_INDEX;
};

const handleTargetMenuInput = (i: number) => {
  G_controller_setBattleTargetIndex(i);
};

const selectTarget = async (actingUnit: Unit) => {
  const battle = G_model_getCurrentBattle();
  const x = G_utils_isAlly(battle, actingUnit) ? 200 : 40;
  const targetMenu = G_model_createVerticalMenu(
    x,
    70,
    0,
    Array(4).fill(''),
    handleTargetMenuInput,
    true,
    G_utils_getSpriteHeight(actingUnit)
  );
  battle.actionMenuStack.push(targetMenu);
  return new Promise(resolve => {
    G_model_setBattlePostActionCb(resolve);
    G_model_setBattleInputEnabled(true);
    G_view_drawBattle(battle);
    G_view_drawMenu(targetMenu);
    battle.actionMenuStack.shift();
  });
};

const getTarget = async (unit: Unit): Promise<Unit> => {
  await selectTarget(unit);
  const battle = G_model_getCurrentBattle();
  const index = G_controller_getBattleTargetIndex();
  if (G_utils_isAlly(battle, unit)) {
    return battle.enemies[index];
  }
  return new Promise(resolve => {
    G_model_setBattlePostActionCb(resolve);
    return battle.allies[index];
  });
};

const handleActionMenuInput = async (i: RoundAction) => {
  const battle = G_model_getCurrentBattle();
  const round = G_model_battleGetCurrentRound(battle);
  const unit = G_model_roundGetActingUnit(round) as Unit;

  // here we could 'await' target selection instead of randomly picking one
  // const target: Unit = G_utils_getRandArrElem(
  //   G_utils_isAlly(battle, unit) ? battle.enemies : battle.allies
  // );

  const target: Unit = await getTarget(unit);

  switch (i) {
    case G_ACTION_STRIKE:
      G_controller_roundApplyAction(G_ACTION_STRIKE, round, target);
      break;
    default:
      console.log('Action', i, 'Is not implemented yet.');
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
