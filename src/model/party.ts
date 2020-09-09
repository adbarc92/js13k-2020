/*
global
G_model_createUnit
G_ALLEGIANCE_ALLY
G_runner
*/

interface Item {
  name: string;
  description: string;
  effect: () => void;
}

interface Party {
  units: CharacterDef[];
  inventory: Item[];
}

let G_Party: Party | null = null;

const G_model_getParty = () => {
  return G_Party as Party;
};

const G_model_setParty = (newParty: Party) => {
  G_Party = newParty;
};

const G_model_addCharacterToParty = (party: Party, unit: CharacterDef) => {
  party.units.push(unit);
};

const G_model_removeCharacterFromParty = (unit: CharacterDef) => {
  const party = G_model_getParty() as Party;
  const index = party.units.indexOf(unit);
  if (index !== -1) party.units.splice(index, 1);
};

const G_model_initParty = () => {
  const party: Party = { units: [], inventory: [] };
  party.units.push(G_runner);
  G_model_setParty(party);
};
