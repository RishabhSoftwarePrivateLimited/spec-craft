#!/usr/bin/env node
'use strict';

// Regenerates examples/*/ by actually running the tool (via src/copy.js
// directly, not the interactive CLI) against scratch output dirs, then
// copying the result into place. Real dogfooded output, not hand-written.

const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const { copySelected } = require('../src/copy');

const TEMPLATES_ROOT = path.join(__dirname, '..', 'templates');
const EXAMPLES_ROOT = path.join(__dirname, '..', 'examples');
const pkgVersion = require('../package.json').version;

const SCENARIOS = {
  'claude-only': ['core', 'claude'],
  'all-agents': ['core', 'claude', 'gemini', 'copilot', 'agentic', 'gitHooks'],
};

function tree(dir, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  const lines = [];
  entries.forEach((entry, i) => {
    const last = i === entries.length - 1;
    lines.push(`${prefix}${last ? '└── ' : '├── '}${entry.name}${entry.isDirectory() ? '/' : ''}`);
    if (entry.isDirectory()) {
      lines.push(...tree(path.join(dir, entry.name), prefix + (last ? '    ' : '│   ')));
    }
  });
  return lines;
}

for (const [name, selectedKeys] of Object.entries(SCENARIOS)) {
  const scratch = path.join(os.tmpdir(), `speccraft-example-${name}-${Date.now()}`);
  fs.ensureDirSync(scratch);

  if (selectedKeys.includes('gitHooks')) {
    require('child_process').execFileSync('git', ['init', '--quiet'], { cwd: scratch });
  }

  copySelected(selectedKeys, {
    templatesRoot: TEMPLATES_ROOT,
    targetDir: scratch,
    force: false,
    pkgVersion,
  });

  const dest = path.join(EXAMPLES_ROOT, name);
  fs.removeSync(dest);
  // scratch may have a real .git/ (git-hook scenarios init one) — never let
  // that land inside this repo as a nested gitlink.
  fs.copySync(scratch, dest, { filter: (src) => path.basename(src) !== '.git' });

  const treeLines = [`${name}/`, ...tree(dest)];
  fs.writeFileSync(path.join(dest, 'TREE.txt'), treeLines.join('\n') + '\n');

  fs.removeSync(scratch);
  console.log(`Built examples/${name}/`);
}
