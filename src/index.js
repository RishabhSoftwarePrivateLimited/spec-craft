'use strict';

const path = require('path');
const clack = require('@clack/prompts');
const pkg = require('../package.json');
const prompts = require('./prompts');
const { copySelected, ConflictError } = require('./copy');
const { configureHooksPath, installGlobal } = require('./postSteps');

const TEMPLATES_ROOT = path.join(__dirname, '..', 'templates');

function parseArgv(argv) {
  const args = argv.slice(2);
  const out = { targetDir: undefined, agents: undefined, force: false, noHooks: false, yes: false };

  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--force') out.force = true;
    else if (a === '--no-hooks') out.noHooks = true;
    else if (a === '--yes' || a === '-y') out.yes = true;
    else if (a === '--agents') out.agents = (args[++i] || '').split(',').filter(Boolean);
    else if (a.startsWith('--agents=')) out.agents = a.slice('--agents='.length).split(',').filter(Boolean);
    else positional.push(a);
  }

  if (positional.length > 0) out.targetDir = positional[0];
  return out;
}

async function run(argv = process.argv) {
  const parsed = parseArgv(argv);

  clack.intro(`${pkg.name} v${pkg.version}`);

  const targetDir = await prompts.resolveTargetDir(parsed);
  const agents = await prompts.resolveAgents(parsed, targetDir);
  const gitHooks = await prompts.resolveGitHooks(parsed, targetDir);
  const updateCore = await prompts.resolveSpecUpdate(parsed, targetDir, pkg.version);
  const effectiveForce = parsed.force || updateCore;

  await prompts.confirmWrite({ targetDir, agents, gitHooks, force: parsed.force, updateCore }, { yes: parsed.yes });

  const selectedKeys = prompts.computeSelectedKeys({ agents, gitHooks, targetDir, force: parsed.force, updateCore });

  if (selectedKeys.length === 0) {
    clack.log.info('Nothing to write — everything selected is already installed.');
  } else {
    const spinner = clack.spinner();
    spinner.start('Writing files');
    try {
      copySelected(selectedKeys, {
        templatesRoot: TEMPLATES_ROOT,
        targetDir,
        force: effectiveForce,
        pkgVersion: pkg.version,
      });
    } catch (err) {
      spinner.stop('Failed');
      if (err instanceof ConflictError) {
        clack.cancel(err.message);
        process.exit(1);
      }
      throw err;
    }
    spinner.stop('Files written');
  }

  if (gitHooks) {
    const result = configureHooksPath(targetDir);
    if (result.ok) clack.log.success('Configured git core.hooksPath -> .githooks');
    else clack.log.warn(`Skipped git hook wiring: ${result.reason}`);
  }

  for (const agentKey of agents) {
    const { installed, skipped } = installGlobal(agentKey, {
      templatesRoot: TEMPLATES_ROOT,
      force: parsed.force,
    });
    for (const dest of installed) clack.log.success(`Installed globally: ${dest}`);
    for (const dest of skipped) clack.log.warn(`Skipped (already exists): ${dest}`);
  }

  clack.outro('Done. See docs/setup.md in the scaffolded project for next steps.');
}

module.exports = { run, parseArgv };
