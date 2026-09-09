// Builds every deck in decks/<name>/slides.md into dist/<name>, and writes a
// dist/index.html listing them.
//
// Usage: node scripts/build-decks.mjs [--base-prefix /resources]

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const decksDir = join(workspaceRoot, 'decks')
const distDir = join(workspaceRoot, 'dist')

const basePrefixArg = process.argv.indexOf('--base-prefix')
const basePrefix = (basePrefixArg === -1 ? '' : process.argv[basePrefixArg + 1] ?? '').replace(/\/$/, '')

const decks = readdirSync(decksDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && existsSync(join(decksDir, entry.name, 'slides.md')))
  .map(entry => entry.name)
  .sort()

if (decks.length === 0) {
  console.error(`No decks found in ${decksDir}`)
  process.exit(1)
}

rmSync(distDir, { recursive: true, force: true })
mkdirSync(distDir, { recursive: true })

for (const deck of decks) {
  console.log(`\n=== building ${deck} ===`)
  execFileSync(
    'slidev',
    [
      'build',
      join('decks', deck, 'slides.md'),
      '--base',
      `${basePrefix}/${deck}/`,
      '--out',
      join(distDir, deck),
    ],
    {
      cwd: workspaceRoot,
      stdio: 'inherit',
      env: {
        ...process.env,
        PATH: `${join(workspaceRoot, 'node_modules', '.bin')}:${process.env.PATH ?? ''}`,
      },
    },
  )
}

const links = decks
  .map(deck => `      <li><a href="${basePrefix}/${deck}/">${deck}</a></li>`)
  .join('\n')

writeFileSync(
  join(distDir, 'index.html'),
  `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Slides</title>
  </head>
  <body>
    <h1>Slides</h1>
    <ul>
${links}
    </ul>
  </body>
</html>
`,
)

console.log(`\nBuilt ${decks.length} deck(s): ${decks.join(', ')}`)
