/*
global
G_model_actorSetPosition
G_model_createParty
G_model_createPlayer
G_model_createRoomFromSprite
G_model_partyGetProtag
G_model_createRoom
G_model_roomGetSizePx
G_utils_to1d
*/

interface World {
  rooms: Room[];
  party: Party;
  roomI: number;
  lastX: number;
  lastY: number;
  pause: boolean;
  state: Object;
}

let model_world: World | null = null;

const START_ROOM_X = 1;
const START_ROOM_Y = 0;

const BG_SPRITE_CAVE_WALL = 'terrain_9';
const BG_SPRITE_MANMADE_WALL = 'terrain_10';

const mapIndexToBgSprite = {
  0: BG_SPRITE_CAVE_WALL,
  1: BG_SPRITE_MANMADE_WALL,
  2: BG_SPRITE_MANMADE_WALL,
  3: BG_SPRITE_CAVE_WALL,
  4: BG_SPRITE_MANMADE_WALL,
  5: BG_SPRITE_CAVE_WALL,
  6: BG_SPRITE_CAVE_WALL,
  7: BG_SPRITE_CAVE_WALL,
  8: BG_SPRITE_CAVE_WALL,
  9: BG_SPRITE_CAVE_WALL,
  10: BG_SPRITE_CAVE_WALL,
  11: BG_SPRITE_CAVE_WALL,
  12: BG_SPRITE_CAVE_WALL,
  13: BG_SPRITE_CAVE_WALL,
  14: BG_SPRITE_CAVE_WALL,
  15: BG_SPRITE_CAVE_WALL,
};

const G_model_createWorld = (): World => {
  const party = G_model_createParty();
  const protag = G_model_partyGetProtag(party);
  const actor = protag.actor;
  G_model_actorSetPosition(actor, 128, 180);
  const world: World = {
    rooms: [],
    party,
    lastX: 128,
    lastY: 180,
    roomI: G_utils_to1d(START_ROOM_X, START_ROOM_Y, 4),
    pause: false,
    state: {}, // trigger state
  };
  for (let i = 0; i < 16; i++) {
    world.rooms.push(
      G_model_createRoom(
        'map_' + i,
        mapIndexToBgSprite[i],
        i % 4,
        Math.floor(i / 4)
      )
    );
  }
  return world;
};

const G_model_setCurrentWorld = (world: World) => {
  model_world = world;
};
const G_model_getCurrentWorld = (): World => {
  return model_world as World;
};

const G_model_worldSetCurrentRoom = (x: number, y: number, world: World) => {
  world.roomI = y * 4 + x;
};

const G_model_worldSetCurrentRoomToAdjacentRoom = (
  offsetX: number,
  offsetY: number,
  world: World
) => {
  const worldY = Math.floor(world.roomI / 4);
  const worldX = world.roomI % 4;
  const nextWorldX = (worldX + offsetX + 4) % 4;
  const nextWorldY = (worldY + offsetY + 4) % 4;
  G_model_worldSetCurrentRoom(nextWorldX, nextWorldY, world);
  const room = G_model_worldGetCurrentRoom(world);
  const party = world.party;
  const protag = G_model_partyGetProtag(party);
  const actor = protag.actor;
  const [roomWidth, roomHeight] = G_model_roomGetSizePx(room);
  let newX = 0;
  let newY = 0;
  if (offsetX > 0) {
    newX = 0;
    newY = actor.y;
  }
  if (offsetX < 0) {
    newX = roomWidth - 16;
    newY = actor.y;
  }
  if (offsetY > 0) {
    newX = actor.x;
    newY = 0;
  }
  if (offsetY < 0) {
    newX = actor.x;
    newY = roomHeight - 16;
  }
  G_model_actorSetPosition(actor, newX, newY);
  world.lastX = newX;
  world.lastY = newY;
};

const G_model_worldGetCurrentRoom = (world: World): Room => {
  return world.rooms[world.roomI];
};

const G_model_worldResetProtagToStartingPosition = (world: World) => {
  const party = world.party;
  const protag = G_model_partyGetProtag(party);

  G_model_actorSetPosition(protag.actor, world.lastX, world.lastY);
};

const G_model_worldSetState = (key: string, value: any) => {
  const world = G_model_getCurrentWorld();
  world.state[key] = value;
};
const G_model_worldGetState = (key: string): any => {
  const world = G_model_getCurrentWorld();
  return world.state[key];
};
const G_model_worldOnce = (key: string): boolean => {
  const s = G_model_worldGetState(key);
  if (s === undefined) {
    G_model_worldSetState(key, true);
    return true;
  }
  return false;
};
