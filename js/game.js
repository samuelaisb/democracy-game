import { scenes, endings, getNpcTalkScene, getElectionScene } from './scenes.js';
import { generateCampaignNPCs, computeElectionResult } from './npcs.js';
import { environments } from './environments.js';

const AXIS_MIN = -50;
const AXIS_MAX = 50;
const CLAMP = (v) => Math.max(AXIS_MIN, Math.min(AXIS_MAX, v));

/** @typedef {{ economic: number, social: number, authority: number }} Axes */
/** @typedef {import('./environments.js').EnvironmentId} EnvironmentId */

export function createInitialState() {
  return {
    sceneId: 'env_select',
    act: 0,
    environmentId: /** @type {EnvironmentId | null} */ (null),
    year: 0,
    axes: { economic: 0, social: 0, authority: 0 },
    approval: 50,
    promises: /** @type {string[]} */ ([]),
    npcs: [],
    npcIndex: 0,
    election: /** @type {{ percent: number, won: boolean, breakdown: { name: string, type: string, support: number }[] } | null} */ (
      null
    ),
    coalition: /** @type {string[]} */ ([]),
    history: [],
  };
}

/**
 * @param {ReturnType<typeof createInitialState>} state
 * @param {import('./scenes.js').Choice} choice
 */
export function applyChoice(state, choice) {
  const next = {
    ...state,
    axes: { ...state.axes },
    promises: [...state.promises],
    coalition: [...state.coalition],
    history: [...state.history, choice.text],
  };

  const effects = choice.effects ?? {};
  for (const key of /** @type {const} */ (['economic', 'social', 'authority'])) {
    if (effects[key] != null) {
      next.axes[key] = CLAMP(next.axes[key] + effects[key]);
    }
  }
  if (effects.approval != null) {
    next.approval = Math.max(0, Math.min(100, next.approval + effects.approval));
  }
  if (choice.promise && !next.promises.includes(choice.promise)) {
    next.promises.push(choice.promise);
  }
  if (choice.coalition && !next.coalition.includes(choice.coalition)) {
    next.coalition.push(choice.coalition);
  }
  if (choice.setEnv) {
    next.environmentId = choice.setEnv;
    next.act = 1;
  }

  if (choice.swayNpc != null && next.npcs[state.npcIndex]) {
    next.npcs = next.npcs.map((n, i) =>
      i === state.npcIndex
        ? { ...n, sway: Math.max(-1, Math.min(1, n.sway + choice.swayNpc)), met: true }
        : n
    );
  }

  if (choice.next === 'act1_npc_talk') {
    if (state.sceneId === 'act1_npc_talk') {
      const nextIndex = state.npcIndex + 1;
      if (nextIndex >= next.npcs.length) {
        next.sceneId = 'act1_promises';
        return finalizeScene(next);
      }
      next.npcIndex = nextIndex;
      next.sceneId = 'act1_npc_talk';
      return next;
    }
    if (next.npcs.length === 0 && next.environmentId) {
      next.npcs = generateCampaignNPCs(next.environmentId);
    }
    next.npcIndex = 0;
    next.sceneId = 'act1_npc_talk';
    return next;
  }

  next.sceneId = choice.next;

  if (next.sceneId === 'election_night') {
    next.election = computeElectionResult(next.npcs, next.axes, next.promises);
    next.act = 1;
  }

  if (next.sceneId === 'act2_start' && next.election?.won) {
    next.act = 2;
    next.year = 1;
  }

  if (next.sceneId === 'act3_polling') {
    next.act = 3;
    next.year = 4;
  }

  return finalizeScene(next);
}

/** @param {ReturnType<typeof createInitialState>} next */
function finalizeScene(next) {
  const scene = scenes[next.sceneId];
  if (scene?.year) next.year = scene.year;
  if (scene?.act != null) next.act = scene.act;
  return next;
}

/** @param {Axes} axes */
export function axisLabel(axis, value) {
  const bands = {
    economic: [
      { max: -30, label: 'Strong left' },
      { max: -12, label: 'Centre-left' },
      { max: 12, label: 'Centrist' },
      { max: 30, label: 'Centre-right' },
      { max: Infinity, label: 'Strong right' },
    ],
    social: [
      { max: -30, label: 'Very progressive' },
      { max: -12, label: 'Progressive' },
      { max: 12, label: 'Centrist' },
      { max: 30, label: 'Traditional' },
      { max: Infinity, label: 'Very traditional' },
    ],
    authority: [
      { max: -30, label: 'Libertarian' },
      { max: -12, label: 'Civil-libertarian' },
      { max: 12, label: 'Balanced' },
      { max: 30, label: 'Strong state' },
      { max: Infinity, label: 'Authoritarian' },
    ],
  };
  const list = bands[axis];
  for (const band of list) {
    if (value <= band.max) return band.label;
  }
  return list[list.length - 1].label;
}

export function markerPercent(value) {
  return ((value - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * 100;
}

/** @param {ReturnType<typeof createInitialState>} state */
export function resolveEnding(state) {
  if (state.sceneId === 'ending_defeat') {
    return endings.find((e) => e.id === 'campaign_defeat');
  }

  const polling = state.approval;
  const env = state.environmentId ? environments[state.environmentId] : null;

  if (polling >= 65) {
    const hero = endings.find((e) => e.id === 'beloved_leader');
    return hero ? { ...hero, subtitle: env?.doomGood ?? hero.subtitle } : endings[0];
  }
  if (polling <= 25) {
    const doom = endings.find((e) => e.id === 'revolution_fury');
    return doom ? { ...doom, subtitle: env?.doomBad ?? doom.subtitle } : endings[0];
  }

  for (const ending of endings) {
    if (
      !['populist_coalition', 'beloved_leader', 'revolution_fury', 'campaign_defeat'].includes(
        ending.id
      ) &&
      ending.match(state.axes)
    ) {
      return ending;
    }
  }
  return endings.find((e) => e.id === 'populist_coalition');
}

/** @param {ReturnType<typeof createInitialState>} state */
export function getScene(state) {
  if (state.sceneId === 'act1_npc_talk') {
    const npc = state.npcs[state.npcIndex];
    if (!npc) return scenes.act1_promises;
    return getNpcTalkScene(npc, state.environmentId, state.npcIndex, state.npcs.length);
  }
  if (state.sceneId === 'election_night') {
    return getElectionScene(state);
  }
  return scenes[state.sceneId];
}

export function isEndingScene(sceneId) {
  return sceneId === 'end' || sceneId === 'ending_defeat';
}

export function actLabel(act) {
  const labels = ['Prologue', 'Act I — Campaign', 'Act II — Government', 'Act III — Judgment'];
  return labels[act] ?? 'Epilogue';
}
