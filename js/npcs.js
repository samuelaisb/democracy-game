import { environments, canonicalEnvironmentId } from './environments.js';

const FIRST = [
  'Marie',
  'Jean',
  'Sophie',
  'Pierre',
  'Elena',
  'Marcus',
  'Thalia',
  'Owen',
  'Hana',
  'Luc',
  'Aisha',
  'Theo',
];
const LAST = [
  'Dubois',
  'Singh',
  'Kowalski',
  'Lefevre',
  'Chen',
  'Petrov',
  'Okonkwo',
  'Mercier',
  'Ionescu',
  'Santos',
  'Nguyen',
  'Ariston',
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

const COALITION_TO_FACTIONS = {
  merchants: ['capital'],
  workers: ['workers'],
  patrons: ['elite'],
  elite: ['elite'],
  broad_coalition: ['workers', 'capital', 'rural'],
  unity: ['workers', 'capital', 'civic'],
};

const FACTION_ARCHETYPES = {
  quebec_town: [
    { id: 'elite', name: 'Municipal Establishment', leanings: { economic: 8, social: 10, authority: 12 }, power: [0.95, 1.15], turnout: [52, 68] },
    { id: 'workers', name: 'Farm & Public Works Labor', leanings: { economic: -20, social: -4, authority: -4 }, power: [0.95, 1.2], turnout: [56, 78] },
    { id: 'clergy', name: 'Parish Traditionalists', leanings: { economic: 4, social: 22, authority: 14 }, power: [0.7, 0.95], turnout: [44, 62] },
    { id: 'rural', name: 'Outlying Rang Households', leanings: { economic: -6, social: 12, authority: 8 }, power: [0.95, 1.2], turnout: [58, 80] },
    { id: 'civic', name: 'Co-op Reform Bloc', leanings: { economic: -10, social: -12, authority: -14 }, power: [0.75, 1], turnout: [48, 70] },
    { id: 'capital', name: 'Regional Agri Investors', leanings: { economic: 22, social: 2, authority: 8 }, power: [0.8, 1.05], turnout: [40, 56] },
  ],
  ontario_suburb: [
    { id: 'elite', name: 'Incumbent Council Network', leanings: { economic: 14, social: 6, authority: 14 }, power: [1, 1.22], turnout: [48, 64] },
    { id: 'workers', name: 'Transit and Service Workers', leanings: { economic: -18, social: -8, authority: -2 }, power: [0.9, 1.15], turnout: [54, 74] },
    { id: 'clergy', name: 'Faith and Family Associations', leanings: { economic: 8, social: 22, authority: 12 }, power: [0.72, 0.95], turnout: [45, 61] },
    { id: 'rural', name: 'Suburban Fringe Drivers', leanings: { economic: 16, social: 14, authority: 8 }, power: [0.85, 1.1], turnout: [50, 68] },
    { id: 'civic', name: 'Active Transit Residents', leanings: { economic: -8, social: -16, authority: -16 }, power: [0.8, 1.05], turnout: [52, 72] },
    { id: 'capital', name: 'Property and Retail Consortium', leanings: { economic: 24, social: 4, authority: 6 }, power: [0.95, 1.22], turnout: [42, 58] },
  ],
  vancouver_city: [
    { id: 'elite', name: 'City Hall Insiders', leanings: { economic: 10, social: -2, authority: 14 }, power: [0.95, 1.2], turnout: [46, 62] },
    { id: 'workers', name: 'Service and Gig Workers', leanings: { economic: -24, social: -10, authority: -8 }, power: [0.95, 1.18], turnout: [56, 76] },
    { id: 'clergy', name: 'Neighborhood Traditionalists', leanings: { economic: 8, social: 18, authority: 10 }, power: [0.68, 0.92], turnout: [42, 58] },
    { id: 'rural', name: 'Metro Fringe Commuters', leanings: { economic: 14, social: 10, authority: 6 }, power: [0.8, 1.05], turnout: [48, 66] },
    { id: 'civic', name: 'Urban Tenants Coalition', leanings: { economic: -14, social: -24, authority: -18 }, power: [0.92, 1.2], turnout: [56, 78] },
    { id: 'capital', name: 'Port and Finance Circle', leanings: { economic: 28, social: -4, authority: 8 }, power: [1.02, 1.28], turnout: [44, 60] },
  ],
  entire_provinces: [
    { id: 'elite', name: 'Premiers and Party Brass', leanings: { economic: 12, social: 8, authority: 20 }, power: [1.05, 1.3], turnout: [45, 60] },
    { id: 'workers', name: 'Provincial Labor Front', leanings: { economic: -22, social: -8, authority: -2 }, power: [0.95, 1.2], turnout: [54, 74] },
    { id: 'clergy', name: 'Values Coalition', leanings: { economic: 8, social: 24, authority: 16 }, power: [0.7, 0.95], turnout: [44, 62] },
    { id: 'rural', name: 'Resource Region Bloc', leanings: { economic: 18, social: 14, authority: 10 }, power: [0.95, 1.2], turnout: [52, 72] },
    { id: 'civic', name: 'Federalist Civil Forum', leanings: { economic: -6, social: -20, authority: -14 }, power: [0.8, 1.06], turnout: [52, 72] },
    { id: 'capital', name: 'Interprovincial Capital Desk', leanings: { economic: 26, social: 2, authority: 12 }, power: [1, 1.26], turnout: [42, 58] },
  ],
  northwest_territories: [
    { id: 'elite', name: 'Consensus Leadership Circle', leanings: { economic: 6, social: 8, authority: 12 }, power: [0.9, 1.1], turnout: [50, 68] },
    { id: 'workers', name: 'Public Service and Health Staff', leanings: { economic: -20, social: -10, authority: -4 }, power: [0.95, 1.18], turnout: [55, 76] },
    { id: 'clergy', name: 'Community Tradition Elders', leanings: { economic: 4, social: 18, authority: 8 }, power: [0.68, 0.92], turnout: [46, 66] },
    { id: 'rural', name: 'Remote Hamlet Households', leanings: { economic: -4, social: 10, authority: 6 }, power: [1, 1.22], turnout: [58, 82] },
    { id: 'civic', name: 'Youth and Climate Advocates', leanings: { economic: -10, social: -22, authority: -16 }, power: [0.8, 1.04], turnout: [52, 74] },
    { id: 'capital', name: 'Extraction and Logistics Firms', leanings: { economic: 22, social: 0, authority: 10 }, power: [0.88, 1.12], turnout: [40, 56] },
  ],
  canada_whole: [
    { id: 'elite', name: 'National Party Establishment', leanings: { economic: 10, social: 4, authority: 16 }, power: [1, 1.25], turnout: [46, 60] },
    { id: 'workers', name: 'Labour Bloc', leanings: { economic: -28, social: -12, authority: -4 }, power: [0.95, 1.2], turnout: [55, 76] },
    { id: 'clergy', name: 'Faith Conservatives', leanings: { economic: 10, social: 26, authority: 18 }, power: [0.75, 1], turnout: [46, 63] },
    { id: 'rural', name: 'Rural Provinces', leanings: { economic: 20, social: 18, authority: 10 }, power: [0.9, 1.15], turnout: [50, 70] },
    { id: 'civic', name: 'Civil Liberties Network', leanings: { economic: -6, social: -28, authority: -26 }, power: [0.85, 1.1], turnout: [54, 74] },
    { id: 'capital', name: 'Finance and Tech Capital', leanings: { economic: 28, social: -2, authority: 6 }, power: [1, 1.28], turnout: [42, 60] },
  ],
};

const PROMISE_AFFINITY = {
  tax_relief: { axis: 'economic', target: 1 },
  public_services: { axis: 'economic', target: -1 },
  tradition: { axis: 'social', target: 1 },
  rights: { axis: 'social', target: -1 },
  order: { axis: 'authority', target: 1 },
  liberty: { axis: 'authority', target: -1 },
};

/** @param {import('./environments.js').EnvironmentId} envId */
export function generateCampaignNPCs(envId, count = 4) {
  const resolved = canonicalEnvironmentId(envId) ?? 'canada_whole';
  const env = environments[resolved];
  const used = new Set();
  const npcs = [];

  for (let i = 0; i < count; i++) {
    let name;
    do {
      name = `${pick(FIRST)} ${pick(LAST)}`;
    } while (used.has(name));
    used.add(name);

    npcs.push({
      id: `npc_${i}`,
      name,
      type: pick(env.npcTypes),
      leanings: {
        economic: randInt(-35, 35),
        social: randInt(-35, 35),
        authority: randInt(-35, 35),
      },
      /** How much conversation can move them (-1 to 1 after talks) */
      sway: 0,
      met: false,
    });
  }
  return npcs;
}

/** @param {import('./environments.js').EnvironmentId} envId */
export function generateCampaignFactions(envId) {
  const resolved = canonicalEnvironmentId(envId) ?? 'canada_whole';
  const env = environments[resolved];
  const archetypes = FACTION_ARCHETYPES[env.id] ?? FACTION_ARCHETYPES.canada_whole;
  return archetypes.map((faction) => ({
    id: faction.id,
    name: faction.name,
    leanings: {
      economic: clamp(faction.leanings.economic + randInt(-8, 8), -40, 40),
      social: clamp(faction.leanings.social + randInt(-8, 8), -40, 40),
      authority: clamp(faction.leanings.authority + randInt(-8, 8), -40, 40),
    },
    power: randInt(Math.round(faction.power[0] * 100), Math.round(faction.power[1] * 100)) / 100,
    turnout: randInt(faction.turnout[0], faction.turnout[1]),
    trust: randInt(42, 58),
    radicalization: randInt(8, 26),
  }));
}

/**
 * @param {ReturnType<typeof generateCampaignNPCs>[0]} npc
 * @param {{ economic: number, social: number, authority: number }} playerAxes
 * @param {string[]} promises
 */
export function npcSupportScore(npc, playerAxes, promises = []) {
  const d =
    Math.abs(playerAxes.economic - npc.leanings.economic) +
    Math.abs(playerAxes.social - npc.leanings.social) +
    Math.abs(playerAxes.authority - npc.leanings.authority);

  let score = Math.max(0, 100 - d * 1.4);
  score += npc.sway * 22;

  if (promises.includes('tax_relief') && npc.leanings.economic > 10) score += 8;
  if (promises.includes('public_services') && npc.leanings.economic < -10) score += 8;
  if (promises.includes('tradition') && npc.leanings.social > 10) score += 8;
  if (promises.includes('rights') && npc.leanings.social < -10) score += 8;
  if (promises.includes('order') && npc.leanings.authority > 10) score += 8;
  if (promises.includes('liberty') && npc.leanings.authority < -10) score += 8;

  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * @param {{ id: string, leanings: { economic: number, social: number, authority: number }, trust: number, radicalization: number }} faction
 * @param {{ economic: number, social: number, authority: number }} playerAxes
 * @param {Record<string, { status: 'made' | 'at_risk' | 'fulfilled' | 'broken', progress: number }>} promiseLedger
 */
export function factionSupportScore(faction, playerAxes, promiseLedger = {}) {
  const d =
    Math.abs(playerAxes.economic - faction.leanings.economic) +
    Math.abs(playerAxes.social - faction.leanings.social) +
    Math.abs(playerAxes.authority - faction.leanings.authority);
  let score = Math.max(0, 100 - d * 1.05);
  score += (faction.trust - 50) * 0.85;
  score -= faction.radicalization * 0.22;

  for (const [promiseId, ledger] of Object.entries(promiseLedger)) {
    const affinity = PROMISE_AFFINITY[promiseId];
    if (!affinity) continue;
    const aligns = Math.sign(faction.leanings[affinity.axis]) === affinity.target;
    if (!aligns) continue;
    if (ledger.status === 'fulfilled') score += 8;
    if (ledger.status === 'broken') score -= 14;
    if (ledger.status === 'at_risk') score -= 5;
  }

  return Math.round(clamp(score, 0, 100));
}

/**
 * @param {ReturnType<typeof generateCampaignFactions>} factions
 * @param {import('./scenes.js').Choice} choice
 * @param {{ economic: number, social: number, authority: number }} playerAxes
 * @param {Record<string, { status: 'made' | 'at_risk' | 'fulfilled' | 'broken', progress: number }>} promiseLedger
 */
export function updateFactionsAfterChoice(factions, choice, playerAxes, promiseLedger = {}) {
  const coalitionTargets = choice.coalition ? COALITION_TO_FACTIONS[choice.coalition] ?? [] : [];
  const approvalPulse = choice.effects?.approval ?? 0;
  const brokenCount = Object.values(promiseLedger).filter((p) => p.status === 'broken').length;

  return factions.map((faction) => {
    let trust = faction.trust;
    let radicalization = faction.radicalization;
    const distance =
      Math.abs(playerAxes.economic - faction.leanings.economic) +
      Math.abs(playerAxes.social - faction.leanings.social) +
      Math.abs(playerAxes.authority - faction.leanings.authority);

    trust += approvalPulse * 0.35;
    if (distance < 42) trust += 1.8;
    else if (distance > 90) trust -= 2.2;

    if (coalitionTargets.includes(faction.id)) trust += 6;
    else if (choice.coalition && choice.coalition !== 'unity') trust -= 1.2;

    if ((choice.effects?.authority ?? 0) >= 8 && faction.leanings.authority <= -10) radicalization += 3;
    if ((choice.effects?.authority ?? 0) <= -8 && faction.leanings.authority >= 10) radicalization += 2;
    radicalization += brokenCount * 0.6;
    radicalization -= approvalPulse > 0 ? 0.8 : 0;

    const support = factionSupportScore(
      { ...faction, trust: clamp(trust, 0, 100), radicalization: clamp(radicalization, 0, 100) },
      playerAxes,
      promiseLedger
    );
    const turnout = clamp(
      faction.turnout + Math.round((support - 50) * 0.12 + (radicalization - 20) * 0.15),
      25,
      95
    );

    return {
      ...faction,
      trust: Math.round(clamp(trust, 0, 100)),
      radicalization: Math.round(clamp(radicalization, 0, 100)),
      turnout,
    };
  });
}

/** @param {ReturnType<typeof generateCampaignNPCs>} npcs */
export function computeElectionResult(
  npcs,
  factions = [],
  playerAxes,
  promises,
  promiseLedger = {},
  state = null
) {
  if (!npcs.length && !factions.length) {
    return { percent: 0, won: false, seatsWon: 0, seatsTotal: 0, districtResults: [], breakdown: [] };
  }

  const breakdown = npcs.map((npc) => ({
    name: npc.name,
    type: npc.type,
    support: npcSupportScore(npc, playerAxes, promises),
    weight: 1,
  }));

  for (const faction of factions) {
    breakdown.push({
      name: faction.name,
      type: 'Faction',
      support: factionSupportScore(faction, playerAxes, promiseLedger),
      weight: faction.power * (faction.turnout / 100) * 2.8,
    });
  }

  const totalWeight = breakdown.reduce((sum, b) => sum + b.weight, 0) || 1;
  const weighted = breakdown.reduce((sum, b) => sum + b.support * b.weight, 0);
  const percent = Math.round(weighted / totalWeight);
  const seatsTotal = 7;
  const districts = Array.from({ length: seatsTotal }, (_, i) => {
    const localNoise = randInt(-12, 12);
    const literacyBoost = ((state?.mediaLiteracy ?? 50) - 50) * 0.12;
    const misinfoPenalty = ((state?.misinformationRisk ?? 20) - 20) * 0.16;
    const organizingBoost = ((state?.campaignKnowledge ?? 40) - 40) * 0.15;
    const rivalPenalty = ((state?.rivalHeat ?? 35) - 35) * 0.12;
    const support = clamp(
      Math.round(percent + localNoise + literacyBoost + organizingBoost - misinfoPenalty - rivalPenalty),
      0,
      100
    );
    return {
      district: `District ${i + 1}`,
      support,
      won: support >= 50,
    };
  });
  const seatsWon = districts.filter((d) => d.won).length;
  const won = seatsWon > Math.floor(seatsTotal / 2);

  return { percent, won, seatsWon, seatsTotal, districtResults: districts, breakdown };
}

export function leaningLabel(axis, value) {
  if (value <= -18) return axis === 'economic' ? 'left' : axis === 'social' ? 'progressive' : 'libertarian';
  if (value >= 18) return axis === 'economic' ? 'right' : axis === 'social' ? 'traditional' : 'authoritarian';
  return 'centrist';
}
