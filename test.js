'use strict';
const assert = require('assert');
const kf = require('./index.js');

let pass = 0;
function t(label, fn) {
  try {
    fn();
    pass++;
    console.log('  ✓ ' + label);
  } catch (e) {
    console.log('  ✗ ' + label + ' — ' + e.message);
    process.exitCode = 1;
  }
}

console.log('── meta');
t('264팀', () => assert.strictEqual(Object.keys(kf.teams).length, 264));
t('meta.count 일치', () => assert.strictEqual(kf.meta.count, Object.keys(kf.teams).length));
t('라이선스 CC0', () => assert.strictEqual(kf.meta.license, 'CC0-1.0'));

console.log('── 정확히 일치하는 조회');
t('Arsenal', () => assert.strictEqual(kf.ko('Arsenal'), '아스날'));
t('Real Madrid', () => assert.strictEqual(kf.ko('Real Madrid'), '레알 마드리드'));

console.log('── 정규화 조회 (API 표기가 흔들릴 때)');
t('FC Bayern München', () => assert.ok(/뮌헨/.test(kf.ko('FC Bayern München') || '')));
t('RC Celta de Vigo', () => assert.strictEqual(kf.ko('RC Celta de Vigo'), '셀타 비고'));
t('Club Atlético de Madrid', () => assert.strictEqual(kf.ko('Club Atlético de Madrid'), '아틀레티코 마드리드'));
t('Tottenham Hotspur FC', () => assert.strictEqual(kf.ko('Tottenham Hotspur FC'), '토트넘'));
t('Paris Saint-Germain FC', () => assert.ok(kf.ko('Paris Saint-Germain FC')));

console.log('── normalize');
t('전치사 제거', () => assert.strictEqual(kf.normalize('RC Celta de Vigo'), kf.normalize('Celta Vigo')));
t('창단연도 제거', () => assert.strictEqual(kf.normalize('TSG 1899 Hoffenheim'), kf.normalize('TSG Hoffenheim')));
t('발음기호 제거', () => assert.strictEqual(kf.normalize('Málaga'), 'malaga'));
t('ß 처리', () => assert.strictEqual(kf.normalize('Preußen'), 'preussen'));

console.log('── 방어');
t('없는 팀은 null', () => assert.strictEqual(kf.ko('Nonexistent United'), null));
t('빈 문자열 null', () => assert.strictEqual(kf.ko(''), null));
t('숫자 입력 null', () => assert.strictEqual(kf.ko(123), null));
t('undefined null', () => assert.strictEqual(kf.ko(undefined), null));

console.log('── 목록');
t('byLeague 프리미어리그 47', () => assert.strictEqual(kf.byLeague('premier-league').length, 47));
t('all() 264', () => assert.strictEqual(kf.all().length, 264));
t('all() 항목 형태', () => {
  const a = kf.all()[0];
  assert.ok(a.en && a.ko && a.league);
});
t('모든 한국어 이름이 비어있지 않음', () => {
  for (const [en, v] of Object.entries(kf.teams)) {
    assert.ok(v.ko && v.ko.length > 0, en + ' 의 ko 가 비어 있음');
    assert.ok(/[가-힣A-Z0-9]/.test(v.ko), en + ' 의 ko 가 이상함: ' + v.ko);
  }
});

console.log('\n통과 ' + pass);
