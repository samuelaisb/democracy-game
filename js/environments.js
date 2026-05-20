/** @typedef {'france_1630' | 'canada_modern' | 'athens_450bc'} EnvironmentId */

/** @type {Record<EnvironmentId, { id: EnvironmentId, title: string, era: string, tagline: string, flavor: string, office: string, electionLabel: string, doomGood: string, doomBad: string, npcTypes: string[] }>} */
export const environments = {
  france_1630: {
    id: 'france_1630',
    title: '17th-Century France',
    era: '1630 — Bourbon court',
    tagline: 'Patronage, pulpit, and powder',
    flavor:
      'Louis XIII sits on the throne. Nobles, clergy, and the Third Estate all claim to speak for France. Your path to power runs through salons, sermons, and whispers at Versailles.',
    office: 'Chief Minister',
    electionLabel: 'Royal favour',
    doomGood: 'The court applauds your survival — for now.',
    doomBad: 'The mob drags you to the Place de Grève. History will not be kind.',
    npcTypes: ['Noble', 'Clergy', 'Merchant', 'Peasant delegate', 'Courtier'],
  },
  canada_modern: {
    id: 'canada_modern',
    title: 'Modern-Day Canada',
    era: '2026 — Confederation',
    tagline: 'Coalitions, clinics, and climate',
    flavor:
      'A federal election looms. Provinces pull in different directions, First Nations leaders demand nation-to-nation respect, and every doorstep wants a different promise.',
    office: 'Prime Minister',
    electionLabel: 'Seat projection',
    doomGood: 'Polls show you might survive the next election.',
    doomBad: 'Approval craters. The caucus schedules a leadership review.',
    npcTypes: ['Union organizer', 'Tech founder', 'Rural mayor', 'Indigenous leader', 'Suburban parent'],
  },
  athens_450bc: {
    id: 'athens_450bc',
    title: 'Classical Athens',
    era: '450 BCE — Assembly',
    tagline: 'Ostracism, oratory, and olive oil',
    flavor:
      'The ecclesia meets on the Pnyx. Generals, merchants, and philosophers argue under the sun. One misstep and your name lands on an ostrakon.',
    office: 'Strategos',
    electionLabel: 'Assembly vote',
    doomGood: 'The demos grants you another season of command.',
    doomBad: 'Your ostrakon is cast. Ten years of exile await.',
    npcTypes: ['Hoplite veteran', 'Metic trader', 'Philosopher', 'Priestess', 'Demagogue'],
  },
};

export const environmentList = Object.values(environments);
