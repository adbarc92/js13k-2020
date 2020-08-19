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
G_model_unitResetPosition
G_view_drawBattleText
G_utils_getRandArrElem
G_utils_isAlly
G_utils_waitMs

G_ACTION_STRIKE
G_ACTION_HEAL
G_ALLEGIANCE_ALLY
G_ALLEGIANCE_ENEMY
G_ANIM_ATTACKING
G_ACTION_CHARGE
G_ANIM_DEFAULT
G_ANIM_WALKING
G_BATTLE_MENU_LABELS
G_FACING_UP
G_FACING_UP_LEFT
G_FACING_UP_RIGHT
*/

const G_controller_initBattle = () => {
  const jimothy = G_model_createUnit(
    'Jimothy',
    100,
    200,
    5,
    5,
    5,
    0,
    G_ALLEGIANCE_ALLY
  );
  const seph = G_model_createUnit(
    'Seph',
    100,
    2,
    4,
    3,
    1,
    1,
    G_ALLEGIANCE_ALLY
  );
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

  const karst = G_model_createUnit(
    'Karst',
    100,
    4,
    4,
    3,
    5,
    0,
    G_ALLEGIANCE_ENEMY
  );
  const urien = G_model_createUnit(
    'Urien',
    100,
    20,
    4,
    3,
    2,
    1,
    G_ALLEGIANCE_ENEMY
  );
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
    // kana,
    // shreth,
    // widdly2Diddly,
    // pDiddy,
  ]);

  G_model_battleAddRound(battle, firstRound);
  console.log('First Round Turn Order:', firstRound);
  G_model_setCurrentBattle(battle);
  G_model_setBattleInputEnabled(false);
  // doBattle(battle);
  return battle;
};

const G_controller_doBattle = async (battle: Battle) => {
  while (!G_model_battleIsComplete(battle)) {
    await G_controller_battleSimulateNextRound(battle); // do the fight!
  }
  console.log('Battle complete!');
  setTimeout(() => {
    G_controller_initBattle();
  }, 2000);
};

// simulates a single round of combat
const G_controller_battleSimulateNextRound = async (battle: Battle) => {
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

const controller_battleSimulateTurn = async (
  battle: Battle,
  round: Round
): Promise<void> => {
  const actingUnit = G_model_roundGetActingUnit(round) as Unit;
  if (!G_model_unitLives(actingUnit)) {
    round.nextTurnOrder.push(actingUnit);
    return;
  }
  return new Promise(resolve => {
    G_model_setBattlePostActionCb(resolve);
    const actionMenu = battle.actionMenuStack[0];
    if (G_utils_isAlly(battle, actingUnit)) {
      if (actingUnit.cS.cCnt <= 0) {
        actionMenu.disabledItems = [2, 4];
      } else {
        actionMenu.disabledItems = [];
      }
      actionMenu.i = -1;
      G_model_menuSetNextCursorIndex(actionMenu, 1);
      G_model_setBattleInputEnabled(true);
    } else {
      setTimeout(() => {
        // AI (the dumb version): select a random target and STRIKE
        const target = G_utils_getRandArrElem(battle.allies);
        G_controller_roundApplyAction(G_ACTION_STRIKE, round, target);
      }, 1000);
    }
  });
};

// at the end of this function the postAction callback is invoked to keep the battle running
const G_controller_roundApplyAction = async (
  action: RoundAction,
  round: Round,
  target: Unit | null
) => {
  G_model_setBattleInputEnabled(false);
  const battle = G_model_getCurrentBattle();
  const actingUnit = G_model_roundGetActingUnit(round) as Unit;
  G_model_unitMoveForward(actingUnit);
  G_model_actorSetAnimState(actingUnit.actor, G_ANIM_ATTACKING);
  battle.text = G_model_actionToString(action);

  await G_utils_waitMs(1000);
  switch (action) {
    case G_ACTION_STRIKE:
      const dmg = G_controller_battleActionStrike(actingUnit, target as Unit);
      battle.text = 'Did ' + -dmg + " damage. It's somewhat effective.";
      if (!G_model_unitLives(target as Unit)) {
        const facing = G_utils_isAlly(battle, target as Unit)
          ? G_FACING_UP_RIGHT
          : G_FACING_UP_LEFT;
        G_model_actorSetFacing((target as Unit).actor, facing);
      }
      break;
    case G_ACTION_CHARGE:
      battle.text = 'Charge';
      G_controller_battleActionCharge(actingUnit);
      break;
    case G_ACTION_HEAL:
      // battle.text = 'Heal';
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

const controller_roundInit = (round: Round) => {
  console.log('Start new round:', round);
};

const controller_roundEnd = (round: Round): Round => {
  return G_model_createRound(round.nextTurnOrder); // Change
};

const G_controller_battleActionStrike = (
  attacker: Unit,
  victim: Unit
): number => {
  const { cS, bS } = victim;
  const { def } = cS;
  const { dmg } = attacker.bS;

  const dmgDone = -Math.max(dmg - def, 1);
  G_model_statsModifyHp(cS, bS, dmgDone);
  console.log(
    `${attacker.name} strikes ${victim.name} for ${-dmgDone} damage! (${
      victim.cS.hp
    } HP remaining)`
  );
  // speed modification should be done here

  return dmgDone;
};

const G_controller_battleActionCharge = (unit: Unit) => {
  const { cS } = unit;
  cS.cCnt++;
  // modSpd
  // animation?
};

const G_controller_battleActionHeal = (actor: Unit) => {
  const { cS, bS } = actor;
  cS.iCnt--;
  cS.hp = bS.hp;
};
