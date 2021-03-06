/*
A Room is a collection of tiles, actors, and triggers.
*/
/*
global
G_utils_to1d
G_model_actorSetPosition
G_model_createCanvas
G_model_createCharacterFromTemplate
G_view_drawSprite
G_ACTORS_MAP
G_CHARACTER_STATUE_THINKER
G_CHARACTER_OLD_MAN
G_CHARACTER_POT
*/

interface Tile {
  id: number;
  size: number; // width/height
  x: number; // position (x,y) in tile index
  y: number;
  px: number; // position (x,y) in pixels
  py: number;
}

interface Room {
  tiles: Tile[]; // list of tiles in a room
  characters: Character[]; // list of characters in a room
  bgSprite: string; // the background sprite used when a room is rendered
  w: number; // width/height of room (most likely 16)
  h: number;
}

const G_MAP_TILE_NOTHING = 15;

// maps an rgb color to a tile id (taken from scripts/encode-map.js)
const colorsInverted = {
  0: [156, 100, 52], // platform + wall
  1: [171, 82, 54], // wall
  2: [0, 228, 54], // platform
  7: [255, 241, 232], // wall block
  // ... to be added later
  15: [0, 0, 0], // nothing
};
const colors = {};
for (let i in colorsInverted) {
  colors[colorsInverted[i].join('')] = Number(i);
}

const G_model_createRoom = (
  spriteName: string,
  bgSprite: string,
  worldX: number,
  worldY: number
): Room => {
  const tiles: Tile[] = [];
  const characters: Character[] = [];
  const pngSize = 16;
  const [, ctx] = G_model_createCanvas(pngSize, pngSize);
  G_view_drawSprite(spriteName, 0, 0, 1, ctx);
  const { data } = ctx.getImageData(0, 0, pngSize, pngSize);
  let ctr = 0;
  for (let j = 0; j < data.length; j += 4) {
    const colorKey = `${data[j + 0]}${data[j + 1]}${data[j + 2]}`;
    let ind = colors[colorKey] || 0;
    const tx = ctr % pngSize;
    const ty = Math.floor(ctr / pngSize);

    let ch: Character | null = null;

    const chTemplate = G_ACTORS_MAP[[worldX, worldY, tx, ty].join(',')];
    if (chTemplate) {
      ch = G_model_createCharacterFromTemplate(chTemplate);
    }

    if (ch) {
      G_model_actorSetPosition(ch.actor, tx * 16, ty * 16 - 16);
      characters.push(ch);
    }

    tiles.push({
      id: ind,
      x: tx,
      y: ty,
      px: tx * 16,
      py: ty * 16,
      size: 16,
    });
    ctr++;
  }

  return {
    tiles,
    characters,
    w: pngSize,
    h: pngSize,
    bgSprite,
  };
};

const G_model_roomGetSizePx = (room: Room): [number, number] => {
  return [room.w * 16, room.h * 16];
};

const G_model_roomRemoveCharacter = (room: Room, ch: Character) => {
  const ind = room.characters.indexOf(ch);
  if (ind > -1) {
    room.characters.splice(ind, 1);
  }
};

const G_model_roomGetCollidableTiles = (room: Room): Tile[] => {
  return room.tiles.filter(tile => {
    return [0, 1, 2, 7].includes(tile.id);
  });
};

const G_model_tileIsFullyCollidable = (tile: Tile): boolean => {
  return [0, 1, 7].includes(tile.id);
};
