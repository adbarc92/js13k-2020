/*
An Actor is an entity on the screen which is affected by gravity.
*/
/*
global
G_model_getElapsedMs
G_model_getCurrentWorld
G_utils_alternate
G_utils_floorNearestMultiple
G_utils_createRect
G_SPRITE_MOD_FLIPPED
G_SPRITE_MOD_FLROT90
G_SPRITE_MOD_ROT90
G_SPRITE_MOD_ROT270
*/

type Facing = 0 | 1 | 2 | 3;
const G_FACING_LEFT: Facing = 0;
const G_FACING_RIGHT: Facing = 1;
const G_FACING_UP_RIGHT: Facing = 2;
const G_FACING_UP_LEFT: Facing = 3;

type AnimState = 0 | 1 | 2 | 3 | 4;
const G_ANIM_DEFAULT: AnimState = 0;
const G_ANIM_WALKING: AnimState = 1;
const G_ANIM_JUMPING: AnimState = 2;
const G_ANIM_ATTACKING: AnimState = 3;
const G_ANIM_STUNNED: AnimState = 4;

type PlatformAI = 0 | 1;
const G_PLATFORM_AI_NONE = 0;
const G_PLATFORM_AI_LEFT_RIGHT = 1;

interface Actor {
  sprite: string;
  spriteIndex: number;
  facing: Facing;
  anim: AnimState;
  isGround: boolean; // actor is currently on the ground
  dpCol: boolean;
  plAi: PlatformAI;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  w: number;
  h: number;
}

const G_model_createActor = (spriteIndex: number): Actor => {
  return {
    sprite: 'actors',
    spriteIndex,
    facing: G_FACING_LEFT,
    anim: G_ANIM_DEFAULT,
    isGround: false,
    dpCol: false,
    plAi: G_PLATFORM_AI_NONE,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    ax: 0,
    ay: 0,
    w: 16, // should be configurable
    h: 16, // ^
  };
};

const G_model_actorSetFacing = (actor: Actor, facing: Facing) => {
  actor.facing = facing;
};

const G_model_actorSetPosition = (actor: Actor, x: number, y: number) => {
  actor.x = x;
  actor.y = y;
};

const G_model_actorGetPosition = (actor: Actor): [number, number] => {
  return [actor.x, actor.y];
};

const G_model_actorSetVelocity = (actor: Actor, vx: number, vy: number) => {
  actor.vx = vx;
  actor.vy = vy;
};

const G_model_actorSetAcceleration = (actor: Actor, ax: number, ay: number) => {
  actor.ax = ax;
  actor.ay = ay;
};

const G_model_actorIsMoving = (actor: Actor): boolean => {
  return actor.vx !== 0;
};

const G_model_actorGetCurrentSpriteAndOffset = (
  actor: Actor,
  isPaused?: boolean
): [string, number, number] => {
  let { facing, sprite, spriteIndex, anim } = actor;
  let spriteIndexOffset = anim;
  let hasMultiSprite = spriteIndex < 3;
  let yOff = 0;
  if (!isPaused) {
    if (anim === G_ANIM_WALKING) {
      // alternate between two frames (anim = 1 and anim = 0) every 100 ms
      spriteIndexOffset = (spriteIndexOffset -
        G_utils_alternate(1, 100)) as AnimState;
    } else if (anim === G_ANIM_ATTACKING) {
      if (hasMultiSprite) {
        spriteIndexOffset = (2 - G_utils_alternate(1, 250)) as AnimState;
      } else {
        spriteIndexOffset = 0;
        yOff = 2 * G_utils_alternate(1, 100);
      }
    } else if (anim === G_ANIM_STUNNED) {
      if (hasMultiSprite) {
        spriteIndexOffset = 2;
      } else {
        spriteIndexOffset = 0;
      }
    }
  }
  let mod = '';
  switch (facing) {
    case 0:
      mod = G_SPRITE_MOD_FLIPPED;
      break;
    // case 1 is no modification
    case 2: // up
      mod = G_SPRITE_MOD_ROT270;
      break;
    case 3:
      mod = G_SPRITE_MOD_FLROT90;
      break;
    default:
      break;
  }
  return [sprite + `_${spriteIndex + spriteIndexOffset + mod}`, 0, yOff];
};

const G_model_actorSetAnimState = (actor: Actor, anim: AnimState) => {
  actor.anim = anim;
};

const G_model_actorGetCollisionRect = (actor: Actor): Rect => {
  return G_utils_createRect(actor.x, actor.y, actor.w, actor.h);
};
