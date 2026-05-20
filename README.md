# Democracy — Political Choose-Your-Own-Adventure

A browser-based narrative game in the spirit of Baldur’s Gate: branchy dialogue, consequences, and comic-panel presentation. Lead a campaign, form a government, then face the polls — or the mob.

## Three acts

1. **Running for office** — Pick a setting, fundraise, meet **randomized NPCs** (each playthrough their economic/social/governance leanings differ), make platform promises, then face an **election** weighted by how well you matched each voter bloc.
2. **Establishing government** — Constitutional choices, signature legislation, crisis management, and coalitions shape your three policy axes.
3. **Judgment** — Final polling / approval decides whether you leave a hero, a managed mediocrity, or facing the guillotine, caucus revolt, or ostracism (flavor depends on setting).

## Settings

- **17th-Century France** — court favour and revolutionary fury
- **Modern-Day Canada** — federal coalitions and leadership reviews
- **Classical Athens** — assembly votes and ostracism

## Run locally

ES modules need a local server:

```bash
python3 -m http.server 8080
# or: npx --yes serve -p 8080
```

Open [http://localhost:8080](http://localhost:8080).

## Structure

```
index.html
styles.css          # Comic halftone UI
js/
  environments.js   # Setting metadata & endings flavor
  npcs.js           # Random NPC generation & election math
  scenes.js         # Story nodes & dynamic NPC/election scenes
  game.js           # State machine (acts, approval, promises)
  app.js            # Rendering
```

## Extending

- Add environments in `js/environments.js`
- Tune election difficulty in `npcs.js` (`computeElectionResult` threshold, default 52%)
- Add scenes in `js/scenes.js`; use `effects.approval`, `promise`, `coalition`, `swayNpc` on choices
