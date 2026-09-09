#!/usr/bin/env bash
# Refreshes the vendored Slidev documentation in docs/slidev/.
#
# docs/slidev/llms-full.txt is the full sli.dev documentation in one file. Keep
# it in the repo so slide authoring can be checked against the real docs offline
# instead of from memory, and record which @slidev/cli version it was fetched
# against so a stale copy is obvious.
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
docs_dir="$repo_root/docs/slidev"
mkdir -p "$docs_dir"

curl -fsSL https://sli.dev/llms-full.txt -o "$docs_dir/llms-full.txt"

installed_version="$(node -e "
  const { createRequire } = require('node:module')
  const req = createRequire('$repo_root/slidev/package.json')
  process.stdout.write(req('@slidev/cli/package.json').version)
" 2>/dev/null || echo 'unknown (run pnpm -C slidev install first)')"

cat > "$docs_dir/README.md" <<EOF
# Vendored Slidev documentation

\`llms-full.txt\` is the complete sli.dev documentation, fetched from
<https://sli.dev/llms-full.txt>. Grep it instead of guessing Slidev syntax.

- Fetched: $(date -u +%Y-%m-%d)
- Installed \`@slidev/cli\`: $installed_version

Refresh with \`scripts/update-slidev-docs.sh\` after upgrading Slidev.
EOF

echo "Updated $docs_dir (@slidev/cli $installed_version)"
