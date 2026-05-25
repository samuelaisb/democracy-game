import {
  createInitialState,
  applyChoice,
  axisLabel,
  markerPercent,
  resolveEnding,
  getScene,
  isEndingScene,
  actLabel,
  promiseLabel,
} from './game.js';
import { environments, canonicalEnvironmentId } from './environments.js';
import { npcSupportScore, factionSupportScore } from './npcs.js';
import { portraitEmoji, brandBallotSvg } from './portraits.js';

const state = createInitialState();

const sceneCard = document.getElementById('scene-card');
const endingPanel = document.getElementById('ending-panel');
const sceneEyebrow = document.getElementById('scene-eyebrow');
const sceneTitle = document.getElementById('scene-title');
const sceneBody = document.getElementById('scene-body');
const choicesEl = document.getElementById('choices');
const termBadge = document.getElementById('term-badge');
const termValue = document.getElementById('term-value');
const actBadge = document.getElementById('act-badge');
const envBadge = document.getElementById('env-badge');
const approvalFill = document.getElementById('approval-fill');
const approvalValue = document.getElementById('approval-value');
const npcPanel = document.getElementById('npc-panel');
const npcList = document.getElementById('npc-list');
const promisePanel = document.getElementById('promise-panel');
const promiseList = document.getElementById('promise-list');
const factionPanel = document.getElementById('faction-panel');
const factionList = document.getElementById('faction-list');
const electionPanel = document.getElementById('election-panel');
const endingTitle = document.getElementById('ending-title');
const endingSubtitle = document.getElementById('ending-subtitle');
const endingBody = document.getElementById('ending-body');
const endingPullquote = document.getElementById('ending-pullquote');
const endingProfile = document.getElementById('ending-profile');
const restartBtn = document.getElementById('restart-btn');
const comicPortrait = document.getElementById('comic-portrait');
const portraitWrap = document.getElementById('portrait-wrap');
const actBanner = document.getElementById('act-banner');
const actBannerLabel = document.getElementById('act-banner-label');
const actBannerFlavor = document.getElementById('act-banner-flavor');
const brandMark = document.getElementById('brand-mark');

const axisEls = {
  economic: { label: 'economic-label', marker: 'economic-marker', fill: 'economic-fill' },
  social: { label: 'social-label', marker: 'social-marker', fill: 'social-fill' },
  authority: { label: 'authority-label', marker: 'authority-marker', fill: 'authority-fill' },
};

const ACT_FLAVOR = {
  quebec_town: [
    'Choose your village battleground',
    'Doorsteps, tractors, and town gossip',
    'Council drama and budget reality',
    'Judgment at the co-op cafe',
  ],
  ontario_suburb: [
    'Choose your suburban ward map',
    'Commute chaos and council mic drops',
    'Infrastructure fights and committee nights',
    'Judgment at the ballot box',
  ],
  vancouver_city: [
    'Choose your metro battleground',
    'Rent wars and rezoning showdowns',
    'Port shocks and city-hall brinkmanship',
    'Judgment in the rain',
  ],
  entire_provinces: [
    'Choose your interprovincial chessboard',
    'Premiers, pipelines, and policy duels',
    'Transfer battles and coalition math',
    'Judgment across the map',
  ],
  northwest_territories: [
    'Choose your northern campaign route',
    'Community halls and logistics reality',
    'Consensus pressure and emergency calls',
    'Judgment under northern lights',
  ],
  canada_whole: [
    'Choose your national battleground',
    'Debates, leaks, and campaign buses',
    'Federal files and province friction',
    'Judgment on election night',
  ],
  default: [
    'Where will you fight?',
    'Campaign in motion',
    'Governing under pressure',
    'Final judgment',
  ],
};

const HINT_CLASS_RULES = [
  [/grassroots|doorstep|canvass|charismatic/i, 'choice-btn--grassroots'],
  [/elite|patron|establishment|noble|backing/i, 'choice-btn--elite'],
  [/authoritarian|security state|order first|curfew|decrees|hard reset/i, 'choice-btn--authoritarian'],
  [/libert|civil freedom|de-escalation/i, 'choice-btn--libertarian'],
  [/progressive|rights|welfare|social progressive|populist left/i, 'choice-btn--progressive'],
  [/conservative|tradition|cultural conservative/i, 'choice-btn--traditional'],
  [/populist/i, 'choice-btn--populist'],
  [/market|business|fiscal|privat/i, 'choice-btn--market'],
  [/consensus|coalition|tripartite|hybrid|pragmatic/i, 'choice-btn--consensus'],
];

const DEFAULT_ENVIRONMENT_SELECTION = {
  id: 'quebec_town',
  key: 'qc_small_town',
  label: 'Small farming town in Quebec',
};

let lastAct = state.act;
let lastApproval = state.approval;
const lastAxisValues = { ...state.axes };
let actBannerTimer = null;

if (brandMark) {
  brandMark.innerHTML = brandBallotSvg(36);
}

function actFlavorFor(envId, act) {
  const flavors = ACT_FLAVOR[envId] ?? ACT_FLAVOR.default;
  return flavors[act] ?? flavors[0];
}

function applyTheme() {
  document.body.dataset.env = state.environmentId || '';
  document.body.dataset.act = String(state.act ?? 0);
}

function ensureEnvironmentSelectionFallback() {
  if (state.sceneId === 'env_select' || state.environmentId) return;
  state.environmentId = DEFAULT_ENVIRONMENT_SELECTION.id;
  if (!state.environmentSelection) {
    state.environmentSelection = {
      key: DEFAULT_ENVIRONMENT_SELECTION.key,
      label: DEFAULT_ENVIRONMENT_SELECTION.label,
    };
  }
}

function showActBanner(act) {
  if (!actBanner || act === lastAct) return;
  const envId = canonicalEnvironmentId(state.environmentId);
  const env = envId ? environments[envId] : null;
  actBannerLabel.textContent = actLabel(act);
  actBannerFlavor.textContent = env
    ? `${env.era} — ${actFlavorFor(envId, act)}`
    : actFlavorFor('default', act);
  actBanner.classList.remove('act-banner--fading');
  actBanner.hidden = false;
  clearTimeout(actBannerTimer);
  actBannerTimer = setTimeout(() => {
    actBanner.classList.add('act-banner--fading');
    actBannerTimer = setTimeout(() => {
      actBanner.hidden = true;
      actBanner.classList.remove('act-banner--fading');
    }, 650);
  }, 5000);
}

function isDialogue(text, scene) {
  const t = text.trim();
  if (t.startsWith('"') || t.startsWith('«') || t.startsWith('\u201c')) return true;
  if (scene?.id === 'act1_npc_talk' && indexLikeNpcTalk(t)) return true;
  if (/^["\u201c]/.test(t)) return true;
  if (/\bsays\b|\basks\b|lean(s)? forward|smile(s)? with|arms crossed|speaks carefully/i.test(t)) {
    return true;
  }
  if (/["\u201c][^"\u201d]+["\u201d]/.test(t) && /\bsays\b/.test(t)) return true;
  return false;
}

function indexLikeNpcTalk(t) {
  return /\bsays\b|says,|asks\.|asks:|fingering|closes a devotional|slides a ledger|smells of the road|survive every change|glances at their phone|Ottawa makes|nation-to-nation|voted last time|held a line|cannot vote|what is justice|omens from Delphi|performing for an imagined/i.test(
    t
  );
}

function paragraphClass(text, index, scene) {
  if (scene?.id === 'act1_npc_talk' && scene?.reactionLine && text === scene.reactionLine) {
    return 'speech-line speech-line--reaction';
  }
  if (index === 0) return 'scene-lead';
  if (isDialogue(text, scene)) return 'speech-line';
  return 'narration-line';
}

function formatSceneBody(paragraphs, scene) {
  const hasNpc = Boolean(scene?.npcPanel && state.npcs[state.npcIndex]);
  return paragraphs
    .map((p, i) => {
      const cls = paragraphClass(p, i, scene);
      const isSpeech = cls.includes('speech-line');
      const speaker =
        isSpeech && hasNpc
          ? ' data-speaker="npc"'
          : isSpeech
            ? ' data-speaker="narrator"'
            : '';
      const text = cls.includes('speech-line--reaction')
        ? `<span class="reaction-label">Voter response</span>${p}`
        : p;
      return `<p class="${cls}"${speaker}>${text}</p>`;
    })
    .join('');
}

function formatEndingBody(paragraphs) {
  return paragraphs
    .map((p, i) => {
      const cls = i === 0 ? 'scene-lead' : 'narration-line';
      return `<p class="${cls}">${p}</p>`;
    })
    .join('');
}

function pulseMarker(markerEl) {
  if (!markerEl) return;
  markerEl.classList.remove('meter-marker--pulse');
  void markerEl.offsetWidth;
  markerEl.classList.add('meter-marker--pulse');
  markerEl.addEventListener(
    'animationend',
    () => markerEl.classList.remove('meter-marker--pulse'),
    { once: true }
  );
}

function renderMeters() {
  for (const axis of Object.keys(axisEls)) {
    const value = state.axes[axis];
    const { label, marker, fill } = axisEls[axis];
    const labelEl = document.getElementById(label);
    labelEl.textContent = axisLabel(axis, value);
    labelEl.classList.toggle('meter-value--warn', Math.abs(value) >= 40);

    const pct = markerPercent(value);
    const markerEl = document.getElementById(marker);
    markerEl.style.left = `${pct}%`;
    if (lastAxisValues[axis] !== value) {
      pulseMarker(markerEl);
      lastAxisValues[axis] = value;
    }

    const fillEl = document.getElementById(fill);
    if (value < 0) {
      fillEl.style.left = `${pct}%`;
      fillEl.style.width = `${50 - pct}%`;
    } else if (value > 0) {
      fillEl.style.left = '50%';
      fillEl.style.width = `${pct - 50}%`;
    } else {
      fillEl.style.width = '0';
    }
    fillEl.classList.toggle('fill-left', value < 0);
    fillEl.classList.toggle('fill-right', value > 0);
    fillEl.classList.toggle('fill-intense', Math.abs(value) > 25);
  }

  approvalFill.style.width = `${state.approval}%`;
  approvalValue.textContent = `${state.approval}%`;
  approvalValue.classList.toggle('meter-value--warn', state.approval <= 25 || state.approval >= 75);
  approvalFill.classList.toggle('approval-danger', state.approval <= 25);
  approvalFill.classList.toggle('approval-high', state.approval >= 65);
  if (lastApproval !== state.approval) {
    lastApproval = state.approval;
  }
}

function electionBarClass(entry) {
  const npc = state.npcs.find((n) => n.name === entry.name);
  if (npc?.leanings) {
    const e = npc.leanings.economic;
    if (e <= -12) return 'election-bar--left';
    if (e >= 12) return 'election-bar--right';
    if (npc.leanings.social <= -12) return 'election-bar--progressive';
    if (npc.leanings.social >= 12) return 'election-bar--traditional';
    if (npc.leanings.authority <= -12) return 'election-bar--libertarian';
    if (npc.leanings.authority >= 12) return 'election-bar--authoritarian';
  }
  const faction = state.factions.find((f) => f.name === entry.name);
  if (faction?.leanings) {
    const e = faction.leanings.economic;
    if (e <= -12) return 'election-bar--left';
    if (e >= 12) return 'election-bar--right';
  }
  let hash = 0;
  for (let i = 0; i < entry.name.length; i++) hash = (hash + entry.name.charCodeAt(i) * (i + 1)) % 6;
  const classes = [
    'election-bar--left',
    'election-bar--right',
    'election-bar--progressive',
    'election-bar--traditional',
    'election-bar--libertarian',
    'election-bar--authoritarian',
  ];
  return classes[hash] ?? 'election-bar--neutral';
}

function choiceHintClass(hint) {
  if (!hint) return '';
  for (const [re, cls] of HINT_CLASS_RULES) {
    if (re.test(hint)) return cls;
  }
  return '';
}

function triggerSceneIn() {
  sceneCard.classList.remove('scene-in');
  void sceneCard.offsetWidth;
  sceneCard.classList.add('scene-in');
}

function renderNpcPanel(scene) {
  if (!scene.npcPanel || !state.npcs.length) {
    npcPanel.hidden = true;
    if (portraitWrap) portraitWrap.hidden = true;
    return;
  }
  npcPanel.hidden = false;
  const current = state.npcs[state.npcIndex];
  npcList.innerHTML = state.npcs
    .map((npc, i) => {
      const support = npcSupportScore(npc, state.axes, state.promises);
      const active = i === state.npcIndex;
      return `
        <li class="npc-chip ${active ? 'npc-chip--active' : ''} ${npc.met ? 'npc-chip--met' : ''}">
          <span class="npc-chip-portrait" role="img" aria-label="${npc.name}">${portraitEmoji(npc.type)}</span>
          <span class="npc-chip-name">${npc.name}</span>
          <span class="npc-chip-type">${npc.type}</span>
          <span class="npc-chip-support">${support}% sway</span>
        </li>
      `;
    })
    .join('');

  if (comicPortrait && current) {
    comicPortrait.textContent = portraitEmoji(current.type);
    comicPortrait.setAttribute('aria-label', `${current.name}, ${current.type}`);
    if (portraitWrap) portraitWrap.hidden = false;
  }
}

function renderPromisePanel() {
  const entries = Object.entries(state.promiseLedger);
  if (!entries.length) {
    promisePanel.hidden = true;
    return;
  }
  promisePanel.hidden = false;

  const statusLabel = {
    made: 'In play',
    at_risk: 'At risk',
    fulfilled: 'Delivered',
    broken: 'Broken',
  };

  promiseList.innerHTML = entries
    .map(([promiseId, ledger]) => {
      const pct = Math.max(0, Math.min(100, ledger.progress + 50));
      return `
      <li class="promise-chip">
        <div class="promise-chip-top">
          <span class="promise-chip-name">${promiseLabel(promiseId)}</span>
          <span class="promise-chip-status promise-chip-status--${ledger.status}">${statusLabel[ledger.status]}</span>
        </div>
        <span class="promise-bar"><span style="width:${pct}%"></span></span>
      </li>
    `;
    })
    .join('');
}

function renderFactionPanel() {
  if (!state.factions.length) {
    factionPanel.hidden = true;
    return;
  }
  factionPanel.hidden = false;
  factionList.innerHTML = state.factions
    .map((faction) => {
      const support = factionSupportScore(faction, state.axes, state.promiseLedger);
      return `
      <li class="faction-chip">
        <div class="faction-chip-top">
          <span class="faction-chip-name">${faction.name}</span>
          <span class="faction-chip-support">${support}%</span>
        </div>
        <div class="faction-chip-meta">
          <span>Trust ${faction.trust}</span>
          <span>Turnout ${faction.turnout}%</span>
          <span>Rad ${faction.radicalization}</span>
        </div>
      </li>
    `;
    })
    .join('');
}

function renderElectionPanel(scene) {
  if (scene.id !== 'election_night' || !state.election) {
    electionPanel.hidden = true;
    return;
  }
  electionPanel.hidden = false;
  electionPanel.innerHTML = `
    <h3 class="election-title">${state.election.won ? 'You won!' : 'You lost'}</h3>
    <p class="election-total">${state.election.percent}% aggregate favour · ${state.election.seatsWon ?? 0}/${state.election.seatsTotal ?? 0} seats (FPTP)</p>
    ${
      state.election.districtResults?.length
        ? `<ul class="district-breakdown">
      ${state.election.districtResults
        .map(
          (d) => `<li class="${d.won ? 'district-chip district-chip--won' : 'district-chip district-chip--lost'}">
            <span>${d.district}</span>
            <strong>${d.support}%</strong>
          </li>`
        )
        .join('')}
    </ul>`
        : ''
    }
    <ul class="election-breakdown">
      ${state.election.breakdown
        .map(
          (b) => `
        <li>
          <span>${b.name} <em>(${b.type})</em></span>
          <span class="election-bar ${electionBarClass(b)}"><span style="width:${b.support}%"></span></span>
          <span>${b.support}%</span>
        </li>`
        )
        .join('')}
    </ul>
  `;
}

function endingPullQuoteText(ending) {
  const envId = canonicalEnvironmentId(state.environmentId);
  const env = envId ? environments[envId] : null;
  if (!env) return null;
  if (ending.id === 'beloved_leader' || state.approval >= 65) return env.doomGood;
  if (ending.id === 'revolution_fury' || state.approval <= 25) return env.doomBad;
  if (state.approval >= 50 && env.doomGood) return env.doomGood;
  if (state.approval < 50 && env.doomBad) return env.doomBad;
  return null;
}

function renderScene() {
  ensureEnvironmentSelectionFallback();

  const scene = getScene(state);
  if (!scene) return;

  const envId = canonicalEnvironmentId(state.environmentId);
  const env = envId ? environments[envId] : null;
  const selectedEnvironmentLabel = state.environmentSelection?.label ?? env?.title ?? null;

  if (state.act !== lastAct) {
    showActBanner(state.act);
    lastAct = state.act;
  }

  applyTheme();

  actBadge.textContent = actLabel(state.act);
  envBadge.textContent = selectedEnvironmentLabel ?? 'Choose setting';
  envBadge.hidden = !selectedEnvironmentLabel;

  termBadge.hidden = state.act < 2;
  termValue.textContent = state.year > 0 ? String(state.year) : '—';

  if (isEndingScene(state.sceneId)) {
    showEnding();
    return;
  }

  sceneCard.hidden = false;
  endingPanel.hidden = true;

  sceneEyebrow.textContent = scene.eyebrow ?? '';
  sceneTitle.textContent = scene.title;
  sceneBody.innerHTML = formatSceneBody(scene.body, scene);

  renderNpcPanel(scene);
  renderPromisePanel();
  renderFactionPanel();
  renderElectionPanel(scene);
  renderMeters();
  triggerSceneIn();

  choicesEl.innerHTML = '';
  scene.choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    const hintCls = choiceHintClass(choice.hint ?? '');
    btn.className = hintCls ? `choice-btn ${hintCls}` : 'choice-btn';
    btn.innerHTML = `
      <span class="choice-index">${i + 1}</span>
      <span class="choice-text">${choice.text}</span>
      ${choice.hint ? `<span class="choice-hint">${choice.hint}</span>` : ''}
    `;
    btn.addEventListener('click', () => {
      Object.assign(state, applyChoice(state, choice));
      renderScene();
    });
    choicesEl.appendChild(btn);
  });
}

function showEnding() {
  sceneCard.hidden = true;
  endingPanel.hidden = false;
  npcPanel.hidden = true;
  promisePanel.hidden = true;
  factionPanel.hidden = true;
  electionPanel.hidden = true;
  if (portraitWrap) portraitWrap.hidden = true;

  applyTheme();

  const ending = resolveEnding(state);
  endingTitle.textContent = ending.title;
  endingSubtitle.textContent = ending.subtitle;
  endingBody.innerHTML = formatEndingBody(ending.body);

  const quote = endingPullQuoteText(ending);
  if (endingPullquote) {
    if (quote) {
      endingPullquote.textContent = quote;
      endingPullquote.hidden = false;
    } else {
      endingPullquote.hidden = true;
      endingPullquote.textContent = '';
    }
  }

  renderMeters();

  const envId = canonicalEnvironmentId(state.environmentId);
  const env = envId ? environments[envId] : null;
  const selectedEnvironmentLabel = state.environmentSelection?.label ?? env?.title ?? null;
  const electionBlock = state.election
    ? `<li><strong>Election:</strong> ${state.election.percent}% (${state.election.won ? 'won' : 'lost'})</li>`
    : '';
  const promiseSummary = Object.entries(state.promiseLedger)
    .map(([promiseId, ledger]) => `${promiseLabel(promiseId)}: ${ledger.status}`)
    .join(', ');
  const brokenPromises = Object.values(state.promiseLedger).filter((entry) => entry.status === 'broken')
    .length;
  const factionStandings = state.factions
    .map((faction) => `${faction.name} (${factionSupportScore(faction, state.axes, state.promiseLedger)}%)`)
    .join(', ');

  endingProfile.innerHTML = `
    <h3>Your ledger</h3>
    <ul>
      ${selectedEnvironmentLabel ? `<li><strong>Setting:</strong> ${selectedEnvironmentLabel}</li>` : ''}
      <li><strong>Final approval:</strong> ${state.approval}%</li>
      <li><strong>Campaign knowledge:</strong> ${state.campaignKnowledge}%</li>
      <li><strong>Media literacy:</strong> ${state.mediaLiteracy}%</li>
      <li><strong>Misinformation risk:</strong> ${state.misinformationRisk}%</li>
      <li><strong>Rival tension:</strong> ${state.rivalHeat}%</li>
      <li><strong>Budget room:</strong> ${state.budgetRoom}%</li>
      <li><strong>Institutional trust:</strong> ${state.institutionalTrust}%</li>
      ${electionBlock}
      <li><strong>Economic:</strong> ${axisLabel('economic', state.axes.economic)}</li>
      <li><strong>Social:</strong> ${axisLabel('social', state.axes.social)}</li>
      <li><strong>Governance:</strong> ${axisLabel('authority', state.axes.authority)}</li>
      ${state.promises.length ? `<li><strong>Promises:</strong> ${state.promises.join(', ')}</li>` : ''}
      ${promiseSummary ? `<li><strong>Promise ledger:</strong> ${promiseSummary}</li>` : ''}
      ${state.promises.length ? `<li><strong>Broken promises:</strong> ${brokenPromises}</li>` : ''}
      ${state.coalition.length ? `<li><strong>Coalitions:</strong> ${state.coalition.join(', ')}</li>` : ''}
      ${factionStandings ? `<li><strong>Faction support:</strong> ${factionStandings}</li>` : ''}
      ${state.crisisHistory.length ? `<li><strong>Crisis log:</strong> ${state.crisisHistory.join(' • ')}</li>` : ''}
    </ul>
    <details class="history-details">
      <summary>Decisions you made</summary>
      <ol>${state.history.map((h) => `<li>${h}</li>`).join('')}</ol>
    </details>
  `;
}

restartBtn.addEventListener('click', () => {
  Object.assign(state, createInitialState());
  lastAct = state.act;
  lastApproval = state.approval;
  Object.assign(lastAxisValues, state.axes);
  if (actBanner) {
    actBanner.hidden = true;
    actBanner.classList.remove('act-banner--fading');
  }
  clearTimeout(actBannerTimer);
  renderScene();
});

renderScene();
