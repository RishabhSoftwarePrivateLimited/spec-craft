'use strict';

const fs = require('fs-extra');
const path = require('path');
const clack = require('@clack/prompts');
const manifest = require('./manifest');
const { plannedPaths, getInstalledSpecVersion } = require('./copy');
const { globalTargets } = require('./postSteps');

const AGENT_KEYS = ['claude', 'gemini', 'antigravity', 'copilot', 'agentic'];
const SCOPES = ['project', 'global', 'both'];

const AGENT_HINTS = {
  claude: 'recommended',
  gemini: '.gemini/commands — terminal CLI',
  antigravity: '.agents/skills — for Antigravity IDE',
  agentic: '.agents/skills, works with any agent',
};

function isNonEmptyDir(dir) {
  return fs.existsSync(dir) && fs.readdirSync(dir).length > 0;
}

function isGitRepo(dir) {
  return fs.existsSync(path.join(dir, '.git'));
}

function bail(message) {
  clack.cancel(message);
  process.exit(1);
}

// A manifest group is "installed" when every dir/file it writes is already
// present in targetDir. Used to recognize a prior scaffold (so a re-run can
// offer to add agents instead of just refusing a non-empty directory) and to
// keep re-runs from re-copying (and clobbering) things already in place.
// A group's `includes` count too, so e.g. Antigravity isn't reported as
// installed just because Gemini CLI already wrote the shared GEMINI.md.
function isGroupInstalled(key, targetDir) {
  const group = manifest[key];
  const paths = [...(group.dirs || []), ...(group.files || []), ...(group.sharedFiles || [])];
  return (
    paths.length > 0 &&
    paths.every((p) => fs.existsSync(path.join(targetDir, p))) &&
    (group.includes || []).every((inc) => isGroupInstalled(inc, targetDir))
  );
}

function isCoreInstalled(targetDir) {
  return isGroupInstalled('core', targetDir);
}

function detectInstalledAgents(targetDir) {
  return AGENT_KEYS.filter((key) => isGroupInstalled(key, targetDir));
}

async function resolveTargetDir(argv) {
  let targetDir = argv.targetDir;

  if (!targetDir) {
    const answer = await clack.text({
      message: 'Where should the SDD workflow be scaffolded?',
      placeholder: './my-app',
      defaultValue: '.',
    });
    if (clack.isCancel(answer)) bail('Cancelled.');
    targetDir = answer;
  }

  targetDir = path.resolve(process.cwd(), targetDir);

  return targetDir;
}

async function resolveAgents(argv, targetDir) {
  if (argv.agents) {
    const invalid = argv.agents.filter((a) => !AGENT_KEYS.includes(a));
    if (invalid.length > 0) {
      bail(`Unknown --agents value(s): ${invalid.join(', ')}`);
    }
    return argv.agents;
  }

  const installedAgents = detectInstalledAgents(targetDir);
  const remaining = AGENT_KEYS.filter((key) => !installedAgents.includes(key));

  if (installedAgents.length > 0 && remaining.length === 0) {
    clack.log.info(
      `All supported agent tooling is already installed (${installedAgents
        .map((k) => manifest[k].label)
        .join(', ')}). Nothing to add.`
    );
    return [];
  }

  const message =
    installedAgents.length > 0
      ? `${installedAgents.map((k) => manifest[k].label).join(', ')} already installed. Add another agent tooling?`
      : 'Which AI agent tooling do you want to install?';

  const options = remaining.map((key) => ({
    value: key,
    label: manifest[key].label,
    hint: AGENT_HINTS[key],
  }));

  const selection = await clack.select({
    message,
    options,
    initialValue: remaining[0],
  });
  if (clack.isCancel(selection)) bail('Cancelled.');
  return [selection];
}

// Where agent commands/skills go: the project, the user's home dir, or both.
// Only asked when a selected agent actually has a global (~/) install target;
// spec/ and .githooks always stay in the project regardless.
async function resolveScope(argv, agents) {
  if (argv.scope !== undefined) {
    if (!SCOPES.includes(argv.scope)) {
      bail(`Unknown --scope value: ${argv.scope} (expected one of: ${SCOPES.join(', ')})`);
    }
    return argv.scope;
  }
  if (!agents.some((a) => manifest[a] && manifest[a].global)) return 'project';
  if (argv.yes) return 'project';

  const answer = await clack.select({
    message: 'Where should the agent commands/skills be installed?',
    options: [
      { value: 'project', label: 'Project', hint: 'only this project' },
      { value: 'global', label: 'Global', hint: 'home directory (~/), available in every project' },
      { value: 'both', label: 'Both', hint: 'project + home directory' },
    ],
    initialValue: 'project',
  });
  if (clack.isCancel(answer)) bail('Cancelled.');
  return answer;
}

async function resolveGitHooks(argv, targetDir) {
  if (!isGitRepo(targetDir)) return false;
  if (argv.noHooks) return false;
  if (argv.hooksConfirmed !== undefined) return argv.hooksConfirmed;
  if (!argv.force && isGroupInstalled('gitHooks', targetDir)) return false;

  const answer = await clack.confirm({
    message: 'Install the git pre-commit hook (.githooks/pre-commit)?',
    initialValue: true,
  });
  if (clack.isCancel(answer)) bail('Cancelled.');
  return answer;
}

// Detects a stale spec/ install (stamped version != this package's version)
// and offers to refresh it. Core is otherwise skipped on re-runs (see
// computeSelectedKeys) so this is the one deliberate way back in without a
// full --force re-copy of everything.
async function resolveSpecUpdate(argv, targetDir, pkgVersion) {
  if (!isCoreInstalled(targetDir)) return false;
  if (argv.force) return true;

  const installedVersion = getInstalledSpecVersion(targetDir);
  if (installedVersion === pkgVersion) return false;

  const versionNote = installedVersion
    ? `spec/ was installed from v${installedVersion}; this package is v${pkgVersion}.`
    : `spec/ version could not be determined; this package is v${pkgVersion}.`;

  if (argv.yes) {
    clack.log.info(`${versionNote} Re-run with --force to update spec/ templates.`);
    return false;
  }

  clack.log.warn(versionNote);
  const answer = await clack.confirm({
    message: `Update spec/ templates to v${pkgVersion} now? This overwrites spec/* — commit or back up any local edits first.`,
    initialValue: false,
  });
  if (clack.isCancel(answer)) bail('Cancelled.');
  return answer;
}

// Skips 'core' on a re-run into an already-scaffolded project so the existing
// spec/ folder isn't re-copied (and any local edits to it clobbered) just to
// add another agent. --force, or an explicit spec-update confirmation from
// resolveSpecUpdate, opts back into a full re-copy of core.
// A selected group's `includes` (e.g. Antigravity -> agentic) are pulled in
// too, unless already installed, so a re-run doesn't conflict on .agents/.
function computeSelectedKeys({ agents, gitHooks, targetDir, force, updateCore }) {
  const includeCore = !!force || !!updateCore || !isCoreInstalled(targetDir);
  const agentKeys = [];
  for (const key of agents) {
    if (!agentKeys.includes(key)) agentKeys.push(key);
    for (const inc of manifest[key].includes || []) {
      if (agentKeys.includes(inc) || agents.includes(inc)) continue;
      if (!force && isGroupInstalled(inc, targetDir)) continue;
      agentKeys.push(inc);
    }
  }
  return [...(includeCore ? ['core'] : []), ...agentKeys, ...(gitHooks ? ['gitHooks'] : [])];
}

function buildSummary({ targetDir, agents, gitHooks, force, updateCore, scope = 'project' }) {
  const selectedKeys = computeSelectedKeys({ agents, gitHooks, targetDir, force, updateCore });
  const planned = plannedPaths(selectedKeys, { scope, targetDir, force });
  const lines = [`Target: ${targetDir}`, '', 'Will write:'];
  if (planned.length === 0) {
    lines.push('  (nothing — everything selected is already installed)');
  }
  for (const rel of planned) lines.push(`  ${rel}`);

  const targets = scope === 'project' ? [] : globalTargets(agents);
  if (targets.length > 0) {
    lines.push('', 'Will also install globally (merge, never clobber):');
    for (const t of targets) {
      lines.push(`  ~/${t.targetDir}/* (${t.label})`);
    }
    lines.push(
      '',
      "Note: this only makes commands/skills available across projects — it is not",
      "a filesystem cache. Anthropic/Gemini prompt caching is a per-request API concern,",
      "not something this installer writes to disk."
    );
  }

  return lines.join('\n');
}

async function confirmWrite(plan, { yes } = {}) {
  clack.note(buildSummary(plan), 'About to write');
  if (yes) return;
  const answer = await clack.confirm({ message: 'Proceed?', initialValue: true });
  if (clack.isCancel(answer) || !answer) bail('Cancelled — nothing was written.');
}

module.exports = {
  isNonEmptyDir,
  isCoreInstalled,
  detectInstalledAgents,
  computeSelectedKeys,
  resolveTargetDir,
  resolveAgents,
  resolveScope,
  resolveGitHooks,
  resolveSpecUpdate,
  confirmWrite,
};
