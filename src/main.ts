/*
This file is the main entry point for the game.
*/
/*
global
G_initActors
G_controller_doBattle
G_controller_updateCurrentRoom
G_model_addCharacterToParty
G_model_createBattle
G_model_createCharacterFromTemplate
G_model_createPlayer
G_model_createRoomFromSprite
G_model_getParty
G_model_setCurrentRoom
G_model_setElapsedMs
G_model_setFrameMultiplier
G_model_loadImagesAndSprites
G_model_loadSounds
G_model_getCurrentBattle
G_model_initParty
G_model_setCurrentBattle
G_model_createWorld
G_model_partyGetProtag
G_model_partyAddCharacter
G_model_worldGetCurrentRoom
G_model_setCurrentWorld
G_view_clearScreen
G_view_drawActor
G_view_drawBattle
G_view_drawRoom

G_view_showDialogBox

G_jerry
G_CHARACTER_DEFENDER
G_CHARACTER_SLAYER
G_CHARACTER_SPEEDSTER
G_CHARACTER_STRIKER
G_kana
G_seph
G_ENCOUNTER_0
*/

// const SCALE = 2;

const G_SCALE = 2;

(window as any).running = true;

const runMainLoop = () => {
  const world = G_model_createWorld();
  G_model_setCurrentWorld(world);
  (window as any).world = world;
  console.log('WORLD', world);
  const party = world.party;
  const jerry = G_model_createCharacterFromTemplate(
    G_CHARACTER_STRIKER,
    'Jeremiah'
  );
  const seph = G_model_createCharacterFromTemplate(
    G_CHARACTER_DEFENDER,
    'Seph'
  );
  const kana = G_model_createCharacterFromTemplate(
    G_CHARACTER_SPEEDSTER,
    'Kana'
  );
  G_model_partyAddCharacter(party, jerry);
  G_model_partyAddCharacter(party, seph);
  G_model_partyAddCharacter(party, kana);

  // uncomment to create and render a battle
  // const battle = G_model_createBattle(party, G_ENCOUNTER_0);
  // G_model_setCurrentBattle(battle);
  // G_controller_doBattle(battle);

  const startTime = performance.now();
  let prevNow = startTime;
  const loop = (now: number) => {
    const sixtyFpsMs = 16.666;
    const dt = now - prevNow;
    const fm = dt / sixtyFpsMs;
    G_model_setFrameMultiplier(fm > 2 ? 2 : fm);
    G_model_setElapsedMs(now - startTime);
    prevNow = now;
    G_view_clearScreen();

    // draw the battle
    const battle = G_model_getCurrentBattle();
    if (battle) {
      G_view_drawBattle(battle);
    } else {
      const room = G_model_worldGetCurrentRoom(world);
      const protag = G_model_partyGetProtag(party);
      const actor = protag.actor;
      G_controller_updateCurrentRoom(world);
      G_view_drawRoom(room, 0, 0, G_SCALE);
      G_view_drawActor(actor, G_SCALE);
    }

    if ((window as any).running) requestAnimationFrame(loop);
    // if ((window as any).running) setTimeout(loop, 22); // for debugging
  };
  loop(startTime);
};

const main = async () => {
  await G_model_loadImagesAndSprites();
  G_model_loadSounds();
  G_initActors();
  runMainLoop();
  // if (!G_model_getCurrentBattle()) {
  //   G_view_showDialogBox(
  //     "Ho ho, friend. Look yonder. There's a tonne of treasure in that pit over there. I certainly won't kick you into the pit. Trust me. I'm Patches the Spider."
  //   );
  // }
};

window.addEventListener('load', main);
