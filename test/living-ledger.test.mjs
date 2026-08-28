import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const req=createRequire(process.cwd()+'/package.json');
const { deriveDueReviews,deriveGlobalStreak,recommendationReason }=req('./src/domain.mjs');
const { createInitialState,renderAppMarkup,reduceState }=req('./src/app.mjs');
const day=n=>`2026-08-${String(n).padStart(2,'0')}T10:00:00.000Z`;

test('F1 due reviews: explored due at/before now, oldest-first',()=>{
 const p={a:{explored:true,nextReview:day(20)},b:{explored:true,nextReview:day(27)},c:{explored:true,nextReview:day(29)},d:{explored:false,nextReview:day(10)}};
 assert.deepEqual(deriveDueReviews(p,new Date(day(28))),['a','b']);
});
test('F1 global streak: UTC days dedup, gap breaks, yesterday remains alive',()=>{
 const p={a:{lastPractised:day(28)},b:{lastPractised:day(27)},c:{lastPractised:day(26)},d:{lastPractised:day(25)},e:{lastPractised:'2026-08-28T22:00:00.000Z'}};
 assert.equal(deriveGlobalStreak(p,new Date(day(28))),4);
 assert.equal(deriveGlobalStreak({a:{lastPractised:day(28)},b:{lastPractised:day(26)}},new Date(day(28))),1);
 assert.equal(deriveGlobalStreak({},new Date(day(28))),0);
 assert.equal(deriveGlobalStreak({a:{lastPractised:day(27)},b:{lastPractised:day(26)}},new Date(day(28))),2);
});
test('F1 recommendation reason: overdue/learning/new distinct in 3 locales',()=>{
 const now=new Date(day(28));
 for(const locale of ['es','en','de']){
  const vals=[recommendationReason({explored:true,nextReview:day(27)},now,locale),recommendationReason({explored:true,nextReview:day(29)},now,locale),recommendationReason({},now,locale)];
  assert.equal(new Set(vals).size,3,locale); assert.ok(vals.every(Boolean),locale);
 }
});
test('F1 home desk: due/streak/recommendation and exactly one primary CTA',()=>{
 const s=createInitialState({locale:'es',view:'home',progress:{'SYN-SK-L0-01':{explored:true,lastPractised:day(28),nextReview:day(27),mastery:50},'SYN-SK-L0-02':{explored:true,lastPractised:day(27),nextReview:day(29),mastery:40}}});
 const html=renderAppMarkup(s,{now:new Date(day(28))});
 assert.match(html,/sbl-desk/); assert.match(html,/sbl-streak-seal/); assert.match(html,/data-action="select-skill"/);
 const cover=html.match(/<section class="sbl-cover">([\s\S]*?)<\/section>/)?.[1]||'';
 assert.equal((cover.match(/btn-primary/g)||[]).length,1,'one primary CTA inside home cover');
});
test('F2 map state matrix new/learning/mastered + progress aria in 3 locales',()=>{
 const p={'SYN-SK-L0-02':{explored:true,mastered:false,mastery:45},'SYN-SK-L0-03':{explored:true,mastered:true,mastery:100}};
 for(const locale of ['es','en','de']){const html=renderAppMarkup(createInitialState({locale,view:'map',progress:p}));assert.match(html,/is-new/);assert.match(html,/is-learning/);assert.match(html,/is-mastered/);assert.match(html,/role="progressbar"/);assert.match(html,/aria-valuenow="1"/);}
});
test('F3 mastery moment: only false→true and ephemeral',()=>{
 const base=createInitialState({progress:{'SYN-SK-L0-01':{knowledge:100,application:100,verification:100,risk:100,mastered:false,explored:true,streak:2,correctAttempts:2,safetyGatePassed:true,lastPractised:day(27),nextReview:day(28)}}});
 const m=reduceState(base,{type:'ASSESS_SKILL',skillId:'SYN-SK-L0-01',correct:true,safetyGatePassed:true,principleCorrect:true,now:day(28)});
 assert.equal(m.masteryMoment?.skillId,'SYN-SK-L0-01');assert.match(renderAppMarkup(m),/sbl-mastery-moment/);
 const c=reduceState(m,{type:'CLEAR_MASTERY_MOMENT'});assert.equal(c.masteryMoment,null);
 const a=reduceState(c,{type:'ASSESS_SKILL',skillId:'SYN-SK-L0-01',correct:true,safetyGatePassed:true,principleCorrect:true,now:day(28)});assert.equal(a.masteryMoment,null);
 const failed=reduceState(a,{type:'ASSESS_SKILL',skillId:'SYN-SK-L0-01',correct:false,safetyGatePassed:true,principleCorrect:false,now:day(28)});
 assert.equal(failed.progress['SYN-SK-L0-01'].mastered,true,'earned mastery is monotonic');
 assert.equal(failed.masteryMoment,null,'failure after mastery never celebrates');
});
test('F6 ledger spine renders 9 interactive level nodes with trilingual aria',()=>{
 const p={'SYN-SK-L0-01':{mastered:true,explored:true,mastery:100}};
 for(const locale of ['es','en','de']){
  const html=renderAppMarkup(createInitialState({locale,view:'home',progress:p}));
  assert.equal((html.match(/class="sbl-spine-node\s/g)||[]).length,9,locale);
  assert.match(html,/data-action="spine-level" data-value="0"/);
  assert.match(html,/aria-label="[^"]+ 13%"/);
  assert.match(html,/sbl-spine-node is-progress/);
 }
});
test('F6 spine navigation sets level filter and map view atomically',()=>{
 const s=reduceState(createInitialState(),{type:'OPEN_LEVEL',value:'4'});
 assert.equal(s.view,'map');assert.equal(String(s.levelFilter),'4');
});

test('F4 due nav count disappears after practice reschedules',()=>{
 const s=createInitialState({view:'map',progress:{'SYN-SK-L0-01':{explored:true,streak:0,lastPractised:day(20),nextReview:day(21),mastery:40}}});
 assert.match(renderAppMarkup(s,{now:new Date(day(28))}),/sbl-review-count[^>]*>1</);
 const d=reduceState(s,{type:'PRACTISE_SKILL',skillId:'SYN-SK-L0-01',now:day(28)});assert.doesNotMatch(renderAppMarkup(d,{now:new Date(day(28))}),/sbl-review-count/);
});
