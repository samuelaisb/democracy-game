import { environments } from './environments.js';
import { leaningLabel } from './npcs.js';

/** @typedef {{ economic?: number, social?: number, authority?: number, approval?: number }} AxisDelta */
/** @typedef {{ text: string, next: string, effects?: AxisDelta, hint?: string, promise?: string, coalition?: string, swayNpc?: number, setEnv?: import('./environments.js').EnvironmentId }} Choice */
/** @typedef {{ id: string, act?: number, year?: number, eyebrow?: string, title: string, body: string[], choices: Choice[], ending?: boolean, npcPanel?: boolean }} Scene */

/** @type {Record<string, Scene>} */
export const scenes = {
  env_select: {
    id: 'env_select',
    act: 0,
    eyebrow: 'Choose your world',
    title: 'Where will you fight for power?',
    body: [
      'Every age asks the same question: who speaks for the people, and who merely performs it?',
      'Pick the realm where your story begins. NPCs, customs, and the price of failure all change with the setting.',
    ],
    choices: [
      {
        text: '17th-Century France — intrigue at court and bread in the streets',
        next: 'act1_intro',
        setEnv: 'france_1630',
        hint: 'Patronage & pulpit',
      },
      {
        text: 'Modern-Day Canada — federal halls and frozen doorsteps',
        next: 'act1_intro',
        setEnv: 'canada_modern',
        hint: 'Coalition politics',
      },
      {
        text: 'Classical Athens — rhetoric under the open sky',
        next: 'act1_intro',
        setEnv: 'athens_450bc',
        hint: 'Assembly & ostracism',
      },
    ],
  },

  act1_intro: {
    id: 'act1_intro',
    act: 1,
    eyebrow: 'Act I — Running for office',
    title: 'The long road to power',
    body: [
      'You are nobody until the ballots — or favours — say otherwise. Patrons want loyalty. Crowds want bread. Idealists want tomorrow.',
      'How you campaign determines who believes you when it matters.',
    ],
    choices: [
      {
        text: 'Door-to-door: listen first, promise second',
        next: 'act1_fundraising',
        effects: { social: -4, authority: -3, approval: 4 },
        hint: 'Grassroots trust',
      },
      {
        text: 'Grand rallies: sell a vision, details later',
        next: 'act1_fundraising',
        effects: { authority: 5, approval: 2 },
        hint: 'Charismatic momentum',
      },
      {
        text: 'Back-room deals: secure sponsors before the public',
        next: 'act1_fundraising',
        effects: { economic: 6, authority: 4 },
        coalition: 'patrons',
        hint: 'Elite backing',
      },
    ],
  },

  act1_fundraising: {
    id: 'act1_fundraising',
    act: 1,
    eyebrow: 'Act I — War chest',
    title: 'Who pays for your voice?',
    body: [
      'Posters, guards, feasts, and favours — power has a price. The purse strings you accept now will be remembered.',
    ],
    choices: [
      {
        text: 'Merchant guilds — low taxes, fewer inspections',
        next: 'act1_npc_talk',
        effects: { economic: 10 },
        coalition: 'merchants',
        hint: 'Business right',
      },
      {
        text: 'Labour halls & mutual-aid societies',
        next: 'act1_npc_talk',
        effects: { economic: -10, social: -4 },
        coalition: 'workers',
        hint: 'Organized left',
      },
      {
        text: 'Mixed small donors — no single master',
        next: 'act1_npc_talk',
        effects: { approval: 6, authority: -2 },
        hint: 'Independent image',
      },
    ],
  },

  act1_promises: {
    id: 'act1_promises',
    act: 1,
    eyebrow: 'Act I — The platform',
    title: 'What do you swear to deliver?',
    body: [
      'You have met the shapers of public opinion. Now bind yourself in words the whole realm can repeat.',
      'Choose two pillars for your platform. Contradictions cost trust at the ballot.',
    ],
    choices: [
      {
        text: 'Tax relief for families and enterprise',
        next: 'act1_promises_2',
        promise: 'tax_relief',
        effects: { economic: 8 },
        hint: 'Economic right',
      },
      {
        text: 'Universal schools, clinics, and pensions',
        next: 'act1_promises_2',
        promise: 'public_services',
        effects: { economic: -8, approval: 4 },
        hint: 'Welfare state',
      },
      {
        text: 'Restore tradition, faith, and local custom',
        next: 'act1_promises_2',
        promise: 'tradition',
        effects: { social: 10 },
        hint: 'Cultural conservative',
      },
      {
        text: 'Expand rights for minorities and dissenters',
        next: 'act1_promises_2',
        promise: 'rights',
        effects: { social: -10, approval: 3 },
        hint: 'Social progressive',
      },
    ],
  },

  act1_promises_2: {
    id: 'act1_promises_2',
    act: 1,
    eyebrow: 'Act I — The platform',
    title: 'Your second vow',
    body: ['One promise is on the record. The crowd waits for the other shoe to drop.'],
    choices: [
      {
        text: 'Order above all — curfews, spies, swift justice',
        next: 'election_night',
        promise: 'order',
        effects: { authority: 12 },
        hint: 'Security state',
      },
      {
        text: 'Liberty above all — limits on power, open trials',
        next: 'election_night',
        promise: 'liberty',
        effects: { authority: -12 },
        hint: 'Civil freedoms',
      },
      {
        text: 'Prosperity pact — growth now, reform later',
        next: 'election_night',
        promise: 'tax_relief',
        effects: { economic: 6, approval: -2 },
        hint: 'Pragmatic centre',
      },
      {
        text: 'Solidarity forever — nobody left behind',
        next: 'election_night',
        promise: 'public_services',
        effects: { economic: -6, approval: 5 },
        hint: 'Populist left',
      },
    ],
  },

  election_night: {
    id: 'election_night',
    act: 1,
    eyebrow: 'Act I — Election night',
    title: 'The count',
    body: ['Tally sheets rustle. Supporters hold their breath.'],
    choices: [],
  },

  act2_start: {
    id: 'act2_start',
    act: 2,
    year: 1,
    eyebrow: 'Act II — Establishing government',
    title: 'The oath and the inbox',
    body: [
      'Victory is yours — fragile, shouted, paid for in promises. Before policy comes structure: how will this republic actually decide?',
    ],
    choices: [
      {
        text: 'Strong executive — you decide, ministers execute',
        next: 'act2_policy',
        effects: { authority: 14 },
        hint: 'Presidential system',
      },
      {
        text: 'Parliament supreme — laws flow from the chamber',
        next: 'act2_policy',
        effects: { authority: -10, social: -3 },
        hint: 'Legislative supremacy',
      },
      {
        text: 'Power shared — coalition cabinet and veto partners',
        next: 'act2_policy',
        effects: { authority: -4, approval: 5 },
        coalition: 'broad_coalition',
        hint: 'Consensus governance',
      },
    ],
  },

  act2_policy: {
    id: 'act2_policy',
    act: 2,
    year: 2,
    eyebrow: 'Act II — First legislation',
    title: 'The signature bill',
    body: [
      'Sponsors knock. Protesters drum. Your first great law will tell the realm what you truly value.',
    ],
    choices: [
      {
        text: 'Nationalise strategic industry & fund public works',
        next: 'act2_crisis',
        effects: { economic: -14, approval: 6 },
        coalition: 'workers',
        hint: 'State-led economy',
      },
      {
        text: 'Privatize monopolies and cut business taxes',
        next: 'act2_crisis',
        effects: { economic: 14, approval: -4 },
        coalition: 'merchants',
        hint: 'Market revolution',
      },
      {
        text: 'Carbon levy + child benefits — technocratic package',
        next: 'act2_crisis',
        effects: { economic: -4, social: -4, approval: 3 },
        hint: 'Centrist reform',
      },
    ],
  },

  act2_crisis: {
    id: 'act2_crisis',
    act: 2,
    year: 3,
    eyebrow: 'Act II — Crisis management',
    title: 'Midnight cables',
    body: [
      'A scandal, a shortage, a border surge — pick your poison. Coalitions you built now demand payback.',
    ],
    choices: [
      {
        text: 'Invoke emergency powers; postpone the opposition',
        next: 'act2_coalition',
        effects: { authority: 16, approval: -10 },
        hint: 'Authoritarian gamble',
      },
      {
        text: 'Call a confidence vote and dare rivals to collapse you',
        next: 'act2_coalition',
        effects: { authority: -6, approval: 4 },
        hint: 'Democratic brinkmanship',
      },
      {
        text: 'Buy peace — subsidies for allies, investigations for enemies',
        next: 'act2_coalition',
        effects: { economic: -6, approval: 2 },
        coalition: 'patrons',
        hint: 'Patronage politics',
      },
    ],
  },

  act2_coalition: {
    id: 'act2_coalition',
    act: 2,
    year: 3,
    eyebrow: 'Act II — Coalitions',
    title: 'Who stands with you?',
    body: [
      'Your majority frays. You can widen the tent or purge the doubters — both have a body count in polling.',
    ],
    choices: [
      {
        text: 'Invite rivals into a national unity cabinet',
        next: 'act3_polling',
        effects: { authority: -8, approval: 8 },
        coalition: 'unity',
        hint: 'Grand coalition',
      },
      {
        text: 'Discipline your base; let defectors flee',
        next: 'act3_polling',
        effects: { authority: 6, social: 4, approval: -5 },
        hint: 'Partisan purity',
      },
      {
        text: 'Plebiscite — let the people ratify your course',
        next: 'act3_polling',
        effects: { authority: -12, approval: 10 },
        hint: 'Direct democracy',
      },
    ],
  },

  act3_polling: {
    id: 'act3_polling',
    act: 3,
    year: 4,
    eyebrow: 'Act III — Judgment',
    title: 'The poll that decides your neck',
    body: [
      'Years of compromise calcify into a number. Approval. Fear. Memory of promises kept or broken.',
      'The realm asks: hero, mediocrity, or head on a pike?',
    ],
    choices: [
      {
        text: 'Victory lap tour — remind them what you built',
        next: 'end',
        effects: { approval: 8 },
        hint: 'Boost popularity',
      },
      {
        text: 'Quiet retirement — leave before the mob gathers',
        next: 'end',
        effects: { approval: -5, authority: -6 },
        hint: 'Timid exit',
      },
      {
        text: 'Double down — one more polarizing decree',
        next: 'end',
        effects: { approval: -12, authority: 10 },
        hint: 'High risk',
      },
      {
        text: 'Truth and reconciliation commission — air every grievance',
        next: 'end',
        effects: { approval: 5, social: -8, authority: -8 },
        hint: 'Moral reckoning',
      },
    ],
  },

  ending_defeat: {
    id: 'ending_defeat',
    ending: true,
    title: 'Defeated before you ruled',
    body: [],
    choices: [],
  },

  end: {
    id: 'end',
    ending: true,
    title: 'Term complete',
    body: [],
    choices: [],
  },
};

/** @param {import('./npcs.js').generateCampaignNPCs extends (...args: any) => infer R ? R[0] : never} npc */
export function getNpcTalkScene(npc, envId, index, total) {
  const env = envId ? environments[envId] : null;
  const econ = leaningLabel('economic', npc.leanings.economic);
  const soc = leaningLabel('social', npc.leanings.social);
  const auth = leaningLabel('authority', npc.leanings.authority);

  return {
    id: 'act1_npc_talk',
    act: 1,
    eyebrow: `Act I — Canvassing (${index + 1}/${total})`,
    title: `${npc.name}, ${npc.type}`,
    npcPanel: true,
    body: [
      `"${env?.flavor.split('.')[0] ?? 'The realm'} watches," ${npc.name} says. "Convince me you mean what you sell."`,
      `You sense they lean ${econ} on purse strings, ${soc} on culture, ${auth} on how hard the state should grip.`,
    ],
    choices: [
      {
        text: 'Mirror their instincts — agree on taxes, morals, and order',
        next: 'act1_npc_talk',
        effects: {
          economic: Math.sign(npc.leanings.economic) * 4,
          social: Math.sign(npc.leanings.social) * 4,
          authority: Math.sign(npc.leanings.authority) * 4,
        },
        swayNpc: 0.35,
        hint: 'Pander (+sway)',
      },
      {
        text: 'Challenge them — argue for the opposite coalition',
        next: 'act1_npc_talk',
        effects: {
          economic: -Math.sign(npc.leanings.economic) * 6,
          approval: 2,
        },
        swayNpc: -0.25,
        hint: 'Principled risk',
      },
      {
        text: 'Offer a concrete favour — job, contract, exemption',
        next: 'act1_npc_talk',
        effects: { economic: 5, authority: 3, approval: -3 },
        swayNpc: 0.2,
        coalition: 'patrons',
        hint: 'Transactional',
      },
      {
        text: 'Share a personal story — no policy, just trust',
        next: 'act1_npc_talk',
        effects: { social: -2, authority: -2, approval: 4 },
        swayNpc: 0.15,
        hint: 'Human connection',
      },
    ],
  };
}

/** @param {import('./game.js').createInitialState extends () => infer S ? S : never} state */
export function getElectionScene(state) {
  const env = state.environmentId ? environments[state.environmentId] : null;
  const result = state.election;
  const pct = result?.percent ?? 0;
  const won = result?.won ?? false;

  const body = [
    `${env?.electionLabel ?? 'Votes'} roll in across ${env?.title ?? 'the realm'}.`,
    won
      ? `You clear the bar with ${pct}% favour. Allies cheer; enemies already plot your first mistake.`
      : `You finish at ${pct}% — short of power. Patrons vanish. Rivals carve your promises into jokes.`,
  ];

  return {
    id: 'election_night',
    act: 1,
    eyebrow: 'Act I — Election night',
    title: won ? 'Victory!' : 'Defeat',
    body,
    choices: won
      ? [{ text: 'Take office and establish government', next: 'act2_start', hint: 'Act II begins' }]
      : [
          {
            text: 'Accept defeat and leave politics',
            next: 'ending_defeat',
            hint: 'Game over',
          },
        ],
  };
}

export const endings = [
  {
    id: 'beloved_leader',
    match: () => true,
    title: 'Beloved — for now',
    subtitle: 'The crowd carries you home.',
    body: [
      'Approval holds. Statues are discussed, not toppled. Whether you earned it or performed it, the people choose to keep you.',
    ],
  },
  {
    id: 'revolution_fury',
    match: () => true,
    title: 'The fury of the mob',
    subtitle: 'Polling became a death sentence.',
    body: [
      'Promises rotted into insults. Coalitions broke. When the final numbers landed, the street answered with rope, blade, or exile.',
    ],
  },
  {
    id: 'campaign_defeat',
    match: () => true,
    title: 'Never took office',
    subtitle: 'The election ended your story early.',
    body: [
      'You misread the rooms that mattered. Patrons shrugged. Voters shrugged louder. Another name will fill the chair you wanted.',
    ],
  },
  {
    id: 'social_democracy',
    match: (s) => s.economic <= -25 && s.authority <= 15,
    title: 'The Social Democratic Republic',
    subtitle: 'Equality secured through institutions.',
    body: [
      'You leave with expanded services and a state willing to tax for dignity. Critics cite bureaucracy; supporters cite results.',
    ],
  },
  {
    id: 'market_liberal',
    match: (s) => s.economic >= 25 && s.authority <= 10,
    title: 'The Market-Liberal Commonwealth',
    subtitle: 'Enterprise unchained.',
    body: [
      'Growth in the capital, strain in the provinces — your term bet on competition and light touch rule.',
    ],
  },
  {
    id: 'conservative_nation',
    match: (s) => s.social >= 20 && s.economic >= 10,
    title: 'The Traditional Nation-State',
    subtitle: 'Order, heritage, guarded borders.',
    body: [
      'Cultural institutions strengthened; immigration tightened. Cohesive to some, closed to others.',
    ],
  },
  {
    id: 'progressive_open',
    match: (s) => s.social <= -20 && s.authority <= -5,
    title: 'The Open Society',
    subtitle: 'Rights expanded; power dispersed.',
    body: [
      'Decentralisation and inclusion define your ledger. Skeptics call it fragile; believers call it freedom.',
    ],
  },
  {
    id: 'strongman',
    match: (s) => s.authority >= 30,
    title: 'The Security State',
    subtitle: 'Stability purchased with liberty.',
    body: [
      'Emergencies outlived crises. Opposition fragmented. Streets are quiet — at a price history will debate.',
    ],
  },
  {
    id: 'technocrat',
    match: (s) =>
      Math.abs(s.economic) <= 15 &&
      Math.abs(s.social) <= 15 &&
      Math.abs(s.authority) <= 15,
    title: 'The Managed Republic',
    subtitle: 'Competence muddled through.',
    body: [
      'Nothing radical passed; nothing collapsed. Voters remember steadiness — or stagnation.',
    ],
  },
  {
    id: 'populist_coalition',
    match: () => true,
    title: 'The Uneasy Coalition',
    subtitle: 'Contradictions held by will alone.',
    body: [
      'Mixed policies pleased no camp fully. New movements stir. The republic survives — argued over, hungry for the next story.',
    ],
  },
];
