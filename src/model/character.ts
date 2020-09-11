/*
global
G_model_createActor
G_model_createUnit
G_ALLEGIANCE_ALLY
*/

interface Character {
  name: string;
  actor: Actor;
  label: string;
  action?: (self?: Character) => any;
  unit?: Unit; // should be optional
  aText: string; //action text
}

const G_model_characterGetActor = (ch: Character): Actor => {
  return ch.actor;
};

const G_model_characterSetActionText = (v: string, ch: Character) => {
  ch.aText = v;
};

const G_model_createCharacterFromTemplate = (
  characterDef: CharacterDef,
  chName?: string
): Character => {
  const { sprI, spr, stats, label, action, name } = characterDef;
  const actor = G_model_createActor(sprI);
  if (spr) {
    actor.sprite = spr;
  }
  return {
    name: chName || name,
    actor,
    label: label || '',
    action,
    aText: '',
    unit: stats
      ? G_model_createUnit(name, actor, characterDef, G_ALLEGIANCE_ALLY, 0)
      : undefined,
  };
};
