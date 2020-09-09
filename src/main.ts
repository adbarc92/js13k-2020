/*
This file is the main entry point for the game.
*/
/*
global
G_controller_doBattle
G_controller_initBattle
G_controller_updateRoom
G_model_addCharacterToParty
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
  /* Battle Code */

  G_model_initParty();
  const party = G_model_getParty();
  // Create character
  const jeremiah = G_model_createCharacterFromTemplate(
    'Jeremiah',
    G_CHARACTER_STRIKER
  );
  const seph = G_model_createCharacterFromTemplate(
    'Seph',
    G_CHARACTER_DEFENDER
  );
  const kana = G_model_createCharacterFromTemplate('Kana', G_CHARACTER_SLAYER);
  G_model_addCharacterToParty(party, jeremiah);
  G_model_addCharacterToParty(party, seph);
  G_model_addCharacterToParty(party, kana);

  const battle = G_controller_initBattle(G_model_getParty(), G_ENCOUNTER_0);
  G_model_setCurrentBattle(battle);
  G_controller_doBattle(battle);

  /* Rendering Code */
  const startTime = performance.now();
  let prevNow = startTime;

  /* Traversal Code */
  // const player = G_model_createPlayer();
  // const room = G_model_createRoomFromSprite('map_0', player);
  // G_model_setCurrentRoom(room);

  /* Draw Code */
  const loop = (now: number) => {
    G_view_drawBattle(battle);
    const sixtyFpsMs = 16.666;
    const dt = now - prevNow;
    const fm = dt / sixtyFpsMs;
    G_model_setFrameMultiplier(fm > 2 ? 2 : fm);
    G_model_setElapsedMs(now - startTime);
    prevNow = now;

    /* Traversal Code */
    // G_view_clearScreen();

    // G_controller_updateRoom(room);

    // G_view_drawRoom(room, 0, 0, G_SCALE);
    // G_view_drawActor(player.actor, G_SCALE);

    if ((window as any).running) requestAnimationFrame(loop);
    // if ((window as any).running) setTimeout(loop, 22); // for debugging
  };
  loop(startTime);
};

const main = async () => {
  await G_model_loadImagesAndSprites();
  G_model_loadSounds();
  runMainLoop();
  if (!G_model_getCurrentBattle()) {
    G_view_showDialogBox(
      "Ho ho, friend. Look yonder. There's a tonne of treasure in that pit over there. I certainly won't kick you into the pit. Trust me. I'm Patches the Spider."
    );
  }
};

window.addEventListener('load', main);
