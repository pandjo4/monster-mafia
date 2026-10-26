// Unit tests for the published Risky Deal table and role-system predicates.
const test = require('node:test');
const assert = require('node:assert/strict');
const rules = require('./role-rules');

function payout(a,b){
  if(a==='split'&&b==='split')return [3,3];
  if(a==='split'&&b==='steal')return [0,4];
  if(a==='steal'&&b==='split')return [4,0];
  return [1,1];
}
test('Risky Deal payouts follow the Split or Steal table',()=>{
 assert.deepEqual(payout('split','split'),[3,3]);
 assert.deepEqual(payout('split','steal'),[0,4]);
 assert.deepEqual(payout('steal','split'),[4,0]);
 assert.deepEqual(payout('steal','steal'),[1,1]);
});
test('Vampire rewards a new human partner once, never the robot',()=>{
 assert.equal(rules.vampireShouldReward('alice','ROBOT',false),true);
 assert.equal(rules.vampireShouldReward('alice','ROBOT',true),false);
 assert.equal(rules.vampireShouldReward('ROBOT','ROBOT',false),false);
});
test('Werewolf and Mummy activation limits stop at four and three',()=>{
 assert.equal(rules.hasBonusSlot(3,4),true);
 assert.equal(rules.hasBonusSlot(4,4),false);
 assert.equal(rules.hasBonusSlot(2,3),true);
 assert.equal(rules.hasBonusSlot(3,3),false);
});
test('Serial Killer becomes eligible only on the second deal and once per target',()=>{
 assert.equal(rules.serialCanActivate(1,false,false),false);
 assert.equal(rules.serialCanActivate(2,false,false),true);
 assert.equal(rules.serialCanActivate(2,true,false),false);
 assert.equal(rules.serialCanActivate(2,false,true),false);
});
test('infection spreads only at the end of the night after infection',()=>{
 assert.equal(rules.shouldScheduleInfection({infected:true,originalZombie:false,infectionNight:2,currentNight:3}),true);
 assert.equal(rules.shouldScheduleInfection({infected:true,originalZombie:false,infectionNight:2,currentNight:2}),false);
 assert.equal(rules.shouldScheduleInfection({infected:true,originalZombie:false,infectionNight:2,currentNight:4}),false);
 assert.equal(rules.shouldScheduleInfection({infected:true,originalZombie:true,infectionNight:0,currentNight:1}),false);
});
test('Dragon requires a rejected target from the previous night and has two activations',()=>{
 const rejected=new Set(['alice']);
 assert.equal(rules.dragonBonusEligible({used:0,targetId:'alice',rejectedLastNight:rejected}),true);
 assert.equal(rules.dragonBonusEligible({used:0,targetId:'bob',rejectedLastNight:rejected}),false);
 assert.equal(rules.dragonBonusEligible({used:2,targetId:'alice',rejectedLastNight:rejected}),false);
});
test('Zombie special win requires a nonempty roster with every player infected',()=>{
 assert.equal(rules.zombieWinsAlone([]),false);
 assert.equal(rules.zombieWinsAlone([{infected:true},{infected:true}]),true);
 assert.equal(rules.zombieWinsAlone([{infected:true},{infected:false}]),false);
});
