/*
A Room is a collection of tiles, actors, and triggers.
*/
/*
global
G_utils_to1d
G_model_createCanvas
G_view_drawSprite
*/

interface Tile {
  id: number;
  size: number;
  x: number;
  y: number;
  px: number;
  py: number;
}

interface Room {
  tiles: Tile[];
  actors: Actor[];
  player: Player;
  w: number;
  h: number;
}

let model_room: Room | null = null;

// maps an rgb color (as a string) to a tile id
const colors = {
  '15610052': 0, // grass+dirt
  '1718254': 1, // dirt
  '022854': 2, // grass platform
  // ... to be added later
  '000': 15, // nothing
};

const G_model_setCurrentRoom = (room: Room) => {
  model_room = room;
};

const G_model_getCurrentRoom = (): Room => {
  return model_room as Room;
};

const G_model_createRoomFromSprite = (
  spriteName: string,
  player: Player
): Room => {
  const tiles: Tile[] = [];
  const pngSize = 16;
  const [, ctx] = G_model_createCanvas(pngSize, pngSize);
  G_view_drawSprite(spriteName, 0, 0, 1, ctx);
  const { data } = ctx.getImageData(0, 0, pngSize, pngSize);
  let ctr = 0;
  for (let j = 0; j < data.length; j += 4) {
    const colorKey = `${data[j + 0]}${data[j + 1]}${data[j + 2]}`;
    const ind = colors[colorKey] || 0;
    const tx = ctr % pngSize;
    const ty = Math.floor(ctr / pngSize);
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
    actors: [],
    player,
    w: pngSize,
    h: pngSize,
  };
};

const G_model_roomGetSizePx = (room: Room): [number, number] => {
  return [room.w * 16, room.h * 16];
};

const G_model_roomGetCollidableTiles = (room: Room, actor?: Actor): Tile[] => {
  return room.tiles.filter(tile => {
    return [0, 1, 2].includes(tile.id);
  });
};

const G_model_tileIsFullyCollidable = (tile: Tile): boolean => {
  return [0, 1].includes(tile.id);
};
