---
name: slidev
description: Authoring, building and visually verifying Slidev decks in this repo. Use whenever creating or editing a deck under slidev/decks, touching shared components/layouts, or debugging slide rendering, overflow or the GitHub Pages deploy.
---

# Slidev decks in this repo

## Layout

```
slidev/
  decks/<deck>/slides.md    one deck per directory, entry is always slides.md
  shared/                   local Slidev addon `slidev-addon-resources`
    components/ layouts/ setup/ snippets/ styles/ global-top.vue global-bottom.vue
  scripts/build-decks.mjs   builds every deck into dist/<deck>
  scripts/screenshot-deck.mjs   rendered screenshots + overflow check
docs/slidev/llms-full.txt   full sli.dev docs, vendored
scripts/update-slidev-docs.sh   refresh the vendored docs
```

## Never guess syntax

`docs/slidev/llms-full.txt` is the complete sli.dev documentation for the installed
`@slidev/cli`. Grep it before writing frontmatter, layouts, `v-click`, addon or export
syntax. Refresh it with `scripts/update-slidev-docs.sh` after upgrading Slidev.

## Commands

```bash
pnpm -C slidev install
pnpm -C slidev exec slidev decks/<deck>/slides.md   # dev server on :3030
pnpm -C slidev run build                            # all decks -> dist/<deck>
pnpm -C slidev run build:pages                      # same, with /resources/<deck>/ base
```

Pages deploys every deck: `https://profmackelly.github.io/resources/<deck>/`.

## Adding a deck

1. `slidev/decks/<deck>/slides.md`, assets alongside it.
2. Headmatter must opt into the shared addon:
   ```yaml
   addons:
     - slidev-addon-resources
   ```
   It resolves as a pnpm workspace package (`slidev/shared`), not as a relative path —
   relative addon paths resolve against the deck's user root and break.
3. Nothing else to register: `build-decks.mjs` discovers any directory containing
   `slides.md`.

## Shared code

Anything reusable (components, layouts, mermaid/shortcut setup, global layers, CSS)
belongs in `slidev/shared/`, not next to a deck. Slidev merges addon directories with
the deck's own, so deck-local overrides still win.

## Always verify rendered output

Markdown that looks fine silently clips: the canvas is fixed (`canvasWidth: 760` in the
negligence deck) and mermaid diagrams in particular blow past it.

```bash
pnpm -C slidev exec slidev decks/<deck>/slides.md &
node slidev/scripts/screenshot-deck.mjs <deck>
```

It screenshots every slide into `slidev/.screenshots/<deck>/` (gitignored) and exits
non-zero listing what hangs off which edge. Look at the PNGs too — the check catches
clipping, not ugly.

Two behaviours the script depends on, both easy to get wrong by hand:

- Slide count comes from `/@slidev/slides`; out-of-range slide URLs render the last
  slide instead of 404ing, so a loop-until-error walk never terminates.
- Each slide is visited as `/<no>?clicks=999` so click-revealed content is present —
  otherwise `v-clicks` slides screenshot as near-empty and overflow goes unnoticed.
