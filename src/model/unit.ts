/*
global
G_model_actorSetFacing
G_model_actorSetPosition
G_model_battleGetScreenPosition
G_model_createActor

G_ACTION_STRIKE
G_ACTION_CHARGE
G_ACTION_INTERRUPT
G_ACTION_DEFEND
G_ACTION_HEAL
G_ACTION_USE
G_ACTION_FLEE

G_FACING_LEFT
G_FACING_RIGHT
*/

type AI = 0 | 1 | 2 | 3;
const G_AI_PLAYER: AI = 0;
const G_AI_CHARGER: AI = 1;
const G_AI_STRIKER: AI = 2;
const G_AI_BOSS: AI = 3;

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
  actor?: Actor,
  ai?: AI
): Unit => {
  actor = actor || G_model_createActor('actors', 0);
  ai = ai || 0;
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
    ai,
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
