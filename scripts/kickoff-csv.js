'use strict';
/**
 * data/kickoff-latest.json  →  data/kickoff-latest.csv
 * 매달 자동 실행된다. 데이터가 비었거나 형식이 다르면 0이 아닌 코드로 종료해서
 * 잘못된 스냅샷이 릴리스되는 것을 막는다.
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join('data', 'kickoff-latest.json');
const OUT = path.join('data', 'kickoff-latest.csv');

let d;
try {
  d = JSON.parse(fs.readFileSync(SRC, 'utf8'));
} catch (e) {
  console.error('JSON을 읽지 못했습니다:', e.message);
  process.exit(1);
}

if (!d || typeof d.matches !== 'number' || d.matches < 1) {
  console.error('집계된 경기가 없습니다. 이번 스냅샷은 만들지 않습니다.');
  process.exit(1);
}
if (!Array.isArray(d.hour_histogram) || d.hour_histogram.length !== 24) {
  console.error('시간 히스토그램이 24칸이 아닙니다.');
  process.exit(1);
}

const q = (s) => '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"';

const head = ['competition', 'name_ko', 'matches', 'dawn_share_pct', 'peak_hour_kst'];
for (let h = 0; h < 24; h++) head.push('h' + String(h).padStart(2, '0'));

const rows = [head.join(',')];
rows.push([q('ALL'), q('전체'), d.matches, d.dawn_share_pct, ''].concat(d.hour_histogram).join(','));

for (const [code, c] of Object.entries(d.competitions || {})) {
  if (!c || !Array.isArray(c.hour_histogram) || c.hour_histogram.length !== 24) {
    console.error('대회 데이터가 이상합니다:', code);
    process.exit(1);
  }
  rows.push(
    [q(code), q(c.name_ko), c.matches, c.dawn_share_pct, c.peak_hour_kst]
      .concat(c.hour_histogram)
      .join(',')
  );
}

fs.writeFileSync(OUT, rows.join('\n') + '\n');
console.log('경기 ' + d.matches + '건 · 새벽 ' + d.dawn_share_pct + '% · 대회 ' + Object.keys(d.competitions || {}).length + '개');
