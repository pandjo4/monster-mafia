// Lightweight reference tests for the published deal table. Run with: node --test
const test = require('node:test');
const assert = require('node:assert/strict');
function payout(a,b){if(a==='split'&&b==='split')return [3,3];if(a==='split'&&b==='steal')return [0,4];if(a==='steal'&&b==='split')return [4,0];return [1,1]}
test('Risky Deal payouts follow the Split or Steal table',()=>{
 assert.deepEqual(payout('split','split'),[3,3]);
 assert.deepEqual(payout('split','steal'),[0,4]);
 assert.deepEqual(payout('steal','split'),[4,0]);
 assert.deepEqual(payout('steal','steal'),[1,1]);
});
