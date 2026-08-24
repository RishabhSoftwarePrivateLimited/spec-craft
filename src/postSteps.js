'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const { execFileSync } = require('child_process');
const manifest = require('./manifest');

// Wires the just-copied .githooks/pre-commit into git. Caller only invokes this
// when the git-hook group was selected, which the prompt already gated on the
// target being a git repo — this check is just defense in depth.
function configureHooksPath(targetDir) {
  if (!fs.existsSync(path.join(targetDir, '.git'))) {
    return { ok: false, reason: 'not-a-git-repo' };
  }
  try {
    execFileSync('git', ['config', 'core.hooksPath', '.githooks'], {
      cwd: targetDir,
      stdio: 'ignore',
    });
  } catch {
    // git binary isn't on PATH (or otherwise failed to run) — files are
    // already written at this point, so surface a warning rather than crash.
    return { ok: false, reason: 'git-not-on-path' };
  }
  return { ok: true };
}

// Global (user-level) command install for an agent selected in the multi-select.
// Merge, never clobber: an existing file at the global path is left untouched
// (skip + warn) unless --force. Scoped to command files only, never
// CLAUDE.md/GEMINI.md, which are personal and out of scope for an installer.
function installGlobal(agentKey, { templatesRoot, force }) {
  const group = manifest[agentKey];
  if (!group || !group.global) return { installed: [], skipped: [] };

  const groupTemplateDir = path.join(templatesRoot, group.templateGroup);
  const srcDir = path.join(groupTemplateDir, group.global.templateDir);
  const destDir = path.join(os.homedir(), group.global.targetDir);

  fs.ensureDirSync(destDir);

  const installed = [];
  const skipped = [];
  for (const entry of fs.readdirSync(srcDir)) {
    const src = path.join(srcDir, entry);
    const dest = path.join(destDir, entry);
    if (fs.existsSync(dest) && !force) {
      skipped.push(dest);
      continue;
    }
    fs.copySync(src, dest, { overwrite: !!force });
    installed.push(dest);
  }
  return { installed, skipped };
}

module.exports = { configureHooksPath, installGlobal };
