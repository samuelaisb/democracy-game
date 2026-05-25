# Campaign Map Template — Democracy Game

A fillable template for adding or revising a **campaign map** (one playable environment).
Use this when you want to swap in a new setting (e.g. `prairie_riding`, `arctic_council`)
or rewrite an existing one (`quebec_town`, `vancouver_city`, …).

---

## 1. The gameplay loop at a glance

Every playthrough runs through the same scene graph. Only the **highlighted nodes**
pull from per-map content; the rest is shared across all maps.

```
                       ┌─────────────────────┐
                       │  env_select  (★MAP) │  6 map options today
                       └──────────┬──────────┘
                                  ▼
                       ┌─────────────────────┐
ACT I — Running        │  act1_intro         │  3 choices
for office             │  act1_field_ops     │  3 choices
                       │  act1_social_media  │  4 choices
                       │  act1_rivalry       │  3 choices
                       │  act1_fundraising   │  3 choices
                       │  act1_npc_talk ★MAP │  loops 4× / playthrough
                       │  act1_promises      │  4 choices (pillar #1)
                       │  act1_promises_2    │  4 choices (pillar #2)
                       │  election_night ★MAP│  weighted by NPC+faction support
                       └──────────┬──────────┘
                                  ▼ (won)
ACT II — Establishing  │  act2_start         │  3 choices
government             │  act2_officials     │  3 choices
                       │  act2_policy        │  3 choices
                       │  act2_crisis  ★MAP  │  1 weighted crisis × 3 choices
                       │  act2_coalition     │  3 choices
                                  ▼
ACT III — Judgment     │  act3_polling       │  4 choices
                       │  end / ending_defeat│  10 ending variants
```

★ marks the four places where per-map content is injected.

---

## 2. Per-map content budget (what you actually write)

For **one** campaign map you need to author all of the following.
Counts are exact — if any row is short, the map will fall back to defaults or English placeholder text.

| # | Asset | File | Count per map | Type |
|---|------|------|---------------|------|
| 1 | Environment metadata | `js/environments.js` → `environments[id]` | **1 object, 9 fields** | strings |
| 2 | `npcTypes` pool | `js/environments.js` → `environments[id].npcTypes` | **5 strings** | NPC archetype labels |
| 3 | `env_select` choice row | `js/scenes.js` → `scenes.env_select.choices[]` | **1 object, 5 fields** | strings |
| 4 | NPC dialogue (`NPC_TYPE_LINES`) | `js/scenes.js` | **5 entries** (one per `npcType`), each with `quote(name)` + `concern` | function + string |
| 5 | NPC choice flavors (`NPC_TYPE_CHOICES`) | `js/scenes.js` | **5 entries** (one per `npcType`), each with 4 lines: `mirror`, `challenge`, `favour`, `personal` | 20 strings |
| 6 | Faction archetypes | `js/npcs.js` → `FACTION_ARCHETYPES[id]` | **6 factions** (`elite`, `workers`, `clergy`, `rural`, `civic`, `capital`), 5 numeric fields + 1 name each | mixed |
| 7 | Map-specific crises | `js/game.js` → `CRISIS_TEMPLATES_BY_ENV[id]` | **2 crises × 3 choices** each | mixed |

### Totals (the “how much do I have to write?” number)

| Bucket | Strings | Numbers / weights |
|---|---|---|
| Environment metadata + env_select | ~14 short strings | — |
| NPC types | 5 short labels | — |
| NPC dialogue + choices | 5 quotes + 5 concerns + 20 choice lines = **30 strings** | — |
| Factions | 6 faction names | 6 × (3 leanings + power range + turnout range) ≈ **30 numbers** |
| Crises | 2 titles + 2 summaries + 6 choice texts + 6 hints = **16 strings** | 2 weight fns + ~18 effect numbers |
| **Per map total** | **≈ 65 strings** | **≈ 50 numbers + 2 weight fns** |

### Runtime sampling rules (so you know what the player actually sees)

- **NPCs encountered per playthrough:** 4 (random sample from your 5 `npcTypes`,
  with random first+last names from `FIRST`/`LAST` in `js/npcs.js`).
  → Write **5** NPC entries so any 4-of-5 draw is fully voiced.
- **Per-NPC interaction:** 4 base choices (mirror / challenge / favour / personal),
  then 1 "Continue canvassing" follow-up.
- **Crisis surfaced in Act II:** 1, weight-picked from your 2 map crises + 2 shared
  crises pool. → Write both map crises so they always land for the right map.
- **Election math:** every faction (6) + every NPC (4) contributes a support score.

---

## 3. Fillable skeletons (copy-paste, then fill the `__FILL__` slots)

> Replace `<MAP_ID>` everywhere with a `snake_case` id, e.g. `prairie_riding`.

### 3a. `js/environments.js` — add to `environments`

```js
<MAP_ID>: {
  id: '<MAP_ID>',
  title: '__FILL__ short human title',           // e.g. "Coastal fishing district"
  era: '__FILL__ year + cycle label',            // e.g. "2026 — Provincial by-election"
  tagline: '__FILL__ one-line vibe',             // e.g. "Lobster, ferries, and feuding wharves"
  flavor:
    '__FILL__ 2–3 sentence atmosphere paragraph that names the place.',
  office: '__FILL__ office title',               // e.g. "MLA", "Mayor", "Premier"
  electionLabel: '__FILL__ vote unit',           // e.g. "Riding projection"
  doomGood: '__FILL__ one-line good-ending zinger.',
  doomBad: '__FILL__ one-line bad-ending zinger.',
  npcTypes: [
    '__FILL__ NPC type 1',                       // 5 distinct archetype labels.
    '__FILL__ NPC type 2',                       // Must match keys you add in
    '__FILL__ NPC type 3',                       // NPC_TYPE_LINES & NPC_TYPE_CHOICES below.
    '__FILL__ NPC type 4',
    '__FILL__ NPC type 5',
  ],
},
```

### 3b. `js/scenes.js` — add a row to `scenes.env_select.choices`

```js
{
  text: '__FILL__ shown to player on the map-pick screen',
  next: 'act1_intro',
  setEnv: '<MAP_ID>',
  environmentKey: '<MAP_ID>',
  environmentLabel: '__FILL__ same human title as environments[].title',
  hint: '__FILL__ one-line gameplay hook (≤6 words)',
},
```

### 3c. `js/scenes.js` — add to `NPC_TYPE_LINES` (one entry per `npcType`)

Repeat this block **5 times**, once per label you listed in `npcTypes`.

```js
'__FILL__ NPC type 1': {
  quote: (name) =>
    `__FILL__ Opening in-character line. Reference $\{name\} once and one concrete local detail.`,
  concern: '__FILL__ One sentence summarizing the issues this archetype tracks.',
},
```

### 3d. `js/scenes.js` — add to `NPC_TYPE_CHOICES` (one entry per `npcType`)

Repeat **5 times**. Each archetype needs all four approaches written.

```js
'__FILL__ NPC type 1': {
  mirror:    '__FILL__ Agree with their instincts; promise their priorities.',
  challenge: '__FILL__ Push back; argue against their preferred coalition.',
  favour:    '__FILL__ Offer a concrete transactional benefit (contract / exemption / project).',
  personal:  '__FILL__ Skip policy; share a personal story to build trust.',
},
```

> If you skip 3d for an archetype, runtime falls back to generic English placeholder
> labels (`Mirror their instincts — agree on taxes, morals, and order`, etc.).

### 3e. `js/npcs.js` — add to `FACTION_ARCHETYPES`

You **must** define all six faction ids. They drive election math and crisis weighting.

```js
<MAP_ID>: [
  { id: 'elite',   name: '__FILL__ local elite faction name',
    leanings: { economic: __N__, social: __N__, authority: __N__ },
    power: [__lo__, __hi__], turnout: [__lo__, __hi__] },
  { id: 'workers', name: '__FILL__ local labor faction name',
    leanings: { economic: __N__, social: __N__, authority: __N__ },
    power: [__lo__, __hi__], turnout: [__lo__, __hi__] },
  { id: 'clergy',  name: '__FILL__ local tradition/values bloc',
    leanings: { economic: __N__, social: __N__, authority: __N__ },
    power: [__lo__, __hi__], turnout: [__lo__, __hi__] },
  { id: 'rural',   name: '__FILL__ local outlying / fringe bloc',
    leanings: { economic: __N__, social: __N__, authority: __N__ },
    power: [__lo__, __hi__], turnout: [__lo__, __hi__] },
  { id: 'civic',   name: '__FILL__ local reform / progressive bloc',
    leanings: { economic: __N__, social: __N__, authority: __N__ },
    power: [__lo__, __hi__], turnout: [__lo__, __hi__] },
  { id: 'capital', name: '__FILL__ local capital / industry bloc',
    leanings: { economic: __N__, social: __N__, authority: __N__ },
    power: [__lo__, __hi__], turnout: [__lo__, __hi__] },
],
```

Guidance for the numbers:

- `leanings.*` range roughly **−30 … +30** (signed). Existing maps stay inside ±28.
- `power` is a **[min, max]** multiplier; typical ranges seen in code: `0.68 … 1.30`.
- `turnout` is a **[min, max]** percent; typical ranges: `40 … 82`.

### 3f. `js/game.js` — add to `CRISIS_TEMPLATES_BY_ENV`

Author **2** map-specific crises. Each needs exactly **3** choices.

```js
<MAP_ID>: [
  {
    id: '<MAP_ID>_crisis_1_slug',
    title: '__FILL__ Crisis headline',
    summary:
      '__FILL__ 2–3 sentences describing what is breaking and the political stakes.',
    weight: (state) => 1 + __FILL__,    // bias toward states where this crisis matters
    choices: [
      { text: '__FILL__ option A',
        hint: '__FILL__ ≤3-word tag',
        effects: { /* axes + approval + budgetRoom etc. */ },
        promiseDelta: { /* optional */ },
        // coalition: 'patrons' | 'workers' | 'unity' | 'broad_coalition' | 'merchants' | 'elite'
      },
      { text: '__FILL__ option B', hint: '__FILL__', effects: { /* … */ } },
      { text: '__FILL__ option C', hint: '__FILL__', effects: { /* … */ } },
    ],
  },
  {
    id: '<MAP_ID>_crisis_2_slug',
    title: '__FILL__',
    summary: '__FILL__',
    weight: (state) => 1 + __FILL__,
    choices: [ /* 3 entries — same shape as above */ ],
  },
],
```

Reference axes used by `effects`/`promiseDelta`: `economic`, `social`, `authority`,
`approval`, `campaignKnowledge`, `mediaLiteracy`, `misinformationRisk`, `rivalHeat`,
`budgetRoom`, `institutionalTrust`. Promise ids: `tax_relief`, `public_services`,
`tradition`, `rights`, `order`, `liberty`.

---

## 4. Inventory: current state of each campaign map

Live audit of the 6 maps shipped today, so you can see what still needs filling.

| Map id | env metadata | `npcTypes` (5) | `NPC_TYPE_LINES` | `NPC_TYPE_CHOICES` | Factions (6) | Crises (2) |
|---|---|---|---|---|---|---|
| `quebec_town`           | ✅ | ✅ 5 | ✅ 5/5 | ✅ 5/5 | ✅ | ✅ |
| `ontario_suburb`        | ✅ | ✅ 5 | ✅ 5/5 | ✅ 5/5 | ✅ | ✅ |
| `vancouver_city`        | ✅ | ✅ 5 | ✅ 5/5 | ✅ 5/5 | ✅ | ✅ |
| `entire_provinces`      | ✅ | ✅ 5 | ✅ 5/5 | ✅ 5/5 | ✅ | ✅ |
| `northwest_territories` | ✅ | ✅ 5 | ✅ 5/5 | ✅ 5/5 | ✅ | ✅ |
| `canada_whole`          | ✅ | ✅ 5 | ✅ 5/5 | ✅ 5/5 | ✅ | ✅ |

> All 30 NPC archetypes shipping in the base game now have flavored
> `mirror / challenge / favour / personal` choices. The generic English fallback
> in `getNpcTalkScene` only triggers if you add a new `npcType` to an environment
> without also adding a matching entry to `NPC_TYPE_CHOICES` in `js/scenes.js`.

---

## 5. Shared (non-map) scenes — for reference only

These are written once and do **not** need to be re-authored per map.
Adjust them in `js/scenes.js` only if you’re changing the loop globally.

| Scene id | Choices | What it sets |
|---|---|---|
| `act1_intro` | 3 | Campaign style (door-to-door / rallies / back rooms) |
| `act1_field_ops` | 3 | Volunteer ladder vs. consultants vs. issue pop-ups |
| `act1_social_media` | 4 | Transparency / spin / astroturf / community |
| `act1_rivalry` | 3 | Hard contrast / issue truce / backchannel |
| `act1_fundraising` | 3 | Merchants / labour / small donors |
| `act1_promises` | 4 | Pillar #1 (tax_relief / public_services / tradition / rights) |
| `act1_promises_2` | 4 | Pillar #2 (order / liberty / tax_relief / public_services) |
| `act2_start` | 3 | Constitutional structure |
| `act2_officials` | 3 | Cross-party / loyalist / transactional |
| `act2_policy` | 3 | Nationalize / privatize / centrist |
| `act2_coalition` | 3 | Unity / purge / plebiscite |
| `act3_polling` | 4 | Final move before judgment |
| endings | 10 variants | See `endings[]` in `scenes.js` |

There are also **2 shared crisis templates** (`shared_pandemic_wave`,
`shared_fiscal_cliff`) in the Act II crisis pool that fire in any environment.

---

## 6. New-map authoring checklist

Tick these off when adding a new map; you’re done when every box is checked.

- [ ] Decide a `snake_case` `<MAP_ID>`.
- [ ] Add the env metadata block (§3a) with all 9 fields filled.
- [ ] Add the row to `scenes.env_select.choices` (§3b).
- [ ] Write 5 NPC `quote` + `concern` entries in `NPC_TYPE_LINES` (§3c).
- [ ] Write 5 `mirror / challenge / favour / personal` blocks in `NPC_TYPE_CHOICES` (§3d).
- [ ] Add all 6 faction archetypes in `FACTION_ARCHETYPES[<MAP_ID>]` (§3e).
- [ ] Add 2 map-specific crises × 3 choices in `CRISIS_TEMPLATES_BY_ENV[<MAP_ID>]` (§3f).
- [ ] Smoke-test: pick your map from the opener, canvas 4 NPCs, trigger Act II crisis, finish Act III.
