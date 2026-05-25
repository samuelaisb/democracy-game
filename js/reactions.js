/**
 * Voter (NPC) reactions during canvassing.
 *
 * Diversity strategy:
 *  1. Many template variants per (approach, attitude) bucket -- random pick.
 *  2. Body-language openers vary by attitude so the same template feels new.
 *  3. NPC-type "voice bites" weave a role-specific phrase into a subset of templates.
 *  4. Leaning-aware accents differentiate "mixed" responses by economic axis.
 */

/** @typedef {'warm' | 'cold' | 'mixed'} Attitude */
/** @typedef {'mirror' | 'challenge' | 'favour' | 'personal' | 'default'} Approach */

/** @type {Record<Attitude, string[]>} */
const BODY_LANGUAGE = {
  warm: [
    '{name} exhales and finally smiles.',
    '{name} nods slowly.',
    '{name} relaxes their shoulders.',
    '{name} sets down their phone for the first time.',
    "{name}'s eyes soften.",
    '{name} steps closer instead of further back.',
    '{name} taps the doorframe in approval.',
    '{name} laughs once, short and real.',
    '{name} nods twice, like a decision just got made.',
    '{name} uncrosses their stance and lets you finish.',
    '{name} gives a quick thumbs-up before catching themselves.',
    '{name} straightens up, newly attentive.',
  ],
  cold: [
    '{name} crosses their arms.',
    '{name} sets their jaw.',
    '{name} looks past you to the next house on the street.',
    '{name} taps their clipboard impatiently.',
    '{name} shakes their head once, slow and flat.',
    '{name} half-closes the door.',
    '{name} sighs through their nose.',
    '{name} pockets your flyer without looking at it.',
    '{name} checks the street as if ending this already.',
    '{name} raises an eyebrow and waits for you to stop.',
    '{name} keeps one hand on the door latch.',
    '{name} taps their watch with theatrical patience.',
  ],
  mixed: [
    '{name} tilts their head.',
    '{name} rubs the back of their neck.',
    '{name} weighs the words for a moment.',
    '{name} half-smiles, half-frowns.',
    '{name} glances at a neighbour, then back at you.',
    '{name} shifts their grocery bag to the other hand.',
    '{name} purses their lips.',
    '{name} clicks a pen against the doorframe.',
    '{name} squints, curious but guarded.',
    '{name} nods once, then shrugs.',
    '{name} glances at your badge and back at your face.',
    '{name} drifts half a step into the doorway.',
  ],
};

/** @type {Record<Approach, Record<Attitude, string[]>>} */
const TEMPLATES = {
  mirror: {
    warm: [
      '"That is the first thing today that sounded like you actually listened." {they} nod. "Keep that tone and you will have people like me."',
      '"You said it like one of us." {they} grin. "Do not change the tune in committee."',
      '"Finally." {they} lean in. "Most of you talk past the doorstep. {typeBite}"',
      '"I do not love everyone in your party, but that line lands," {they} admit.',
      '"Keep saying it that way and I might canvass for you," {they} add, half-joking.',
    ],
    cold: [
      '"You are saying what I wanted to hear," {they} reply, unconvinced. "Now prove you mean it."',
      '"Polished." {they} give a thin smile. "Too polished. Who wrote it, you or your pollster?"',
      '"That is the script for my street," {they} mutter. "I have heard it three elections running."',
      '"I appreciate the mirror," {they} note, voice flat. "Mirrors break the moment you turn around."',
      '"Mirroring me does not pay my bills," {they} cut in. "{typeBite}"',
    ],
    mixed: [
      '"You hit the notes, I just do not know the song yet," {they} concede.',
      '"That sounds like me on a good day." {they} shrug. "We will see if it sounds like me by Thursday."',
      '"Half of that I believe," {they} note. "The other half I have heard before."',
      '"You read the room," {they} reply. "Now read the bill before you vote on it."',
      '"Echoing me is easy," {they} remind you. "{typeBite}"',
    ],
  },

  challenge: {
    warm: [
      '"You disagreed with me to my face," {they} remark, almost smiling. "That is rarer than agreement."',
      '"I respect that you did not flinch." {they} tap the doorframe. "{typeBite} I can work with someone who pushes back."',
      '"Wrong answer, but honest one," {they} admit. "That counts for more than you think."',
      '"At least your spine is not a focus group," {they} crack.',
      '"I will not vote with you on that," {they} continue, "but I will not call you a coward either."',
    ],
    cold: [
      '{they} stiffen. "Then we are not allies. I appreciate the honesty, but do not expect my support."',
      '"You picked the wrong street to give that speech on," {they} snap.',
      '"That is the answer that keeps people like me out of your tent," {they} warn. "Walk away clean."',
      '"You are entitled to be wrong," {they} counter. "I am entitled to vote you out."',
      '"You sound certain," {they} murmur. "That is the part that worries me. {typeBite}"',
    ],
    mixed: [
      '"I do not agree, but at least you are not hiding behind slogans," {they} concede.',
      '"Bold take," {they} chuckle. "Bold takes lose elections, but they age well."',
      '"I will not pretend you changed my mind," {they} tell you. "I will pretend less, though, around your name."',
      '"Half of my house will hate you for that," {they} add. "I am the other half."',
      '"You picked a fight on the right doorstep at the wrong hour," {they} sigh.',
    ],
  },

  favour: {
    warm: [
      '{they} lower their voice. "Concrete help beats campaign poetry. If this is real, we can do business."',
      '"A favour I can use is more honest than three speeches," {they} admit. "{typeBite}"',
      '"That is a real handshake, not a press release," {they} reply.',
      '"You are speaking my language," {they} reply. "I will remember this in October."',
      '"Do not put this in the paper," {they} whisper, "and you have me."',
    ],
    cold: [
      '"That sounds like a deal," {they} reply carefully. "Deals are remembered. So are the people who skip out on them."',
      '"You are not the first to offer," {they} warn. "You will be judged on whether you deliver."',
      '"I will take the favour and still vote my conscience," {they} add.',
      '"Be careful." {they} hold your gaze. "Favours have a way of becoming receipts."',
      '"Quiet help is help," {they} concede. "{typeBite} But quiet does not mean free."',
    ],
    mixed: [
      '"I will not say no," {they} reply. "I will not say thank you either."',
      '"Off the record, that helps," {they} whisper. "On the record, we never spoke."',
      '"That kind of help builds loyalty," {they} note, "or scandal. Depends on you."',
      '"I appreciate the offer," {they} reply. "I also know what you are buying."',
      '"You move fast," {they} observe. "Faster than most. {typeBite}"',
    ],
  },

  personal: {
    warm: [
      '{they} exhale. "That sounded human, not scripted. I needed that."',
      '"You told me a story, not a stat," {they} reply. "Tell more of those."',
      '"Now I can picture you at my kitchen table," {they} admit. "That matters."',
      '"You did not have to share that," {they} acknowledge. "It moved me, a little."',
      '"For a politician, that was almost a confession," {they} joke. "I will take it."',
    ],
    cold: [
      '"A story is nice," {they} reply, "but I still need policy I can trust."',
      '"Save the personal stuff for the documentary," {they} cut in. "Tell me what you will do on Monday."',
      '"My grandmother told better stories," {they} scoff. "She also told the truth more often."',
      '"You shared, I appreciate it," {they} say flatly. "Now do not mistake that for a yes."',
      '"Anecdote is not policy," {they} remind you. "{typeBite}"',
    ],
    mixed: [
      '"I hear you," {they} reply. "I am still deciding whether to believe you."',
      '"That story landed," {they} caution, "but stories fade by ballot day."',
      '"You are more interesting than your platform," {they} admit. "That is not a compliment."',
      '"I felt that," {they} admit. "Now I want to read the fine print."',
      '"You can be human and still wrong," {they} add. "But you sound less rehearsed. {typeBite}"',
    ],
  },

  default: {
    warm: [
      '"That sounded human, not scripted," {they} say quietly. "I needed that today."',
      '"Keep talking like that," {they} urge. "It is rarer than you think."',
      '"That was specific enough to matter," {they} say. "Specific is trust."',
      '"You sound like you have knocked real doors before," {they} grin.',
      '"Fine. You earned another minute of my time," {they} say.',
    ],
    cold: [
      '"I am not convinced," {they} reply. "Send your record, not your face."',
      '"Pretty words," {they} mutter, "from a pretty stranger. Try again next week."',
      '"Your campaign voice is polished," {they} reply. "My patience is not."',
      '"If this is your best line, save both of us the trouble," {they} say flatly.',
      '"I have met your promise before, wearing different colours," {they} mutter.',
    ],
    mixed: [
      '"I hear you," {they} reply. "I am still deciding whether to believe you."',
      '"Noted," {they} reply. "Now go knock on the next door and tell me if you say the same thing."',
      '"You make sense in pieces," {they} say. "I am still testing the whole."',
      '"Could be real, could be rehearsed," {they} reply. "I need one more datapoint."',
      '"I am open, not sold," {they} say. "There is a difference."',
    ],
  },
};

/**
 * Bite-sized, role-flavoured snippets a voter may add to their reply.
 * Stored without surrounding quotes so they can be inlined inside a quote.
 * Mirrors the NPC types declared in scenes.js.
 */
/** @type {Record<string, string[]>} */
const TYPE_BITES = {
  // Quebec town
  'Dairy farmer': [
    'My barn does not vote, but my neighbours do.',
    'Sweet talk does not pour into the milk tank.',
    'A quota line is a livelihood line.',
  ],
  'Maple cooperative chief': [
    'Our season is shorter than your news cycle.',
    'One useless form less, and I trust you a little more.',
    'Trees do not care about your slogan.',
  ],
  'French school principal': [
    'Teachers count buses before they count promises.',
    'Underfunded classrooms remember every election.',
    'Words in two languages still need budget in one currency.',
  ],
  'Village priest': [
    'I see the pews before I see your polls.',
    'We feed people you only see in pamphlets.',
    'Faith is patient. Hunger is not.',
  ],
  'Snowplow union steward': [
    'Salt budgets do not bend to applause.',
    'Talk nice. Plow faster.',
    'Storms do not read your platform.',
  ],

  // Ontario suburb
  'Commuter parent': [
    'My day starts on a delayed train.',
    'Daycare costs more than your campaign bus.',
    'Forty minutes home from work is the new tax.',
  ],
  'Condo board president': [
    'Special assessments are how trust collapses, slowly.',
    'Owners and renters will both blame you. Pick a strategy.',
    'A leaky podium is a political problem.',
  ],
  'GO transit advocate': [
    'A signal failure is a policy failure.',
    'Frequency is freedom.',
    'Stop funding parking lots like they are infrastructure.',
  ],
  'Small business strip owner': [
    'I open at six. Government opens at ten.',
    'My rent does not pause for committees.',
    'You hike one fee, I close one storefront.',
  ],
  'Youth soccer coach': [
    'Half my team cannot afford registration.',
    'Field permits should not require lobbyists.',
    'Kids do not have a caucus.',
  ],

  // Vancouver city
  'Housing activist': [
    'Rent is a policy choice.',
    'We organize faster than you legislate.',
    'Homelessness is a budget, not a tragedy.',
  ],
  'Port logistics manager': [
    'Throughput is a metric you cannot fake.',
    'A week of disruption is a quarter of damage.',
    'Containers do not wait for caucus retreats.',
  ],
  'Film industry producer': [
    'Tax credits are mood lighting for an industry.',
    'We shoot here because of the math, not the scenery.',
  ],
  'Climate scientist': [
    'You can poll the weather. You cannot bribe it.',
    'Mitigation is cheaper than the alternative. Always.',
    'Adaptation budgets are tomorrow priced today.',
  ],
  'Downtown tenant organizer': [
    'Rent strikes are louder than your platform.',
    'Tenants outnumber landlords. Eventually you remember that.',
  ],

  // Entire provinces
  'Atlantic fisheries minister': [
    'Quota fights become ferry fights.',
    'Catch limits are coastlines, drawn in ink.',
  ],
  'Prairie energy lobbyist': [
    'Pipelines move faster than your op-eds.',
    'Royalties pay for your hospital announcements.',
  ],
  'Quebec nationalist MLA': [
    'Ottawa rarely keeps its promises in French.',
    'Distinct society is not a slogan, it is a clause.',
  ],
  'Ontario hospital CEO': [
    'Wait times are the most honest poll there is.',
    'Beds are policy. Hallways are headlines.',
  ],
  'BC wildfire responder': [
    'Fire season starts earlier than your election cycle.',
    'Evacuation orders do not consult your platform.',
  ],

  // Northwest Territories
  'Dene community elder': [
    'Consultation begins before you arrive, not at the press conference.',
    'Land has memory longer than your term.',
  ],
  'Northern nurse': [
    'Medevac weather does not negotiate.',
    'A single nurse covers what southern cities call a wing.',
  ],
  'Mining operations lead': [
    'Permitting timelines decide who shows up next quarter.',
    'Camps do not run on press releases.',
  ],
  'Bush pilot': [
    'Weather wins more arguments than I do.',
    'Fuel costs are policy made visible.',
  ],
  'Climate adaptation coordinator': [
    'Thaw is faster than legislation.',
    'Every season we lose a road and a deadline.',
  ],

  // Canada whole
  'Union organizer': [
    'Members do not forget which side held the line.',
    'A picket line is a polling place.',
  ],
  'Tech founder': [
    'Talent migrates faster than policy.',
    'Regulation that is late is regulation that is wrong.',
  ],
  'Rural mayor': [
    'My budget is smaller than your communications team.',
    'A washed-out road is a federal issue once a year.',
  ],
  'Indigenous leader': [
    'Nation-to-nation means more than a press release.',
    'Treaties were not optional. Implementation is not either.',
  ],
  'Suburban parent': [
    'School catchments and groceries decide my vote.',
    'I track interest rates before I track party leaders.',
  ],
};

const GENERIC_BITES = [
  'We will see if you mean it on Tuesday.',
  'My neighbours are listening too.',
  'I have heard better. I have heard worse.',
  'Words travel faster on this street than you think.',
  'I will tell my group chat about you tonight.',
  'I can spot a canned line by the second sentence.',
  'Delivery matters less than follow-through.',
  'You are one doorstep in a long memory.',
  'My block compares notes before election day.',
  'The people upstairs and downstairs vote differently, and both are watching.',
  'I keep receipts from every campaign season.',
  'This street grades politicians on curve and character.',
];

/** @type {Record<Attitude, string[]>} */
const ATTITUDE_CLOSERS = {
  warm: [
    '"You keep this up, you might earn my volunteer hours."',
    '"Say that at the community hall and people will listen."',
    '"I can work with this version of you."',
    '"Do not waste the goodwill you just earned."',
    '"You sound ready for the hard part, not just the rally."',
  ],
  cold: [
    '"I am still a no today."',
    '"Do not mistake this conversation for support."',
    '"Come back with proof, not posture."',
    '"I have heard this melody before and know the ending."',
    '"You get one chance to make that real."',
  ],
  mixed: [
    '"You moved me one inch. That is not nothing."',
    '"I am listening, but I am still checking your math."',
    '"I can see the argument. I am not at yes yet."',
    '"You bought yourself another conversation."',
    '"I will watch what you do next, not what you said best."',
  ],
};

/** Light flavour for "mixed" voter responses based on dominant axis. */
function leaningFlavour(npc) {
  if (!npc?.leanings) return null;
  const { economic, social, authority } = npc.leanings;
  const abs = {
    economic: Math.abs(economic),
    social: Math.abs(social),
    authority: Math.abs(authority),
  };
  const dominant = /** @type {'economic' | 'social' | 'authority'} */ (
    Object.keys(abs).reduce((a, b) => (abs[a] > abs[b] ? a : b))
  );
  const value =
    dominant === 'economic' ? economic : dominant === 'social' ? social : authority;
  if (Math.abs(value) < 15) return null;
  if (dominant === 'economic' && value > 0) return 'I judge candidates on the wallet, mostly.';
  if (dominant === 'economic' && value < 0) return 'I judge candidates on who they fund first.';
  if (dominant === 'social' && value > 0) return 'I care what stays the same after you arrive.';
  if (dominant === 'social' && value < 0) return 'I care who gets to belong here.';
  if (dominant === 'authority' && value > 0) return 'Order on this street matters more than slogans.';
  if (dominant === 'authority' && value < 0) return 'I do not trust anyone who likes power too much.';
  return null;
}

function pick(list) {
  if (!Array.isArray(list) || list.length === 0) return '';
  return list[Math.floor(Math.random() * list.length)];
}

const SHUFFLE_BAGS = new Map();
const RECENT_BY_KEY = new Map();
const RECENT_LINES = [];

const RECENT_TEMPLATE_WINDOW = 5;
const RECENT_BITE_WINDOW = 6;
const RECENT_OPENER_WINDOW = 5;
const RECENT_CLOSER_WINDOW = 5;
const RECENT_LINE_WINDOW = 8;

function shuffleIntoNewOrder(length) {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function nextFromBag(key, list) {
  if (!Array.isArray(list) || list.length === 0) return '';
  const signature = list.join('\u0001');
  const bag = SHUFFLE_BAGS.get(key);
  if (!bag || bag.signature !== signature || bag.length !== list.length) {
    const fresh = {
      signature,
      length: list.length,
      order: shuffleIntoNewOrder(list.length),
      cursor: 0,
    };
    SHUFFLE_BAGS.set(key, fresh);
    return list[fresh.order[fresh.cursor++]];
  }
  if (bag.cursor >= bag.order.length) {
    bag.order = shuffleIntoNewOrder(list.length);
    bag.cursor = 0;
  }
  return list[bag.order[bag.cursor++]];
}

function pushRecentForKey(key, value, maxSize) {
  if (!value) return;
  const list = RECENT_BY_KEY.get(key) ?? [];
  list.push(value);
  while (list.length > maxSize) list.shift();
  RECENT_BY_KEY.set(key, list);
}

function pickDiversified(key, list, recentWindow) {
  if (!Array.isArray(list) || list.length === 0) return '';
  if (list.length === 1) return list[0];

  const recent = RECENT_BY_KEY.get(key) ?? [];
  const boundedWindow = Math.max(1, Math.min(recentWindow, list.length - 1));
  const recentSlice = recent.slice(-boundedWindow);
  const maxAttempts = Math.max(6, list.length * 2);
  let fallback = '';

  for (let i = 0; i < maxAttempts; i += 1) {
    const candidate = nextFromBag(key, list);
    if (!fallback) fallback = candidate;
    if (!recentSlice.includes(candidate)) {
      pushRecentForKey(key, candidate, boundedWindow);
      return candidate;
    }
  }

  pushRecentForKey(key, fallback, boundedWindow);
  return fallback;
}

function pronouns() {
  return { they: 'they', their: 'their' };
}

function tidy(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!?;:])/g, '$1')
    .replace(/"\s+/g, '" ')
    .replace(/\s+"/g, ' "')
    .trim();
}

function fillPlaceholders(text, values) {
  return String(text ?? '').replace(/\{(name|they|their|typeBite)\}/g, (_, token) => values[token] ?? '');
}

function rememberReactionLine(line) {
  if (!line) return;
  RECENT_LINES.push(line);
  while (RECENT_LINES.length > RECENT_LINE_WINDOW) {
    RECENT_LINES.shift();
  }
}

export function resetCanvassReactionHistory() {
  SHUFFLE_BAGS.clear();
  RECENT_BY_KEY.clear();
  RECENT_LINES.length = 0;
}

/**
 * Build the diversified voter reaction line.
 * @param {{ name: string, type?: string, leanings?: { economic: number, social: number, authority: number } }} npc
 * @param {{ swayNpc?: number, npcApproach?: Approach }} choice
 */
export function buildCanvassReactionLine(npc, choice) {
  const sway = choice.swayNpc ?? 0;
  const attitude = /** @type {Attitude} */ (sway >= 0.2 ? 'warm' : sway <= -0.2 ? 'cold' : 'mixed');
  const approach = /** @type {Approach} */ (choice.npcApproach ?? 'default');
  const npcName = npc?.name || 'The voter';
  const typeKey = npc?.type || 'generic';

  const bucket = (TEMPLATES[approach] ?? TEMPLATES.default)[attitude] ?? TEMPLATES.default[attitude];
  const { they, their } = pronouns();
  const typeBitePool = (npc.type && TYPE_BITES[npc.type]) || GENERIC_BITES;
  const tokenValues = { name: npcName, they, their, typeBite: '' };
  const mixedAccent = attitude === 'mixed' ? leaningFlavour(npc) : null;
  const maxAttempts = 8;
  let bestLine = '';

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const template = pickDiversified(
      `template:${approach}:${attitude}`,
      bucket,
      RECENT_TEMPLATE_WINDOW
    );
    const opener = pickDiversified(`opener:${attitude}`, BODY_LANGUAGE[attitude], RECENT_OPENER_WINDOW);
    const typeBite = pickDiversified(`bite:${typeKey}`, typeBitePool, RECENT_BITE_WINDOW);
    const closerPool = ATTITUDE_CLOSERS[attitude] ?? [];
    const closer = Math.random() < 0.5
      ? pickDiversified(`closer:${attitude}`, closerPool, RECENT_CLOSER_WINDOW)
      : '';
    const accentEnabled =
      attitude === 'mixed' && !!mixedAccent && (attempt === 0 ? Math.random() < 0.58 : Math.random() < 0.35);

    tokenValues.typeBite = typeBite || pick(GENERIC_BITES) || 'I heard your point.';
    const openerFilled = fillPlaceholders(opener, tokenValues);
    const bodyFilled = fillPlaceholders(template, tokenValues);
    const closerFilled = fillPlaceholders(closer, tokenValues);
    const accentSuffix = accentEnabled ? ` ${npcName} adds, almost to themselves, "${mixedAccent}"` : '';
    const candidate = tidy(`${openerFilled} ${bodyFilled} ${closerFilled}${accentSuffix}`);

    if (!bestLine) bestLine = candidate;
    if (!RECENT_LINES.includes(candidate)) {
      rememberReactionLine(candidate);
      return candidate;
    }
  }

  rememberReactionLine(bestLine);
  return bestLine;
}
