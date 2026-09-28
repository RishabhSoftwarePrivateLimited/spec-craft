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

// Global (user-level) command/skill install for a selected agent, used when
// the install scope is 'global' or 'both'. Merge, never clobber: an existing
// entry at the global path is left untouched (skip + warn) unless --force.
// Scoped to command/skill files only, never CLAUDE.md/GEMINI.md, which are
// personal and out of scope for an installer.
function installGlobal(agentKey, { templatesRoot, force, only }) {
  const group = manifest[agentKey];
  const installed = [];
  const skipped = [];
  if (!group || !group.global) return { installed, skipped };

  for (const spec of only || group.global) {
    const srcDir = path.join(templatesRoot, spec.templateGroup || group.templateGroup, spec.templateDir);
    const destDir = path.join(os.homedir(), spec.targetDir);

    fs.ensureDirSync(destDir);

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
  }
  return { installed, skipped };
}

// Unique global (~/) targets across a set of agents, first owner wins — e.g.
// Antigravity and Agent-agnostic both target ~/.agents/skills, which should
// be listed and installed once, not twice (the second pass would only
// report every entry as "skipped").
function globalTargets(agentKeys) {
  const seen = new Set();
  const targets = [];
  for (const key of agentKeys) {
    const group = manifest[key];
    for (const spec of (group && group.global) || []) {
      if (seen.has(spec.targetDir)) continue;
      seen.add(spec.targetDir);
      targets.push({ key, label: group.label, targetDir: spec.targetDir });
    }
  }
  return targets;
}

function installGlobalAll(agentKeys, opts) {
  const owners = new Set(globalTargets(agentKeys).map((t) => `${t.key}:${t.targetDir}`));
  const installed = [];
  const skipped = [];
  for (const key of agentKeys) {
    const group = manifest[key];
    if (!group || !group.global) continue;
    const own = group.global.filter((spec) => owners.has(`${key}:${spec.targetDir}`));
    const result = installGlobal(key, { ...opts, only: own });
    installed.push(...result.installed);
    skipped.push(...result.skipped);
  }
  return { installed, skipped };
}

module.exports = { configureHooksPath, installGlobal, installGlobalAll, globalTargets };
