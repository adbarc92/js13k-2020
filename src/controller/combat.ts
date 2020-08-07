/*
global
G_model_createActor
G_model_setBattleInputEnabled
G_model_battleGetCurrentRound
G_model_roundIsOver
G_view_drawBattle
G_model_battleAddRound
G_model_battleIncrementIndex
G_model_battleIsComplete
G_model_createUnit
G_model_createBattle
G_model_setCurrentBattle
G_view_drawMenu
G_model_createRound
G_utils_isAlly
G_utils_getRandArrElem
G_model_roundGetActingUnit
G_ACTION_STRIKE
G_model_roundIncrementIndex
G_model_statsModifyHp
*/

// simulates a single round of combat
const G_controller_battleSimulateNextRound = async (battle: Battle) => {
  G_model_setBattleInputEnabled(false);
  const round = G_model_battleGetCurrentRound(battle);
  controller_roundInit(round);

  // this part is hard-coded.  We'd probably want to generalize printing a unit with a function
  while (!G_model_roundIsOver(round)) {
    await controller_battleSimulateTurn(battle, round);
    G_view_drawBattle(battle);
  }

  const nextRound = controller_roundEnd(round);
  G_model_battleAddRound(battle, nextRound);
  G_model_battleIncrementIndex(battle);
  G_view_drawBattle(battle);
  // console.log('round over');
  if (G_model_battleIsComplete(battle)) {
    setTimeout(() => {
      controller_initBattle();
    }, 2000);
  }
  G_model_setBattleInputEnabled(true);
};

const controller_initBattle = () => {
  const jimothy = G_model_createUnit('Jimothy', 5, 5, 5, 5, 5);
  const karst = G_model_createUnit('Karst', 7, 2, 4, 3, 1);

  const battle = G_model_createBattle([jimothy], [karst]);
  const firstRound = G_model_createRound([jimothy, karst]);

  G_model_battleAddRound(battle, firstRound);
  G_model_setCurrentBattle(battle);

  G_view_drawBattle(battle);
  // G_view_drawMenu();
  const options = ['Strike', 'Charge', 'Defend', 'Use', 'Heal', 'Flee'];
  G_view_drawMenu(options, 'white', 195, 380, 100, 120, 18);
  G_model_setBattleInputEnabled(true);
};

const controller_battleSimulateTurn = async (
  battle: Battle,
  round: Round
): Promise<void> => {
  return new Promise(resolve => {
    const actingUnit = G_model_roundGetActingUnit(round) as Unit;

    const target = G_utils_getRandArrElem(
      G_utils_isAlly(battle, actingUnit) ? battle.enemies : battle.allies
    );
    controller_roundDoTurn(round, target as Unit);
    setTimeout(resolve, 1000);
  });
};

const controller_roundEnd = (round: Round): Round => {
  return G_model_createRound(round.nextTurnOrder); // Change
};

const controller_roundDoTurn = (round: Round, target: Unit) => {
  // Either AI or wait for player input occurs here; player input would pass the target
  // Enable input here; either the AI action or the listener should actually call applyAction
  controller_roundApplyAction(G_ACTION_STRIKE, round, target);
};

const controller_roundApplyAction = (
  action: RoundAction,
  round: Round,
  target: Unit
) => {
  const actingUnit = G_model_roundGetActingUnit(round) as Unit;
  switch (action) {
    case G_ACTION_STRIKE:
      controller_battleActionStrike(actingUnit, target);
      break;
    default:
      console.error('No action:', action, 'exists.');
  }
  G_model_roundIncrementIndex(round);
  // check if hp <=0
  round.nextTurnOrder.push(actingUnit);
};

const controller_roundInit = (round: Round) => {
  console.log('Start new round:', round);
};

const controller_battleActionStrike = (
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
