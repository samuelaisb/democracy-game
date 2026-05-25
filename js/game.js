import { scenes, endings, getNpcTalkScene, getElectionScene } from './scenes.js';
import {
  generateCampaignNPCs,
  generateCampaignFactions,
  updateFactionsAfterChoice,
  computeElectionResult,
} from './npcs.js';
import { environments, canonicalEnvironmentId } from './environments.js';
import { buildCanvassReactionLine, resetCanvassReactionHistory } from './reactions.js';

const AXIS_MIN = -50;
const AXIS_MAX = 50;
const CLAMP = (v) => Math.max(AXIS_MIN, Math.min(AXIS_MAX, v));
const PCT_CLAMP = (v) => Math.max(0, Math.min(100, v));

const PROMISE_RULES = {
  tax_relief: { label: 'Tax relief', axis: 'economic', target: 1 },
  public_services: { label: 'Public services', axis: 'economic', target: -1 },
  tradition: { label: 'Tradition', axis: 'social', target: 1 },
  rights: { label: 'Rights expansion', axis: 'social', target: -1 },
  order: { label: 'Law and order', axis: 'authority', target: 1 },
  liberty: { label: 'Civil liberties', axis: 'authority', target: -1 },
};

const SHARED_CRISIS_TEMPLATES = [
  {
    id: 'shared_pandemic_wave',
    title: 'Respiratory Wave and Hospital Saturation',
    summary:
      'A fast-moving respiratory outbreak pushes emergency rooms toward overflow while neighboring jurisdictions demand coordinated protocols. Every delay raises both health and trust costs.',
    weight: (state) => 1 + Math.max(0, (55 - state.institutionalTrust) / 16),
    choices: [
      {
        text: 'Public health command: surge staffing, testing, clear risk communication',
        hint: 'Health-first response',
        effects: { authority: 4, approval: 5, budgetRoom: -8, institutionalTrust: 8 },
        promiseDelta: { public_services: 10, order: 4, liberty: -4 },
      },
      {
        text: 'Keep restrictions minimal and protect economic activity',
        hint: 'Economic continuity',
        effects: { economic: 5, approval: -4, institutionalTrust: -8, budgetRoom: 4 },
        promiseDelta: { tax_relief: 10, public_services: -8 },
      },
      {
        text: 'Joint protocol with local leaders and independent health advisors',
        hint: 'Shared legitimacy',
        effects: { authority: -2, approval: 3, institutionalTrust: 10, budgetRoom: -4 },
        coalition: 'unity',
        promiseDelta: { rights: 6, public_services: 6, liberty: 4 },
      },
    ],
  },
  {
    id: 'shared_fiscal_cliff',
    title: 'Fiscal Cliff and Funding Gap',
    summary:
      'Revenues underperform while borrowing costs rise. Core services, payroll, and infrastructure plans cannot all be protected under the current budget envelope.',
    weight: (state) => 1 + Math.max(0, (40 - state.budgetRoom) / 14),
    choices: [
      {
        text: 'Temporary solidarity levy plus protected essential services',
        hint: 'Tax-and-shield plan',
        effects: { economic: -5, approval: 2, budgetRoom: 8, institutionalTrust: 4 },
        promiseDelta: { public_services: 10, tax_relief: -10 },
      },
      {
        text: 'Austerity package with spending caps and service consolidation',
        hint: 'Austerity pivot',
        effects: { economic: 6, approval: -6, budgetRoom: 12, institutionalTrust: -6 },
        promiseDelta: { tax_relief: 8, public_services: -12 },
      },
      {
        text: 'Bridge financing from sponsors and partner organizations',
        hint: 'Outside financing',
        effects: { economic: 2, approval: -1, budgetRoom: 10, institutionalTrust: -3, rivalHeat: 3 },
        coalition: 'patrons',
        promiseDelta: { order: 4, rights: -4 },
      },
    ],
  },
];

const CRISIS_TEMPLATES_BY_ENV = {
  quebec_town: [
    {
      id: 'quebec_milk_quota_shock',
      title: 'Milk Quota Shock on FM Radio',
      summary:
        'A late-night policy leak says provincial quota formulas are changing, and your town co-op claims it could wipe out small farms within months. By sunrise, tractors are parked outside city hall and every local caller show asks if you sold out the valley.',
      weight: (state) => 1 + Math.max(0, -state.axes.economic / 15),
      choices: [
        { text: 'Emergency farm stabilization fund', hint: 'Protect producers', effects: { economic: -6, approval: 6 }, promiseDelta: { public_services: 14, tax_relief: -10 } },
        { text: 'Let market consolidation proceed with minimal aid', hint: 'Market discipline', effects: { economic: 8, approval: -7 }, promiseDelta: { tax_relief: 12, public_services: -16 } },
        { text: 'Broker co-op merger with transition grants', hint: 'Compromise package', effects: { economic: 1, approval: 2, authority: -2 }, coalition: 'broad_coalition', promiseDelta: { tax_relief: 6, public_services: 8 } },
      ],
    },
    {
      id: 'quebec_snow_contract_scandal',
      title: 'Snowplow Contract Meltdown',
      summary:
        'Two days before a blizzard, the town discovers salt deliveries were routed through a shell contractor tied to campaign donors. The roads are icing, the union is furious, and residents are live-posting every uncleared street.',
      weight: (state) => 1 + (state.coalition.includes('patrons') ? 1.5 : 0.5),
      choices: [
        { text: 'Cancel contracts and reopen bidding publicly', hint: 'Clean break', effects: { authority: -4, approval: 7 }, promiseDelta: { rights: 10, liberty: 8 } },
        { text: 'Keep current vendors and manage fallout with messaging', hint: 'Contain optics', effects: { authority: 6, approval: -6 }, coalition: 'patrons', promiseDelta: { order: 8, rights: -12 } },
        { text: 'Temporary military-equipment support plus audit', hint: 'Emergency patch', effects: { authority: 4, approval: 1 }, promiseDelta: { order: 6, liberty: -4 } },
      ],
    },
  ],
  ontario_suburb: [
    {
      id: 'ontario_go_line_failure',
      title: 'GO Line Service Collapse',
      summary:
        'A signaling failure knocks out commuter rail for three consecutive mornings. Parents are late, offices are angry, and your inbox is now 90% transit memes and rage.',
      weight: (state) => 1 + Math.max(0, (60 - state.approval) / 16),
      choices: [
        { text: 'Fund emergency service expansion immediately', hint: 'Transit first', effects: { economic: -5, approval: 6, social: -3 }, promiseDelta: { public_services: 12 } },
        { text: 'Prioritize road widening and park-and-ride capacity', hint: 'Car-first pivot', effects: { economic: 5, approval: -3, social: 3 }, promiseDelta: { tax_relief: 8, public_services: -6 } },
        { text: 'Joint task force with rider reps and operators', hint: 'Shared governance', effects: { authority: -4, approval: 3 }, coalition: 'broad_coalition', promiseDelta: { liberty: 6, public_services: 6 } },
      ],
    },
    {
      id: 'ontario_condo_special_assessment',
      title: 'Condo Tower Special Assessment Wave',
      summary:
        'Three aging condo complexes announce massive special assessments after structural findings. Owners demand relief, renters fear pass-through hikes, and your council chamber overflows before lunch.',
      weight: (state) => 1 + Math.max(0, Math.abs(state.axes.social) / 18),
      choices: [
        { text: 'City-backed low-interest repair loans', hint: 'Stability package', effects: { economic: -4, approval: 5 }, promiseDelta: { public_services: 10 } },
        { text: 'Strict owner responsibility with targeted hardship aid', hint: 'Fiscal guardrails', effects: { economic: 4, approval: -4 }, promiseDelta: { tax_relief: 8, public_services: -8 } },
        { text: 'Mandatory developer levy for future reserve gaps', hint: 'Regulatory reset', effects: { authority: 5, approval: 1 }, promiseDelta: { rights: 6, order: 4 } },
      ],
    },
  ],
  vancouver_city: [
    {
      id: 'vancouver_rent_spike',
      title: 'Rental Spike and Tenant Walkout',
      summary:
        'A major landlord cluster files synchronized rent hikes and downtown tenant groups call a citywide rent strike. National media arrives, and so do three contradictory legal opinions.',
      weight: (state) => 1 + Math.max(0, -state.axes.economic / 14),
      choices: [
        { text: 'Emergency renter protections and legal support', hint: 'Tenant shield', effects: { economic: -7, approval: 7, authority: 2 }, promiseDelta: { rights: 14, public_services: 10 } },
        { text: 'Fast-track supply approvals, avoid direct controls', hint: 'Build more now', effects: { economic: 7, approval: -2, social: -2 }, promiseDelta: { tax_relief: 10, rights: -4 } },
        { text: 'Broker rent freeze + density deal', hint: 'Hard compromise', effects: { economic: -1, approval: 3 }, coalition: 'broad_coalition', promiseDelta: { public_services: 6, tax_relief: 4 } },
      ],
    },
    {
      id: 'vancouver_port_shutdown',
      title: 'Port Shutdown Threat',
      summary:
        'A labor dispute and software outage threaten to halt port operations for the week. Retailers panic, workers harden positions, and your office gets hourly calls from every sector.',
      weight: (state) => 1 + (state.coalition.includes('workers') ? 0.8 : 0.4),
      choices: [
        { text: 'Back labor demands with city relief funding', hint: 'Worker alignment', effects: { economic: -4, approval: 4, social: -2 }, coalition: 'workers', promiseDelta: { public_services: 8, tax_relief: -8 } },
        { text: 'Mandate arbitration and continuity protocol', hint: 'Order and throughput', effects: { authority: 7, approval: -3 }, promiseDelta: { order: 10, liberty: -8 } },
        { text: 'Temporary triage lanes + shared mediation board', hint: 'Pragmatic truce', effects: { authority: -2, approval: 2, economic: 1 }, coalition: 'broad_coalition', promiseDelta: { liberty: 4, order: 4 } },
      ],
    },
  ],
  entire_provinces: [
    {
      id: 'provinces_transfer_formula_revolt',
      title: 'Transfer Formula Revolt',
      summary:
        'Several premiers jointly reject your fiscal transfer update, calling it a stealth clawback. The phrase "constitutional challenge" appears before your breakfast meeting.',
      weight: (state) => 1 + Math.max(0, state.axes.authority / 16),
      choices: [
        { text: 'Reopen formula talks with provincial veto checkpoints', hint: 'Decentralize pressure', effects: { authority: -8, approval: 5 }, coalition: 'unity', promiseDelta: { liberty: 10, rights: 6 } },
        { text: 'Hold line on formula and dare premiers to sue', hint: 'Federal hard line', effects: { authority: 8, approval: -6 }, promiseDelta: { order: 12, liberty: -10 } },
        { text: 'Offer side deals for key provinces quietly', hint: 'Transactional federalism', effects: { economic: -3, approval: 1 }, coalition: 'patrons', promiseDelta: { rights: -8, tax_relief: 6 } },
      ],
    },
    {
      id: 'provinces_resource_corridor_deadlock',
      title: 'Resource Corridor Deadlock',
      summary:
        'A cross-province corridor project stalls as environmental, Indigenous, and industry camps all accuse your government of bad faith in the same hour.',
      weight: (state) => 1 + Math.max(0, Math.abs(state.axes.social) / 16),
      choices: [
        { text: 'Pause project and launch consent-led redesign', hint: 'Consultation-first', effects: { economic: -6, approval: 4, social: -4 }, promiseDelta: { rights: 12, public_services: 6 } },
        { text: 'Approve corridor with expedited permit powers', hint: 'Build now', effects: { economic: 8, approval: -5, authority: 6 }, promiseDelta: { order: 10, rights: -12 } },
        { text: 'Stage-gate permits tied to strict climate metrics', hint: 'Conditional greenlight', effects: { economic: 1, approval: 2, authority: 1 }, promiseDelta: { public_services: 4, tax_relief: 4 } },
      ],
    },
  ],
  northwest_territories: [
    {
      id: 'nwt_winter_road_failure',
      title: 'Winter Road Failure',
      summary:
        'An early thaw collapses a critical winter road segment. Fuel and food costs spike overnight, and isolated communities demand immediate logistics support.',
      weight: (state) => 1 + Math.max(0, (58 - state.approval) / 14),
      choices: [
        { text: 'Airlift essentials with emergency territorial funds', hint: 'Immediate relief', effects: { economic: -7, approval: 7, authority: 2 }, promiseDelta: { public_services: 14 } },
        { text: 'Ration deliveries and prioritize core services', hint: 'Scarcity management', effects: { authority: 6, approval: -5 }, promiseDelta: { order: 8, liberty: -6 } },
        { text: 'Co-governed logistics command with local councils', hint: 'Consensus response', effects: { authority: -4, approval: 4, social: -2 }, coalition: 'unity', promiseDelta: { rights: 8, liberty: 6 } },
      ],
    },
    {
      id: 'nwt_medevac_backlog',
      title: 'Medevac Backlog Emergency',
      summary:
        'A chain of storms grounds flights and creates a medevac backlog across remote communities. Every hour matters, and every decision now has a face attached to it.',
      weight: (state) => 1 + Math.max(0, -state.axes.social / 16),
      choices: [
        { text: 'Contract private carriers at any cost', hint: 'Capacity surge', effects: { economic: -5, approval: 3, authority: 3 }, promiseDelta: { public_services: 8, tax_relief: -6 } },
        { text: 'Centralize triage under emergency command', hint: 'Command mode', effects: { authority: 9, approval: -4 }, promiseDelta: { order: 12, liberty: -10 } },
        { text: 'Deploy telehealth-first triage and local nurse authority', hint: 'Distributed care', effects: { authority: -5, approval: 5, social: -3 }, promiseDelta: { rights: 6, liberty: 8 } },
      ],
    },
  ],
  canada_whole: [
    {
      id: 'canada_caucus_leak_storm',
      title: 'National Caucus Leak Storm',
      summary:
        'Leaked caucus messages reveal contradictory strategies for different regions. Every province now thinks you promised everyone everything, and primetime panels are having a field day.',
      weight: (state) => 1 + getBrokenPromiseCount(state.promiseLedger) * 0.4,
      choices: [
        { text: 'Publish full strategy docs and take the hit', hint: 'Radical transparency', effects: { authority: -4, approval: 6, social: -3 }, promiseDelta: { rights: 10, liberty: 8 } },
        { text: 'Discipline leak suspects and lock communications', hint: 'Control narrative', effects: { authority: 8, approval: -6 }, promiseDelta: { order: 10, liberty: -8 } },
        { text: 'Reset platform publicly with regional roundtables', hint: 'Political reset', effects: { authority: -2, approval: 3 }, coalition: 'broad_coalition', promiseDelta: { public_services: 6, tax_relief: 4 } },
      ],
    },
    {
      id: 'canada_interprovincial_gridlock',
      title: 'Interprovincial Gridlock Week',
      summary:
        'Simultaneous disruptions in rail, shipping, and trucking expose fragile national coordination. Grocery prices jump, premiers blame each other, and your office is expected to fix all of it by Friday.',
      weight: (state) => 1 + Math.max(0, -state.axes.economic / 15),
      choices: [
        { text: 'Federal emergency logistics command', hint: 'Central command', effects: { authority: 9, approval: -4 }, promiseDelta: { order: 10, liberty: -8 } },
        { text: 'Fund provincial response packages immediately', hint: 'Money first', effects: { economic: -8, approval: 5 }, promiseDelta: { public_services: 10, tax_relief: -8 } },
        { text: 'Tripartite labor-industry-premier accord', hint: 'Negotiated corridor', effects: { authority: -3, approval: 3, economic: 1 }, coalition: 'unity', promiseDelta: { liberty: 4, order: 4 } },
      ],
    },
  ],
};

/** @typedef {{ economic: number, social: number, authority: number }} Axes */
/** @typedef {import('./environments.js').EnvironmentId} EnvironmentId */

export function createInitialState() {
  resetCanvassReactionHistory();
  return {
    sceneId: 'env_select',
    act: 0,
    environmentId: /** @type {EnvironmentId | null} */ (null),
    environmentSelection: /** @type {{ key: string, label: string } | null} */ (null),
    year: 0,
    axes: { economic: 0, social: 0, authority: 0 },
    approval: 50,
    campaignKnowledge: 40,
    mediaLiteracy: 45,
    misinformationRisk: 20,
    rivalHeat: 35,
    budgetRoom: 50,
    institutionalTrust: 50,
    promises: /** @type {string[]} */ ([]),
    npcs: [],
    npcIndex: 0,
    pendingNpcReaction: /** @type {{ npcId: string, text: string } | null} */ (null),
    election: /** @type {{ percent: number, won: boolean, seatsWon: number, seatsTotal: number, districtResults?: { district: string, support: number, won: boolean }[], breakdown: { name: string, type: string, support: number }[] } | null} */ (
      null
    ),
    coalition: /** @type {string[]} */ ([]),
    factions: [],
    promiseLedger: /** @type {Record<string, { status: 'made' | 'at_risk' | 'fulfilled' | 'broken', progress: number }>} */ ({}),
    currentCrisis: /** @type {{ id: string, title: string, summary: string, choices: import('./scenes.js').Choice[] } | null} */ (null),
    crisisHistory: /** @type {string[]} */ ([]),
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
    factions: state.factions.map((faction) => ({
      ...faction,
      leanings: { ...faction.leanings },
    })),
    promiseLedger: Object.fromEntries(
      Object.entries(state.promiseLedger).map(([key, value]) => [key, { ...value }])
    ),
    crisisHistory: [...state.crisisHistory],
    currentCrisis: state.currentCrisis
      ? {
          ...state.currentCrisis,
          choices: state.currentCrisis.choices.map((choiceItem) => ({ ...choiceItem })),
        }
      : null,
    history: choice.continueNpcTalk ? [...state.history] : [...state.history, choice.text],
    pendingNpcReaction: state.pendingNpcReaction ? { ...state.pendingNpcReaction } : null,
    environmentSelection: state.environmentSelection ? { ...state.environmentSelection } : null,
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
  if (effects.campaignKnowledge != null) {
    next.campaignKnowledge = PCT_CLAMP(next.campaignKnowledge + effects.campaignKnowledge);
  }
  if (effects.mediaLiteracy != null) {
    next.mediaLiteracy = PCT_CLAMP(next.mediaLiteracy + effects.mediaLiteracy);
  }
  if (effects.misinformationRisk != null) {
    next.misinformationRisk = PCT_CLAMP(next.misinformationRisk + effects.misinformationRisk);
  }
  if (effects.rivalHeat != null) {
    next.rivalHeat = PCT_CLAMP(next.rivalHeat + effects.rivalHeat);
  }
  if (effects.budgetRoom != null) {
    next.budgetRoom = PCT_CLAMP(next.budgetRoom + effects.budgetRoom);
  }
  if (effects.institutionalTrust != null) {
    next.institutionalTrust = PCT_CLAMP(next.institutionalTrust + effects.institutionalTrust);
  }
  if (choice.promise && !next.promises.includes(choice.promise)) {
    next.promises.push(choice.promise);
    next.promiseLedger[choice.promise] = next.promiseLedger[choice.promise] ?? {
      status: 'made',
      progress: 0,
    };
  }
  if (choice.coalition && !next.coalition.includes(choice.coalition)) {
    next.coalition.push(choice.coalition);
  }
  if (choice.setEnv) {
    const resolvedEnv = canonicalEnvironmentId(choice.setEnv);
    if (resolvedEnv) {
      next.environmentId = resolvedEnv;
    }
    next.act = 1;
    next.environmentSelection = {
      key: choice.environmentKey ?? choice.setEnv,
      label: choice.environmentLabel ?? choice.text,
    };
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
      if (choice.continueNpcTalk) {
        const nextIndex = state.npcIndex + 1;
        next.pendingNpcReaction = null;
        if (nextIndex >= next.npcs.length) {
          next.sceneId = 'act1_promises';
          return finalizeScene(next);
        }
        next.npcIndex = nextIndex;
        next.sceneId = 'act1_npc_talk';
        return next;
      }

      const currentNpc = next.npcs[state.npcIndex];
      if (currentNpc) {
        next.pendingNpcReaction = {
          npcId: currentNpc.id,
          text: buildCanvassReactionLine(currentNpc, choice),
        };
      }
      next.sceneId = 'act1_npc_talk';
      return next;
    }
    if (next.npcs.length === 0 && next.environmentId) {
      next.npcs = generateCampaignNPCs(next.environmentId);
    }
    next.pendingNpcReaction = null;
    next.npcIndex = 0;
    next.sceneId = 'act1_npc_talk';
    return next;
  }

  applyPromiseDelta(next, choice.promiseDelta);
  autoAdvancePromiseCredibility(next);
  applyPromiseDebtApproval(next, state.promiseLedger);

  if (next.environmentId && next.factions.length) {
    next.factions = updateFactionsAfterChoice(next.factions, choice, next.axes, next.promiseLedger);
  }

  next.sceneId = choice.next;
  if (next.sceneId !== 'act1_npc_talk') {
    next.pendingNpcReaction = null;
  }

  if (next.sceneId === 'election_night') {
    next.election = computeElectionResult(
      next.npcs,
      next.factions,
      next.axes,
      next.promises,
      next.promiseLedger,
      next
    );
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

  if (choice.setEnv) {
    next.factions = generateCampaignFactions(next.environmentId ?? choice.setEnv);
  }

  if (next.sceneId === 'act2_crisis' && !next.currentCrisis) {
    next.currentCrisis = generateCrisis(next);
  }
  if (state.sceneId === 'act2_crisis' && next.sceneId !== 'act2_crisis' && next.currentCrisis) {
    next.crisisHistory.push(next.currentCrisis.title);
    next.currentCrisis = null;
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

function getBrokenPromiseCount(promiseLedger = {}) {
  return Object.values(promiseLedger).filter((p) => p.status === 'broken').length;
}

function getPromiseDebtScore(promiseLedger = {}) {
  return Object.values(promiseLedger).reduce((sum, p) => {
    if (p.status === 'broken') return sum + 3;
    if (p.status === 'at_risk') return sum + 1;
    return sum;
  }, 0);
}

/**
 * @param {ReturnType<typeof createInitialState>} state
 * @param {Record<string, number> | undefined} promiseDelta
 */
function applyPromiseDelta(state, promiseDelta) {
  if (!promiseDelta) return;
  for (const [promiseId, delta] of Object.entries(promiseDelta)) {
    if (!state.promises.includes(promiseId)) continue;
    const current = state.promiseLedger[promiseId] ?? { status: 'made', progress: 0 };
    const progress = Math.max(-100, Math.min(100, current.progress + delta));
    let status = current.status;
    if (progress >= 70) status = 'fulfilled';
    else if (progress <= -65) status = 'broken';
    else if (progress < -18) status = 'at_risk';
    else if (status !== 'fulfilled' && status !== 'broken') status = 'made';
    state.promiseLedger[promiseId] = { status, progress };
  }
}

/** @param {ReturnType<typeof createInitialState>} state */
function autoAdvancePromiseCredibility(state) {
  if (state.act < 2) return;
  for (const promiseId of state.promises) {
    const rule = PROMISE_RULES[promiseId];
    if (!rule) continue;
    const ledger = state.promiseLedger[promiseId] ?? { status: 'made', progress: 0 };
    if (ledger.status === 'fulfilled' || ledger.status === 'broken') continue;
    const axisValue = state.axes[rule.axis];
    let drift = 0;
    if (Math.sign(axisValue || 0) === rule.target && Math.abs(axisValue) >= 18) drift = 7;
    if (Math.sign(axisValue || 0) === -rule.target && Math.abs(axisValue) >= 18) drift = -10;
    const nextProgress = Math.max(-100, Math.min(100, ledger.progress + drift));
    let nextStatus = ledger.status;
    if (nextProgress >= 70) nextStatus = 'fulfilled';
    else if (nextProgress <= -65) nextStatus = 'broken';
    else if (nextProgress < -18) nextStatus = 'at_risk';
    else nextStatus = 'made';
    state.promiseLedger[promiseId] = { status: nextStatus, progress: nextProgress };
  }
}

/**
 * @param {ReturnType<typeof createInitialState>} state
 * @param {ReturnType<typeof createInitialState>['promiseLedger']} previousLedger
 */
function applyPromiseDebtApproval(state, previousLedger) {
  const before = getPromiseDebtScore(previousLedger);
  const after = getPromiseDebtScore(state.promiseLedger);
  if (after > before) {
    state.approval = PCT_CLAMP(state.approval - (after - before) * 2);
  } else if (after < before) {
    state.approval = PCT_CLAMP(state.approval + (before - after));
  }
}

/** @param {ReturnType<typeof createInitialState>} state */
function generateCrisis(state) {
  const envId = canonicalEnvironmentId(state.environmentId) ?? 'canada_whole';
  const envPool = CRISIS_TEMPLATES_BY_ENV[envId] ?? CRISIS_TEMPLATES_BY_ENV.canada_whole;
  const pool = [...envPool, ...SHARED_CRISIS_TEMPLATES];
  const weightedPool = pool.map((template) => ({
    template,
    weight: Math.max(0.1, template.weight?.(state) ?? 1),
  }));
  const total = weightedPool.reduce((sum, c) => sum + c.weight, 0);
  let pick = Math.random() * total;
  let selected = weightedPool[weightedPool.length - 1].template;
  for (const candidate of weightedPool) {
    pick -= candidate.weight;
    if (pick <= 0) {
      selected = candidate.template;
      break;
    }
  }
  return {
    id: selected.id,
    title: selected.title,
    summary: selected.summary,
    choices: selected.choices.map((choice) => ({
      ...choice,
      next: 'act2_coalition',
    })),
  };
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
  const envId = canonicalEnvironmentId(state.environmentId);
  const env = envId ? environments[envId] : null;

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
    const npcReaction =
      state.pendingNpcReaction && state.pendingNpcReaction.npcId === npc.id
        ? state.pendingNpcReaction.text
        : null;
    return getNpcTalkScene(npc, state.environmentId, state.npcIndex, state.npcs.length, npcReaction);
  }
  if (state.sceneId === 'election_night') {
    return getElectionScene(state);
  }
  if (state.sceneId === 'act2_crisis' && state.currentCrisis) {
    return {
      id: 'act2_crisis',
      act: 2,
      year: 3,
      eyebrow: 'Act II — Procedural crisis',
      title: state.currentCrisis.title,
      body: [
        state.currentCrisis.summary,
        'Factions read this decision as a signal of who your government truly serves.',
      ],
      choices: state.currentCrisis.choices,
    };
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

export function promiseLabel(promiseId) {
  return PROMISE_RULES[promiseId]?.label ?? promiseId.replace(/_/g, ' ');
}

