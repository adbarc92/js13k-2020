/*
global
G_model_actorSetFacing
G_model_actorSetPosition
G_model_battleGetScreenPosition
G_model_createActor
G_model_createStats
G_model_getScreenSize
G_model_getSpriteSize

G_ACTION_STRIKE
G_ACTION_CHARGE
G_ACTION_INTERRUPT
G_ACTION_DEFEND
G_ACTION_HEAL
G_ACTION_USE
G_ACTION_FLEE

G_BATTLE_SCALE

G_FACING_LEFT
G_FACING_RIGHT
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
  name: string;
  actor: Actor;
  bS: Stats;
  cS: Stats;
  i: number; // vertical index of unit
  allegiance: Allegiance;
  ai: AI;
}

const G_model_createUnit = (
  name: string,
  charDef: CharacterDef,
  allegiance: Allegiance,
  i: number
): Unit => {
  const { stats, sprI } = charDef;
  if (!stats) {
    throw new Error('CharacterDef has no stats');
  }
  const newUnit = {
    name,
    actor: G_model_createActor(sprI),
    bS: { ...stats.bS },
    cS: { ...stats.bS },
    i,
    allegiance,
    ai: stats.ai,
  };
  newUnit.allegiance
    ? G_model_actorSetFacing(newUnit.actor, G_FACING_LEFT)
    : G_model_actorSetFacing(newUnit.actor, G_FACING_RIGHT);
  G_model_unitResetPosition(newUnit);
  return newUnit;
};

const G_model_statsModifyHp = (
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

const G_model_unitMoveForward = (unit: Unit) => {
  const { allegiance } = unit;
  const [x, y] = G_model_battleGetScreenPosition(unit.i, allegiance);
  G_model_actorSetPosition(unit.actor, x + (allegiance ? -20 : 20), y);
};

const G_model_unitSetToCenter = (unit: Unit) => {
  const screenSize = G_model_getScreenSize() / G_BATTLE_SCALE;
  const spriteSize = G_model_getSpriteSize();
  const center = screenSize / 2 - spriteSize / 2;
  G_model_actorSetPosition(unit.actor, center, center);
};

const G_model_unitResetPosition = (unit: Unit) => {
  const [x, y] = G_model_battleGetScreenPosition(unit.i, unit.allegiance);
  G_model_actorSetPosition(unit.actor, x, y);
};

const G_model_unitLives = (unit: Unit): boolean => {
  if (unit.cS.hp > 0) {
    return true;
  }
  return false;
};

const G_model_unitGainCharge = (unit: Unit) => {
  unit.cS.cCnt++;
};

const G_model_unitResetDef = (unit: Unit) => {
  unit.cS.def = unit.bS.def;
};

const G_model_modifySpeed = (unit: Unit, action: RoundAction) => {
  const { cS } = unit;
  switch (action) {
    case G_ACTION_STRIKE:
      console.log('strike modifies speed; old speed:', cS.spd);
      cS.spd += 2;
      console.log('new speed:', cS.spd);
      break;
    case G_ACTION_CHARGE:
      cS.spd += 2;
      break;
    case G_ACTION_INTERRUPT:
      cS.spd += 0;
      break;
    case G_ACTION_DEFEND:
      cS.spd += 3;
      break;
    case G_ACTION_HEAL:
      cS.spd -= 1;
      break;
    case G_ACTION_USE:
      cS.spd -= 2;
      break;
    case G_ACTION_FLEE:
      cS.spd -= 3;
      break;
  }
};
