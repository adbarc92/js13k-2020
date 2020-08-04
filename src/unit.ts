/*
global
G_utils_areAllUnitsDead
G_utils_getRandArrElem
G_utils_isAlly
*/

interface Stats {
  hp: number;
  dmg: number;
  def: number;
  mag: number;
  spd: number;
  iCnt: number;
  cCnt: number;
}

interface Unit {
  sprite: string;
  bS: Stats;
  cS: Stats;
}

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
}

type RoundAction = 0 | 1 | 2 | 3 | 4 | 5 | 6;
const G_ACTION_STRIKE: RoundAction = 0;
const G_ACTION_CHARGE: RoundAction = 1;
const G_ACTION_INTERRUPT: RoundAction = 2;
const G_ACTION_DEFEND: RoundAction = 3;
const G_ACTION_HEAL: RoundAction = 4;
const G_ACTION_USE: RoundAction = 5;
const G_ACTION_FLEE: RoundAction = 6;

/* GLOBAL FUNCTIONS BEGIN */

let G_BATTLE_ALLIES: Unit[] = [];

let G_BATTLE_ENEMIES: Unit[] = [];

let G_BATTLE_CURRENT_BATTLE: Battle;

const G_battleGetAllies = (): Unit[] => {
  if (G_BATTLE_ALLIES === []) {
    G_BATTLE_ALLIES.push(model_createUnit(5, 5, 5, 5, 5));
  }
  return G_BATTLE_ALLIES;
};

const G_battleGetEnemies = (): Unit[] => {
  if (G_BATTLE_ENEMIES === []) {
    G_BATTLE_ENEMIES.push(model_createUnit(7, 2, 4, 3, 1));
  }
  return G_BATTLE_ENEMIES;
};

const G_battleGetCurrentBattle = () => {
  if (G_BATTLE_CURRENT_BATTLE === undefined) {
    G_BATTLE_CURRENT_BATTLE = model_createBattle(
      G_battleGetAllies(),
      G_battleGetEnemies()
    );
  }
  return G_BATTLE_CURRENT_BATTLE;
};

const G_battleGenerateRound = () => {
  const battle = G_battleGetCurrentBattle();
  const newRound = model_createRound(
    G_battleGetAllies().concat(G_battleGetEnemies())
  );
  model_battleAddRound(battle, newRound);
};

/* GLOBAL FUNCTIONS END */

const model_createBattle = (allies: Unit[], enemies: Unit[]): Battle => {
  return { allies, enemies, rounds: [], roundIndex: 0 };
};

const model_battleAddRound = (battle: Battle, round: Round) => {
  battle.rounds.push(round);
};

const model_battleGetCurrentRound = (battle: Battle): Round => {
  return battle.rounds[battle.roundIndex];
};

const model_createRound = (turnOrder: Unit[]): Round => {
  return {
    turnOrder,
    nextTurnOrder: [],
    currentIndex: 0,
  };
};

const model_roundIncrementIndex = (round: Round) => {
  round.currentIndex++;
};

const model_battleIncrementIndex = (battle: Battle) => {
  battle.roundIndex++;
};

const controller_roundInit = (round: Round) => {
  console.log('Start new round');
};

const model_roundGetActingUnit = (round: Round): Unit | null => {
  return round.turnOrder[round.currentIndex] || null;
};

const model_roundIsOver = (round: Round): boolean => {
  return model_roundGetActingUnit(round) === null;
};

const controller_roundDoTurn = (round: Round, target: Unit) => {
  // Either AI or wait for player input occurs here; player input would pass the target
  // Enable input here; either the AI action or the listener should actually call applyAction
  controller_roundApplyAction(G_ACTION_STRIKE, round, target);
};

const controller_roundApplyAction = (
  action: RoundAction,
  round: Round,
  target: Unit
) => {
  const actingUnit = model_roundGetActingUnit(round) as Unit;
  switch (action) {
    case G_ACTION_STRIKE:
      strike(actingUnit, target);
      break;
    default:
      console.error('No action:', action, 'exists.');
  }
  model_roundIncrementIndex(round);
  // check if hp <=0
  round.nextTurnOrder.push(actingUnit);
};

const model_battleIsComplete = (battle: Battle) => {
  return (
    G_utils_areAllUnitsDead(battle.enemies) ||
    G_utils_areAllUnitsDead(battle.allies)
  );
};

const controller_roundEnd = (round: Round): Round => {
  return model_createRound(round.nextTurnOrder); // Change
};

const model_createStats = (
  hp: number,
  dmg: number,
  def: number,
  mag: number,
  spd: number
): Stats => {
  return { hp, dmg, def, mag, spd, iCnt: mag, cCnt: 0 };
};

const model_createUnit = (
  hp: number,
  dmg: number,
  def: number,
  mag: number,
  spd: number,
  sprite?: string
): Unit => {
  sprite = sprite || '';
  return {
    bS: model_createStats(hp, dmg, def, mag, spd),
    cS: model_createStats(hp, dmg, def, mag, spd),
    sprite,
  };
};

const model_statsModifyhp = (
  currentStats: Stats,
  baseStats: Stats,
  val: number
) => {
  const { hp: chp } = currentStats;
  const { hp: bhp } = baseStats;
  let nextHp = chp + val;
  if (nextHp > bhp) {
    nextHp = bhp;
  } else if (nextHp < 0) {
    nextHp = 0;
  }
  currentStats.hp = nextHp;
};

const modSpd = (actor: Unit, act: RoundAction) => {
  const { cS } = actor;
  let mod;
  switch (act) {
    case 0:
      mod = 1;
      break;
    case 1:
      mod = 2;
      break;
    case 2:
      mod = -1;
      break;
    case 3:
      mod = 3;
      break;
    case 4:
      mod = 2;
      break;
    case 5:
      mod = 1;
      break;
    case 6:
      mod = -1;
      break;
    default:
      mod = 0;
      break;
  }
  cS.spd += mod;
};

const strike = (attacker: Unit, victim: Unit): number => {
  const { cS, bS } = victim;
  const { def } = cS;
  const { dmg } = attacker.bS;

  const dmgDone = -Math.max(dmg - def, 1);

  // speed modification should be done here
  model_statsModifyhp(cS, bS, dmgDone);
  return dmgDone;
};

// Benjamin: this function simulates a turn for the current acting unit (I think?)
const roundLoop = (battle: Battle, round: Round) => {
  console.log(battle.roundIndex);
  const actingUnit = model_roundGetActingUnit(round) as Unit;

  const target = G_utils_isAlly(battle, actingUnit)
    ? (G_utils_getRandArrElem(battle.enemies) as Unit)
    : (G_utils_getRandArrElem(battle.allies) as Unit);
  controller_roundDoTurn(round, target);
};

// Benjamin: this function sets up the current battle
const mainBattle = () => {
  const unit1 = model_createUnit(5, 5, 5, 5, 5);
  // G_BATTLE_ALLIES.push(unit1);
  const unit2 = model_createUnit(7, 2, 4, 3, 1);
  // G_BATTLE_ENEMIES.push(unit2);

  // Benjamin: set up the first round of the battle, but don't run it until user input
  const battle = model_createBattle([unit1], [unit2]);
  const firstRound = model_createRound([unit1, unit2]);
  model_battleAddRound(battle, firstRound);
  G_model_setCurrentBattle(battle);

  // const battle = model_createBattle([unit1, unit2]);
  // const battle = G_battleGetCurrentBattle();
  // let round = model_createRound([unit1, unit2]);
  // model_battleAddRound(battle, round);
  // controller_roundInit(round);

  /* This block runs a round of combat */
  // while (!model_roundIsOver(round)) {
  //   roundLoop(battle, round);
  //   console.log('Unit1:', JSON.stringify(unit1, null, 2));
  //   console.log('Unit2:', JSON.stringify(unit2, null, 2));
  // }

  /* This block runs the battle to completion */
  // while (!model_battleIsComplete(battle)) {
  //   while (!model_roundIsOver(round)) {
  //     console.log(battle.roundIndex);
  //     const actingUnit = model_roundGetActingUnit(round) as Unit;

  //     const target = G_utils_isAlly(battle, actingUnit)
  //       ? (G_utils_getRandArrElem(battle.enemies) as Unit)
  //       : (G_utils_getRandArrElem(battle.allies) as Unit);
  //     controller_roundDoTurn(round, target);
  //     console.log('Unit1:', JSON.stringify(unit1, null, 2));
  //     console.log('Unit2:', JSON.stringify(unit2, null, 2));
  //   }
  //   model_battleAddRound(battle, controller_roundEnd(round));
  //   model_battleIncrementIndex(battle);
  //   round = battle.rounds[battle.roundIndex];
  // }
};

// code that Benjamin added is below -----------------------------------------------------

// This global variable holds the current battle.  It should only be accessed through
// the following getters and setters
let model_currentBattle: Battle | null = null;
const G_model_setCurrentBattle = (battle: Battle) => {
  model_currentBattle = battle;
};
const G_model_getCurrentBattle = (): Battle => {
  return model_currentBattle as Battle;
};

// simulates a single round of combat
const G_controller_battleSimulateNextRound = (battle: Battle) => {
  const round = model_battleGetCurrentRound(battle);
  controller_roundInit(round);

  // this part is hard-coded.  We'd probably want to generalize printing a unit with a function
  const [unit1] = battle.allies;
  const [unit2] = battle.enemies;
  while (!model_roundIsOver(round)) {
    roundLoop(battle, round);
    console.log('Unit1:', JSON.stringify(unit1, null, 2));
    console.log('Unit2:', JSON.stringify(unit2, null, 2));
  }

  const nextRound = controller_roundEnd(round);
  model_battleAddRound(battle, nextRound);
  model_battleIncrementIndex(battle);
  console.log('round over');
};
