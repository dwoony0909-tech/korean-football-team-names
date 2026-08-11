# korean-football-team-names

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21884267.svg)](https://doi.org/10.5281/zenodo.21884267)

**English → Korean club name mapping for European football.** 264 clubs across the Premier League, La Liga, Serie A, Bundesliga, Ligue 1 (including second divisions) and UEFA Champions League opponents. Keyed on the names returned by the [football-data.org](https://www.football-data.org/) API. Public domain (CC0).

```bash
npm install korean-football-team-names
```

```js
const kf = require('korean-football-team-names');

kf.ko('Arsenal');                    // '아스날'
kf.ko('FC Bayern München');          // '바이에른 뮌헨'
kf.ko('Club Atlético de Madrid');    // '아틀레티코 마드리드'  ← normalised lookup
kf.find('Tottenham Hotspur FC');     // { ko: '토트넘', league: 'premier-league' }
```

Also available as plain [`teams.json`](teams.json) and [`teams.csv`](teams.csv) — no dependency required.

---

유럽 5대 리그와 UEFA 챔피언스리그 축구팀의 **영문명 → 한국어명 대조표**입니다.
[football-data.org](https://www.football-data.org/) API가 반환하는 팀 이름을 그대로 키로 씁니다.

**264개 팀** · CC0 (출처 표시 없이 자유 사용) · 별칭 표기 포함

## 왜 필요한가

축구 데이터 API는 팀 이름을 영어로만 줍니다.

```
FC Bayern München
Borussia Mönchengladbach
RCD Espanyol de Barcelona
```

한국어 서비스에서는 이걸 "바이에른 뮌헨", "묀헨글라트바흐", "에스파뇰"로 바꿔야 하는데,
공개된 대조표가 없어 다들 각자 만들고 있습니다. 그 표를 공개합니다.

## 사용법

### npm

```bash
npm install korean-football-team-names
```

```js
const kf = require('korean-football-team-names');

kf.ko('Arsenal');                 // '아스날'
kf.find('Real Madrid');           // { ko: '레알 마드리드', league: 'la-liga' }
kf.byLeague('premier-league');    // [{ en, ko, league }, ...]
kf.all().length;                  // 264
kf.normalize('RC Celta de Vigo'); // 'celta vigo'
```

`ko()`와 `find()`는 정확히 일치하지 않아도 정규화해서 다시 찾습니다.
`Club Atlético de Madrid`, `RC Celta de Vigo`, `TSG 1899 Hoffenheim` 모두 그대로 넣으면 됩니다.

### 파일로 직접

```js
const { teams } = require('./teams.json');

teams['FC Bayern München'];   // { ko: '바이에른 뮌헨', league: 'bundesliga' }
teams['Tottenham Hotspur FC'] // { ko: '토트넘', league: 'premier-league' }
```

### 표기가 흔들릴 때 (직접 정규화)

같은 팀이라도 API가 `Inter` / `FC Internazionale Milano` 처럼 다르게 줍니다.
아래처럼 정규화한 뒤 조회하면 대부분 맞습니다.

```js
const norm = s => s
  .normalize('NFD').replace(/[̀-ͯ]/g, '')  // 발음기호 제거
  .toLowerCase()
  .replace(/\b(club|fc|afc|cf|sc|ac|as|ss|us|ssc|rc|rcd|sv|vfb|vfl|tsg|fsv|sco|ogc|aj|ud|cd|sd|stade|olympique|calcio)\b/g, ' ')
  .replace(/\b(de|del|di|da|do|of)\b/g, ' ')          // 전치사 제거
  .replace(/\b(18|19|20)\d{2}\b/g, ' ')               // 창단연도 제거
  .replace(/[^a-z0-9]+/g, ' ').trim();

const index = {};
for (const [en, v] of Object.entries(teams)) index[norm(en)] = v.ko;

index[norm('RC Celta de Vigo')];        // '셀타 비고'
index[norm('Club Atlético de Madrid')]; // '아틀레티코 마드리드'
```

전치사·창단연도·법인격 표기를 떼는 처리가 핵심입니다. 이게 없으면
`RC Celta de Vigo`(→ `celta de vigo`)와 `Celta Vigo`(→ `celta vigo`)가 서로 다른 키가 됩니다.

## 구조

```json
{
  "count": 264,
  "teams": {
    "FC Bayern München": { "ko": "바이에른 뮌헨", "league": "bundesliga" }
  }
}
```

`league` 값: `premier-league` · `la-liga` · `serie-a` · `bundesliga` · `ligue-1` · `other`
(`other`는 챔피언스리그에서 만나는 그 밖의 리그 클럽)

CSV(`teams.csv`)는 `name_en, name_ko, league, league_en` 네 열입니다.
[Frictionless Data](https://frictionlessdata.io/) 규격 기술서(`datapackage.json`)를 함께 넣어 두어
데이터 도구에서 바로 읽을 수 있습니다.

## 수록 범위

| 리그 | 팀 수 |
|---|---|
| 라리가 · 세군다 | 51 |
| 프리미어리그 · 챔피언십 | 47 |
| 리그앙 · 리그2 | 43 |
| 분데스리가 · 2부 | 39 |
| 세리에A · 세리에B | 36 |
| 그 밖(UCL 상대 클럽) | 48 |

2부 리그 팀까지 넣은 이유는 **승격팀이 매 시즌 생기기 때문**입니다.
1부만 담아 두면 8월마다 표가 깨집니다.

## 관련 데이터

같은 곳에서 **유럽 축구 킥오프 시각의 한국 시간대 분포**도 공개합니다 — 5대 리그와 챔피언스리그
경기가 한국시간 몇 시에 열리는지를 누적 집계한 자료입니다.
[분석 페이지](https://walking-football.com/kickoff-hours/) · [JSON](https://walking-football.com/?wfsk_data=kickoff)

## 기여

빠진 팀이나 잘못된 표기를 발견하면 이슈나 PR로 알려주세요.
한글 표기는 국내 중계·언론에서 통용되는 쪽을 따릅니다
(예: `Wolverhampton Wanderers` → "울버햄튼", `Paris Saint-Germain` → "PSG").

## 인용 / Citation

```
Kim, D. (2026). Korean Football Team Names: an English-to-Korean mapping
for European club football (Version 2.0.0) [Data set]. Walking Football.
https://walking-football.com/
```

BibTeX·APA 형식은 저장소 첫 화면 오른쪽 **“Cite this repository”** 버튼에서 바로 복사할 수 있습니다.

## 라이선스

[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/deed.ko) — 저작권을 포기합니다. 출처 표시 없이 상업적으로도 자유롭게 쓰세요.

---

만든 곳 · [Walking Football](https://walking-football.com/) — 세계 축구 리그를 한국어로 정리하는 사이트
