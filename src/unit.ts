/*
global
G_utils_areAllUnitsDead
G_utils_getRandArrElem
G_utils_isAlly
G_model_createActor
G_model_actorSetPosition
G_model_actorSetFacing
G_view_drawActor
G_view_clearScreen
G_FACING_LEFT
G_FACING_RIGHT
G_view_drawText
BATTLE_INPUT_ENABLED
*/

const playerPos = [
  [60, 90],
  [45, 105],
  [30, 90],
  [45, 75],
];

const enemyPos = [
  [165, 90],
  [180, 105],
  [195, 90],
  [180, 75],
];

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
  name: string;
  actor: Actor;
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
  name: string,
  hp: number,
  dmg: number,
  def: number,
  mag: number,
  spd: number,
  actor?: Actor
): Unit => {
  actor = actor || G_model_createActor(0);
  return {
    name,
    bS: model_createStats(hp, dmg, def, mag, spd),
    cS: model_createStats(hp, dmg, def, mag, spd),
    actor,
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
// const simulateTurn = (battle: Battle, round: Round) => {
//   // console.log(battle.roundIndex);
//   const actingUnit = model_roundGetActingUnit(round) as Unit;

//   const target = G_utils_isAlly(battle, actingUnit)
//     ? (G_utils_getRandArrElem(battle.enemies) as Unit)
//     : (G_utils_getRandArrElem(battle.allies) as Unit);
//   // setTimeout(() => {
//   //   controller_roundDoTurn(round, target);
//   // }, 500);
//   controller_roundDoTurn(round, target);
// };

const simulateTurn = async (battle: Battle, round: Round): Promise<void> => {
  return new Promise(resolve => {
    const actingUnit = model_roundGetActingUnit(round) as Unit;

    const target = G_utils_isAlly(battle, actingUnit)
      ? (G_utils_getRandArrElem(battle.enemies) as Unit)
      : (G_utils_getRandArrElem(battle.allies) as Unit);
    controller_roundDoTurn(round, target);
    setTimeout(resolve, 1000);
  });
};

const drawBattle = (battle: Battle) => {
  G_view_clearScreen();
  G_view_drawText(`Round: ${battle.roundIndex + 1}`, 20, 20);
  const { allies, enemies } = battle;
  for (let i = 0; i < allies.length; i++) {
    G_model_actorSetFacing(allies[i].actor, G_FACING_RIGHT);
    G_model_actorSetPosition(allies[i].actor, playerPos[i][0], playerPos[i][1]);
    G_view_drawActor(allies[i].actor, 2);

    G_view_drawText(
      `${allies[i].cS.hp}/${allies[i].bS.hp}`,
      playerPos[i][0] + 70,
      playerPos[i][1] + 70
    );
  }

  for (let i = 0; i < enemies.length; i++) {
    G_model_actorSetFacing(enemies[i].actor, G_FACING_LEFT);
    G_model_actorSetPosition(enemies[i].actor, enemyPos[i][0], enemyPos[i][1]);

    G_view_drawActor(enemies[i].actor, 2);
    G_view_drawText(
      `${enemies[i].cS.hp.toString()}/${enemies[i].bS.hp.toString()}`,
      enemyPos[i][0] + 175,
      enemyPos[i][1] + 70
    );
  }
};

// Benjamin: this function sets up the current battle
const initBattle = () => {
  const jimothy = model_createUnit('Jimothy', 5, 5, 5, 5, 5);
  const karst = model_createUnit('Karst', 7, 2, 4, 3, 1);

  // Benjamin: set up the first round of the battle, but don't run it until user input
  const battle = model_createBattle([jimothy], [karst]);
  const firstRound = model_createRound([jimothy, karst]);
  model_battleAddRound(battle, firstRound);
  G_model_setCurrentBattle(battle);

  drawBattle(battle);
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
const G_controller_battleSimulateNextRound = async (battle: Battle) => {
  BATTLE_INPUT_ENABLED = false;
  // console.log('Battle input:', BATTLE_INPUT_ENABLED);
  const round = model_battleGetCurrentRound(battle);
  controller_roundInit(round);

  // this part is hard-coded.  We'd probably want to generalize printing a unit with a function
  const [jimothy] = battle.allies;
  const [karst] = battle.enemies;
  while (!model_roundIsOver(round)) {
    await simulateTurn(battle, round);
    // console.log('jimothy:', JSON.stringify(jimothy, null, 2));
    // console.log('karst:', JSON.stringify(karst, null, 2));
  }

  const nextRound = controller_roundEnd(round);
  model_battleAddRound(battle, nextRound);
  model_battleIncrementIndex(battle);
  drawBattle(battle);
  // console.log('round over');
  if (model_battleIsComplete(battle)) {
    setTimeout(() => {
      initBattle();
    }, 2000);
  }
  BATTLE_INPUT_ENABLED = true;
  // console.log('Battle input:', BATTLE_INPUT_ENABLED);
};
