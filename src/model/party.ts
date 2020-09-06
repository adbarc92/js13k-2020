/*
global
G_model_createUnit
G_ALLEGIANCE_ALLY
*/

interface Item {
  name: string;
  description: string;
  effect: () => void;
}

interface Party {
  units: Unit[];
  inventory: Item[];
}

let G_Party: Party | null = null;

const G_model_getParty = () => {
  return G_Party;
};

const G_model_setParty = (newParty: Party) => {
  G_Party = newParty;
};

const G_model_addUnitToParty = (unit: Unit) => {
  const party = G_model_getParty();
  (party as Party).units.push(unit);
};

const G_model_removeUnitFromParty = (unit: Unit) => {
  const party = G_model_getParty() as Party;
  const index = party.units.indexOf(unit);
  if (index !== -1) party.units.splice(index, 1);
};

const initParty = (
  name: string,
  hp: number,
  dmg: number,
  def: number,
  mag: number,
  spd: number
) => {
  const newUnit = G_model_createUnit(
    name,
    hp,
    dmg,
    def,
    mag,
    spd,
    0,
    G_ALLEGIANCE_ALLY
  );
  if (G_model_getParty() === null) {
    const party: Party = { units: [], inventory: [] };
    party.units.push(newUnit);
    G_model_setParty(party);
  } else {
    G_model_addUnitToParty(newUnit);
  }
};
