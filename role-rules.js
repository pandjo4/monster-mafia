'use strict';

// Small pure predicates shared by the authoritative server and unit tests.
function hasBonusSlot(used, limit) { return Number(used || 0) < limit; }
function vampireShouldReward(partnerId, robotId, alreadyCounted) {
  return partnerId !== robotId && !alreadyCounted;
}
function serialCanActivate(successfulDealCount, alreadyUsed, hasPendingDecision) {
  return successfulDealCount === 2 && !alreadyUsed && !hasPendingDecision;
}
function shouldScheduleInfection({ infected, originalZombie, infectionNight, currentNight }) {
  return !!infected && !originalZombie && Number.isInteger(infectionNight) &&
    infectionNight < currentNight && infectionNight + 1 === currentNight;
}
function dragonBonusEligible({ used, limit = 2, targetId, robotId = 'ROBOT', rejectedLastNight }) {
  return hasBonusSlot(used, limit) && targetId !== robotId && rejectedLastNight.has(targetId);
}
function zombieWinsAlone(players) {
  return Array.isArray(players) && players.length > 0 && players.every(p => p && p.infected === true);
}
module.exports = { hasBonusSlot, vampireShouldReward, serialCanActivate, shouldScheduleInfection, dragonBonusEligible, zombieWinsAlone };
