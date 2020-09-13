/*
global
G_model_setBattleInputEnabled
G_model_battleGetCurrentRound
G_model_actionToString
G_model_actorGetPosition
G_model_actorSetAnimState
G_model_actorSetFacing
G_model_actorSetPosition
G_model_battleAddRound
G_model_battleIncrementIndex
G_model_battleIsComplete
G_model_battleSetText
G_model_battleGetScreenPosition
G_model_createBattle
G_model_createCharacterFromTemplate
G_model_createMenu
G_model_createUnit
G_model_createVerticalMenu
G_model_createRound
G_model_doAI
G_model_getBattlePostActionCb
G_model_getCurrentBattle
G_model_getParty
G_model_getScreenSize
G_model_menuSetNextCursorIndex
G_model_modifySpeed
G_model_createActor
G_model_roundGetActingUnit
G_model_roundIncrementIndex
G_model_statsModifyHp
G_model_setBattlePostActionCb
G_model_setCurrentBattle
G_model_roundIsOver
G_model_unitGainBreakCharge
G_model_unitLives
G_model_unitMoveForward
G_model_unitResetDef
G_model_unitResetPosition
G_model_unitSetToCenter

G_view_drawBattleText
G_view_playSound
G_utils_getRandNum
G_utils_areAllUnitsDead
G_utils_isAlly
G_utils_waitMs

G_ACTION_CHARGE
G_ACTION_DEFEND
G_ACTION_HEAL
G_ACTION_INTERRUPT
G_ACTION_RENEW
G_ACTION_STRIKE
G_ACTION_FLEE
G_ACTION_USE
G_ALLEGIANCE_ALLY
G_ALLEGIANCE_ENEMY
G_ACTION_FLEE
G_ANIM_ATTACKING
G_ANIM_DEFAULT
G_ANIM_STUNNED
G_ANIM_WALKING
G_BATTLE_MENU_LABELS
G_FACING_UP
G_FACING_UP_LEFT
G_FACING_UP_RIGHT
G_COMPLETION_INCONCLUSIVE
G_CURSOR_WIDTH
G_CURSOR_HEIGHT
G_COMPLETION_FAILURE
G_COMPLETION_VICTORY

G_model_battleSumLostHealth

G_ENCOUNTER_0
*/

const G_BATTLE_SCALE = 2;

const G_controller_doBattle = async (battle: Battle) => {
  return new Promise(async resolve => {
    G_model_setCurrentBattle(battle);
    G_model_setBattleInputEnabled(false);

    while (!G_model_battleIsComplete(battle)) {
      await G_controller_battleSimulateNextRound(battle); // do the fight!
    }

    if (G_utils_areAllUnitsDead(battle.allies)) {
      battle.completionState = G_COMPLETION_FAILURE;
    } else if (G_utils_areAllUnitsDead(battle.enemies)) {
      battle.completionState = G_COMPLETION_VICTORY;
    } else {
      battle.completionState = G_COMPLETION_INCONCLUSIVE;
    }
    G_model_setCurrentBattle(null);
    resolve();
  });

  // console.log('Battle complete!');
  // setTimeout(() => {
  //   const battle2 = G_model_createBattle(battle.party, G_ENCOUNTER_0);
  //   G_model_setCurrentBattle(battle2);
  //   G_controller_doBattle(battle2);
  // }, 2000); // For debugging
};

// simulates a single round of combat
const G_controller_battleSimulateNextRound = async (battle: Battle) => {
  const round = G_model_battleGetCurrentRound(battle);
  controller_roundInit(round);

  // this part is hard-coded.  We'd probably want to generalize printing a unit with a function
  while (!G_model_roundIsOver(round)) {
    // console.log('Current Round Index:', round.currentIndex);
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
  if (!G_model_unitLives(actingUnit) || G_model_battleIsComplete(battle)) {
    return;
  }
  // Reset stats if necessary, here
  if (actingUnit.cS.def !== actingUnit.bS.def) {
    G_model_unitResetDef(actingUnit);
  }
  if (actingUnit.cS.spd === 0) {
    actingUnit.cS.spd = actingUnit.bS.spd;
    return;
  }
  G_model_unitMoveForward(actingUnit);
  return new Promise(resolve => {
    G_model_setBattlePostActionCb(resolve);
    const actionMenu = battle.actionMenuStack[0];
    if (G_utils_isAlly(battle, actingUnit)) {
      if (actingUnit.cS.iCnt <= 0) {
        actionMenu.disabledItems.push(2, 4);
      } else {
        actionMenu.disabledItems = actionMenu.disabledItems.filter(
          i => i !== 2 && i !== 4
        );
      }
      actionMenu.i = -1;
      G_model_menuSetNextCursorIndex(actionMenu, 1, true);
      G_model_setBattleInputEnabled(true);
    } else {
      setTimeout(() => {
        G_model_doAI(battle, round, actingUnit);
      }, 1000);
    }
  });
};

// at the end of this function the postAction callback is invoked to keep the battle running
const G_controller_roundApplyAction = async (
  action: RoundAction,
  round: Round,
  target: Unit | null,
  item?: Item
) => {
  G_model_setBattleInputEnabled(false);
  const battle = G_model_getCurrentBattle();
  const actingUnit = G_model_roundGetActingUnit(round) as Unit;
  G_model_unitSetToCenter(actingUnit);
  // Change animations here

  G_model_actorSetAnimState(actingUnit.actor, G_ANIM_ATTACKING);

  battle.text = G_model_actionToString(action);
  await G_utils_waitMs(1000);
  G_model_modifySpeed(actingUnit, action);
  switch (action) {
    case G_ACTION_STRIKE:
      const dmg = G_controller_battleActionStrike(actingUnit, target as Unit);
      battle.text = 'Did ' + -dmg + ' damage.';
      G_view_playSound('actionStrike');

      G_model_actorSetAnimState((target as Unit).actor, G_ANIM_STUNNED);
      await G_utils_waitMs(800);
      G_model_actorSetAnimState((target as Unit).actor, G_ANIM_DEFAULT);

      if (!G_model_unitLives(target as Unit)) {
        const facing = G_utils_isAlly(battle, target as Unit)
          ? G_FACING_UP_RIGHT
          : G_FACING_UP_LEFT;
        G_model_actorSetFacing((target as Unit).actor, facing);
      }
      break;
    case G_ACTION_CHARGE:
      G_controller_battleActionCharge(actingUnit);
      G_view_playSound('actionCharge');
      break;
    case G_ACTION_DEFEND:
      G_controller_battleActionDefend(actingUnit);
      G_view_playSound('actionDefend');
      break;
    case G_ACTION_HEAL:
      G_controller_battleActionHeal(actingUnit);
      break;
    case G_ACTION_INTERRUPT:
      G_controller_battleActionInterrupt(actingUnit, target as Unit);
      break;
    case G_ACTION_FLEE:
      G_controller_battleActionFlee();
      break;
    case G_ACTION_RENEW:
      battle.text = 'Powers replenished.';
      G_controller_battleActionRenew(actingUnit);
      break;
    case G_ACTION_USE:
      if (item && item.onUse) {
        item.onUse(item);
      }
      break;
    default:
      console.error('No action:', action, 'exists.');
  }

  await G_utils_waitMs(1250);
  G_model_unitResetPosition(actingUnit);
  G_model_actorSetAnimState(actingUnit.actor, G_ANIM_DEFAULT);

  battle.text = '';

  await G_utils_waitMs(500);
  G_model_getBattlePostActionCb()(); // resolve is called here
  if (controller_roundRemoveDeadUnits(round)) {
    G_model_unitGainBreakCharge(actingUnit);
  }
};

const controller_roundRemoveDeadUnits = (round: Round): boolean => {
  const { turnOrder } = round;
  let unitSlain = false;
  for (let i = 0; i < turnOrder.length; i++) {
    if (!G_model_unitLives(turnOrder[i])) {
      turnOrder.splice(i, 1);
      unitSlain = true;
    }
  }
  return unitSlain;
};

const controller_roundSort = (round: Round) => {
  round.turnOrder = round.turnOrder.sort((a, b) => {
    return b.cS.spd - a.cS.spd;
  });
};

const controller_roundInit = (round: Round) => {
  // console.log('Start new round:', round);
  controller_roundSort(round);
};

const controller_roundEnd = (round: Round): Round => {
  return G_model_createRound(round.turnOrder); // Change
};

const G_controller_battleActionStrike = (
  attacker: Unit,
  victim: Unit
): number => {
  const { cS, bS } = victim;
  const { def } = cS;
  const { dmg } = attacker.bS;
  const { cCnt } = attacker.cS;
  const damage = cCnt > 0 ? dmg * (cCnt + 1) : dmg;

  const dmgDone = -Math.floor(Math.max(damage - def, 1));
  attacker.cS.cCnt = 0;
  G_model_statsModifyHp(cS, bS, dmgDone);
  console.log(
    `${attacker.name} strikes ${victim.name} for ${-dmgDone} damage! (${
      victim.cS.hp
    } HP remaining)`
  );

  return dmgDone;
};

const G_controller_battleActionCharge = (unit: Unit) => {
  const { cS } = unit;
  cS.cCnt++;
};

const G_controller_battleActionInterrupt = (attacker: Unit, victim: Unit) => {
  attacker.cS.iCnt--;
  victim.cS.spd = 0;
  victim.cS.cCnt = 0;
};

const G_controller_battleActionHeal = (unit: Unit) => {
  const { cS, bS } = unit;
  cS.iCnt--;
  cS.hp = bS.hp;
};

const G_controller_battleActionDefend = (unit: Unit) => {
  const { cS } = unit;
  cS.def *= 1.5;
};

const G_controller_battleActionFlee = () => {
  const battle = G_model_getCurrentBattle();
  battle.completionState = G_COMPLETION_INCONCLUSIVE;
};

const G_controller_battleActionRenew = (unit: Unit) => {
  unit.cS.iCnt = unit.bS.mag;
};

const G_controller_battleSelectItem = async (
  battle: Battle
): Promise<Item | null> => {
  return new Promise(resolve => {
    const indexMap = {};
    const party = battle.party;
    let ctr = 0;
    const itemNames = party.inv
      .filter((item, i) => {
        indexMap[ctr] = i;
        ctr++;
        return !!item.onUse;
      })
      .map(item => item.name);

    const screenSize = G_model_getScreenSize();
    const menuWidth = 100;
    const lineHeight = 20;
    const x = screenSize / 2 - menuWidth / 2;
    const y = screenSize - screenSize / 2;
    const itemMenu = G_model_createVerticalMenu(
      x,
      y,
      menuWidth,
      itemNames,
      (i: number) => {
        const itemToUse = party.inv[indexMap[i]];
        resolve(itemToUse);
      },
      [],
      true,
      lineHeight
    );
    itemMenu.i = -1;
    G_model_menuSetNextCursorIndex(itemMenu, 1);
    battle.actionMenuStack.unshift(itemMenu); // transfers input to the newly-created menu
  });
};
