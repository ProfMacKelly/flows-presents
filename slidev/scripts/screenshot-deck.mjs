// Screenshots every slide of a deck from a running dev server and reports
// slides whose content overflows the slide canvas.
//
// Slidev renders onto a fixed canvas (see `canvasWidth` in the headmatter), so
// content that is too tall or too wide is silently clipped in the markdown but
// obvious in a screenshot. Run this after editing a deck.
//
// Usage:
//   pnpm exec slidev decks/<deck>/slides.md --port 3030   # in another shell
//   node scripts/screenshot-deck.mjs <deck> [--port 3030]

import { mkdirSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

let chromium
try {
  ({ chromium } = await import('playwright'))
}
catch {
  console.error('playwright is not installed. Run:\n  pnpm -C slidev add -D playwright\n  pnpm -C slidev exec playwright install chromium')
  process.exit(1)
}

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const [deck] = process.argv.slice(2).filter(arg => !arg.startsWith('--'))
if (!deck) {
  console.error('Usage: node scripts/screenshot-deck.mjs <deck> [--port 3030]')
  process.exit(1)
}

const portArg = process.argv.indexOf('--port')
const port = portArg === -1 ? 3030 : Number(process.argv[portArg + 1])
const origin = `http://localhost:${port}`

const outDir = join(workspaceRoot, '.screenshots', deck)
rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })

await page.goto(`${origin}/1`, { waitUntil: 'networkidle' })

// The dev server exposes the parsed deck as a virtual module; out-of-range
// slide numbers render the last slide instead of 404ing, so ask for the count.
const total = await page.evaluate(async () => {
  const source = await (await fetch('/@slidev/slides')).text()
  return source.match(/\{ no: \d+/g)?.length ?? 0
})

if (!total) {
  await browser.close()
  console.error(`No slides found at ${origin} — is the dev server running for deck "${deck}"?`)
  process.exit(1)
}

const overflowing = []
for (let no = 1; no <= total; no++) {
  // ?clicks=999 reveals every click animation, so the screenshot shows the
  // slide in its fullest state - which is when it is most likely to overflow.
  await page.goto(`${origin}/${no}?clicks=999`, { waitUntil: 'networkidle' })

  // Mermaid/KaTeX render asynchronously.
  await page.waitForTimeout(600)
  await page.screenshot({ path: join(outDir, `${String(no).padStart(2, '0')}.png`) })

  const overflow = await page.evaluate(() => {
    // #slide-content is the fixed canvas; anything outside it is clipped when
    // presenting or exporting.
    const canvas = document.querySelector('#slide-content')
    const slide = [...document.querySelectorAll('.slidev-page')]
      .find(el => el.getBoundingClientRect().width > 0)
    if (!canvas || !slide) return null

    const box = canvas.getBoundingClientRect()
    const tolerance = 2
    const offenders = []
    for (const el of slide.querySelectorAll('*')) {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) continue
      // Nav controls and other overlays are pinned to the viewport on purpose.
      if (getComputedStyle(el).position === 'fixed') continue

      const sides = {
        top: Math.round(box.top - rect.top),
        bottom: Math.round(rect.bottom - box.bottom),
        left: Math.round(box.left - rect.left),
        right: Math.round(rect.right - box.right),
      }
      const clipped = Object.entries(sides).filter(([, px]) => px > tolerance)
      if (clipped.length) {
        offenders.push({
          text: (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 60),
          clipped: clipped.map(([side, px]) => `${px}px past ${side}`).join(', '),
        })
      }
    }
    // Ancestors overflow whenever a child does; the last entries are the
    // innermost, most specific elements.
    return offenders.slice(-3)
  })

  if (overflow?.length) overflowing.push({ no, overflow })
}

await browser.close()

console.log(`Wrote ${total} screenshots to ${outDir}`)
if (overflowing.length === 0) {
  console.log('No slides overflow the canvas.')
}
else {
  console.log('\nSlides overflowing the canvas:')
  for (const { no: slideNo, overflow } of overflowing) {
    console.log(`  slide ${slideNo}:`)
    for (const o of overflow)
      console.log(`    ${o.clipped} — ${JSON.stringify(o.text)}`)
  }
  process.exitCode = 1
}
