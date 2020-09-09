/*
global
G_model_createUnit
G_model_createCharacterFromTemplate
G_ALLEGIANCE_ALLY
G_CHARACTER_PROTAG
*/

interface Item {
  name: string;
  description: string;
  effect: () => void;
}

interface Party {
  characters: Character[];
  inventory: Item[];
}

let G_Party: Party | null = null;

const G_model_getParty = () => {
  return G_Party as Party;
};

const G_model_setParty = (newParty: Party) => {
  G_Party = newParty;
};

const G_model_addCharacterToParty = (party: Party, unit: Character) => {
  party.characters.push(unit);
};

const G_model_removeCharacterFromParty = (unit: Character) => {
  const party = G_model_getParty() as Party;
  const index = party.characters.indexOf(unit);
  if (index !== -1) party.characters.splice(index, 1);
};

const G_model_initParty = () => {
  const party: Party = { characters: [], inventory: [] };

  party.characters.push(
    G_model_createCharacterFromTemplate('Runner', G_CHARACTER_PROTAG)
  );
  G_model_setParty(party);
};
