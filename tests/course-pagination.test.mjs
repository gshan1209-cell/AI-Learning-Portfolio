import assert from 'node:assert/strict';
import { parseCoursePagination } from '../src/lib/course-pagination.ts';
let checks=0;
for (const [q, expected] of [
 ['', {page:1,limit:12}], ['page=2&limit=5',{page:2,limit:5}],
 ['limit=100',{page:1,limit:50}], ['page=0002&limit=01',{page:2,limit:1}],
]) {assert.deepEqual(parseCoursePagination(new URLSearchParams(q)),expected);checks++;}
for (const q of ['page=abc','page=Infinity','page=NaN','page=1.5','page=-1','page=0','page=', 'limit=abc','limit=Infinity','limit=0','limit=-5','limit=2.5','limit=', 'page=9007199254740992','page=9007199254740991&limit=50','page=1e2','page=%20']) {
 assert.equal(parseCoursePagination(new URLSearchParams(q)),null,q);checks++;
}
console.log(`${checks} pagination assertions PASS`);
