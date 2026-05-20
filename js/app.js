import {
  createInitialState,
  applyChoice,
  axisLabel,
  markerPercent,
  resolveEnding,
  getScene,
  isEndingScene,
  actLabel,
} from './game.js';
import { environments } from './environments.js';
import { npcSupportScore } from './npcs.js';

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
const electionPanel = document.getElementById('election-panel');
const endingTitle = document.getElementById('ending-title');
const endingSubtitle = document.getElementById('ending-subtitle');
const endingBody = document.getElementById('ending-body');
const endingProfile = document.getElementById('ending-profile');
const restartBtn = document.getElementById('restart-btn');
const comicPortrait = document.getElementById('comic-portrait');

const axisEls = {
  economic: { label: 'economic-label', marker: 'economic-marker', fill: 'economic-fill' },
  social: { label: 'social-label', marker: 'social-marker', fill: 'social-fill' },
  authority: { label: 'authority-label', marker: 'authority-marker', fill: 'authority-fill' },
};

const PORTRAITS = ['🗳️', '⚔️', '🏛️', '📜', '🎭', '👑'];

function renderMeters() {
  for (const axis of Object.keys(axisEls)) {
    const value = state.axes[axis];
    const { label, marker, fill } = axisEls[axis];
    document.getElementById(label).textContent = axisLabel(axis, value);
    const pct = markerPercent(value);
    document.getElementById(marker).style.left = `${pct}%`;
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
  }

  approvalFill.style.width = `${state.approval}%`;
  approvalValue.textContent = `${state.approval}%`;
  approvalFill.classList.toggle('approval-danger', state.approval <= 25);
  approvalFill.classList.toggle('approval-high', state.approval >= 65);
}

function renderNpcPanel(scene) {
  if (!scene.npcPanel || !state.npcs.length) {
    npcPanel.hidden = true;
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
          <span class="npc-chip-name">${npc.name}</span>
          <span class="npc-chip-type">${npc.type}</span>
          <span class="npc-chip-support">${support}% sway</span>
        </li>
      `;
    })
    .join('');

  if (comicPortrait && current) {
    comicPortrait.textContent = PORTRAITS[state.npcIndex % PORTRAITS.length];
    comicPortrait.setAttribute('aria-label', current.name);
  }
}

function renderElectionPanel(scene) {
  if (scene.id !== 'election_night' || !state.election) {
    electionPanel.hidden = true;
    return;
  }
  electionPanel.hidden = false;
  electionPanel.innerHTML = `
    <h3 class="election-title">${state.election.won ? 'You won!' : 'You lost'}</h3>
    <p class="election-total">${state.election.percent}% aggregate favour</p>
    <ul class="election-breakdown">
      ${state.election.breakdown
        .map(
          (b) => `
        <li>
          <span>${b.name} <em>(${b.type})</em></span>
          <span class="election-bar"><span style="width:${b.support}%"></span></span>
          <span>${b.support}%</span>
        </li>`
        )
        .join('')}
    </ul>
  `;
}

function renderScene() {
  const scene = getScene(state);
  if (!scene) return;

  const env = state.environmentId ? environments[state.environmentId] : null;

  actBadge.textContent = actLabel(state.act);
  envBadge.textContent = env ? env.title : 'Choose setting';
  envBadge.hidden = !env;

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
  sceneBody.innerHTML = scene.body.map((p) => `<p class="speech-line">${p}</p>`).join('');

  renderNpcPanel(scene);
  renderElectionPanel(scene);
  renderMeters();

  choicesEl.innerHTML = '';
  scene.choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-btn';
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
  electionPanel.hidden = true;

  const ending = resolveEnding(state);
  endingTitle.textContent = ending.title;
  endingSubtitle.textContent = ending.subtitle;
  endingBody.innerHTML = ending.body.map((p) => `<p>${p}</p>`).join('');

  const env = state.environmentId ? environments[state.environmentId] : null;
  const electionBlock = state.election
    ? `<li><strong>Election:</strong> ${state.election.percent}% (${state.election.won ? 'won' : 'lost'})</li>`
    : '';

  endingProfile.innerHTML = `
    <h3>Your ledger</h3>
    <ul>
      ${env ? `<li><strong>Setting:</strong> ${env.title}</li>` : ''}
      <li><strong>Final approval:</strong> ${state.approval}%</li>
      ${electionBlock}
      <li><strong>Economic:</strong> ${axisLabel('economic', state.axes.economic)}</li>
      <li><strong>Social:</strong> ${axisLabel('social', state.axes.social)}</li>
      <li><strong>Governance:</strong> ${axisLabel('authority', state.axes.authority)}</li>
      ${state.promises.length ? `<li><strong>Promises:</strong> ${state.promises.join(', ')}</li>` : ''}
      ${state.coalition.length ? `<li><strong>Coalitions:</strong> ${state.coalition.join(', ')}</li>` : ''}
    </ul>
    <details class="history-details">
      <summary>Decisions you made</summary>
      <ol>${state.history.map((h) => `<li>${h}</li>`).join('')}</ol>
    </details>
  `;
}

restartBtn.addEventListener('click', () => {
  Object.assign(state, createInitialState());
  renderScene();
});

renderScene();
