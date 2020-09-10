/*
global
G_model_createUnit
G_model_createCharacterFromTemplate
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
  worldX: 0;
  worldY: 0;
}

const G_model_createParty = (): Party => {
  return {
    characters: [
      G_model_createCharacterFromTemplate(G_CHARACTER_PROTAG, 'Runner'),
    ],
    inventory: [] as Item[],
    worldX: 0,
    worldY: 0,
  };
};

const G_model_partyGetProtag = (party: Party): Character => {
  return party.characters[0];
};
const G_model_partyAddCharacter = (party: Party, unit: Character) => {
  party.characters.push(unit);
};
const G_model_partyRemoveCharacter = (ch: Character, party: Party) => {
  const index = party.characters.indexOf(ch);
  if (index === 0) {
    throw new Error(
      'cannot remove character from party at index 0 (thats the protag, silly!)'
    );
  }
  if (index !== -1) party.characters.splice(index, 1);
};
