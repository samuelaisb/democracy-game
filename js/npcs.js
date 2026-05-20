import { environments } from './environments.js';

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

/** @param {import('./environments.js').EnvironmentId} envId */
export function generateCampaignNPCs(envId, count = 4) {
  const env = environments[envId];
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

/** @param {ReturnType<typeof generateCampaignNPCs>} npcs */
export function computeElectionResult(npcs, playerAxes, promises) {
  if (!npcs.length) return { percent: 0, won: false, breakdown: [] };

  const breakdown = npcs.map((npc) => ({
    name: npc.name,
    type: npc.type,
    support: npcSupportScore(npc, playerAxes, promises),
  }));

  const percent = Math.round(
    breakdown.reduce((sum, b) => sum + b.support, 0) / breakdown.length
  );
  const won = percent >= 52;

  return { percent, won, breakdown };
}

export function leaningLabel(axis, value) {
  if (value <= -18) return axis === 'economic' ? 'left' : axis === 'social' ? 'progressive' : 'libertarian';
  if (value >= 18) return axis === 'economic' ? 'right' : axis === 'social' ? 'traditional' : 'authoritarian';
  return 'centrist';
}
