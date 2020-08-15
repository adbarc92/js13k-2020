/*
global
G_model_createActor
G_model_setBattleInputEnabled
G_model_battleGetCurrentRound
G_model_roundIsOver
G_model_battleAddRound
G_model_battleIncrementIndex
G_model_battleIsComplete
G_model_createUnit
G_model_createBattle
G_model_setCurrentBattle
G_view_drawBattle
G_model_createRound
G_model_roundGetActingUnit
G_model_roundIncrementIndex
G_model_statsModifyHp
G_model_createMenu
G_model_getBattlePostActionCb
G_model_setBattlePostActionCb
G_utils_isAlly
G_utils_getRandArrElem
G_ACTION_STRIKE
*/

const G_controller_initBattle = () => {
  const jimothy = G_model_createUnit('Jimothy', 5, 5, 5, 5, 5);
  const seph = G_model_createUnit('Seph', 7, 2, 4, 3, 1);
  const kana = G_model_createUnit('Kana', 5, 8, 3, 2, 7);
  const widdly2Diddly = G_model_createUnit('widdly2Diddly', 7, 7, 7, 7, 7);

  const karst = G_model_createUnit('Karst', 6, 4, 4, 3, 5);
  const urien = G_model_createUnit('Urien', 9, 5, 4, 3, 2);
  const shreth = G_model_createUnit('Shreth', 8, 8, 6, 3, 2);
  const pDiddy = G_model_createUnit('P Diddy', 5, 5, 5, 5, 5);

  const battle = G_model_createBattle(
    [jimothy, seph, kana, widdly2Diddly],
    [karst, urien, shreth, pDiddy]
  );
  const firstRound = G_model_createRound([
    jimothy,
    karst,
    seph,
    urien,
    kana,
    shreth,
    widdly2Diddly,
    pDiddy,
  ]);

  G_model_battleAddRound(battle, firstRound);
  G_model_setCurrentBattle(battle);
  G_model_setBattleInputEnabled(false);
  doBattle(battle);
};

const doBattle = async (battle: Battle) => {
  G_view_drawBattle(battle);
  while (!G_model_battleIsComplete(battle)) {
    await G_controller_battleSimulateNextRound(battle); // do the fight!
    G_view_drawBattle(battle);
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
    await controller_battleSimulateTurn(battle, round);
    G_view_drawBattle(battle);
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
  return new Promise(resolve => {
    G_model_setBattlePostActionCb(resolve);
    if (G_utils_isAlly(battle, actingUnit)) {
      G_model_setBattleInputEnabled(true);
      G_view_drawBattle(battle);
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
const G_controller_roundApplyAction = (
  action: RoundAction,
  round: Round,
  target: Unit
) => {
  const actingUnit = G_model_roundGetActingUnit(round) as Unit;
  switch (action) {
    case G_ACTION_STRIKE:
      G_controller_battleActionStrike(actingUnit, target);
      break;
    default:
      console.error('No action:', action, 'exists.');
  }
  G_model_roundIncrementIndex(round);
  // check if hp <=0
  round.nextTurnOrder.push(actingUnit);
  G_model_setBattleInputEnabled(false);
  G_model_getBattlePostActionCb()();
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

const G_controller_battleActionCharge = (actor: Unit) => {
  const { cS } = actor;
  cS.cCnt++;
  // modSpd
  // animation?
};

const G_controller_battleActionHeal = (actor: Unit) => {
  const { cS, bS } = actor;
  if (cS.iCnt < 2) {
    console.log('Insufficient charge');
  } else {
    cS.iCnt--;
    cS.hp = bS.hp;
  }
};
