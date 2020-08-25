() => {
    const images = [
        'https://i.imgur.com/M36x4jw.jpg',
        'https://i.imgur.com/6SfbJkg.jpg',
        'https://i.imgur.com/FW3ehVy.jpg',
        'https://i.imgur.com/MgZ4f35.jpg',
        'https://i.imgur.com/PoaqwIJ.png',
    ];
    let isRendering = false;
    let nextRender = null;
    window.doManualFadeInOut = () => {
        if (isRendering) {
            isRendering = false;
            nextRender = window.doManualFadeInOut;
            return;
        }
        const img = document.getElementById('img_0');
        if (img) {
            img.style.transition = '';
            const ms = 500;
            // const startTime = +new Date();
            const startTime = performance.now();
            isRendering = true;
            const render = now => {
                // console.log(
                //   'startTime: ',
                //   startTime,
                //   'now:',
                //   now,
                //   'now-startTime:',
                //   now - startTime
                // );
                const elapsed = now - startTime;
                img.style.opacity = (1 - elapsed / 500).toString();
                if (elapsed < ms && isRendering) {
                    requestAnimationFrame(render);
                }
                else {
                    isRendering = false;
                    img.style.opacity = '1';
                    if (nextRender) {
                        nextRender();
                        nextRender = null;
                    }
                }
            };
            render(startTime);
        }
    };
    window.fadeOut = ev => {
        const img = document.getElementById('img_0');
        if (img) {
            img.style.opacity = '0';
        }
    };
    // This will be inconsistent, dependent on browser performance
    window.doManualFadeOut = () => {
        const img = document.getElementById('img_0');
        console.log(img);
        if (img) {
            img.style.transition = '';
            const ms = 500;
            for (let i = 0; i < ms; i += 25) {
                setTimeout(() => {
                    img.style.opacity = (1 - i / ms).toString();
                }, i);
            }
            setTimeout(() => {
                img.style.opacity = '1';
            }, ms);
        }
    };
    const loadImage = (url, index) => {
        return new Promise((resolve, reject) => {
            let p = document.createElement('P');
            p.innerText = 'Loading';
            p.style.color = 'white';
            document.body.append(p);
            let img = new Image();
            img.id = 'img_' + index;
            img.src = url;
            img.style.opacity = '1';
            img.style.transition = 'opacity 500ms';
            img.width = 512; // Aped
            // If image loads, resolve promise
            img.onload = () => {
                p.remove();
                resolve(img);
            };
            // If image fails to load, reject promise
            img.onerror = () => reject(new Error('Image failed to load'));
        });
    };
    const addImageToDom = async () => {
        window.addEventListener('transitionend', () => {
            const img = document.getElementById('img_0');
            if (img) {
                img.style.transition = '';
                console.log(img.style.transition);
                img.style.opacity = '1';
                // A setTimeout of zero forces the code to wait until the next tick, rather than continuing the thread
                setTimeout(() => {
                    img.style.transition = 'opacity 500ms';
                }, 0);
            }
        });
        const image = await loadImage(images[0], 0);
        document.body.append(image);
    };
    document.body.style.backgroundColor = 'black';
    addImageToDom();
};
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
G_view_clearScreen
G_view_drawActor
G_view_drawBattle
G_view_drawRoom

G_SCALE
*/
// const SCALE = 2;
window.running = true;
const runMainLoop = () => {
    // const player = G_model_createPlayer();
    // const room = G_model_createRoomFromSprite('map_0', player);
    // G_model_setCurrentRoom(room);
    const battle = G_controller_initBattle();
    G_controller_doBattle(battle);
    const startTime = performance.now();
    let prevNow = startTime;
    const loop = (now) => {
        G_view_drawBattle(battle);
        const sixtyFpsMs = 16.666;
        const dt = now - prevNow;
        const fm = dt / sixtyFpsMs;
        G_model_setFrameMultiplier(fm > 2 ? 2 : fm);
        G_model_setElapsedMs(now - startTime);
        prevNow = now;
        // G_view_clearScreen();
        // G_controller_updateRoom(room);
        // G_view_drawRoom(room, 0, 0, G_SCALE);
        // G_view_drawActor(player.actor, G_SCALE);
        if (window.running)
            requestAnimationFrame(loop);
        // if ((window as any).running) setTimeout(loop, 22); // for debugging
    };
    loop(startTime);
};
const main = async () => {
    await G_model_loadImagesAndSprites();
    runMainLoop();
};
window.addEventListener('load', main);
const G_COLLISION_BOTTOM = 0;
const G_COLLISION_TOP = 1;
const G_COLLISION_LEFT = 2;
const G_COLLISION_RIGHT = 3;
const G_utils_to2d = (i, width) => {
    return [i % width, Math.floor(i / width)];
};
const G_utils_to1d = (x, y, width) => {
    return y * width + x;
};
const G_utils_getSign = (v) => {
    return (Math.abs(v) / v);
};
const G_utils_floorNearestMultiple = (num, multipleOf) => {
    return Math.floor((num + multipleOf / 2) / multipleOf) * multipleOf;
};
const G_utils_createRect = (x, y, w, h) => {
    return [x, y, x + w, y + h];
};
const G_utils_createPoint = (x, y) => {
    return [x, y];
};
const G_utils_pointRectCollides = (a, b) => {
    const [x, y] = a;
    const [bx, by, bx2, by2] = b;
    return x > bx && x < bx2 && y > by && y < by2;
};
const G_utils_getCollisionsWithRect = (pts, rect) => {
    return pts
        .map((pt, i) => {
        return G_utils_pointRectCollides(pt, rect) ? i : -1;
    })
        .filter(collisionSide => {
        return collisionSide > -1;
    });
};
// given a rect, returns 4 Points where each point represents the BOTTOM, TOP, LEFT, RIGHT of the given rect
const G_utils_rectToCollisionPoints = (rect) => {
    const [x1, y1, x2, y2] = rect;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const cx = x1 + dx / 2;
    const cy = y1 + dy / 2;
    return [
        G_utils_createPoint(cx, y2),
        G_utils_createPoint(cx, y1),
        G_utils_createPoint(x1 + dx / 4, cy),
        G_utils_createPoint(x2 - dx / 4, cy),
    ];
};
const G_utils_areAllUnitsDead = (units) => {
    return units.reduce((everyoneIsDead, unit) => {
        return everyoneIsDead && unit.cS.hp === 0;
    }, true);
};
const G_utils_getRandArrElem = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};
const G_utils_isAlly = (battle, unit) => {
    return battle.allies.includes(unit);
};
const G_utils_windowGetHeight = () => {
    return window.innerHeight;
};
const G_utils_windowGetWidth = () => {
    return window.innerWidth;
};
const G_utils_waitMs = async (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};
/*
global
G_model_setBattleInputEnabled
G_model_battleGetCurrentRound
G_model_actionToString
G_model_actorSetAnimState
G_model_actorSetFacing
G_model_battleAddRound
G_model_battleIncrementIndex
G_model_battleIsComplete
G_model_createActor
G_model_createBattle
G_model_createMenu
G_model_createUnit
G_model_createVerticalMenu
G_model_createRound
G_model_getBattlePostActionCb
G_model_getCurrentBattle
G_model_getScreenSize
G_model_menuSetNextCursorIndex
G_model_roundGetActingUnit
G_model_roundIncrementIndex
G_model_statsModifyHp
G_model_setCurrentBattle
G_model_setBattlePostActionCb
G_model_roundIsOver
G_model_unitLives
G_model_unitMoveForward
G_model_unitResetDef
G_model_unitResetPosition
G_view_drawBattleText
G_utils_getRandArrElem
G_utils_isAlly
G_utils_waitMs

G_ACTION_CHARGE
G_ACTION_DEFEND
G_ACTION_HEAL
G_ACTION_STRIKE
G_ALLEGIANCE_ALLY
G_ALLEGIANCE_ENEMY
G_ANIM_ATTACKING
G_ANIM_DEFAULT
G_ANIM_WALKING
G_BATTLE_MENU_LABELS
G_FACING_UP
G_FACING_UP_LEFT
G_FACING_UP_RIGHT
*/
const G_controller_initBattle = () => {
    const jimothy = G_model_createUnit('Jimothy', 100, 10, 5, 5, 5, 0, G_ALLEGIANCE_ALLY);
    const seph = G_model_createUnit('Seph', 100, 10, 5, 5, 5, 1, G_ALLEGIANCE_ALLY);
    // const kana = G_model_createUnit(
    //   'Kana',
    //   100,
    //   8,
    //   3,
    //   2,
    //   7,
    //   2,
    //   G_ALLEGIANCE_ALLY
    // );
    // const widdly2Diddly = G_model_createUnit(
    //   'widdly2Diddly',
    //   100,
    //   7,
    //   7,
    //   7,
    //   7,
    //   3,
    //   G_ALLEGIANCE_ALLY
    // );
    const karst = G_model_createUnit('Karst', 100, 10, 5, 5, 5, 0, G_ALLEGIANCE_ENEMY);
    const urien = G_model_createUnit('Urien', 100, 10, 5, 5, 5, 1, G_ALLEGIANCE_ENEMY);
    // const shreth = G_model_createUnit(
    //   'Shrike',
    //   100,
    //   8,
    //   6,
    //   3,
    //   2,
    //   2,
    //   G_ALLEGIANCE_ENEMY
    // );
    // const pDiddy = G_model_createUnit(
    //   'P Diddy',
    //   100,
    //   5,
    //   5,
    //   5,
    //   5,
    //   3,
    //   G_ALLEGIANCE_ENEMY
    // );
    const battle = G_model_createBattle([jimothy, seph], [karst, urien]);
    const firstRound = G_model_createRound([
        jimothy,
        karst,
        seph,
        urien,
    ]);
    G_model_battleAddRound(battle, firstRound);
    console.log('First Round Turn Order:', firstRound);
    G_model_setCurrentBattle(battle);
    G_model_setBattleInputEnabled(false);
    // doBattle(battle);
    return battle;
};
const G_controller_doBattle = async (battle) => {
    while (!G_model_battleIsComplete(battle)) {
        await G_controller_battleSimulateNextRound(battle); // do the fight!
    }
    console.log('Battle complete!');
    setTimeout(() => {
        G_controller_initBattle();
    }, 2000);
};
// simulates a single round of combat
const G_controller_battleSimulateNextRound = async (battle) => {
    const round = G_model_battleGetCurrentRound(battle);
    controller_roundInit(round);
    // this part is hard-coded.  We'd probably want to generalize printing a unit with a function
    while (!G_model_roundIsOver(round)) {
        console.log('Current Round Index:', round.currentIndex);
        await controller_battleSimulateTurn(battle, round);
        G_model_roundIncrementIndex(round);
    }
    const nextRound = controller_roundEnd(round);
    G_model_battleAddRound(battle, nextRound);
    G_model_battleIncrementIndex(battle);
};
const controller_battleSimulateTurn = async (battle, round) => {
    const actingUnit = G_model_roundGetActingUnit(round);
    if (!G_model_unitLives(actingUnit)) {
        round.nextTurnOrder.push(actingUnit);
        return;
    }
    if (actingUnit.cS.def !== actingUnit.bS.def) {
        G_model_unitResetDef(actingUnit);
    }
    return new Promise(resolve => {
        G_model_setBattlePostActionCb(resolve);
        const actionMenu = battle.actionMenuStack[0];
        if (G_utils_isAlly(battle, actingUnit)) {
            if (actingUnit.cS.iCnt <= 0) {
                actionMenu.disabledItems = [2, 4];
            }
            else {
                actionMenu.disabledItems = [];
            }
            actionMenu.i = -1;
            G_model_menuSetNextCursorIndex(actionMenu, 1);
            G_model_setBattleInputEnabled(true);
        }
        else {
            setTimeout(() => {
                // AI (the dumb version): select a random target and STRIKE
                const target = G_utils_getRandArrElem(battle.allies);
                G_controller_roundApplyAction(G_ACTION_STRIKE, round, target);
            }, 1000);
        }
    });
};
// at the end of this function the postAction callback is invoked to keep the battle running
const G_controller_roundApplyAction = async (action, round, target) => {
    G_model_setBattleInputEnabled(false);
    const battle = G_model_getCurrentBattle();
    const actingUnit = G_model_roundGetActingUnit(round);
    G_model_unitMoveForward(actingUnit);
    G_model_actorSetAnimState(actingUnit.actor, G_ANIM_ATTACKING);
    battle.text = G_model_actionToString(action);
    await G_utils_waitMs(1000);
    switch (action) {
        case G_ACTION_STRIKE:
            const dmg = G_controller_battleActionStrike(actingUnit, target);
            battle.text = 'Did ' + -dmg + " damage. It's somewhat effective.";
            if (!G_model_unitLives(target)) {
                const facing = G_utils_isAlly(battle, target)
                    ? G_FACING_UP_RIGHT
                    : G_FACING_UP_LEFT;
                G_model_actorSetFacing(target.actor, facing);
            }
            break;
        case G_ACTION_CHARGE:
            G_controller_battleActionCharge(actingUnit);
            break;
        case G_ACTION_DEFEND:
            G_controller_battleActionDefend(actingUnit);
            break;
        case G_ACTION_HEAL:
            G_controller_battleActionHeal(actingUnit);
            break;
        default:
            console.error('No action:', action, 'exists.');
    }
    round.nextTurnOrder.push(actingUnit);
    await G_utils_waitMs(2000);
    G_model_unitResetPosition(actingUnit);
    G_model_actorSetAnimState(actingUnit.actor, G_ANIM_DEFAULT);
    battle.text = '';
    await G_utils_waitMs(500);
    G_model_getBattlePostActionCb()(); // resolve is called here
};
const controller_roundInit = (round) => {
    console.log('Start new round:', round);
};
const controller_roundEnd = (round) => {
    return G_model_createRound(round.nextTurnOrder); // Change
};
const G_controller_battleActionStrike = (attacker, victim) => {
    const { cS, bS } = victim;
    const { def } = cS;
    const { dmg } = attacker.bS;
    const dmgDone = -Math.floor(Math.max(dmg - def, 1));
    G_model_statsModifyHp(cS, bS, dmgDone);
    console.log(`${attacker.name} strikes ${victim.name} for ${-dmgDone} damage! (${victim.cS.hp} HP remaining)`);
    // speed modification should be done here
    return dmgDone;
};
const G_controller_battleActionCharge = (unit) => {
    const { cS } = unit;
    cS.cCnt++;
    // modSpd
    // animation?
};
const G_controller_battleActionHeal = (unit) => {
    const { cS, bS } = unit;
    cS.iCnt--;
    cS.hp = bS.hp;
};
const G_controller_battleActionDefend = (unit) => {
    const { cS } = unit;
    cS.def *= 1.5;
};
// const G_controller_battleEnemyTurn = (unit: Unit) => {
// 	const {cS, bS} = unit;
// 	if (cS.cCnt === bS.mag) {
// 	}
// };
/*
This file contains logic for what happens when an event occurs: a keypress, button click, .etc
*/
/*
global
G_model_setKeyDown
G_model_setKeyUp
G_model_getCurrentBattle
G_model_getBattleInputEnabled
G_model_getCursorIndex
G_model_setCursorIndex
G_model_roundGetActingUnit
G_model_battleGetCurrentRound
G_model_menuSetNextCursorIndex
G_model_menuSelectCurrentItem
G_model_menuSelectNothing
G_view_drawMenu
G_view_drawBattle
G_controller_battleSimulateNextRound
G_controller_battleActionCharge
G_controller_battleActionHeal
*/
window.addEventListener('keydown', ev => {
    G_model_setKeyDown(ev.key);
    // console.log('KEY', ev.key);
    if (ev.key === 'q') {
        window.running = false;
    }
    if (G_model_getBattleInputEnabled()) {
        const battle = G_model_getCurrentBattle();
        const key = ev.key;
        const menu = battle.actionMenuStack[0];
        if (key === 'ArrowDown') {
            G_model_menuSetNextCursorIndex(menu, 1);
        }
        else if (key === 'ArrowUp') {
            G_model_menuSetNextCursorIndex(menu, -1);
        }
        else if (key === 'Enter') {
            G_model_menuSelectCurrentItem(menu);
        }
        else if (key === 'Escape') {
            if (battle.actionMenuStack.length > 1) {
                G_model_menuSelectNothing(menu);
            }
        }
    }
});
window.addEventListener('keyup', ev => {
    G_model_setKeyUp(ev.key);
});
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
G_model_roomGetSizePx
G_model_roomGetCollidableTiles
G_model_tileIsFullyCollidable
G_model_getFrameMultiplier
G_utils_floorNearestMultiple
G_utils_createRect
G_utils_getCollisionsWithRect
G_utils_rectToCollisionPoints
G_KEY_LEFT
G_KEY_RIGHT
G_KEY_SPACE
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
const decelerateVelocity = (actor, vel) => {
    const v = actor[vel];
    if (v < 0) {
        actor[vel] += DECELERATION_RATE;
    }
    else if (v > 0) {
        actor[vel] -= DECELERATION_RATE;
    }
    if (Math.abs(actor[vel]) <= DECELERATION_RATE) {
        actor[vel] = 0;
    }
};
const applyGravity = (actor) => {
    const fm = G_model_getFrameMultiplier();
    if (actor.isGround) {
        actor.ay += 0.0001 * fm;
    }
    else {
        actor.ay += GRAVITY_RATE * fm;
    }
};
// check collisions between this actor and all wall tiles.  If the actor is colliding,
// then move the actor towards a position that is not colliding until the actor is no
// longer colliding
const handleActorCollisions = (actor, room) => {
    let hasCollision;
    let hasCollisionWithGround = false;
    let ctr = 0;
    const collidableTiles = G_model_roomGetCollidableTiles(room);
    do {
        ctr++;
        hasCollision = false;
        const actorCollisionPoints = G_utils_rectToCollisionPoints(G_utils_createRect(actor.x, actor.y, actor.w, actor.h));
        const collisionSideMap = {
            [G_COLLISION_BOTTOM]: null,
            [G_COLLISION_TOP]: null,
            [G_COLLISION_LEFT]: null,
            [G_COLLISION_RIGHT]: null,
        };
        collidableTiles.forEach(tile => {
            const tileRect = G_utils_createRect(tile.px, tile.py, tile.size, tile.size);
            if (G_model_tileIsFullyCollidable(tile)) {
                G_utils_getCollisionsWithRect(actorCollisionPoints, tileRect).forEach(side => {
                    hasCollision = true;
                    collisionSideMap[side] = tile;
                });
            }
            else if (actor.y + actor.h / 2 < tile.py) {
                G_utils_getCollisionsWithRect(actorCollisionPoints, tileRect).forEach(side => {
                    if (side === G_COLLISION_BOTTOM) {
                        hasCollision = true;
                        collisionSideMap[side] = tile;
                    }
                });
            }
        });
        const tileBottom = collisionSideMap[G_COLLISION_BOTTOM];
        const tileTop = collisionSideMap[G_COLLISION_TOP];
        const tileLeft = collisionSideMap[G_COLLISION_LEFT];
        const tileRight = collisionSideMap[G_COLLISION_RIGHT];
        const correctionRate = 1;
        if (tileBottom) {
            actor.y = G_utils_floorNearestMultiple(actor.y, 16);
            hasCollisionWithGround = true;
        }
        else if (tileTop) {
            actor.y += correctionRate;
            actor.vy = 0;
        }
        else if (tileLeft) {
            actor.x += correctionRate;
        }
        else if (tileRight) {
            actor.x -= correctionRate;
        }
    } while (hasCollision && ctr < 10);
    if (hasCollisionWithGround !== actor.isGround && !hasCollisionWithGround) {
        actor.vy = 0;
    }
    actor.isGround = hasCollisionWithGround;
    //throw 'pizza';
};
const G_controller_updateRoom = (room) => {
    const { actors, player } = room;
    actors.forEach(actor => {
        G_controller_updateActor(actor, room);
    });
    G_controller_updatePlayer(player, room);
};
const G_controller_updatePlayer = (player, room) => {
    const { actor } = player;
    const { ax, ay, isGround } = actor;
    G_model_actorSetAnimState(actor, G_ANIM_DEFAULT);
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
        const actor = room.player.actor;
        if (actor.isGround) {
            nextAy = -PLAYER_JUMP_SPEED;
            actor.vy = 0;
            actor.isGround = false;
        }
    }
    if (!actor.isGround) {
        G_model_actorSetAnimState(actor, G_ANIM_JUMPING);
    }
    G_model_actorSetAcceleration(actor, nextAx, nextAy);
    G_controller_updateActor(actor, room);
};
const G_controller_updateActor = (actor, room) => {
    applyGravity(actor);
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
    }
    else if (newX + w > roomWidthPx) {
        newX = roomWidthPx - w;
    }
    if (newY < 0) {
        newY = 0;
    }
    else if (newY + h > roomHeightPx) {
        newY = roomHeightPx - h;
    }
    G_model_actorSetPosition(actor, newX, newY);
    handleActorCollisions(actor, room);
    if (ax === 0) {
        decelerateVelocity(actor, 'vx');
    }
    if (ay === 0) {
        decelerateVelocity(actor, 'vy');
    }
    G_model_actorSetAcceleration(actor, 0, 0);
};
/*
An Actor is an entity on the screen which is affected by gravity.
*/
/*
global
G_model_getElapsedMs
G_utils_floorNearestMultiple
G_SPRITE_MOD_FLIPPED
G_SPRITE_MOD_FLROT90
G_SPRITE_MOD_ROT90
G_SPRITE_MOD_ROT270
*/
const G_FACING_LEFT = 0;
const G_FACING_RIGHT = 1;
const G_FACING_UP_RIGHT = 2;
const G_FACING_UP_LEFT = 3;
const G_ANIM_DEFAULT = 0;
const G_ANIM_WALKING = 1;
const G_ANIM_JUMPING = 2;
const G_ANIM_ATTACKING = 3;
const G_model_createActor = (spriteIndex) => {
    return {
        sprite: 'actors',
        spriteIndex,
        facing: G_FACING_LEFT,
        anim: G_ANIM_DEFAULT,
        isGround: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        ax: 0,
        ay: 0,
        w: 16,
        h: 16,
    };
};
const G_model_actorSetFacing = (actor, facing) => {
    actor.facing = facing;
};
const G_model_actorSetPosition = (actor, x, y) => {
    actor.x = x;
    actor.y = y;
};
const G_model_actorGetPosition = (actor) => {
    return [actor.x, actor.y];
};
const G_model_actorSetVelocity = (actor, vx, vy) => {
    actor.vx = vx;
    actor.vy = vy;
};
const G_model_actorSetAcceleration = (actor, ax, ay) => {
    actor.ax = ax;
    actor.ay = ay;
};
const G_model_actorIsMoving = (actor) => {
    return actor.vx !== 0;
};
const G_model_actorGetCurrentSprite = (actor) => {
    let { facing, sprite, spriteIndex, anim } = actor;
    if (anim === G_ANIM_WALKING) {
        // alternate between two frames (anim = 1 and anim = 0) every 100 ms
        anim = (anim -
            Math.floor((G_model_getElapsedMs() % 200) / 100));
    }
    else if (anim === G_ANIM_ATTACKING) {
        anim = (2 - Math.floor((G_model_getElapsedMs() % 500) / 250));
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
    return sprite + `_${spriteIndex + anim + mod}`;
};
const G_model_actorSetAnimState = (actor, anim) => {
    actor.anim = anim;
};
/*
global
G_controller_battleActionCharge
G_controller_roundApplyAction
G_controller_unitLives
G_model_createVerticalMenu
G_model_getScreenSize
G_model_getSprite
G_model_menuSetNextCursorIndex
G_model_unitLives
G_view_drawBattle
G_view_drawMenu
G_utils_areAllUnitsDead
G_utils_isAlly
G_utils_getRandArrElem

G_ACTION_CHARGE
G_CURSOR_WIDTH
G_CURSOR_HEIGHT
*/
const G_ACTION_STRIKE = 0; // requires target
const G_ACTION_CHARGE = 1;
const G_ACTION_INTERRUPT = 2; // requires target
const G_ACTION_DEFEND = 3;
const G_ACTION_HEAL = 4;
const G_ACTION_USE = 5; // may require target
const G_ACTION_FLEE = 6;
const G_BATTLE_MENU_LABELS = [
    // make sure these indices match above
    'Strike',
    'Charge',
    'Break',
    'Defend',
    'Heal',
    'Use',
    'Flee',
];
const G_ALLEGIANCE_ALLY = 0;
const G_ALLEGIANCE_ENEMY = 1;
const G_SCALE = 2;
const playerPos = [
    [40, 70],
    [40, 100],
    [40, 130],
    [40, 160],
];
const enemyPos = [
    [200, 70],
    [200, 100],
    [200, 130],
    [200, 160],
];
const G_model_createBattle = (allies, enemies) => {
    const screenSize = G_model_getScreenSize();
    const menuWidth = 100;
    const lineHeight = 20;
    const x = screenSize / 2 - menuWidth / 2;
    const y = screenSize - lineHeight * G_BATTLE_MENU_LABELS.length;
    const actionMenuStack = [
        G_model_createVerticalMenu(x, y, menuWidth, G_BATTLE_MENU_LABELS, handleActionMenuSelected, [], true, lineHeight),
    ];
    return {
        allies,
        enemies,
        rounds: [],
        roundIndex: 0,
        actionMenuStack,
        text: '',
    };
};
const G_model_battleGetScreenPosition = (i, allegiance) => {
    return allegiance === G_ALLEGIANCE_ALLY ? playerPos[i] : enemyPos[i];
};
const selectTarget = async (battle) => {
    return new Promise(resolve => {
        const targets = battle.enemies;
        const [startX, startY] = G_model_battleGetScreenPosition(0, G_ALLEGIANCE_ENEMY);
        const x = startX * G_SCALE - G_CURSOR_WIDTH;
        const y = startY * G_SCALE - 16; // offset by -16 so the cursor is centered on the sprite
        const h = 30 * G_SCALE; // "30" is the difference in y values of the unit positions from the unit variables
        const targetMenu = G_model_createVerticalMenu(x, y, 100, // set this to 100 so I could debug by turning on the background
        Array(targets.length).fill(''), // wtf, that exists?  i never knew that...
        // this function is called when a target is selected
        (i) => {
            battle.actionMenuStack.shift(); // returns input to the last menu
            if (i >= 0) {
                resolve(targets[i]);
            }
            else {
                resolve(null);
            }
        }, battle.enemies
            .filter(unit => {
            return !G_model_unitLives(unit);
        })
            .map((_, i) => {
            return i;
        }), false, h);
        targetMenu.i = -1;
        G_model_menuSetNextCursorIndex(targetMenu, 1);
        battle.actionMenuStack.unshift(targetMenu); // transfers input to the newly-created menu
    });
};
const handleActionMenuSelected = async (i) => {
    const battle = G_model_getCurrentBattle();
    const round = G_model_battleGetCurrentRound(battle);
    switch (i) {
        case G_ACTION_STRIKE:
            // here we could 'await' target selection instead of randomly picking one
            const target = await selectTarget(battle);
            // handles the case where ESC (or back or something) is pressed while targeting
            if (!target) {
                return;
            }
            G_controller_roundApplyAction(G_ACTION_STRIKE, round, target);
            break;
        case G_ACTION_CHARGE:
            G_controller_roundApplyAction(G_ACTION_CHARGE, round, null);
            break;
        case G_ACTION_DEFEND:
            G_controller_roundApplyAction(G_ACTION_DEFEND, round, null);
            break;
        case G_ACTION_HEAL:
            G_controller_roundApplyAction(G_ACTION_HEAL, round, null);
            break;
        default:
            console.error('Action', i, 'Is not implemented yet.');
    }
};
// This global variable holds the current battle.  It should only be accessed through
// the following getters and setters
let model_currentBattle = null;
const G_model_setCurrentBattle = (battle) => {
    model_currentBattle = battle;
};
const G_model_getCurrentBattle = () => {
    return model_currentBattle;
};
let model_battleInputEnabled = false;
const G_model_setBattleInputEnabled = (v) => {
    model_battleInputEnabled = v;
};
const G_model_getBattleInputEnabled = () => {
    return model_battleInputEnabled;
};
let model_battlePostActionCb = () => { };
const G_model_setBattlePostActionCb = (cb) => {
    model_battlePostActionCb = cb;
};
const G_model_getBattlePostActionCb = () => model_battlePostActionCb;
const G_model_battleAddRound = (battle, round) => {
    battle.rounds.push(round);
};
const G_model_battleGetCurrentRound = (battle) => {
    return battle.rounds[battle.roundIndex];
};
const G_model_createRound = (turnOrder) => {
    return {
        turnOrder,
        nextTurnOrder: [],
        currentIndex: 0,
    };
};
const G_model_roundIncrementIndex = (round) => {
    round.currentIndex++;
};
const G_model_battleIncrementIndex = (battle) => {
    battle.roundIndex++;
};
const G_model_roundGetActingUnit = (round) => {
    return round.turnOrder[round.currentIndex] || null;
};
const G_model_roundIsOver = (round) => {
    return G_model_roundGetActingUnit(round) === null;
};
const G_model_battleIsComplete = (battle) => {
    return (G_utils_areAllUnitsDead(battle.enemies) ||
        G_utils_areAllUnitsDead(battle.allies));
};
const G_model_actionToString = (i) => {
    return G_BATTLE_MENU_LABELS[i];
};
/*
This file contains functions for creating and getting an HTML Canvas element
*/
/*
global
*/
let model_canvas = null;
let model_frameMultiplier = 1;
let model_elapsedMs = 0;
// Create a canvas element given a width and a height, returning a reference to the
// canvas, the rendering context, width, and height
const G_model_createCanvas = (width, height) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return [
        canvas,
        canvas.getContext('2d'),
        width,
        height,
    ];
};
// get a reference to the current canvas.  If it has not been made yet, then create it,
// append it to the body, then return a reference to it.
const G_model_getCanvas = () => {
    if (model_canvas) {
        return model_canvas;
    }
    else {
        const [canvas, ctx] = G_model_createCanvas(512, 512);
        canvas.id = 'canv';
        ctx.imageSmoothingEnabled = false;
        document.body.appendChild(canvas);
        model_canvas = canvas;
        return canvas;
    }
};
// get a reference to the current rendering context
const G_model_getCtx = () => {
    return G_model_getCanvas().getContext('2d');
};
// return the value to multiply all position and time values by in order to simulate
// rendering at a consistent speed (as if it were 60 FPS).
// Without this value, the game's physics are tied to the FPS, so a higher FPS results
// in a faster game, while lower FPS results in a slower game.
const G_model_setFrameMultiplier = (v) => {
    model_frameMultiplier = v;
};
const G_model_getFrameMultiplier = () => {
    return model_frameMultiplier;
};
const G_model_setElapsedMs = (v) => {
    model_elapsedMs = v;
};
const G_model_getElapsedMs = () => {
    return model_elapsedMs;
};
const G_model_getScreenSize = () => {
    return 512;
};
/*
This file contains functions that do something when an input is pressed.
 */
/*
global
G_model_getCurrentRoom
*/
const model_keys = {};
const G_KEY_RIGHT = 'ArrowRight';
const G_KEY_LEFT = 'ArrowLeft';
const G_KEY_UP = 'ArrowUp';
const G_KEY_DOWN = 'ArrowDown';
const G_KEY_SPACE = ' ';
const G_model_setKeyDown = (key) => {
    if (!model_keys[key]) {
        model_keys[key] = true;
    }
};
const G_model_setKeyUp = (key) => {
    model_keys[key] = false;
};
const G_model_isKeyDown = (key) => {
    return model_keys[key];
};
/*
global
G_model_actorSetFacing
G_model_actorSetPosition
G_model_getCtx
G_view_drawActor
G_view_drawText

G_FACING_RIGHT
*/
const MENU_DEFAULT_LINE_HEIGHT = 16;
const G_model_createVerticalMenu = (x, y, w, items, cb, disabledItems, bg, lineHeight) => {
    lineHeight = lineHeight || MENU_DEFAULT_LINE_HEIGHT;
    return {
        x,
        y,
        w,
        h: lineHeight * items.length,
        i: 0,
        cb,
        disabledItems,
        items,
        lineHeight,
        bg: !!bg,
    };
};
const G_model_menuSetNextCursorIndex = (menu, diff) => {
    const len = menu.items.length;
    let ctr = 0;
    let nextIndex = 0;
    let curIndex = menu.i;
    do {
        ctr++;
        if (ctr > 30) {
            break;
        }
        nextIndex = curIndex + diff;
        if (nextIndex < 0) {
            nextIndex = len - 1;
        }
        else if (nextIndex >= len) {
            nextIndex = 0;
        }
        curIndex = nextIndex;
    } while (menu.disabledItems.includes(nextIndex));
    menu.i = nextIndex;
};
const G_model_menuSelectCurrentItem = (menu) => {
    menu.cb(menu.i);
};
const G_model_menuSelectNothing = (menu) => {
    menu.cb(-1);
};
/*
 */
/*
global
G_model_createActor
G_model_actorSetPosition
*/
const PLAYER_SPRITE_INDEX = 0;
const G_model_createPlayer = () => {
    const actor = G_model_createActor(PLAYER_SPRITE_INDEX);
    G_model_actorSetPosition(actor, 0, 33);
    return {
        actor,
    };
};
/*
A Room is a collection of tiles, actors, and triggers.
*/
/*
global
G_utils_to1d
G_model_createCanvas
G_view_drawSprite
*/
let model_room = null;
// maps an rgb color (as a string) to a tile id
const colors = {
    '15610052': 0,
    '1718254': 1,
    '022854': 2,
    // ... to be added later
    '000': 15,
};
const G_model_setCurrentRoom = (room) => {
    model_room = room;
};
const G_model_getCurrentRoom = () => {
    return model_room;
};
const G_model_createRoomFromSprite = (spriteName, player) => {
    const tiles = [];
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
const G_model_roomGetSizePx = (room) => {
    return [room.w * 16, room.h * 16];
};
const G_model_roomGetCollidableTiles = (room, actor) => {
    return room.tiles.filter(tile => {
        return [0, 1, 2].includes(tile.id);
    });
};
const G_model_tileIsFullyCollidable = (tile) => {
    return [0, 1].includes(tile.id);
};
/*
This file handles operations related to Sprites: loading them and getting info about them.
A Sprite is a sub-image of a parent image.  The sub image is represented by a rectangle
within the parent image (the four numbers: x, y, width, height).
*/
/*
global
G_controller_unitLives
G_model_createCanvas
G_model_getCurrentBattle
G_utils_isAlly
G_view_drawSprite
*/
const createSprite = (img, x, y, w, h) => {
    return [img, x, y, w, h];
};
const G_SPRITE_MOD_NORMAL = '';
const G_SPRITE_MOD_FLIPPED = '_f';
const G_SPRITE_MOD_ROT90 = '_r1';
const G_SPRITE_MOD_ROT180 = '_r2';
const G_SPRITE_MOD_ROT270 = '_r3';
const G_SPRITE_MOD_FLROT90 = '_fr1';
let model_sprites = null;
// given an inputCanvas, return a new canvas rotated to the right by 90 degrees
const createRotatedImg = (inputCanvas) => {
    const [canvas, ctx, width, height] = G_model_createCanvas(inputCanvas.width, inputCanvas.height);
    const x = width / 2;
    const y = height / 2;
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(inputCanvas, -x, -y);
    return canvas;
};
// given an inputCanvas, return a new canvas flipped horizontally
const createFlippedImg = (inputCanvas) => {
    const [canvas, ctx, width] = G_model_createCanvas(inputCanvas.width, inputCanvas.height);
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(inputCanvas, 0, 0);
    return canvas;
};
// given a Sprite, create and return a new image from the sprite
const spriteToCanvas = (sprite) => {
    const [, , , spriteWidth, spriteHeight] = sprite;
    const [canvas, ctx] = G_model_createCanvas(spriteWidth, spriteHeight);
    G_view_drawSprite(sprite, 0, 0, 1, ctx);
    return canvas;
};
// load a set of sprites from an image, each sprite loaded with also have a set of rotated
// and flipped variants
const loadSpritesFromImage = (spriteMap, // collection in which to put created sprites
image, // parent image
spritePrefix, // created sprites are named <spritePrefix>_<index>
spriteWidth, spriteHeight) => {
    const addSprite = (name, image, x, y, w, h) => {
        return (spriteMap[name] = createSprite(image, x, y, w, h));
    };
    const addRotatedSprite = (sprite, baseSpriteName, n) => {
        let rotated = sprite;
        for (let i = 0; i < n; i++) {
            rotated = createRotatedImg(rotated);
        }
        addSprite(`${baseSpriteName}_r${n}`, rotated, 0, 0, spriteWidth, spriteHeight);
    };
    const numColumns = image.width / spriteWidth;
    const numRows = image.height / spriteHeight;
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
            // create original sprite: <baseSpriteName>
            const baseSpriteName = `${spritePrefix}_${i * numColumns + j}`;
            const sprite = addSprite(baseSpriteName, image, j * spriteWidth, i * spriteHeight, spriteWidth, spriteHeight);
            // create rotated sprites:<baseSpriteName>_rN
            addRotatedSprite(spriteToCanvas(sprite), baseSpriteName, 1);
            addRotatedSprite(spriteToCanvas(sprite), baseSpriteName, 2);
            addRotatedSprite(spriteToCanvas(sprite), baseSpriteName, 3);
            // create flipped sprite: <baseSpriteName>_f
            addSprite(`${baseSpriteName}${G_SPRITE_MOD_FLIPPED}`, createFlippedImg(spriteToCanvas(sprite)), 0, 0, spriteWidth, spriteHeight);
            addSprite(`${baseSpriteName}${G_SPRITE_MOD_FLROT90}`, createRotatedImg(createFlippedImg(spriteToCanvas(sprite))), 0, 0, spriteWidth, spriteHeight);
        }
    }
};
const loadImage = (imagePath) => {
    return new Promise(resolve => {
        const img = new Image();
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
    const topLeftSpritesheet = spriteToCanvas(createSprite(baseImage, 0, 0, spriteSheetWidth, spriteSheetHeight));
    loadSpritesFromImage(spriteMap, topLeftSpritesheet, 'actors', 16, 16);
    const topRightSpritesheet = spriteToCanvas(createSprite(baseImage, spriteSheetWidth, 0, spriteSheetWidth, spriteSheetHeight));
    loadSpritesFromImage(spriteMap, topRightSpritesheet, 'terrain', 16, 16);
    const bottomLeftSpritesheet = spriteToCanvas(createSprite(baseImage, 0, spriteSheetHeight, spriteSheetWidth, spriteSheetHeight));
    loadSpritesFromImage(spriteMap, bottomLeftSpritesheet, 'map', 16, 16);
    model_sprites = spriteMap;
};
// get a Sprite given a sprite name
const G_model_getSprite = (spriteName) => model_sprites[spriteName];
const G_model_getSpriteSize = () => 16;
/*
global
G_model_actorSetFacing
G_model_actorSetPosition
G_model_battleGetScreenPosition
G_model_createActor
G_FACING_LEFT
G_FACING_RIGHT
*/
const model_createStats = (hp, dmg, def, mag, spd) => {
    return { hp, dmg, def, mag, spd, iCnt: mag, cCnt: 0 };
};
const G_model_createUnit = (name, hp, dmg, def, mag, spd, i, allegiance, actor) => {
    actor = actor || G_model_createActor(0);
    allegiance
        ? G_model_actorSetFacing(actor, G_FACING_LEFT)
        : G_model_actorSetFacing(actor, G_FACING_RIGHT);
    const unit = {
        name,
        bS: model_createStats(hp, dmg, def, mag, spd),
        cS: model_createStats(hp, dmg, def, mag, spd),
        actor,
        i,
        allegiance,
    };
    G_model_unitResetPosition(unit);
    return unit;
};
const G_model_statsModifyHp = (currentStats, baseStats, val) => {
    const { hp: chp } = currentStats;
    const { hp: bhp } = baseStats;
    let nextHp = chp + val;
    if (nextHp > bhp) {
        nextHp = bhp;
    }
    else if (nextHp < 0) {
        nextHp = 0;
    }
    currentStats.hp = nextHp;
};
const G_model_unitMoveForward = (unit) => {
    const { allegiance } = unit;
    const [x, y] = G_model_battleGetScreenPosition(unit.i, allegiance);
    G_model_actorSetPosition(unit.actor, x + (allegiance ? -50 : 50), y);
};
const G_model_unitResetPosition = (unit) => {
    const [x, y] = G_model_battleGetScreenPosition(unit.i, unit.allegiance);
    G_model_actorSetPosition(unit.actor, x, y);
};
const G_model_unitLives = (unit) => {
    if (unit.cS.hp > 0) {
        return true;
    }
    return false;
};
const G_model_unitGainCharge = (unit) => {
    unit.cS.cCnt++;
};
const G_model_unitResetDef = (unit) => {
    unit.cS.def = unit.bS.def;
};
//draw.ts
/*
This file contains functions that can draw things on the screen
*/
/*
global
G_model_actorSetPosition
G_model_actorGetCurrentSprite
G_model_actorGetPosition
G_model_actorSetFacing
G_model_battleGetCurrentRound
G_model_battleGetScreenPosition
G_model_getCanvas
G_model_getCtx
G_model_getBattleInputEnabled
G_model_getSprite
G_model_roundGetActingUnit
G_view_drawBattleText
G_view_drawInfo
G_view_drawMenu

G_ALLEGIANCE_ALLY
G_ALLEGIANCE_ENEMY
G_FACING_LEFT
G_FACING_RIGHT
BATTLE_MENU
*/
const G_BLACK = '#000';
const G_WHITE = '#FFF';
const DEFAULT_TEXT_PARAMS = {
    font: 'monospace',
    color: '#fff',
    size: 14,
    align: 'left',
};
// for(let i = 70; i <= 160; i+=30)
const gradientCache = {};
const G_view_clearScreen = () => {
    const canvas = G_model_getCanvas();
    G_view_drawVerticalGradient(0, 0, canvas.width, canvas.height, '#557', '#aaf');
};
const G_view_drawRect = (x, y, w, h, color, stroke, ctx) => {
    ctx = ctx || G_model_getCtx();
    ctx[stroke ? 'strokeStyle' : 'fillStyle'] = color;
    ctx[stroke ? 'strokeRect' : 'fillRect'](x, y, w, h);
};
const G_view_drawText = (text, x, y, textParams, ctx) => {
    const { font, size, color, align } = Object.assign(Object.assign({}, DEFAULT_TEXT_PARAMS), (textParams || {}));
    ctx = ctx || G_model_getCtx();
    ctx.font = `${size}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
};
const G_view_drawVerticalGradient = (x, y, w, h, colorStart, colorStop) => {
    const ctx = G_model_getCtx();
    const key = `${x},${y},${w},${h},${colorStart},${colorStop}`;
    if (!gradientCache[key]) {
        const grd = ctx.createLinearGradient(0, h, 0, 0);
        grd.addColorStop(0, colorStart);
        grd.addColorStop(1, colorStop);
        gradientCache[key] = grd;
    }
    ctx.fillStyle = gradientCache[key];
    ctx.fillRect(x, y, w, h);
};
const G_view_drawSprite = (sprite, x, y, scale, ctx) => {
    scale = scale || 1;
    ctx = ctx || G_model_getCtx();
    const [image, sprX, sprY, sprW, sprH] = typeof sprite === 'string' ? G_model_getSprite(sprite) : sprite;
    ctx.drawImage(image, sprX, sprY, sprW, sprH, x, y, sprW * scale, sprH * scale);
};
const G_view_drawRoom = (room, x, y, scale) => {
    scale = scale || 1;
    room.tiles.forEach(tile => {
        const { id, x: tx, y: ty, size } = tile;
        if (id < 15) {
            const tileSprite = `terrain_${id}`;
            G_view_drawSprite(tileSprite, (x + tx * size) * scale, (y + ty * size) * scale, scale);
        }
    });
};
const G_view_drawActor = (actor, scale) => {
    scale = scale || 1;
    const { x, y } = actor;
    const px = x * scale;
    const py = y * scale;
    const sprite = G_model_actorGetCurrentSprite(actor);
    G_view_drawSprite(sprite, px, py, scale);
};
const G_view_drawBattle = (battle) => {
    G_view_clearScreen();
    G_view_drawText(`Round: ${battle.roundIndex + 1}`, 10, 40);
    const actingUnit = G_model_roundGetActingUnit(G_model_battleGetCurrentRound(battle));
    G_view_drawText(`Turn: ${actingUnit === null || actingUnit === void 0 ? void 0 : actingUnit.name}`, 10, 60);
    const { allies, enemies, actionMenuStack } = battle;
    const actionMenu = actionMenuStack[0];
    for (let i = 0; i < allies.length; i++) {
        const [x, y] = G_model_actorGetPosition(allies[i].actor);
        // const [x, y] = G_model_battleGetScreenPosition(i, G_ALLEGIANCE_ALLY);
        G_model_actorSetPosition(allies[i].actor, x, y);
        G_view_drawActor(allies[i].actor, 2);
        G_view_drawText(`${allies[i].name}`, x * 2 + 16, y * 2 - 5, {
            align: 'center',
        });
    }
    G_view_drawInfo(battle, G_ALLEGIANCE_ALLY);
    G_view_drawInfo(battle, G_ALLEGIANCE_ENEMY);
    for (let i = 0; i < enemies.length; i++) {
        // const [x, y] = G_model_battleGetScreenPosition(i, G_ALLEGIANCE_ENEMY);
        const [x, y] = G_model_actorGetPosition(enemies[i].actor);
        // G_model_actorSetPosition(enemies[i].actor, x, y);
        G_view_drawActor(enemies[i].actor, 2);
        G_view_drawText(`${enemies[i].name}: ${enemies[i].cS.hp.toString()}/${enemies[i].bS.hp.toString()}`, x * 2 + 5, y * 2 - 5, {
            align: 'center',
        });
    }
    if (G_model_getBattleInputEnabled()) {
        G_view_drawMenu(actionMenu);
    }
    if (battle.text) {
        console.log('Battle Text:', battle.text);
        G_view_drawBattleText(battle.text);
    }
};
/*
global
G_model_getCtx
G_model_getScreenSize
G_view_drawRect
G_view_drawText

G_ALLEGIANCE_ALLY
G_ALLEGIANCE_ENEMY
G_BLACK
G_WHITE
*/
const G_CURSOR_WIDTH = 16;
const G_CURSOR_HEIGHT = 16;
const G_view_drawUiBackground = (x, y, w, h) => {
    G_view_drawRect(x, y, w, h, G_BLACK);
    G_view_drawRect(x, y, w, h, G_WHITE, true);
};
// const G_view_drawMenuCursor = (x: number, y: number) => {
//   const ctx = G_model_getCtx();
//   const cursorHeight = G_CURSOR_HEIGHT;
//   const cursorWidth = G_CURSOR_WIDTH;
//   ctx.save();
//   ctx.translate(x - G_CURSOR_WIDTH / 2, y - G_CURSOR_HEIGHT / 2);
//   ctx.beginPath();
//   ctx.moveTo(0, 0);
//   ctx.lineTo(0, cursorHeight);
//   ctx.lineTo(cursorWidth, cursorHeight / 2);
//   ctx.closePath();
//   ctx.fillStyle = G_WHITE;
//   ctx.fill();
//   ctx.restore();
// };
// const G_view_drawDblCursor = (x: number, y: number, w: number, lh: number) => {
//   const ctx = G_model_getCtx();
//   const cursorHeight = G_CURSOR_HEIGHT / 2;
//   const cursorWidth = G_CURSOR_WIDTH / 2;
//   ctx.save();
//   ctx.translate(x, y);
//   ctx.beginPath();
//   ctx.moveTo(w / 12, lh / 4);
//   ctx.lineTo(w / 12, (lh * 3) / 4);
//   ctx.lineTo(w / 8, lh / 2);
//   ctx.closePath();
//   ctx.fillStyle = G_WHITE;
//   ctx.fill();
//   ctx.beginPath();
//   ctx.moveTo((w * 11) / 12, lh / 4);
//   ctx.lineTo((w * 11) / 12, (lh * 3) / 4);
//   ctx.lineTo((w * 7) / 8, lh / 2);
//   ctx.closePath();
//   ctx.fillStyle = G_WHITE;
//   ctx.fill();
//   ctx.restore();
// };
const G_view_drawCursorIn = (x, y, w, h) => {
    const ctx = G_model_getCtx();
    const cursorHeight = G_CURSOR_HEIGHT;
    const cursorWidth = G_CURSOR_WIDTH;
    ctx.save();
    ctx.translate(x + 2, y);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, cursorHeight);
    ctx.lineTo(cursorWidth, cursorHeight / 2);
    ctx.closePath();
    ctx.fillStyle = G_WHITE;
    ctx.fill();
    ctx.restore();
};
const G_view_drawMenu = (menu) => {
    const { x, y, w, h, i, bg, items, lineHeight: lh } = menu;
    if (bg) {
        G_view_drawUiBackground(x, y, w, h);
    }
    items.forEach((label, ind) => {
        let color = G_WHITE;
        if (menu.disabledItems.includes(ind)) {
            color = '#999';
        }
        G_view_drawText(label, x + w / 2, y + ind * lh + lh / 2, {
            align: 'center',
            color,
        });
    });
    // G_view_drawMenuCursor(x - G_CURSOR_WIDTH, y + i * lh + lh / 2);
    // G_view_drawDblCursor(x, y + lh * i, w, lh);
    G_view_drawCursorIn(x, y + lh * i, w, lh);
};
const G_view_drawBattleText = (text) => {
    const x = 0;
    const y = 0;
    const w = G_model_getScreenSize();
    const h = 30;
    G_view_drawUiBackground(x, y, w, h);
    G_view_drawText(text, G_model_getScreenSize() / 2, 16, {
        align: 'center',
    });
};
const G_view_drawHeaders = (x, y) => {
    const screenSize = G_model_getScreenSize();
    const w = 200;
    // const x = 0;
    const h = 25;
    const y2 = y - h;
    G_view_drawUiBackground(x, y2, w, h);
    G_view_drawText('Unit', x + 10, y2 + h / 2);
    G_view_drawText('HP', x + 80, y2 + h / 2);
    G_view_drawText('Chg', x + 140, y2 + h / 2);
    G_view_drawText('Int', x + 170, y2 + h / 2);
};
const G_view_drawInfo = (battle, allegiance) => {
    // For players, contains name, HP, currentCharge
    const lineHeight = 20;
    const screenSize = G_model_getScreenSize();
    const w = 200;
    const h = 90;
    const x = allegiance === G_ALLEGIANCE_ENEMY ? screenSize - w : 0;
    const y = screenSize - 90;
    G_view_drawUiBackground(x, y, w, h);
    G_view_drawHeaders(0, y);
    const units = allegiance === G_ALLEGIANCE_ENEMY ? battle.enemies : battle.allies;
    for (let i = 0; i < units.length; i++) {
        const unit = units[i];
        const { name, bS, cS } = unit;
        if (allegiance === G_ALLEGIANCE_ALLY) {
            G_view_drawText(name.slice(0, 8), x + 10, y + 15 + lineHeight * i);
            G_view_drawText(`${cS.hp}/${bS.hp}`, x + 80, y + 15 + lineHeight * i);
            G_view_drawText(`${cS.cCnt}`, x + 145, y + 15 + lineHeight * i);
            G_view_drawText(`${cS.iCnt}`, x + 175, y + 15 + lineHeight * i);
        }
        else {
            G_view_drawText(name.slice(0, 8), x + w / 2, y + 15 + lineHeight * i, {
                align: 'center',
            });
        }
    }
};
//# sourceMappingURL=main.js.map