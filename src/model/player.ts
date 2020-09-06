/*
 */
/*
global
G_model_createActor
G_model_actorSetPosition
*/

interface Player {
  actor: Actor;
}

const PLAYER_SPRITE_INDEX = 0;

const G_model_createPlayer = (): Player => {
  const actor = G_model_createActor('actors', PLAYER_SPRITE_INDEX);
  G_model_actorSetPosition(actor, 0, 33);
  return {
    actor,
  };
};
