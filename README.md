# korean-football-team-names

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

```js
const { teams } = require('./teams.json');

teams['FC Bayern München'];   // { ko: '바이에른 뮌헨', league: 'bundesliga' }
teams['Tottenham Hotspur FC'] // { ko: '토트넘', league: 'premier-league' }
```

### 표기가 흔들릴 때

같은 팀이라도 API가 `Inter` / `FC Internazionale Milano` 처럼 다르게 줍니다.
아래처럼 정규화한 뒤 조회하면 대부분 맞습니다.

```js
const norm = s => s
  .normalize('NFD').replace(/[̀-ͯ]/g, '')   // 발음기호 제거
  .toLowerCase()
  .replace(/\b(fc|afc|cf|sc|ac|as|ss|us|ssc|rc|rcd|sv|vfb|vfl|tsg|fsv|sco|ogc|aj|ud|cd|sd|stade|olympique|calcio)\b/g, ' ')
  .replace(/\b(de|del|di|da|do|of)\b/g, ' ')          // 전치사 제거
  .replace(/\b(18|19|20)\d{2}\b/g, ' ')               // 창단연도 제거
  .replace(/[^a-z0-9]+/g, ' ').trim();

const index = {};
for (const [en, v] of Object.entries(teams)) index[norm(en)] = v.ko;

index[norm('RC Celta de Vigo')];        // '셀타 비고'
index[norm('Club Atlético de Madrid')]; // '아틀레티코 마드리드'
```

전치사와 창단연도를 떼는 처리가 핵심입니다. 이게 없으면
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

## 기여

빠진 팀이나 잘못된 표기를 발견하면 이슈나 PR로 알려주세요.
한글 표기는 국내 중계·언론에서 통용되는 쪽을 따릅니다
(예: `Wolverhampton Wanderers` → "울버햄튼", `Paris Saint-Germain` → "PSG").

## 라이선스

[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/deed.ko) — 저작권을 포기합니다. 출처 표시 없이 상업적으로도 자유롭게 쓰세요.

---

만든 곳 · [Walking Football](https://walking-football.com/) — 세계 축구 리그를 한국어로 정리하는 사이트
