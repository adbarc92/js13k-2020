/*
global
G_controller_roundApplyAction
G_model_battleGetCurrentRound
G_utils_getRandArrElem
G_utils_getRandNum
G_view_drawBattleText
G_model_unitLives

G_ACTION_CHARGE
G_ACTION_STRIKE
G_ACTION_INTERRUPT
G_ACTION_RENEW

G_AI_CHARGER
G_AI_STRIKER
G_AI_BREAKER
G_AI_BOSS
*/

const G_utils_getWeakestEnemy = (enemies: Unit[]): Unit => {
  let weakest = enemies[0];
  for (let i = 0; i < enemies.length; i++) {
    if (enemies[i].cS.hp < weakest.cS.hp) {
      weakest = enemies[i];
    }
  }
  return weakest;
};

const G_utils_getChargedEnemy = (battle: Battle, enemies: Unit[]): Unit => {
  for (let i = 0; i < enemies.length; i++) {
    if (enemies[i].cS.cCnt >= 3 && G_model_unitLives(enemies[i])) {
      return enemies[i];
    }
  }
  if (G_model_unitLives(enemies[battle.aiSeed])) {
    return enemies[battle.aiSeed];
  } else {
    return G_utils_getWeakestEnemy(enemies);
  }
};

// const GET_LEAST = false;
// const GET_GREATEST = true;

// const G_utils_getOutlierByStat = (
//   enemies: Unit[],
//   stat: string,
//   greatest: boolean
// ): Unit => {
//   let outlier = enemies[0];
//   for (let i = 1; i < enemies.length; i++) {
//     if (greatest) {
//       if (enemies[i].cS[stat] > outlier[stat]) {
//         outlier = enemies[i];
//       }
//     } else {
//       if (enemies[i].cS[stat] < outlier[stat]) {
//         outlier = enemies[i];
//       }
//     }
//   }
//   return outlier;
// };

const G_model_showChargeStatus = (battle: Battle, actingUnit: Unit) => {
  const chargeStatus = actingUnit.cS.cCnt / actingUnit.cS.iCnt;
  // 0%
  if (chargeStatus < 0.2) {
    G_view_drawBattleText(`${actingUnit.name} begins to glow ominously.`);
  } else if (chargeStatus < 0.5) {
    G_view_drawBattleText(`${actingUnit.name} shines contemptuously.`);
  }
};

const G_model_doAI = (battle: Battle, round: Round, actingUnit: Unit) => {
  const target = G_utils_getRandArrElem(battle.allies);
  const { roundIndex, aiSeed } = battle;
  switch (actingUnit.ai) {
    case G_AI_CHARGER: // Charger
      if (actingUnit.cS.cCnt < actingUnit.cS.iCnt) {
        G_controller_roundApplyAction(G_ACTION_CHARGE, round, null);
      } else {
        G_controller_roundApplyAction(G_ACTION_STRIKE, round, target);
      }
      G_model_showChargeStatus(battle, actingUnit);
      break;
    case G_AI_STRIKER: // Striker
      // AI (the dumb version): select a random target and STRIKE

      G_controller_roundApplyAction(G_ACTION_STRIKE, round, target);
      break;
    case G_AI_BREAKER:
      // console.log('will break on:', aiSeed);
      const action =
        roundIndex % (aiSeed + 2) === 0 ? G_ACTION_INTERRUPT : G_ACTION_STRIKE;
      G_controller_roundApplyAction(action, round, target);
      break;
    case G_AI_BOSS:
      // Interrupt charge > 3
      let bossTarget = G_utils_getWeakestEnemy(battle.allies);
      let bossAction: RoundAction;
      if (roundIndex % (aiSeed + 2)) {
        if (actingUnit.cS.iCnt < 2) {
          bossAction = G_ACTION_RENEW;
          G_controller_roundApplyAction(bossAction, round, null);
        } else {
          bossAction = G_ACTION_INTERRUPT;
          bossTarget = G_utils_getChargedEnemy(battle, battle.allies);
          G_controller_roundApplyAction(bossAction, round, null);
        }
      } else {
        bossAction = actingUnit.cS.cCnt < 3 ? G_ACTION_CHARGE : G_ACTION_STRIKE;
        G_controller_roundApplyAction(bossAction, round, bossTarget);
      }
  }
};
