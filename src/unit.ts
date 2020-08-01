/*
global
G_utils_areAllUnitsDead
G_utils_getRandArrElem
G_utils_isAlly
*/

interface Stats {
  HP: number;
  Dmg: number;
  Def: number;
  Mag: number;
  Spd: number;
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
}

type RoundAction = 0 | 1;
const G_ACTION_STRIKE = 0;
// ...

const model_createBattle = (allies: Unit[], enemies: Unit[]): Battle => {
  return { allies, enemies, rounds: [] };
};

const model_battleAddRound = (battle: Battle, round: Round) => {
  battle.rounds.push(round);
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
  // check if HP <=0
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
  return { HP: hp, Dmg: dmg, Def: def, Mag: mag, Spd: spd, iCnt: mag, cCnt: 0 };
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

const model_statsModifyHP = (
  currentStats: Stats,
  baseStats: Stats,
  val: number
) => {
  const { HP: cHP } = currentStats;
  const { HP: bHP } = baseStats;
  let nextHp = cHP + val;
  if (nextHp > bHP) {
    nextHp = bHP;
  } else if (nextHp < 0) {
    nextHp = 0;
  }

  currentStats.HP = nextHp;
};

const strike = (attacker: Unit, victim: Unit) => {
  const { cS, bS } = victim;
  const { Def } = cS;
  const { Dmg } = attacker.bS;

  const dmgDone = -Math.max(Dmg - Def, 1);

  model_statsModifyHP(cS, bS, dmgDone);
  return dmgDone;
};

const mainBattle = () => {
  const unit1 = model_createUnit(5, 5, 5, 5, 5);
  // console.log('Unit1:', JSON.stringify(unit1, null, 2));
  const unit2 = model_createUnit(7, 2, 4, 3, 1);
  // console.log('Unit2:', JSON.stringify(unit2, null, 2));

  // console.log('Damage done by U1 to U2!!!!!!: ', strike(unit1, unit2));
  // console.log('Damage done by U2 to U1!!!!!!: ', strike(unit2, unit1));
  // console.log('Unit1:', JSON.stringify(unit1, null, 2));
  // console.log('Unit2:', JSON.stringify(unit2, null, 2));

  const battle = model_createBattle([unit1], [unit2]);
  const round = model_createRound([unit1, unit2]);
  model_battleAddRound(battle, round);
  controller_roundInit(round);
  console.log(round);
  console.log(round.turnOrder);
  // while (!model_battleIsComplete(battle)) {
  console.log('while condition:', !model_roundIsOver(round));
  while (!model_roundIsOver(round)) {
    console.log('while');
    const actingUnit = model_roundGetActingUnit(round) as Unit;

    const target = G_utils_isAlly(battle, actingUnit)
      ? (G_utils_getRandArrElem(battle.enemies) as Unit)
      : (G_utils_getRandArrElem(battle.allies) as Unit);
    console.log('Target is', JSON.stringify(target, null, 2));
    controller_roundDoTurn(round, target);
  }
  // model_battleAddRound(battle, controller_roundEnd(round));
  // }
};
