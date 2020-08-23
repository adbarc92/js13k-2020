window.running = true;
const runMainLoop = () => {
    const player = G_model_createPlayer();
    const room = G_model_createRoomFromSprite('map_0', player);
    G_model_setCurrentRoom(room);
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
        G_controller_updateRoom(room);
        G_view_drawRoom(room, 0, 0, G_SCALE);
        G_view_drawActor(player.actor, G_SCALE);
        if (window.running)
            requestAnimationFrame(loop);
    };
    loop(startTime);
};
const main = async () => {
    await G_model_loadImagesAndSprites();
    G_model_loadSounds();
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
const G_controller_initBattle = () => {
    const jimothy = G_model_createUnit('Jimothy', 100, 10, 5, 5, 5, 0, G_ALLEGIANCE_ALLY);
    const seph = G_model_createUnit('Seph', 100, 10, 5, 5, 5, 1, G_ALLEGIANCE_ALLY);
    const karst = G_model_createUnit('Karst', 100, 10, 5, 5, 5, 0, G_ALLEGIANCE_ENEMY);
    const urien = G_model_createUnit('Urien', 100, 10, 5, 5, 5, 1, G_ALLEGIANCE_ENEMY);
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
    return battle;
};
const G_controller_doBattle = async (battle) => {
    while (!G_model_battleIsComplete(battle)) {
        await G_controller_battleSimulateNextRound(battle);
    }
    console.log('Battle complete!');
    setTimeout(() => {
        G_controller_initBattle();
    }, 2000);
};
const G_controller_battleSimulateNextRound = async (battle) => {
    const round = G_model_battleGetCurrentRound(battle);
    controller_roundInit(round);
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
                const target = G_utils_getRandArrElem(battle.allies);
                G_controller_roundApplyAction(G_ACTION_STRIKE, round, target);
            }, 1000);
        }
    });
};
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
    G_model_getBattlePostActionCb()();
};
const controller_roundInit = (round) => {
    console.log('Start new round:', round);
};
const controller_roundEnd = (round) => {
    return G_model_createRound(round.nextTurnOrder);
};
const G_controller_battleActionStrike = (attacker, victim) => {
    const { cS, bS } = victim;
    const { def } = cS;
    const { dmg } = attacker.bS;
    const dmgDone = -Math.floor(Math.max(dmg - def, 1));
    G_model_statsModifyHp(cS, bS, dmgDone);
    console.log(`${attacker.name} strikes ${victim.name} for ${-dmgDone} damage! (${victim.cS.hp} HP remaining)`);
    return dmgDone;
};
const G_controller_battleActionCharge = (unit) => {
    const { cS } = unit;
    cS.cCnt++;
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
window.addEventListener('keydown', ev => {
    G_model_setKeyDown(ev.key);
    if (ev.key === 'q') {
        window.running = false;
    }
    if (G_model_getBattleInputEnabled()) {
        const battle = G_model_getCurrentBattle();
        const key = ev.key;
        const menu = battle.actionMenuStack[0];
        if (key === 'ArrowDown') {
            G_model_menuSetNextCursorIndex(menu, 1);
            G_view_playSound('menuMove');
        }
        else if (key === 'ArrowUp') {
            G_model_menuSetNextCursorIndex(menu, -1);
            G_view_playSound('menuMove');
        }
        else if (key === 'Enter') {
            G_model_menuSelectCurrentItem(menu);
            G_view_playSound('menuConfirm');
        }
        else if (key === 'Escape') {
            if (battle.actionMenuStack.length > 1) {
                G_view_playSound('menuCancel');
                G_model_menuSelectNothing(menu);
            }
        }
    }
});
window.addEventListener('keyup', ev => {
    G_model_setKeyUp(ev.key);
});
const PLAYER_SPEED = 1.2;
const PLAYER_JUMP_SPEED = 5.1;
const AIR_CONTROL_DIVISOR = 30;
const MAX_SPEED_X = 1.2;
const MAX_SPEED_Y = 3.2;
const DECELERATION_RATE = 1.2;
const GRAVITY_RATE = 0.2;
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
var zzfx, zzfxV, zzfxX;
zzfxV = 0.3;
zzfx;
(zzfx = (t = 1, a = 0.05, n = 220, e = 0, f = 0, h = 0.1, M = 0, r = 1, z = 0, o = 0, i = 0, s = 0, u = 0, x = 0, c = 0, d = 0, X = 0, b = 1, m = 0, l = 44100, B = 99 + e * l, C = f * l, P = h * l, g = m * l, w = X * l, A = 2 * Math.PI, D = t => (0 < t ? 1 : -1), I = B + g + C + P + w, S = (z *= (500 * A) / l ** 2), V = (n *= ((1 + 2 * a * Math.random() - a) * A) / l), j = (D(c) * A) / 4, k = 0, p = 0, q = 0, v = 0, y = 0, E = 0, F = 1, G = [], H = zzfxX.createBufferSource(), J = zzfxX.createBuffer(1, I, l)) => {
    for (H.connect(zzfxX.destination); q < I; G[q++] = E)
        ++y > 100 * d &&
            ((y = 0),
                (E = k * n * Math.sin((p * c * A) / l - j)),
                (E =
                    D((E = M
                        ? 1 < M
                            ? 2 < M
                                ? 3 < M
                                    ? Math.sin((E % A) ** 3)
                                    : Math.max(Math.min(Math.tan(E), 1), -1)
                                : 1 - (((((2 * E) / A) % 2) + 2) % 2)
                            : 1 - 4 * Math.abs(Math.round(E / A) - E / A)
                        : Math.sin(E))) *
                        Math.abs(E) ** r *
                        t *
                        zzfxV *
                        (q < B
                            ? q / B
                            : q < B + g
                                ? 1 - ((q - B) / g) * (1 - b)
                                : q < B + g + C
                                    ? b
                                    : q < I - w
                                        ? ((I - q - w) / P) * b
                                        : 0)),
                (E = w
                    ? E / 2 +
                        (w > q ? 0 : ((q < I - w ? 1 : (q - I) / w) * G[(q - w) | 0]) / 2)
                    : E)),
            (k += 1 - x + ((1e9 * (Math.sin(q) + 1)) % 2) * x),
            (p += 1 - x + ((1e9 * (Math.sin(q) ** 2 + 1)) % 2) * x),
            (n += z += (500 * o * A) / l ** 3),
            F && ++F > s * l && ((n += (i * A) / l), (V += (i * A) / l), (F = 0)),
            u && ++v > u * l && ((n = V), (z = S), (v = 1), (F = F || 1));
    return J.getChannelData(0).set(G), (H.buffer = J), H.start(), H;
}),
    (zzfxX = new AudioContext());
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
        case 2:
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
const G_ACTION_STRIKE = 0;
const G_ACTION_CHARGE = 1;
const G_ACTION_INTERRUPT = 2;
const G_ACTION_DEFEND = 3;
const G_ACTION_HEAL = 4;
const G_ACTION_USE = 5;
const G_ACTION_FLEE = 6;
const G_BATTLE_MENU_LABELS = [
    'Strike',
    'Charge',
    'Interrupt',
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
        const y = startY * G_SCALE - 16;
        const h = 30 * G_SCALE;
        const targetMenu = G_model_createVerticalMenu(x, y, 100, Array(targets.length).fill(''), (i) => {
            battle.actionMenuStack.shift();
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
        battle.actionMenuStack.unshift(targetMenu);
    });
};
const handleActionMenuSelected = async (i) => {
    const battle = G_model_getCurrentBattle();
    const round = G_model_battleGetCurrentRound(battle);
    switch (i) {
        case G_ACTION_STRIKE:
            const target = await selectTarget(battle);
            if (!target) {
                return;
            }
            G_view_playSound('actionStrike');
            G_controller_roundApplyAction(G_ACTION_STRIKE, round, target);
            break;
        case G_ACTION_CHARGE:
            G_view_playSound('actionCharge');
            G_controller_roundApplyAction(G_ACTION_CHARGE, round, null);
            break;
        case G_ACTION_DEFEND:
            G_view_playSound('actionDefend');
            G_controller_roundApplyAction(G_ACTION_DEFEND, round, null);
            break;
        case G_ACTION_HEAL:
            G_controller_roundApplyAction(G_ACTION_HEAL, round, null);
            break;
        default:
            console.error('Action', i, 'Is not implemented yet.');
    }
};
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
let model_canvas = null;
let model_frameMultiplier = 1;
let model_elapsedMs = 0;
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
const G_model_getCtx = () => {
    return G_model_getCanvas().getContext('2d');
};
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
const PLAYER_SPRITE_INDEX = 0;
const G_model_createPlayer = () => {
    const actor = G_model_createActor(PLAYER_SPRITE_INDEX);
    G_model_actorSetPosition(actor, 0, 33);
    return {
        actor,
    };
};
let model_room = null;
const colors = {
    '15610052': 0,
    '1718254': 1,
    '022854': 2,
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
const createRotatedImg = (inputCanvas) => {
    const [canvas, ctx, width, height] = G_model_createCanvas(inputCanvas.width, inputCanvas.height);
    const x = width / 2;
    const y = height / 2;
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(inputCanvas, -x, -y);
    return canvas;
};
const createFlippedImg = (inputCanvas) => {
    const [canvas, ctx, width] = G_model_createCanvas(inputCanvas.width, inputCanvas.height);
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(inputCanvas, 0, 0);
    return canvas;
};
const spriteToCanvas = (sprite) => {
    const [, , , spriteWidth, spriteHeight] = sprite;
    const [canvas, ctx] = G_model_createCanvas(spriteWidth, spriteHeight);
    G_view_drawSprite(sprite, 0, 0, 1, ctx);
    return canvas;
};
const loadSpritesFromImage = (spriteMap, image, spritePrefix, spriteWidth, spriteHeight) => {
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
            const baseSpriteName = `${spritePrefix}_${i * numColumns + j}`;
            const sprite = addSprite(baseSpriteName, image, j * spriteWidth, i * spriteHeight, spriteWidth, spriteHeight);
            addRotatedSprite(spriteToCanvas(sprite), baseSpriteName, 1);
            addRotatedSprite(spriteToCanvas(sprite), baseSpriteName, 2);
            addRotatedSprite(spriteToCanvas(sprite), baseSpriteName, 3);
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
const G_model_getSprite = (spriteName) => model_sprites[spriteName];
const G_model_getSpriteSize = () => 16;
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
const G_BLACK = '#000';
const G_WHITE = '#FFF';
const DEFAULT_TEXT_PARAMS = {
    font: 'monospace',
    color: '#fff',
    size: 14,
    align: 'left',
};
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
        G_model_actorSetPosition(allies[i].actor, x, y);
        G_view_drawActor(allies[i].actor, 2);
        G_view_drawText(`${allies[i].name}`, x * 2 + 16, y * 2 - 5, {
            align: 'center',
        });
    }
    G_view_drawInfo(battle, G_ALLEGIANCE_ALLY);
    G_view_drawInfo(battle, G_ALLEGIANCE_ENEMY);
    for (let i = 0; i < enemies.length; i++) {
        const [x, y] = G_model_actorGetPosition(enemies[i].actor);
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
let model_sounds = null;
const loadSound = (soundMap, key, soundArr) => {
    soundMap[key] = soundArr;
};
const G_model_loadSounds = () => {
    const soundMap = {};
    loadSound(soundMap, 'menuMove', [
        ,
        ,
        1964,
        ,
        ,
        0.08,
        1,
        2.14,
        ,
        ,
        462,
        0.01,
        ,
        ,
        ,
        ,
        ,
        ,
        0.02,
    ]);
    loadSound(soundMap, 'menuConfirm', [
        ,
        ,
        1469,
        ,
        ,
        0.08,
        ,
        0.14,
        56,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        0.04,
        ,
        0.04,
    ]);
    loadSound(soundMap, 'menuCancel', [
        ,
        ,
        484,
        0.04,
        ,
        0.08,
        3,
        0.12,
        74,
        ,
        57,
        0.2,
        ,
        ,
        -8.8,
        ,
        ,
        ,
        0.02,
    ]);
    loadSound(soundMap, 'menuCancel', [
        ,
        ,
        889,
        ,
        ,
        0.09,
        ,
        1.47,
        3.7,
        ,
        16,
        0.12,
        -0.01,
        ,
        -7,
        0.1,
        ,
        0.74,
        0.01,
    ]);
    loadSound(soundMap, 'jump', [
        ,
        ,
        223,
        0.01,
        0.1,
        0.22,
        1,
        1.35,
        0.1,
        ,
        ,
        ,
        ,
        0.4,
        ,
        ,
        ,
        0.55,
        0.09,
    ]);
    loadSound(soundMap, 'explosion', [
        ,
        ,
        518,
        0.01,
        0.05,
        1.59,
        4,
        1.24,
        0.5,
        0.4,
        ,
        ,
        ,
        0.3,
        ,
        0.7,
        0.13,
        0.58,
        0.01,
    ]);
    loadSound(soundMap, 'actionStrike', [
        ,
        ,
        224,
        ,
        0.08,
        0.17,
        4,
        1.12,
        4.7,
        -4.2,
        ,
        ,
        ,
        1.6,
        -0.9,
        0.1,
        0.01,
        0.82,
        0.01,
    ]);
    loadSound(soundMap, 'actionCharge', [
        ,
        ,
        978,
        0.06,
        0.47,
        0.82,
        ,
        1.45,
        9.6,
        ,
        23,
        0.03,
        0.1,
        ,
        ,
        0.1,
        ,
        0.92,
        0.08,
    ]);
    loadSound(soundMap, 'actionDefend', [
        ,
        ,
        1396,
        ,
        0.1,
        0.14,
        1,
        0.91,
        ,
        ,
        ,
        ,
        ,
        0.1,
        ,
        0.1,
        ,
        0.71,
        0.07,
    ]);
    model_sounds = soundMap;
};
const G_view_playSound = (soundName) => {
    zzfx(...model_sounds[soundName]);
};
const G_CURSOR_WIDTH = 16;
const G_CURSOR_HEIGHT = 16;
const G_view_drawUiBackground = (x, y, w, h) => {
    G_view_drawRect(x, y, w, h, G_BLACK);
    G_view_drawRect(x, y, w, h, G_WHITE, true);
};
const G_view_drawMenuCursor = (x, y) => {
    const ctx = G_model_getCtx();
    const cursorHeight = G_CURSOR_HEIGHT;
    const cursorWidth = G_CURSOR_WIDTH;
    ctx.save();
    ctx.translate(x - G_CURSOR_WIDTH / 2, y - G_CURSOR_HEIGHT / 2);
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
    G_view_drawMenuCursor(x - G_CURSOR_WIDTH, y + i * lh + lh / 2);
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
    const h = 25;
    const y2 = y - h;
    G_view_drawUiBackground(x, y2, w, h);
    G_view_drawText('Unit', x + 10, y2 + h / 2);
    G_view_drawText('HP', x + 80, y2 + h / 2);
    G_view_drawText('Chg', x + 140, y2 + h / 2);
    G_view_drawText('Int', x + 170, y2 + h / 2);
};
const G_view_drawInfo = (battle, allegiance) => {
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
