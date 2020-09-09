/*
global
G_model_createUnit

G_ALLEGIANCE_ALLY
*/

interface Character {
  name: string;
  pos: [number, number];
  unit?: Unit; // should be optional
}

const G_model_characterSetPosition = (
  character: Character,
  x: number,
  y: number
) => {
  character.pos = [x, y];
};

const G_model_createCharacterFromTemplate = (
  name: string,
  characterDef: CharacterDef
): Character => {
  return {
    name,
    pos: [0, 0],
    unit: G_model_createUnit(name, characterDef, G_ALLEGIANCE_ALLY, 0),
  };
};
