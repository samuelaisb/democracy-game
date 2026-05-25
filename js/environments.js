/**
 * @typedef {
 *   | 'quebec_town'
 *   | 'ontario_suburb'
 *   | 'vancouver_city'
 *   | 'entire_provinces'
 *   | 'northwest_territories'
 *   | 'canada_whole'
 * } EnvironmentId
 */

/**
 * @typedef {'france_1630' | 'canada_modern' | 'athens_450bc'} LegacyEnvironmentId
 */

/**
 * @typedef {EnvironmentId | LegacyEnvironmentId} AnyEnvironmentId
 */

/**
 * @type {Record<EnvironmentId, {
 *   id: EnvironmentId,
 *   title: string,
 *   era: string,
 *   tagline: string,
 *   flavor: string,
 *   office: string,
 *   electionLabel: string,
 *   doomGood: string,
 *   doomBad: string,
 *   npcTypes: string[]
 * }>}
 */
export const environments = {
  quebec_town: {
    id: 'quebec_town',
    title: 'Small farming town in Quebec',
    era: '2026 — Municipal cycle',
    tagline: 'Maple syrup, potholes, and political gossip',
    flavor:
      'In Saint-Riviere, everyone knows your cousin, your mistakes, and your snow-clearing record. The election is won at the co-op cafe one eyebrow raise at a time.',
    office: 'Mayor',
    electionLabel: 'Ward projection',
    doomGood: 'The town says, "Bon, at least this one answers texts."',
    doomBad: 'Your name becomes a running joke at bingo night.',
    npcTypes: ['Dairy farmer', 'Maple cooperative chief', 'French school principal', 'Village priest', 'Snowplow union steward'],
  },
  ontario_suburb: {
    id: 'ontario_suburb',
    title: 'Suburban municipality in Ontario',
    era: '2026 — Civic election',
    tagline: 'HOA drama, transit debates, and yard signs',
    flavor:
      'In Mapleview, politics means school drop-off line alliances, packed council meetings, and whether buses arrive before your coffee gets cold.',
    office: 'Council Chair',
    electionLabel: 'Riding projection',
    doomGood: 'Your lawn signs survive the week and so do you.',
    doomBad: 'Council turns your mandate into a very long parking debate.',
    npcTypes: ['Commuter parent', 'Condo board president', 'GO transit advocate', 'Small business strip owner', 'Youth soccer coach'],
  },
  vancouver_city: {
    id: 'vancouver_city',
    title: 'Larger city in British Columbia (Vancouver)',
    era: '2026 — Metro campaign',
    tagline: 'Rain, rezoning, and rent panic',
    flavor:
      'Vancouver runs on views, bike lanes, and impossible housing math. Every promise attracts two rallies and one viral rebuttal video.',
    office: 'Mayor',
    electionLabel: 'Citywide vote',
    doomGood: 'Even your critics admit your transit thread slapped.',
    doomBad: 'You are ratioed by three urban planners before breakfast.',
    npcTypes: ['Housing activist', 'Port logistics manager', 'Film industry producer', 'Climate scientist', 'Downtown tenant organizer'],
  },
  entire_provinces: {
    id: 'entire_provinces',
    title: 'Entire Provinces',
    era: '2026 — Interprovincial politics',
    tagline: 'Premiers, pipelines, and fiscal tug-of-war',
    flavor:
      'You are not campaigning in one place, but across clashing provincial realities. Every stop asks for unity and special treatment in the same breath.',
    office: 'Federal Party Leader',
    electionLabel: 'Provincial seat map',
    doomGood: 'Premiers still complain, but now they call you first.',
    doomBad: 'Your federation strategy collapses into twelve separate headlines.',
    npcTypes: ['Atlantic fisheries minister', 'Prairie energy lobbyist', 'Quebec nationalist MLA', 'Ontario hospital CEO', 'BC wildfire responder'],
  },
  northwest_territories: {
    id: 'northwest_territories',
    title: 'Northwest Territories',
    era: '2026 — Consensus government',
    tagline: 'Ice roads, air lifts, and community consensus',
    flavor:
      'In the NWT, distance is policy. A delayed cargo plane can decide an election issue before your speech starts.',
    office: 'Premier',
    electionLabel: 'Community support',
    doomGood: 'People say you listened first and legislated second.',
    doomBad: 'The whole territory hears about your blunder by sundown.',
    npcTypes: ['Dene community elder', 'Northern nurse', 'Mining operations lead', 'Bush pilot', 'Climate adaptation coordinator'],
  },
  canada_whole: {
    id: 'canada_whole',
    title: 'Canada (whole)',
    era: '2026 — Federal election',
    tagline: 'Question Period, caucus leaks, and coast-to-coast chaos',
    flavor:
      'This is the full national circus: federal files, provincial friction, and a thousand local concerns packed into one nightly panel show.',
    office: 'Prime Minister',
    electionLabel: 'National seat projection',
    doomGood: 'The country grants you another season of controlled chaos.',
    doomBad: 'Your caucus schedules a "friendly" leadership conversation.',
    npcTypes: ['Union organizer', 'Tech founder', 'Rural mayor', 'Indigenous leader', 'Suburban parent'],
  },
};

/** @type {Record<LegacyEnvironmentId, EnvironmentId>} */
export const legacyEnvironmentAliases = {
  france_1630: 'quebec_town',
  canada_modern: 'canada_whole',
  athens_450bc: 'entire_provinces',
};

/**
 * @param {AnyEnvironmentId | null | undefined} envId
 * @returns {EnvironmentId | null}
 */
export function canonicalEnvironmentId(envId) {
  if (!envId) return null;
  if (envId in environments) {
    return /** @type {EnvironmentId} */ (envId);
  }
  return legacyEnvironmentAliases[/** @type {LegacyEnvironmentId} */ (envId)] ?? null;
}

export const environmentList = Object.values(environments);
