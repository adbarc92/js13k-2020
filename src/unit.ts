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
G_model_getCtx
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
      controller_battleActionStrike(actingUnit, target);
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

const controller_battleModSpd = (actor: Unit, act: RoundAction) => {
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

const controller_battleActionStrike = (
  attacker: Unit,
  victim: Unit
): number => {
  const { cS, bS } = victim;
  const { def } = cS;
  const { dmg } = attacker.bS;

  const dmgDone = -Math.max(dmg - def, 1);
  console.log(
    `${attacker.name} controller_battleActionStrikes ${
      victim.name
    } for ${-dmgDone} damage! (${victim.cS.hp} HP remaining)`
  );
  // speed modification should be done here
  model_statsModifyhp(cS, bS, dmgDone);
  return dmgDone;
};

// Benjamin: this function simulates a turn for the current acting unit (I think?)
// const controller_battleSimulateTurn = (battle: Battle, round: Round) => {
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

const controller_battleSimulateTurn = async (
  battle: Battle,
  round: Round
): Promise<void> => {
  return new Promise(resolve => {
    const actingUnit = model_roundGetActingUnit(round) as Unit;

    const target = G_utils_isAlly(battle, actingUnit)
      ? (G_utils_getRandArrElem(battle.enemies) as Unit)
      : (G_utils_getRandArrElem(battle.allies) as Unit);
    controller_roundDoTurn(round, target);
    setTimeout(resolve, 1000);
  });
};

// const drawCursor = (index: number) => {
//   const ctx = G_model_getCtx();
//   const mod = index * 18;
//   ctx.beginPath();
//   ctx.moveTo(210, 390 + mod);
//   ctx.lineTo(210, 400 + mod);
//   ctx.lineTo(220, 395 + mod);
//   ctx.closePath();
//   ctx.fillStyle = 'white';
//   ctx.fill();
// };

// const betterCursor = (
//   index: number,
//   menuOffset: number,
//   x: number,
//   y: number,
//   color: string
// ) => {
//   const ctx = G_model_getCtx();
//   const offset = index * 18;
//   ctx.beginPath();
//   ctx.moveTo(x, y + offset);
//   ctx.lineTo(x, y + 10 + offset);
//   ctx.lineTo(x + 10, y + 5 + offset);
//   ctx.closePath();
//   ctx.fillStyle = color;
//   ctx.fill();
// };

// const G_view_drawMenu = (cursorIndex: number = 0) => {
//   const options = ['Strike', 'Charge', 'Defend', 'Use', 'Heal', 'Flee'];
//   const ctx = G_model_getCtx();
//   // Create background
//   ctx.fillRect(195, 380, 100, 120);
//   // create outline
//   ctx.strokeStyle = 'white';
//   ctx.strokeRect(195, 380, 100, 120);
//   // Populate menu options
//   for (let i = 0, x = 225, y = 400; i < options.length; i++, y += 18) {
//     G_view_drawText(options[i], x, y, 'white');
//   }
//   // Draw Cursor
//   const offset = cursorIndex * 18;
//   ctx.beginPath();
//   ctx.moveTo(210, 390 + offset);
//   ctx.lineTo(210, 400 + offset);
//   ctx.lineTo(220, 395 + offset);
//   ctx.closePath();
//   ctx.fillStyle = 'white';
//   ctx.fill();
// };

const G_view_drawMenu = (
  options: string[],
  x: number = 195,
  y: number = 380,
  w: number = 100,
  h: number = 120,
  color: string = 'white',
  cursorIndex: number = 0,
  optionOffset: number = 18
) => {
  const ctx = G_model_getCtx();
  // Create background
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = color; // Ben: more general value? Relative to color parameter
  ctx.strokeRect(x, y, w, h);

  // Populate menu
  for (
    let i = 0, j = x + 30, k = y + 20;
    i < options.length;
    i++, k += optionOffset
  ) {
    G_view_drawText(options[i], j, k, color);
  }

  // draw Cursor
  const cursorOffset = cursorIndex * optionOffset;
  ctx.beginPath();
  ctx.moveTo(x + 15, y + 10 + cursorOffset);
  ctx.lineTo(x + 15, y + 20 + cursorOffset);
  ctx.lineTo(x + 25, y + 15 + cursorOffset);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
};

const G_view_drawBattle = (battle: Battle) => {
  G_view_clearScreen();
  G_view_drawText(`Round: ${battle.roundIndex + 1}`, 20, 20);
  const { allies, enemies } = battle;
  for (let i = 0; i < allies.length; i++) {
    G_model_actorSetFacing(allies[i].actor, G_FACING_RIGHT);
    G_model_actorSetPosition(allies[i].actor, playerPos[i][0], playerPos[i][1]);
    G_view_drawActor(allies[i].actor, 2);

    G_view_drawText(
      `${allies[i].cS.hp}/${allies[i].bS.hp}`,
      playerPos[i][0] * 2 + 5,
      playerPos[i][1] * 2 - 5
    );
  }

  for (let i = 0; i < enemies.length; i++) {
    G_model_actorSetFacing(enemies[i].actor, G_FACING_LEFT);
    G_model_actorSetPosition(enemies[i].actor, enemyPos[i][0], enemyPos[i][1]);

    G_view_drawActor(enemies[i].actor, 2);

    G_view_drawText(
      `${enemies[i].cS.hp.toString()}/${enemies[i].bS.hp.toString()}`,
      enemyPos[i][0] * 2 + 5,
      enemyPos[i][1] * 2 - 5
    );
  }
};

// Benjamin: this function sets up the current battle
const controller_initBattle = () => {
  const jimothy = model_createUnit('Jimothy', 5, 5, 5, 5, 5);
  const karst = model_createUnit('Karst', 7, 2, 4, 3, 1);

  const battle = model_createBattle([jimothy], [karst]);
  const firstRound = model_createRound([jimothy, karst]);

  model_battleAddRound(battle, firstRound);
  G_model_setCurrentBattle(battle);

  G_view_drawBattle(battle);
  // G_view_drawMenu();
  const options = ['Strike', 'Charge', 'Defend', 'Use', 'Heal', 'Flee'];
  G_view_drawMenu(options, 195, 380, 100, 120, 'white', 0, 18);
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
  const round = model_battleGetCurrentRound(battle);
  controller_roundInit(round);

  // this part is hard-coded.  We'd probably want to generalize printing a unit with a function
  const [jimothy] = battle.allies;
  const [karst] = battle.enemies;
  while (!model_roundIsOver(round)) {
    await controller_battleSimulateTurn(battle, round);
    G_view_drawBattle(battle);
  }

  const nextRound = controller_roundEnd(round);
  model_battleAddRound(battle, nextRound);
  model_battleIncrementIndex(battle);
  G_view_drawBattle(battle);
  // console.log('round over');
  if (model_battleIsComplete(battle)) {
    setTimeout(() => {
      controller_initBattle();
    }, 2000);
  }
  BATTLE_INPUT_ENABLED = true;
};
