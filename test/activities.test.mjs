import test from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS } from '../src/content.mjs';
import { MASTERCLASS } from '../src/masterclass.mjs';
import { getActivity, ACTIVITY_COUNTS } from '../src/activities.mjs';

test('all 72 skills have practical activities',()=>{ assert.equal(SKILLS.length,72); for(const s of SKILLS){const a=getActivity(s,'es');assert.ok(a&&!a.unavailable,s.id);assert.ok(['simulator','bughunt','journal','forensic','consequence','config'].includes(a.type));}});
test('all six formats are used',()=>{assert.deepEqual(Object.keys(ACTIVITY_COUNTS).sort(),['bughunt','config','consequence','forensic','journal','simulator']);});
test('every format has deterministic solution',()=>{for(const s of SKILLS){const a=getActivity(s,'es');if(a.type==='simulator')assert.ok(a.targets.length&&a.targets.every(x=>x.options.includes(x.expected)));if(a.type==='bughunt')assert.equal(a.clues.filter(x=>x.error).length,1);if(a.type==='journal')assert.ok(a.lines.length>=2);if(a.type==='forensic')assert.equal(a.evidence.filter(x=>x.broken).length,1);if(a.type==='consequence')assert.ok(a.chain.length>=2);if(a.type==='config')assert.ok(a.route.every(x=>a.tokens.includes(x)));}});
test('all activities have masterclass evidence',()=>{assert.equal(Object.keys(MASTERCLASS).length,72);for(const s of SKILLS)assert.ok(MASTERCLASS[s.id],s.id);});
test('no activity exposes serialized objects to learners',()=>{for(const locale of ['es','en','de'])for(const s of SKILLS){const a=getActivity(s,locale);assert.equal(JSON.stringify(a).includes('[object Object]'),false,`${s.id}/${locale}`);}});
