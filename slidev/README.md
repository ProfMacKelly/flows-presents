# Slidev workspace

```
slidev/
  decks/<deck>/slides.md   # one deck per folder; the only entry files
  shared/                  # local Slidev addon: components, layouts, styles, setup, global layers
  scripts/build-decks.mjs  # builds every deck into dist/<deck>
```

## Working on a deck

```bash
pnpm -C slidev install
pnpm -C slidev run dev:negligence   # http://localhost:3030
```

`dev` is an alias for the negligence deck. To run any other deck:

```bash
pnpm -C slidev exec slidev decks/<deck>/slides.md --open
```

## Adding a deck

1. `mkdir -p decks/<deck>` and add a `slides.md`.
2. In its headmatter, opt into the shared addon:

   ```yaml
   ---
   addons:
     - slidev-addon-resources
   ---
   ```

3. Add a `dev:<deck>` script to `package.json`. The build picks up new decks
   automatically.

Deck-local assets go in `decks/<deck>/` (or `decks/<deck>/public/` to be served
at the deck root).

## Shared addon

Everything in `shared/` is a local Slidev addon (`slidev-addon-resources`,
linked as a pnpm workspace package), so every deck gets the same
`components/`, `layouts/`, `styles/`, `setup/` and `global-top`/`global-bottom`
layers. Edit it once; all decks pick it up.

## Building

```bash
pnpm -C slidev run build        # dist/<deck>/, served from /
pnpm -C slidev run build:pages  # dist/<deck>/, served from /resources/<deck>/
```

CI runs `build:pages` and publishes `slidev/dist` to GitHub Pages, so decks live
at `https://profmackelly.github.io/resources/<deck>/`.

## Docs

`docs/slidev/llms-full.txt` (repo root) is the full sli.dev documentation.
Check syntax against it rather than from memory; refresh it with
`scripts/update-slidev-docs.sh` after upgrading Slidev.
