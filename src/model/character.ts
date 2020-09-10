/*
global
G_model_createActor
G_model_createUnit
G_ALLEGIANCE_ALLY
*/

interface Character {
  name: string;
  actor: Actor;
  unit?: Unit; // should be optional
}

const G_model_characterGetActor = (ch: Character): Actor => {
  return ch.actor;
};

const G_model_createCharacterFromTemplate = (
  characterDef: CharacterDef,
  chName?: string
): Character => {
  const { sprI, spr, stats, name } = characterDef;
  const actor = G_model_createActor(sprI);
  if (spr) {
    actor.sprite = spr;
  }
  return {
    name: chName || name,
    actor,
    unit: stats
      ? G_model_createUnit(name, actor, characterDef, G_ALLEGIANCE_ALLY, 0)
      : undefined,
  };
};
