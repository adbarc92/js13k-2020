/*
This file handles operations related to Sprites: loading them and getting info about them.
A Sprite is a sub-image of a parent image.  The sub image is represented by a rectangle
within the parent image (the four numbers: x, y, width, height).
*/
/*
global
G_view_drawSprite
G_model_createCanvas
*/

type Sprite = [
  HTMLCanvasElement | HTMLImageElement,
  number,
  number,
  number,
  number
];

const createSprite = (
  img: HTMLCanvasElement | HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
): Sprite => {
  return [img, x, y, w, h];
};

// sprites are stored inside key => value objects, where the key is the name of the sprite
type SpriteCollection = { [key: string]: Sprite };

// This type represents the postfix one can add to a sprite
type SpriteModification = '' | '_r1' | '_r2' | '_r3' | '_f';
const G_SPRITE_MOD_NORMAL: SpriteModification = '';
const G_SPRITE_MOD_FLIPPED: SpriteModification = '_f';
const G_SPRITE_MOD_ROT90: SpriteModification = '_r1';
const G_SPRITE_MOD_ROT180: SpriteModification = '_r2';
const G_SPRITE_MOD_ROT270: SpriteModification = '_r3';

let model_sprites: SpriteCollection | null = null;

// given an inputCanvas, return a new canvas rotated to the right by 90 degrees
const createRotatedImg = (
  inputCanvas: HTMLCanvasElement
): HTMLCanvasElement => {
  const [canvas, ctx, width, height] = G_model_createCanvas(
    inputCanvas.width,
    inputCanvas.height
  );
  const x = width / 2;
  const y = height / 2;
  ctx.translate(x, y);
  ctx.rotate(Math.PI / 2);
  ctx.drawImage(inputCanvas, -x, -y);
  return canvas;
};

// given an inputCanvas, return a new canvas flipped horizontally
const createFlippedImg = (
  inputCanvas: HTMLCanvasElement
): HTMLCanvasElement => {
  const [canvas, ctx, width] = G_model_createCanvas(
    inputCanvas.width,
    inputCanvas.height
  );
  ctx.translate(width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(inputCanvas, 0, 0);
  return canvas;
};

// given a Sprite, create and return a new image from the sprite
const spriteToCanvas = (sprite: Sprite): HTMLCanvasElement => {
  const [, , , spriteWidth, spriteHeight] = sprite;
  const [canvas, ctx] = G_model_createCanvas(spriteWidth, spriteHeight);
  G_view_drawSprite(sprite, 0, 0, 1, ctx);
  return canvas;
};

// load a set of sprites from an image, each sprite loaded with also have a set of rotated
// and flipped variants
const loadSpritesFromImage = (
  spriteMap: SpriteCollection, // collection in which to put created sprites
  image: HTMLImageElement | HTMLCanvasElement, // parent image
  spritePrefix: string, // created sprites are named <spritePrefix>_<index>
  spriteWidth: number,
  spriteHeight: number
) => {
  const addSprite = (
    name: string,
    image: HTMLImageElement | HTMLCanvasElement,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    return (spriteMap[name] = createSprite(image, x, y, w, h));
  };

  const addRotatedSprite = (
    sprite: HTMLCanvasElement,
    baseSpriteName: string,
    n: number
  ) => {
    let rotated: HTMLCanvasElement = sprite;
    for (let i = 0; i < n; i++) {
      rotated = createRotatedImg(rotated);
    }
    addSprite(
      `${baseSpriteName}_r${n}`,
      rotated,
      0,
      0,
      spriteWidth,
      spriteHeight
    );
  };

  const numColumns = image.width / spriteWidth;
  const numRows = image.height / spriteHeight;

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numColumns; j++) {
      // create original sprite: <baseSpriteName>
      const baseSpriteName = `${spritePrefix}_${i * numColumns + j}`;
      const sprite = addSprite(
        baseSpriteName,
        image,
        j * spriteWidth,
        i * spriteHeight,
        spriteWidth,
        spriteHeight
      );

      // create rotated sprites:<baseSpriteName>_rN
      addRotatedSprite(spriteToCanvas(sprite), baseSpriteName, 1);
      addRotatedSprite(spriteToCanvas(sprite), baseSpriteName, 2);
      addRotatedSprite(spriteToCanvas(sprite), baseSpriteName, 3);

      // create flipped sprite: <baseSpriteName>_f
      addSprite(
        `${baseSpriteName}${G_SPRITE_MOD_FLIPPED}`,
        createFlippedImg(spriteToCanvas(sprite)),
        0,
        0,
        spriteWidth,
        spriteHeight
      );
    }
  }
};

const loadImage = (imagePath: string): Promise<HTMLImageElement> => {
  return new Promise(resolve => {
    const img: HTMLImageElement = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.src = imagePath;
  });
};

// exported functions --------------------------------------------------------------------

const G_model_loadImagesAndSprites = async () => {
  const spriteMap = {};

  const spriteSheetWidth = 16 * 4;
  const spriteSheetHeight = 16 * 4;

  const baseImage = await loadImage('res/packed.png');
  const topLeftSpritesheet = spriteToCanvas(
    createSprite(baseImage, 0, 0, spriteSheetWidth, spriteSheetHeight)
  );
  loadSpritesFromImage(spriteMap, topLeftSpritesheet, 'actors', 16, 16);

  const topRightSpritesheet = spriteToCanvas(
    createSprite(
      baseImage,
      spriteSheetWidth,
      0,
      spriteSheetWidth,
      spriteSheetHeight
    )
  );
  loadSpritesFromImage(spriteMap, topRightSpritesheet, 'terrain', 16, 16);

  const bottomLeftSpritesheet = spriteToCanvas(
    createSprite(
      baseImage,
      0,
      spriteSheetHeight,
      spriteSheetWidth,
      spriteSheetHeight
    )
  );
  loadSpritesFromImage(spriteMap, bottomLeftSpritesheet, 'map', 16, 16);

  model_sprites = spriteMap;
};

// get a Sprite given a sprite name
const G_model_getSprite = (spriteName: string): Sprite =>
  (model_sprites as SpriteCollection)[spriteName];

const G_model_getSpriteSize = () => 16;
