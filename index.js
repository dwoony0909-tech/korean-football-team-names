'use strict';

/**
 * korean-football-team-names
 * 영문 축구팀명 → 한국어 팀명. CC0.
 * https://walking-football.com/
 */

const data = require('./teams.json');

const teams = data.teams;

/* 법인격 표기·전치사·창단연도를 떼어 비교용 키를 만든다.
 * 이게 없으면 "RC Celta de Vigo"와 "Celta Vigo"가 서로 다른 팀이 된다. */
const DROP_TOKENS =
  /\b(club|fc|afc|cf|sc|ac|as|ss|us|ssc|rc|rcd|sv|vfb|vfl|tsg|fsv|bc|acf|cfc|sco|ogc|aj|ud|cd|sd|sk|nk|hnk|fk|bk|stade|olympique|calcio|balompie)\b/g;
const DROP_PREPS = /\b(de|del|di|da|do|of)\b/g;
const DROP_YEARS = /\b(18|19|20)\d{2}\b/g;

/**
 * 조회용으로 이름을 정규화한다.
 * @param {string} name
 * @returns {string}
 */
function normalize(name) {
  if (typeof name !== 'string') return '';
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // 발음기호 제거
    .replace(/ß/g, 'ss')
    .replace(/ø/g, 'o')
    .replace(/æ/g, 'ae')
    .replace(/đ/g, 'd')
    .toLowerCase()
    .replace(DROP_TOKENS, ' ')
    .replace(DROP_PREPS, ' ')
    .replace(DROP_YEARS, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

/* 정규화 키 색인은 처음 조회할 때 한 번만 만든다 */
let index = null;
function buildIndex() {
  if (index) return index;
  index = Object.create(null);
  for (const en of Object.keys(teams)) {
    const key = normalize(en);
    // 먼저 등록된 표기를 유지한다 — teams.json은 정식 명칭이 앞에 오도록 정렬돼 있다
    if (key && !(key in index)) index[key] = teams[en];
  }
  return index;
}

/**
 * 영문 팀명으로 한국어 이름을 찾는다. 정확히 일치하지 않아도 정규화해서 다시 찾는다.
 * @param {string} name
 * @returns {string|null}
 */
function ko(name) {
  const hit = find(name);
  return hit ? hit.ko : null;
}

/**
 * 영문 팀명으로 항목 전체({ ko, league })를 찾는다.
 * @param {string} name
 * @returns {{ko: string, league: string}|null}
 */
function find(name) {
  if (typeof name !== 'string' || name === '') return null;
  if (Object.prototype.hasOwnProperty.call(teams, name)) return teams[name];
  const key = normalize(name);
  if (!key) return null;
  const idx = buildIndex();
  return key in idx ? idx[key] : null;
}

/**
 * 리그별 팀 목록.
 * @param {string} league premier-league | la-liga | serie-a | bundesliga | ligue-1 | other
 * @returns {Array<{en: string, ko: string, league: string}>}
 */
function byLeague(league) {
  const out = [];
  for (const en of Object.keys(teams)) {
    if (teams[en].league === league) out.push({ en, ko: teams[en].ko, league });
  }
  return out;
}

/**
 * 전체 목록을 배열로.
 * @returns {Array<{en: string, ko: string, league: string}>}
 */
function all() {
  return Object.keys(teams).map((en) => ({ en, ko: teams[en].ko, league: teams[en].league }));
}

module.exports = {
  teams,
  meta: {
    name: data.name,
    version: data.version,
    updated: data.updated,
    count: data.count,
    license: data.license,
    homepage: data.homepage,
  },
  ko,
  find,
  normalize,
  byLeague,
  all,
};
