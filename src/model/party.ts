/*
global
G_model_createUnit
G_model_createCharacterFromTemplate
G_view_renderItemsBox
G_CHARACTER_PROTAG
G_AI_PLAYER
*/

interface Item {
  name: string;
  dsc: string;
  onUse?: (item: Item) => void;
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
const G_model_partyAddCharacter = (party: Party, character: Character) => {
  (character.unit as Unit).ai = G_AI_PLAYER;
  party.characters.push(character);
};
const G_model_partyRemoveCharacter = (party: Party, ch: Character) => {
  const index = party.characters.indexOf(ch);
  if (index === 0) {
    throw new Error('cannot remove protag.');
  }
  if (index !== -1) party.characters.splice(index, 1);
};

const G_model_partyAddItem = (party: Party, itemTemplate: ItemDef) => {
  const item = {
    ...itemTemplate,
  };
  party.inv.push(item);
  G_view_renderItemsBox(party.inv, true);
};
const G_model_partyRemoveItem = (party: Party, item: Item) => {
  const i = party.inv.indexOf(item);
  if (i > -1) {
    party.inv.splice(i, 1);
  }
  G_view_renderItemsBox(party.inv, true);
};
const G_model_partyGetItem = (party: Party, itemDef: ItemDef): Item | null => {
  for (let i in party.inv) {
    const { name } = party.inv[i];
    if (name === itemDef.name) {
      return party.inv[i];
    }
  }
  return null;
};
