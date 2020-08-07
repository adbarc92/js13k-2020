/*
global
G_model_createActor
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
