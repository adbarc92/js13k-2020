/*
global
G_model_createUnit
G_model_createCharacterFromTemplate
G_CHARACTER_PROTAG
*/

interface Item {
  name: string;
  dsc: string;
  onUse: () => void;
}

interface Party {
  characters: Character[];
  inv: Item[];
  worldX: 0;
  worldY: 0;
}

const G_model_createParty = (): Party => {
  return {
    characters: [
      G_model_createCharacterFromTemplate(G_CHARACTER_PROTAG, 'Runner'),
    ],
    inv: [] as Item[],
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
const G_model_partyAddItem = (party: Party, itemTemplate: ItemDef) => {
  const item = {
    ...itemTemplate,
  };
  party.inv.push(item);
};
const G_model_partyRemoveCharacter = (party: Party, ch: Character) => {
  const index = party.characters.indexOf(ch);
  if (index === 0) {
    throw new Error('cannot remove main ch.');
  }
  if (index !== -1) party.characters.splice(index, 1);
};
