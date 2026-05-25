/** @type {Record<string, string>} */
const TYPE_KEYS = {
  noble: 'noble',
  courtier: 'noble',
  clergy: 'clergy',
  priestess: 'clergy',
  merchant: 'merchant',
  'peasant delegate': 'peasant',
  'dairy farmer': 'peasant',
  'maple cooperative chief': 'merchant',
  'french school principal': 'scholar',
  'village priest': 'clergy',
  'snowplow union steward': 'worker',
  'commuter parent': 'parent',
  'condo board president': 'leader',
  'go transit advocate': 'leader',
  'small business strip owner': 'merchant',
  'youth soccer coach': 'parent',
  'housing activist': 'worker',
  'port logistics manager': 'merchant',
  'film industry producer': 'tech',
  'climate scientist': 'scholar',
  'downtown tenant organizer': 'worker',
  'atlantic fisheries minister': 'leader',
  'prairie energy lobbyist': 'merchant',
  'quebec nationalist mla': 'leader',
  'ontario hospital ceo': 'leader',
  'bc wildfire responder': 'soldier',
  'dene community elder': 'leader',
  'northern nurse': 'worker',
  'mining operations lead': 'merchant',
  'bush pilot': 'soldier',
  'climate adaptation coordinator': 'scholar',
  'union organizer': 'worker',
  'tech founder': 'tech',
  'rural mayor': 'rural',
  'indigenous leader': 'leader',
  'suburban parent': 'parent',
  'hoplite veteran': 'soldier',
  'metic trader': 'merchant',
  philosopher: 'scholar',
  demagogue: 'demagogue',
};

function typeKey(type) {
  const lower = (type || '').toLowerCase();
  if (TYPE_KEYS[lower]) return TYPE_KEYS[lower];
  if (/noble|court|elite/i.test(type)) return 'noble';
  if (/clergy|priest|faith/i.test(type)) return 'clergy';
  if (/merchant|trade|founder|metic/i.test(type)) return 'merchant';
  if (/peasant|rural|parent|farmer/i.test(type)) return 'peasant';
  if (/union|worker|organizer/i.test(type)) return 'worker';
  if (/indigenous|leader/i.test(type)) return 'leader';
  if (/philosopher|scholar/i.test(type)) return 'scholar';
  if (/hoplite|veteran|soldier/i.test(type)) return 'soldier';
  if (/demagogue/i.test(type)) return 'demagogue';
  if (/tech/i.test(type)) return 'tech';
  return 'default';
}

/** @type {Record<string, string>} */
const PORTRAIT_EMOJI = {
  noble: '👑',
  clergy: '⛪',
  merchant: '💰',
  peasant: '🌾',
  worker: '✊',
  tech: '💻',
  rural: '🏘️',
  leader: '🪶',
  parent: '🏡',
  scholar: '📜',
  soldier: '🛡️',
  demagogue: '📣',
  default: '👤',
};

/**
 * @param {string} [type]
 * @returns {string}
 */
export function portraitEmoji(type) {
  const key = typeKey(type);
  return PORTRAIT_EMOJI[key] ?? PORTRAIT_EMOJI.default;
}

const SILHOUETTES = {
  noble: '<path d="M20 8c0-3 2-5 4-5s4 2 4 5v2h3l-2 28H15L13 10h3V8z"/><path d="M14 6h12l1 4H13l1-4z"/>',
  clergy: '<path d="M20 6l6 8v22H14V14l6-8z"/><ellipse cx="20" cy="9" rx="5" ry="3"/>',
  merchant: '<rect x="12" y="14" width="16" height="14" rx="2"/><path d="M14 14V10h12v4"/><circle cx="20" cy="28" r="6"/>',
  peasant: '<circle cx="20" cy="10" r="5"/><path d="M12 38V22c0-4 3.5-7 8-7s8 3 8 7v16"/>',
  worker: '<path d="M10 32l6-14 4 8 4-12 6 18H10z"/>',
  leader: '<path d="M20 8c-4 0-7 3-7 7 0 2 1 4 3 5l-2 20h12l-2-20c2-1 3-3 3-5 0-4-3-7-7-7z"/><path d="M8 14l4-6M32 14l-4-6"/>',
  parent: '<circle cx="20" cy="11" r="4"/><path d="M14 38V24c0-3 2.5-5 6-5s6 2 6 5v14"/><circle cx="28" cy="26" r="3"/>',
  tech: '<rect x="11" y="12" width="18" height="12" rx="2"/><path d="M14 38h12l-1-8H15l-1 8z"/>',
  rural: '<path d="M10 22h20l-2 16H12L10 22z"/><path d="M20 8l8 14H12L20 8z"/>',
  scholar: '<rect x="14" y="10" width="12" height="18" rx="1"/><path d="M12 38h16M16 14h8M16 18h6"/>',
  soldier: '<path d="M14 14h12l2 8-8 4-8-4 2-8z"/><path d="M12 38h16l-1-12H13l-1 12z"/>',
  demagogue: '<path d="M14 20h12v4H14z"/><path d="M26 16c4 2 6 6 6 10H8c0-4 2-8 6-10"/><circle cx="20" cy="30" r="6"/>',
  default: '<circle cx="20" cy="11" r="5"/><path d="M11 38V23c0-5 4-9 9-9s9 4 9 9v15"/>',
};

/**
 * @param {string} [type]
 * @param {{ size?: number, className?: string, title?: string }} [opts]
 */
export function portraitSvg(type, opts = {}) {
  const size = opts.size ?? 40;
  const key = typeKey(type);
  const paths = SILHOUETTES[key] ?? SILHOUETTES.default;
  const label = opts.title ? ` aria-label="${opts.title}"` : ' aria-hidden="true"';
  const cls = opts.className ? ` class="${opts.className}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="${size}" height="${size}"${cls}${label} role="img"><rect width="40" height="40" fill="currentColor" opacity="0.12" rx="4"/><g fill="currentColor">${paths}</g></svg>`;
}

export function brandBallotSvg(size = 32) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}" class="brand-mark-svg" aria-hidden="true"><rect x="4" y="4" width="24" height="24" rx="3" fill="currentColor" opacity="0.15"/><path fill="currentColor" d="M10 8h12v3H10V8zm0 6h12v2H10v-2zm0 5h8v2h-8v-2zm14 3l-4 4-2-2 1.4-1.4.6.6 2.6-2.6 4 4 1.4-1.4z"/></svg>`;
}
