/*
global
G_model_actorSetFacing
G_model_actorSetPosition
G_model_battleGetScreenPosition
G_model_createActor
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
}

const model_createStats = (
  hp: number,
  dmg: number,
  def: number,
  mag: number,
  spd: number
): Stats => {
  return { hp, dmg, def, mag, spd, iCnt: mag, cCnt: 0 };
};

const G_model_createUnit = (
  name: string,
  hp: number,
  dmg: number,
  def: number,
  mag: number,
  spd: number,
  i: number,
  allegiance: Allegiance,
  actor?: Actor
): Unit => {
  actor = actor || G_model_createActor(0);
  allegiance
    ? G_model_actorSetFacing(actor, G_FACING_LEFT)
    : G_model_actorSetFacing(actor, G_FACING_RIGHT);
  const unit = {
    name,
    bS: model_createStats(hp, dmg, def, mag, spd),
    cS: model_createStats(hp, dmg, def, mag, spd),
    actor,
    i,
    allegiance,
  };
  G_model_unitResetPosition(unit);
  return unit;
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
  G_model_actorSetPosition(unit.actor, x + (allegiance ? -50 : 50), y);
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
