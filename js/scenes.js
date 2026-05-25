import { environments, canonicalEnvironmentId } from './environments.js';
import { leaningLabel } from './npcs.js';

/** @typedef {{ economic?: number, social?: number, authority?: number, approval?: number, campaignKnowledge?: number, mediaLiteracy?: number, misinformationRisk?: number, rivalHeat?: number, budgetRoom?: number, institutionalTrust?: number }} AxisDelta */
/** @typedef {{ text: string, next: string, effects?: AxisDelta, hint?: string, promise?: string, promiseDelta?: Record<string, number>, coalition?: string, swayNpc?: number, setEnv?: import('./environments.js').EnvironmentId, environmentKey?: string, environmentLabel?: string, npcApproach?: 'mirror' | 'challenge' | 'favour' | 'personal', continueNpcTalk?: boolean }} Choice */
/** @typedef {{ id: string, act?: number, year?: number, eyebrow?: string, title: string, body: string[], choices: Choice[], ending?: boolean, npcPanel?: boolean }} Scene */

/** @type {Record<string, Scene>} */
export const scenes = {
  env_select: {
    id: 'env_select',
    act: 0,
    eyebrow: 'Choose your environment',
    title: 'Choose your campaign map',
    body: [
      'Point-and-click through your opening campaign and pick where this run begins.',
      'Your selected environment sets the local political context and the people you will face.',
    ],
    choices: [
      {
        text: 'Small farming town in Quebec',
        next: 'act1_intro',
        setEnv: 'quebec_town',
        environmentKey: 'qc_small_town',
        environmentLabel: 'Small farming town in Quebec',
        hint: 'Local ridings & rural priorities',
      },
      {
        text: 'suburban municipality in Ontario',
        next: 'act1_intro',
        setEnv: 'ontario_suburb',
        environmentKey: 'on_suburban_municipality',
        environmentLabel: 'suburban municipality in Ontario',
        hint: 'Commuter issues & school boards',
      },
      {
        text: 'Larger city in British Columbia (Vancouver)',
        next: 'act1_intro',
        setEnv: 'vancouver_city',
        environmentKey: 'bc_large_city_vancouver',
        environmentLabel: 'Larger city in British Columbia (Vancouver)',
        hint: 'Urban pressure cooker',
      },
      {
        text: 'Entire Provinces',
        next: 'act1_intro',
        setEnv: 'entire_provinces',
        environmentKey: 'entire_provinces',
        environmentLabel: 'Entire Provinces',
        hint: 'Regional coalition balancing',
      },
      {
        text: 'Northwest Territories',
        next: 'act1_intro',
        setEnv: 'northwest_territories',
        environmentKey: 'northwest_territories',
        environmentLabel: 'Northwest Territories',
        hint: 'Remote governance trade-offs',
      },
      {
        text: 'Canada (whole)',
        next: 'act1_intro',
        setEnv: 'canada_whole',
        environmentKey: 'canada_whole',
        environmentLabel: 'Canada (whole)',
        hint: 'National campaign scale',
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
        next: 'act1_field_ops',
        effects: { social: -4, authority: -3, approval: 4, campaignKnowledge: 7 },
        hint: 'Grassroots trust',
      },
      {
        text: 'Grand rallies: sell a vision, details later',
        next: 'act1_field_ops',
        effects: { authority: 5, approval: 2, rivalHeat: 5 },
        hint: 'Charismatic momentum',
      },
      {
        text: 'Back-room deals: secure sponsors before the public',
        next: 'act1_field_ops',
        effects: { economic: 6, authority: 4, campaignKnowledge: -3, rivalHeat: 7 },
        coalition: 'patrons',
        hint: 'Elite backing',
      },
    ],
  },

  act1_field_ops: {
    id: 'act1_field_ops',
    act: 1,
    eyebrow: 'Act I — Field operations',
    title: 'How do people join your campaign?',
    body: [
      'Supporters ask where to start. Your answer determines whether they become one-day cheerleaders or an actual civic network.',
      'This is where canvassing literacy is built: scripts, follow-up, and who gets invited into the process.',
    ],
    choices: [
      {
        text: 'Volunteer ladder: training nights, neighborhood captains, clear next steps',
        next: 'act1_social_media',
        effects: { approval: 4, campaignKnowledge: 10, authority: -3 },
        hint: 'Organizing capacity',
      },
      {
        text: 'Consultant-heavy operation: polished outreach, limited volunteer control',
        next: 'act1_social_media',
        effects: { authority: 4, campaignKnowledge: 2, approval: -1 },
        coalition: 'elite',
        hint: 'Professional machine',
      },
      {
        text: 'Issue pop-ups only: mobilize fast around viral moments',
        next: 'act1_social_media',
        effects: { approval: 1, campaignKnowledge: 4, misinformationRisk: 6, rivalHeat: 4 },
        hint: 'Reactive organizing',
      },
    ],
  },

  act1_social_media: {
    id: 'act1_social_media',
    act: 1,
    eyebrow: 'Act I — Information war',
    title: 'What is your digital strategy?',
    body: [
      'Your team can spread facts, vibes, or outright fiction. The fastest growth channels are often the dirtiest.',
      'Choices here shape literacy about astroturfing, misinformation, and disinformation.',
    ],
    choices: [
      {
        text: 'Transparency-first: source every claim and fund independent fact checks',
        next: 'act1_rivalry',
        effects: { approval: 3, mediaLiteracy: 12, misinformationRisk: -10, authority: -2 },
        hint: 'Trust over speed',
      },
      {
        text: 'Grey-zone spin: emotionally loaded clips and selective context',
        next: 'act1_rivalry',
        effects: { approval: 5, mediaLiteracy: -3, misinformationRisk: 10, rivalHeat: 8 },
        hint: 'Misinformation edge',
      },
      {
        text: 'Astroturf burst: paid “grassroots” pages and bot-amplified outrage',
        next: 'act1_rivalry',
        effects: { approval: 8, mediaLiteracy: -10, misinformationRisk: 18, rivalHeat: 12 },
        coalition: 'patrons',
        hint: 'Astroturfing gamble',
      },
      {
        text: 'Community explainers: livestream Q&A and myth-busting with local groups',
        next: 'act1_rivalry',
        effects: { approval: 4, mediaLiteracy: 9, campaignKnowledge: 5, misinformationRisk: -6 },
        hint: 'Civic education',
      },
    ],
  },

  act1_rivalry: {
    id: 'act1_rivalry',
    act: 1,
    eyebrow: 'Act I — Candidate relations',
    title: 'How do you handle other candidates?',
    body: [
      'Rivals want your voters, your donors, and your mistakes on loop. Cooperation can look weak; permanent war can poison the whole election.',
      'Your tone now will shape whether post-election governing is possible.',
    ],
    choices: [
      {
        text: 'Hard contrast: expose contradictions and force direct debates',
        next: 'act1_fundraising',
        effects: { approval: 2, rivalHeat: 10, authority: 3 },
        hint: 'Combat campaign',
      },
      {
        text: 'Issue truce: no personal attacks, compete on policy receipts',
        next: 'act1_fundraising',
        effects: { approval: 3, rivalHeat: -8, campaignKnowledge: 4, institutionalTrust: 5 },
        hint: 'Democratic norms',
      },
      {
        text: 'Backchannel pact: split messaging lanes, avoid direct collisions',
        next: 'act1_fundraising',
        effects: { approval: -2, rivalHeat: -2, misinformationRisk: 6, authority: 2 },
        coalition: 'broad_coalition',
        hint: 'Transactional détente',
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
        effects: { economic: 10, budgetRoom: 8 },
        coalition: 'merchants',
        hint: 'Business right',
      },
      {
        text: 'Labour halls & mutual-aid societies',
        next: 'act1_npc_talk',
        effects: { economic: -10, social: -4, campaignKnowledge: 5 },
        coalition: 'workers',
        hint: 'Organized left',
      },
      {
        text: 'Mixed small donors — no single master',
        next: 'act1_npc_talk',
        effects: { approval: 6, authority: -2, mediaLiteracy: 4, misinformationRisk: -4 },
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
        next: 'act2_officials',
        effects: { authority: 14, institutionalTrust: -5 },
        promiseDelta: { order: 12, liberty: -10 },
        hint: 'Presidential system',
      },
      {
        text: 'Parliament supreme — laws flow from the chamber',
        next: 'act2_officials',
        effects: { authority: -10, social: -3, institutionalTrust: 5 },
        promiseDelta: { liberty: 14, rights: 8, order: -8 },
        hint: 'Legislative supremacy',
      },
      {
        text: 'Power shared — coalition cabinet and veto partners',
        next: 'act2_officials',
        effects: { authority: -4, approval: 5, institutionalTrust: 7 },
        coalition: 'broad_coalition',
        promiseDelta: { liberty: 8, rights: 6, order: 4 },
        hint: 'Consensus governance',
      },
    ],
  },

  act2_officials: {
    id: 'act2_officials',
    act: 2,
    year: 1,
    eyebrow: 'Act II — Political relationships',
    title: 'On-party and cross-party dealings',
    body: [
      'Your caucus wants rewards. Opposition members want influence. Bureaucrats want clear direction and fewer late-night reversals.',
      'How you treat fellow officials now will either unlock coalitions or harden sabotage.',
    ],
    choices: [
      {
        text: 'Cross-party policy working groups with transparent minutes',
        next: 'act2_policy',
        effects: { approval: 5, authority: -4, institutionalTrust: 10 },
        coalition: 'unity',
        hint: 'Bridge-building',
      },
      {
        text: 'Reward loyalists, isolate rivals, centralize negotiations',
        next: 'act2_policy',
        effects: { authority: 7, approval: -3, institutionalTrust: -8, rivalHeat: 5 },
        coalition: 'patrons',
        hint: 'Inner-circle governance',
      },
      {
        text: 'Transactional dealmaking issue-by-issue across all blocs',
        next: 'act2_policy',
        effects: { approval: 2, authority: 1, institutionalTrust: 2, budgetRoom: -4 },
        coalition: 'broad_coalition',
        hint: 'Fluid coalition',
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
        promiseDelta: { public_services: 28, tax_relief: -28 },
        hint: 'State-led economy',
      },
      {
        text: 'Privatize monopolies and cut business taxes',
        next: 'act2_crisis',
        effects: { economic: 14, approval: -4 },
        coalition: 'merchants',
        promiseDelta: { tax_relief: 30, public_services: -26 },
        hint: 'Market revolution',
      },
      {
        text: 'Carbon levy + child benefits — technocratic package',
        next: 'act2_crisis',
        effects: { economic: -4, social: -4, approval: 3 },
        promiseDelta: { public_services: 14, tax_relief: 10 },
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
        promiseDelta: { order: 24, liberty: -22, rights: -16 },
        hint: 'Authoritarian gamble',
      },
      {
        text: 'Call a confidence vote and dare rivals to collapse you',
        next: 'act2_coalition',
        effects: { authority: -6, approval: 4 },
        promiseDelta: { liberty: 20, rights: 12, order: -10 },
        hint: 'Democratic brinkmanship',
      },
      {
        text: 'Buy peace — subsidies for allies, investigations for enemies',
        next: 'act2_coalition',
        effects: { economic: -6, approval: 2 },
        coalition: 'patrons',
        promiseDelta: { tax_relief: -12, rights: -12 },
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
        promiseDelta: { rights: 12, liberty: 8, order: -6 },
        hint: 'Grand coalition',
      },
      {
        text: 'Discipline your base; let defectors flee',
        next: 'act3_polling',
        effects: { authority: 6, social: 4, approval: -5 },
        promiseDelta: { order: 10, rights: -8 },
        hint: 'Partisan purity',
      },
      {
        text: 'Plebiscite — let the people ratify your course',
        next: 'act3_polling',
        effects: { authority: -12, approval: 10 },
        promiseDelta: { liberty: 18, rights: 10, order: -8 },
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

/**
 * Opening lines and concern descriptions keyed by NPC type.
 * quote(name) → string said by the NPC.
 * concern      → what the player observes about their priorities.
 */
const NPC_TYPE_LINES = {
  // Quebec town
  'Dairy farmer': {
    quote: (name) =>
      `${name} wipes their boots on your campaign sign. "My milk quota, feed costs, and road access decide whether this farm survives. Practical plan or campaign poetry?"`,
    concern: 'They track farm margins, winter road maintenance, and reliable market access.',
  },
  'Maple cooperative chief': {
    quote: (name) =>
      `"Our syrup season is shorter than your permit process," ${name} says. "Cut one useless form and we can talk trust."`,
    concern: 'They want co-op support, shipping reliability, and lower admin drag during harvest.',
  },
  'French school principal': {
    quote: (name) =>
      `${name} closes a stack of report cards. "You want votes? Start with enough teachers, buses, and language support that students are not forgotten."`,
    concern: 'They prioritize francophone services, staffing, and stable school funding.',
  },
  'Village priest': {
    quote: (name) =>
      `"People ask me for grocery help before blessings now," ${name} says. "Whatever you cut in council, we feel first in the pews."`,
    concern: 'They care about poverty relief, elder support, and social cohesion.',
  },
  'Snowplow union steward': {
    quote: (name) =>
      `${name} taps your clipboard. "Talk nice if you want. I need contracts, salt budgets, and fewer speeches during storms."`,
    concern: 'They watch worker safety, equipment upgrades, and realistic winter response plans.',
  },
  // Ontario suburb
  'Commuter parent': {
    quote: (name) =>
      `"Traffic ate two hours of my life today," ${name} says. "Sell me one policy that gets me home before my kids are asleep."`,
    concern: 'They focus on transit reliability, childcare costs, and school crowding.',
  },
  'Condo board president': {
    quote: (name) =>
      `${name} flips through reserve-fund charts. "One bad repair cycle and three towers are toast. Where is your plan for aging condos?"`,
    concern: 'They need practical building standards, insurance relief, and repair funding.',
  },
  'GO transit advocate': {
    quote: (name) =>
      `"If your transit promise has no timetable, it is fan fiction," ${name} says. "Give me trains, not hashtags."`,
    concern: 'They push for frequent service, integrated fares, and transit-first growth.',
  },
  'Small business strip owner': {
    quote: (name) =>
      `${name} points to empty storefronts. "I can survive taxes or roadwork, but not both forever. Who gets relief first?"`,
    concern: 'They want tax predictability, construction coordination, and local foot traffic.',
  },
  'Youth soccer coach': {
    quote: (name) =>
      `"Ninety kids, one muddy field, zero lights," ${name} says. "Fund one pitch and I might canvas for you out of pure gratitude."`,
    concern: 'They seek recreation funding, safe facilities, and family-friendly schedules.',
  },
  // Vancouver city
  'Housing activist': {
    quote: (name) =>
      `${name} waves a rent notice. "No more studies. Build homes people can actually afford before retirement age."`,
    concern: 'They demand affordable housing delivery, tenant protections, and anti-speculation policy.',
  },
  'Port logistics manager': {
    quote: (name) =>
      `"One strike plus one storm equals empty shelves," ${name} says. "Can your city run supply chains without weekly chaos?"`,
    concern: 'They track port resilience, labor stability, and freight corridor capacity.',
  },
  'Film industry producer': {
    quote: (name) =>
      `${name} adjusts dark glasses in the rain. "Everyone loves creative jobs until permit season. Keep shoots here and thousands keep work."`,
    concern: 'They want predictable permitting, competitive credits, and neighborhood coordination.',
  },
  'Climate scientist': {
    quote: (name) =>
      `"Heat domes do not care about your approval rating," ${name} says. "If adaptation is optional, casualties are not."`,
    concern: 'They prioritize adaptation funding, emissions cuts, and resilient infrastructure.',
  },
  'Downtown tenant organizer': {
    quote: (name) =>
      `${name} holds a stack of mold complaints. "My group can mobilize twenty towers by Friday. Why should we trust your renter agenda?"`,
    concern: 'They push for rental enforcement, eviction protections, and more non-market housing.',
  },
  // Entire provinces
  'Atlantic fisheries minister': {
    quote: (name) =>
      `${name} answers while standing at a dock. "One central memo can ruin a whole season. Whose voice matters when policies hit the coast?"`,
    concern: 'They defend fishery livelihoods, regional authority, and coastal investment.',
  },
  'Prairie energy lobbyist': {
    quote: (name) =>
      `"People still need heat and paycheques tomorrow," ${name} says. "Transition is fine. Whiplash policy is not."`,
    concern: 'They seek energy certainty, transition support, and stable regulation.',
  },
  'Quebec nationalist MLA': {
    quote: (name) =>
      `${name} smiles politely. "Unity speeches are easy. Respecting jurisdiction when cameras are gone is the hard part."`,
    concern: 'They watch language protections, provincial autonomy, and fiscal fairness.',
  },
  'Ontario hospital CEO': {
    quote: (name) =>
      `"Hallway medicine is now literal hallway medicine," ${name} says. "Miss one transfer target and we miss ten nurses."`,
    concern: 'They need workforce retention, infrastructure renewal, and predictable health transfers.',
  },
  'BC wildfire responder': {
    quote: (name) =>
      `${name} smells faintly of smoke. "Prevention budgets are cheaper than rebuilding towns. Are you funding prevention or press conferences?"`,
    concern: 'They demand prevention funding, rapid response coordination, and climate readiness.',
  },
  // Northwest Territories
  'Dene community elder': {
    quote: (name) =>
      `${name} studies you in silence. "Promises travel fast. Cargo does not. Which one arrives first under your government?"`,
    concern: 'They value community consultation, language continuity, and service reliability.',
  },
  'Northern nurse': {
    quote: (name) =>
      `"I do emergency care, prenatal support, and medevac triage in one shift," ${name} says. "What I cannot do is clone staff."`,
    concern: 'They need staffing incentives, telehealth reliability, and medevac capacity.',
  },
  'Mining operations lead': {
    quote: (name) =>
      `${name} taps a logistics map. "One delayed winter road and payroll shakes. We need certainty, not mood swings in permitting."`,
    concern: 'They seek infrastructure reliability, clear permits, and community partnerships.',
  },
  'Bush pilot': {
    quote: (name) =>
      `"Your policy memo is cute," ${name} says. "Can it land on gravel in crosswinds with medical cargo?"`,
    concern: 'They prioritize maintained airstrips, fuel affordability, and emergency logistics.',
  },
  'Climate adaptation coordinator': {
    quote: (name) =>
      `${name} spreads thaw maps on the table. "Permafrost is moving under homes right now. What is your ten-year adaptation plan?"`,
    concern: 'They push resilient housing, relocation support, and long-term adaptation funds.',
  },
  // Canada whole
  'Union organizer': {
    quote: (name) =>
      `"We have heard workers-first speeches from everyone," ${name} says. "Give me hard numbers and legal teeth."`,
    concern: 'They track wage floors, bargaining rights, and labor enforcement.',
  },
  'Tech founder': {
    quote: (name) =>
      `${name} checks a startup dashboard mid-sentence. "I can hire in Toronto or Austin tomorrow. Why scale here under your plan?"`,
    concern: 'They seek talent pipelines, competitive taxes, and smart regulation.',
  },
  'Rural mayor': {
    quote: (name) =>
      `"Can you find us after election day too?" ${name} asks. "Then talk roads, clinics, and broadband like we matter year-round."`,
    concern: 'They need reliable infrastructure, health access, and rural connectivity.',
  },
  'Indigenous leader': {
    quote: (name) =>
      `${name} speaks carefully. "Nation-to-nation is not branding. What authority will you actually share, and when?"`,
    concern: 'They center treaty rights, clean water, and meaningful consent.',
  },
  'Suburban parent': {
    quote: (name) =>
      `"Mortgage up, groceries up, childcare up," ${name} says. "Give me one policy that changes my weekly spreadsheet."`,
    concern: 'They worry about affordability, schools, commuting, and middle-class stability.',
  },
};

/**
 * Flavored choice labels for each NPC type.
 * Keys: mirror | challenge | favour | personal
 */
const NPC_TYPE_CHOICES = {
  'Dairy farmer': {
    mirror: 'Promise stable quotas, better roads, and local agriculture support',
    challenge: 'Argue tough reforms are needed to keep farms competitive',
    favour: 'Offer fuel relief and priority winter clearing for farm routes',
    personal: 'Share a story about early mornings, weather, and hard margins',
  },
  'Commuter parent': {
    mirror: 'Promise transit reliability, safer routes, and childcare support',
    challenge: 'Be blunt: long-term fixes require short-term construction pain',
    favour: 'Offer a commuter rebate and school-route safety pilot',
    personal: 'Talk honestly about family schedules and burnout',
  },
  'Housing activist': {
    mirror: 'Commit to real housing delivery targets and tenant protections',
    challenge: 'Push back: supply growth still needs broad neighborhood buy-in',
    favour: 'Offer concrete zoning wins in their priority districts',
    personal: 'Admit your own frustration with performative housing politics',
  },
  'Dene community elder': {
    mirror: 'Commit to consultation-led governance and local decision power',
    challenge: 'Argue emergency response files need tighter territorial timelines',
    favour: 'Offer funded consultation teams and language support services',
    personal: 'Listen first, then promise explicit accountability dates',
  },
  'Union organizer': {
    mirror: 'Back stronger labor standards and enforceable bargaining rights',
    challenge: 'Argue phased changes protect jobs during economic shocks',
    favour: 'Offer organized labor a formal seat in budget consultations',
    personal: 'Share a personal memory of precarious work and wage stress',
  },
  'Tech founder': {
    mirror: 'Promise talent pathways, procurement reform, and smart regulation',
    challenge: 'Argue growth without protections creates brittle inequality',
    favour: 'Offer innovation tax support and a public-sector pilot contract',
    personal: 'Discuss risk, failure, and building under uncertainty',
  },
};

/** @param {import('./npcs.js').generateCampaignNPCs extends (...args: any) => infer R ? R[0] : never} npc */
export function getNpcTalkScene(npc, envId, index, total, npcReaction = null) {
  const resolvedEnv = canonicalEnvironmentId(envId);
  const env = resolvedEnv ? environments[resolvedEnv] : null;
  const econ = leaningLabel('economic', npc.leanings.economic);
  const soc = leaningLabel('social', npc.leanings.social);
  const auth = leaningLabel('authority', npc.leanings.authority);

  const typeLines = NPC_TYPE_LINES[npc.type];
  const typeChoices = NPC_TYPE_CHOICES[npc.type];

  const openingQuote = typeLines
    ? typeLines.quote(npc.name)
    : `"${env?.flavor.split('.')[0] ?? 'The realm'} watches," ${npc.name} says. "Convince me you mean what you sell."`;

  const concernLine = typeLines
    ? typeLines.concern
    : `They lean ${econ} on purse strings, ${soc} on culture, ${auth} on how hard the state should grip.`;

  const choices = npcReaction
    ? [
        {
          text: 'Continue canvassing',
          next: 'act1_npc_talk',
          continueNpcTalk: true,
          hint: 'Next doorstep',
        },
      ]
    : [
        {
          text: typeChoices?.mirror ?? 'Mirror their instincts — agree on taxes, morals, and order',
          next: 'act1_npc_talk',
          effects: {
            economic: Math.sign(npc.leanings.economic) * 4,
            social: Math.sign(npc.leanings.social) * 4,
            authority: Math.sign(npc.leanings.authority) * 4,
          },
          swayNpc: 0.35,
          npcApproach: 'mirror',
          hint: 'Pander (+sway)',
        },
        {
          text: typeChoices?.challenge ?? 'Challenge them — argue for the opposite coalition',
          next: 'act1_npc_talk',
          effects: {
            economic: -Math.sign(npc.leanings.economic) * 6,
            approval: 2,
          },
          swayNpc: -0.25,
          npcApproach: 'challenge',
          hint: 'Principled risk',
        },
        {
          text: typeChoices?.favour ?? 'Offer a concrete favour — job, contract, exemption',
          next: 'act1_npc_talk',
          effects: { economic: 5, authority: 3, approval: -3 },
          swayNpc: 0.2,
          npcApproach: 'favour',
          coalition: 'patrons',
          hint: 'Transactional',
        },
        {
          text: typeChoices?.personal ?? 'Share a personal story — no policy, just trust',
          next: 'act1_npc_talk',
          effects: { social: -2, authority: -2, approval: 4 },
          swayNpc: 0.15,
          npcApproach: 'personal',
          hint: 'Human connection',
        },
      ];

  return {
    id: 'act1_npc_talk',
    act: 1,
    eyebrow: `Act I — Canvassing (${index + 1}/${total})`,
    title: `${npc.name}, ${npc.type}`,
    npcPanel: true,
    body: [
      openingQuote,
      concernLine,
      `Political instincts: ${econ} on economics, ${soc} on culture, ${auth} on state power.`,
      ...(npcReaction ? [npcReaction] : []),
    ],
    reactionLine: npcReaction,
    choices,
  };
}

/** @param {import('./game.js').createInitialState extends () => infer S ? S : never} state */
export function getElectionScene(state) {
  const envId = canonicalEnvironmentId(state.environmentId);
  const env = envId ? environments[envId] : null;
  const result = state.election;
  const pct = result?.percent ?? 0;
  const won = result?.won ?? false;

  const body = [
    `${env?.electionLabel ?? 'Votes'} roll in across ${env?.title ?? 'the realm'}, district by district under first-past-the-post rules.`,
    won
      ? `You take ${result?.seatsWon ?? 0} of ${result?.seatsTotal ?? 0} seats with ${pct}% aggregate favour. Allies cheer; enemies already plot your first mistake.`
      : `You finish with ${result?.seatsWon ?? 0} of ${result?.seatsTotal ?? 0} seats and ${pct}% aggregate favour — short of power.`,
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
      'Historians will argue about the gap between your rhetoric and your record. For now, the streets are yours.',
      'Legacy is a long game. You have bought yourself time to play it.',
    ],
  },
  {
    id: 'revolution_fury',
    match: () => true,
    title: 'The fury of the mob',
    subtitle: 'Polling became a death sentence.',
    body: [
      'Promises rotted into insults. Coalitions broke. When the final numbers landed, the street answered with rope, blade, or exile.',
      'They do not burn portraits of leaders they never believed in. The fire is a form of disappointed love.',
      'Whatever comes next will cite your name as a warning. That, too, is a kind of legacy.',
    ],
  },
  {
    id: 'campaign_defeat',
    match: () => true,
    title: 'Never took office',
    subtitle: 'The election ended your story early.',
    body: [
      'You misread the rooms that mattered. Patrons shrugged. Voters shrugged louder. Another name will fill the chair you wanted.',
      'The platform you built will be borrowed, rebranded, and claimed by someone with better timing.',
      'Losing an election is not the end of politics. It is the beginning of a different kind of patience.',
    ],
  },
  {
    id: 'social_democracy',
    match: (s) => s.economic <= -25 && s.authority <= 15,
    title: 'The Social Democratic Republic',
    subtitle: 'Equality secured through institutions.',
    body: [
      'You leave with expanded services and a state willing to tax for dignity. Critics cite bureaucracy; supporters cite results.',
      'Infant mortality falls. University enrolment rises. A generation that never thanks you directly will live better for the trade-offs you made.',
      'The coalition that built this will need tending. Institutions are only as durable as the people willing to defend them.',
    ],
  },
  {
    id: 'market_liberal',
    match: (s) => s.economic >= 25 && s.authority <= 10,
    title: 'The Market-Liberal Commonwealth',
    subtitle: 'Enterprise unchained.',
    body: [
      'Growth in the capital, strain in the provinces — your term bet on competition and a light touch from the state.',
      'Investment returns. Inequality also returns, less loudly. The ledger is not lying, but it is selective.',
      'Future governments will inherit the infrastructure you did not build. They will call it your debt.',
    ],
  },
  {
    id: 'conservative_nation',
    match: (s) => s.social >= 20 && s.economic >= 10,
    title: 'The Traditional Nation-State',
    subtitle: 'Order, heritage, guarded borders.',
    body: [
      'Cultural institutions are strengthened. Immigration is tightened. Cohesive to some; closed to others.',
      'Those who felt the nation was slipping away from them feel it again — solid underfoot, familiar.',
      'Those who were already on the margins find the margins a little harder to cross. The record will hold both truths.',
    ],
  },
  {
    id: 'progressive_open',
    match: (s) => s.social <= -20 && s.authority <= -5,
    title: 'The Open Society',
    subtitle: 'Rights expanded; power dispersed.',
    body: [
      'Decentralisation and inclusion define your ledger. Skeptics call it fragile; believers call it freedom.',
      'Groups that spent decades asking for a seat at the table are writing the agenda. The adjustment is not comfortable for everyone.',
      'Whether this holds depends on successors you cannot choose. You have made the tent bigger. Someone must keep the poles up.',
    ],
  },
  {
    id: 'strongman',
    match: (s) => s.authority >= 30,
    title: 'The Security State',
    subtitle: 'Stability purchased with liberty.',
    body: [
      'Emergencies outlived their crises. Opposition fragmented. Streets are quiet — at a price that history will spend a long time debating.',
      'Order is real. So is the silence of people who have learned not to speak.',
      'Every authoritarian era ends eventually. You have made the question only a matter of when, and at what further cost.',
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
      'Nothing radical passed; nothing collapsed. Voters remember steadiness — or stagnation, depending on whom you ask.',
      'You governed like a surgeon asked to paint a cathedral — precise, careful, and slightly wrong for the task.',
      'The institutions you left are intact. The hunger for something more decisive will outlast your term.',
    ],
  },
  {
    id: 'populist_coalition',
    match: () => true,
    title: 'The Uneasy Coalition',
    subtitle: 'Contradictions held by will alone.',
    body: [
      'Mixed policies pleased no camp fully. Every faction got something and resented what they did not get.',
      'You governed by negotiation, by compromise, by the slow and unglamorous work of keeping incompatible people in the same room.',
      'The republic survives — argued over, hungry for the next story. That is not nothing.',
    ],
  },
];
