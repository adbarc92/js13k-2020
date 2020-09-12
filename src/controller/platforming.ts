/*
This file contains functions that run on each frame.
*/
/*
global
G_utils_getSign
G_model_isKeyDown
G_model_actorSetVelocity
G_model_actorSetPosition
G_model_actorSetAcceleration
G_model_actorSetFacing
G_model_actorSetAnimState
G_model_actorGetCollisionRect
G_model_characterSetActionText
G_model_roomGetSizePx
G_model_roomGetCollidableTiles
G_model_tileIsFullyCollidable
G_model_getFrameMultiplier
G_model_getCurrentWorld
G_model_partyGetProtag
G_model_worldGetCurrentRoom
G_model_worldSetCurrentRoomToAdjacentRoom
G_model_setInteractCb
G_utils_floorNearestMultiple
G_utils_createRect
G_utils_getCollisionsWithRect
G_utils_rectToCollisionPoints
G_KEY_LEFT
G_KEY_RIGHT
G_KEY_SPACE
G_KEY_DOWN
G_FACING_LEFT
G_FACING_RIGHT
G_ANIM_JUMPING
G_ANIM_WALKING
G_ANIM_DEFAULT
G_COLLISION_TOP
G_COLLISION_BOTTOM
G_COLLISION_LEFT
G_COLLISION_RIGHT
*/

const PLAYER_SPEED = 1.2; // the acceleration rate that the player moves left/right
const PLAYER_JUMP_SPEED = 5.1; // the higher this value, the higher+faster the player jumps
const AIR_CONTROL_DIVISOR = 30; // the higher this value, the less air control the player has.
const MAX_SPEED_X = 1.2; // the maximum x speed that an actor can move
const MAX_SPEED_Y = 3.2; // the maximum y speed that an actor can move
const DECELERATION_RATE = 1.2; // the rate that actors decelerate (reduce velocity) per frame
const GRAVITY_RATE = 0.2; // the rate that the y velocity is modified each frame (the higher, the faster the player moves down)

// given an actor and a 'vx' or 'vy' reduce the velocity value one step closer to 0
const decelerateVelocity = (actor: Actor, vel: 'vx' | 'vy') => {
  const v = actor[vel];

  if (v < 0) {
    actor[vel] += DECELERATION_RATE;
  } else if (v > 0) {
    actor[vel] -= DECELERATION_RATE;
  }

  if (Math.abs(actor[vel]) <= DECELERATION_RATE) {
    actor[vel] = 0;
  }
};

const applyGravity = (actor: Actor) => {
  const fm = G_model_getFrameMultiplier();
  if (actor.isGround) {
    actor.ay += 0.0001 * fm;
  } else {
    actor.ay += GRAVITY_RATE * fm;
  }
};

interface CollisionResult {
  sides: CollisionSide[];
  tile: Tile;
}

// check collisions between this actor and all wall tiles.  If the actor is colliding,
// then move the actor towards a position that is not colliding until the actor is no
// longer colliding
const handleActorTileCollisions = (actor: Actor, room: Room) => {
  let hasCollision: boolean;
  let hasCollisionPlatform: boolean;
  let hasCollisionWithGround = false;
  let ctr = 0;
  const collidableTiles = G_model_roomGetCollidableTiles(room);
  do {
    ctr++;
    hasCollision = false;
    hasCollisionPlatform = false;
    const actorCollisionPoints = G_utils_rectToCollisionPoints(
      G_utils_createRect(actor.x, actor.y, actor.w, actor.h)
    );

    const collisionSideMap = {
      [G_COLLISION_BOTTOM]: null,
      [G_COLLISION_TOP]: null,
      [G_COLLISION_LEFT]: null,
      [G_COLLISION_RIGHT]: null,
    } as any;

    collidableTiles.forEach(tile => {
      const tileRect = G_utils_createRect(
        tile.px,
        tile.py,
        tile.size,
        tile.size
      );
      if (G_model_tileIsFullyCollidable(tile)) {
        G_utils_getCollisionsWithRect(actorCollisionPoints, tileRect).forEach(
          side => {
            hasCollision = true;
            collisionSideMap[side] = tile;
          }
        );
      } else if (actor.y + actor.h / 2 < tile.py) {
        G_utils_getCollisionsWithRect(actorCollisionPoints, tileRect).forEach(
          side => {
            if (
              side === G_COLLISION_BOTTOM &&
              !actor.disablePlatformCollision
            ) {
              hasCollisionPlatform = true;
              hasCollision = true;
              collisionSideMap[side] = tile;
            }
          }
        );
      }
    });

    const tileBottom = collisionSideMap[G_COLLISION_BOTTOM];
    const tileTop = collisionSideMap[G_COLLISION_TOP];
    const tileLeft = collisionSideMap[G_COLLISION_LEFT];
    const tileRight = collisionSideMap[G_COLLISION_RIGHT];

    const correctionRate = 1;
    if (tileBottom) {
      if (actor.vy > 0) {
        actor.y = G_utils_floorNearestMultiple(actor.y, 16);
        hasCollisionWithGround = true;
      }
    } else if (tileTop) {
      if (!hasCollisionPlatform) {
        actor.y += correctionRate;
        actor.vy = 0;
      }
    } else if (tileLeft) {
      if (!hasCollisionPlatform) {
        actor.x += correctionRate;
      }
    } else if (tileRight) {
      if (!hasCollisionPlatform) {
        actor.x -= correctionRate;
      }
    }
  } while (hasCollision && ctr < 10);

  if (hasCollisionWithGround !== actor.isGround && !hasCollisionWithGround) {
    actor.vy = 0;
  }
  actor.isGround = hasCollisionWithGround;
};

const G_controller_updateCurrentRoom = (world: World) => {
  if (world.pause) {
    return;
  }
  const room = G_model_worldGetCurrentRoom(world);
  const { characters } = room;
  characters.forEach(ch => {
    const actor = ch.actor;
    G_controller_updateActor(actor, room);
  });
  G_controller_updatePlayer(world.party, room, world);
};

const G_controller_updatePlayer = (party: Party, room: Room, world: World) => {
  const protag = G_model_partyGetProtag(party);
  const actor = protag.actor;
  const { ax, ay, isGround } = actor;
  G_model_actorSetAnimState(actor, G_ANIM_DEFAULT);
  G_model_setInteractCb(null);

  let nextAx = ax;
  let nextAy = ay;
  const nextSpeed = isGround
    ? PLAYER_SPEED
    : PLAYER_SPEED / AIR_CONTROL_DIVISOR;

  if (G_model_isKeyDown(G_KEY_LEFT)) {
    nextAx = -nextSpeed;
    G_model_actorSetFacing(actor, G_FACING_LEFT);
    G_model_actorSetAnimState(actor, G_ANIM_WALKING);
  }
  if (G_model_isKeyDown(G_KEY_RIGHT)) {
    nextAx = nextSpeed;
    G_model_actorSetFacing(actor, G_FACING_RIGHT);
    G_model_actorSetAnimState(actor, G_ANIM_WALKING);
  }
  if (G_model_isKeyDown(G_KEY_SPACE)) {
    if (actor.isGround) {
      nextAy = -PLAYER_JUMP_SPEED;
      actor.vy = 0;
      actor.isGround = false;
    }
  }
  if (G_model_isKeyDown(G_KEY_DOWN)) {
    actor.disablePlatformCollision = true;
  }

  if (!actor.isGround) {
    G_model_actorSetAnimState(actor, G_ANIM_JUMPING);
  }

  G_model_actorSetAcceleration(actor, nextAx, nextAy);
  const [boundsOffsetX, boundsOffsetY] = G_controller_updateActor(actor, room);
  if (boundsOffsetX || boundsOffsetY) {
    G_model_worldSetCurrentRoomToAdjacentRoom(
      boundsOffsetX,
      boundsOffsetY,
      world
    );
  }

  const actorCollisionPoints = G_utils_rectToCollisionPoints(
    G_model_actorGetCollisionRect(actor)
  );
  for (let i in room.characters) {
    const ch = room.characters[i];
    const chActor = ch.actor;
    G_model_characterSetActionText('', ch);

    const chRect = G_model_actorGetCollisionRect(chActor);
    let hasCollision = false;
    G_utils_getCollisionsWithRect(actorCollisionPoints, chRect).forEach(
      (/*side*/) => {
        // potentially back attack if side === back
        hasCollision = true;
      }
    );
    const text = ch.label || ch.name;
    if (hasCollision) {
      if (text) {
        G_model_characterSetActionText(text, ch);
      }
      G_model_setInteractCb(() => {
        if (ch.action) {
          ch.action(ch);
        }
      });
      if (ch.col) {
        ch.col(ch);
      }
    }
  }
};

const G_controller_updateActor = (
  actor: Actor,
  room: Room
): [number, number] => {
  applyGravity(actor);

  let boundsOffsetX = 0;
  let boundsOffsetY = 0;

  const fm = G_model_getFrameMultiplier();
  let { x, y, vx, vy, ax, ay, w, h } = actor;
  let newVx = vx + ax * fm;
  let newVy = vy + ay * fm;
  if (Math.abs(newVx) > MAX_SPEED_X) {
    newVx = MAX_SPEED_X * G_utils_getSign(newVx);
  }
  if (Math.abs(newVy) > MAX_SPEED_Y) {
    newVy = MAX_SPEED_Y * G_utils_getSign(newVy);
  }
  G_model_actorSetVelocity(actor, newVx, newVy);

  let newX = x + vx * fm;
  let newY = y + vy * fm;
  const [roomWidthPx, roomHeightPx] = G_model_roomGetSizePx(room);

  // keep in bounds
  if (newX < 0) {
    newX = 0;
    boundsOffsetX = -1;
  } else if (newX + w > roomWidthPx) {
    newX = roomWidthPx - w;
    boundsOffsetX = 1;
  }
  if (newY < 0) {
    newY = 0;
    boundsOffsetY = -1;
  } else if (newY + h > roomHeightPx) {
    newY = roomHeightPx - h;
    boundsOffsetY = 1;
  }
  G_model_actorSetPosition(actor, newX, newY);

  handleActorTileCollisions(actor, room);
  if (ax === 0) {
    decelerateVelocity(actor, 'vx');
  }
  if (ay === 0) {
    decelerateVelocity(actor, 'vy');
  }

  G_model_actorSetAcceleration(actor, 0, 0);

  return [boundsOffsetX, boundsOffsetY];
};
