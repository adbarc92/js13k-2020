/*
This file is the main entry point for the game.
*/
/*
global
G_controller_doBattle
G_controller_initBattle
G_controller_updateRoom
G_model_createPlayer
G_model_createRoomFromSprite
G_model_setCurrentRoom
G_model_setElapsedMs
G_model_setFrameMultiplier
G_model_loadImagesAndSprites
G_model_loadSounds
G_view_clearScreen
G_view_drawActor
G_view_drawBattle
G_view_drawRoom

G_view_showDialogBox

*/

// const SCALE = 2;

const G_SCALE = 2;

(window as any).running = true;

const runMainLoop = () => {
  /* Battle Code */

  const battle = G_controller_initBattle();
  G_controller_doBattle(battle);

  /* Rendering Code */
  const startTime = performance.now();
  let prevNow = startTime;

  /* Traversal Code */
  // const player = G_model_createPlayer();
  // const room = G_model_createRoomFromSprite('map_0', player);
  // G_model_setCurrentRoom(room);

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
  G_view_showDialogBox(
    "Ho ho, friend. Look yonder. There's a tonne of treasure in that pit over there. I certainly won't kick you into the pit. Trust me. I'm Patches the Spider."
  );
};

window.addEventListener('load', main);
