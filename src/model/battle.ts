/*
global
G_utils_areAllUnitsDead
G_utils_getRandArrElem
G_utils_isAlly
G_model_getScreenSize
G_model_createVerticalMenu
G_controller_roundApplyAction
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
  actionMenu: Menu;
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
  const actionMenu = G_model_createVerticalMenu(
    x,
    y,
    menuWidth,
    G_BATTLE_MENU_LABELS,
    handleActionMenuInput,
    true,
    lineHeight
  );
  return { allies, enemies, rounds: [], roundIndex: 0, actionMenu };
};

const handleActionMenuInput = (i: RoundAction) => {
  const battle = G_model_getCurrentBattle();
  const round = G_model_battleGetCurrentRound(battle);
  const unit = G_model_roundGetActingUnit(round) as Unit;

  // here we could 'await' target selection instead of randomly picking one
  const target: Unit = G_utils_getRandArrElem(
    G_utils_isAlly(battle, unit) ? battle.enemies : battle.allies
  );

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
