/*
global
G_controller_roundApplyAction
G_model_battleGetCurrentRound
G_utils_getRandArrElem
G_ACTION_CHARGE
G_ACTION_STRIKE
*/

// Attack weakest target

// const G_utils_getWeakestEnemy = (enemies: Unit[]): Unit => {
//   let weakest = enemies[0];
//   for (let i = 0; i < enemies.length; i++) {
//     if (enemies[i].cS.hp < weakest.cS.hp) {
//       weakest = enemies[i];
//     }
//   }
//   return weakest;
// };

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

// const G_model_aiTargetWeakest = (allies: Unit[], round: Round) => {
//   const target = G_utils_getOutlierByStat(allies, 'hp', GET_LEAST);
//   G_controller_roundApplyAction(G_ACTION_STRIKE, round, target);
// };

// Standard: charge up and then strike

// const G_model_aiChargeStrike = (
//   actingUnit: Unit,
//   enemies: Unit[],
//   round: Round
// ) => {
//   if (actingUnit.cS.cCnt < actingUnit.cS.iCnt) {
//     G_controller_roundApplyAction(G_ACTION_CHARGE, round, null);
//   } else {
//     const target = G_utils_getRandArrElem(enemies);
//     G_controller_roundApplyAction(G_ACTION_STRIKE, round, target);
//   }
// };

// const G_model_aiBoss = (actingUnit: Unit, battle: Battle, round: Round) => {
//   // If Interrupt Count < 2, replenish
//   if (actingUnit.cS.iCnt < 2) {
//     battle.text = 'Replenishing';
//     actingUnit.cS.iCnt = actingUnit.bS.iCnt;
//   } else {
//     const target = G_utils_getOutlierByStat(
//       battle.allies,
//       'cCnt',
//       GET_GREATEST
//     );
//     // If an enemy has charge of >4, Interrupt
//     if (target.cS.cCnt > 4) {
//       // G_controller_roundApplyAction(G_ACTION_INTERRUPT, round, target);
//     }
//   }
// };

const G_model_doAI = (battle: Battle, round: Round, actingUnit: Unit) => {
  switch (actingUnit.ai) {
    case 1: // Charger
      if (actingUnit.cS.cCnt < actingUnit.cS.iCnt) {
        G_controller_roundApplyAction(G_ACTION_CHARGE, round, null);
      } else {
        const target = G_utils_getRandArrElem(battle.allies);
        G_controller_roundApplyAction(G_ACTION_STRIKE, round, target);
      }
      break;
    case 2: // Striker
      // AI (the dumb version): select a random target and STRIKE
      const target = G_utils_getRandArrElem(battle.allies);
      G_controller_roundApplyAction(G_ACTION_STRIKE, round, target);
      break;
  }
};
// Alternate strike and charge

//
