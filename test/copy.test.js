'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const { execFileSync } = require('child_process');

const { copySelected, mergeGitignore, ConflictError, GITIGNORE_START } = require('../src/copy');
const { configureHooksPath, installGlobal } = require('../src/postSteps');
const { isNonEmptyDir } = require('../src/prompts');

const TEMPLATES_ROOT = path.join(__dirname, '..', 'templates');
const PKG_VERSION = require('../package.json').version;

function tmpDir(name) {
  const dir = path.join(os.tmpdir(), `speccraft-test-${name}-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  fs.ensureDirSync(dir);
  return dir;
}

// os.homedir() reads USERPROFILE on win32, HOME elsewhere — set both so
// installGlobal() (which calls os.homedir() itself, not injectable) is
// redirected into a scratch dir instead of the real machine home.
function withFakeHome(fakeHomeDir, fn) {
  const prevHome = process.env.HOME;
  const prevUserProfile = process.env.USERPROFILE;
  process.env.HOME = fakeHomeDir;
  process.env.USERPROFILE = fakeHomeDir;
  try {
    return fn();
  } finally {
    process.env.HOME = prevHome;
    process.env.USERPROFILE = prevUserProfile;
  }
}

test('claude-only, no hooks: writes core + claude, nothing else', () => {
  const target = tmpDir('claude-only');
  copySelected(['core', 'claude'], {
    templatesRoot: TEMPLATES_ROOT,
    targetDir: target,
    force: false,
    pkgVersion: PKG_VERSION,
  });

  for (const p of ['spec', 'AGENTS.md', 'README.md', '.claude', 'CLAUDE.md', '.gitignore']) {
    assert.ok(fs.existsSync(path.join(target, p)), `expected ${p} to exist`);
  }
  for (const p of ['.gemini', '.github', '.agents', 'GEMINI.md']) {
    assert.ok(!fs.existsSync(path.join(target, p)), `expected ${p} to NOT exist`);
  }

  fs.removeSync(target);
});

test('all four agents + git hooks: everything present, hooksPath configured', () => {
  const target = tmpDir('all-agents');
  execFileSync('git', ['init', '--quiet'], { cwd: target });

  copySelected(['core', 'claude', 'gemini', 'copilot', 'agentic', 'gitHooks'], {
    templatesRoot: TEMPLATES_ROOT,
    targetDir: target,
    force: false,
    pkgVersion: PKG_VERSION,
  });

  for (const p of ['spec', 'AGENTS.md', 'README.md', '.claude', 'CLAUDE.md', '.gemini', 'GEMINI.md', '.github', '.agents', '.githooks', '.gitignore']) {
    assert.ok(fs.existsSync(path.join(target, p)), `expected ${p} to exist`);
  }

  const result = configureHooksPath(target);
  assert.equal(result.ok, true);
  const configured = execFileSync('git', ['config', 'core.hooksPath'], { cwd: target }).toString().trim();
  assert.equal(configured, '.githooks');

  fs.removeSync(target);
});

test('git-hook wiring warns instead of crashing when git is not on PATH', () => {
  const target = tmpDir('git-not-on-path');
  execFileSync('git', ['init', '--quiet'], { cwd: target }); // uses the real PATH

  const emptyPathDir = tmpDir('empty-path-dir'); // no git binary in here
  const prevPath = process.env.PATH;
  process.env.PATH = emptyPathDir;
  let result;
  try {
    result = configureHooksPath(target);
  } finally {
    process.env.PATH = prevPath;
  }

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'git-not-on-path');

  fs.removeSync(target);
  fs.removeSync(emptyPathDir);
});

test('refuses to write into a non-empty target without --force', () => {
  const target = tmpDir('non-empty');
  fs.writeFileSync(path.join(target, 'spec'), 'not actually a dir, just a conflicting file');
  assert.ok(isNonEmptyDir(target));

  assert.throws(
    () =>
      copySelected(['core'], {
        templatesRoot: TEMPLATES_ROOT,
        targetDir: target,
        force: false,
        pkgVersion: PKG_VERSION,
      }),
    ConflictError
  );

  fs.removeSync(target);
});

test('.gitignore: preserves custom rules, appends boilerplate once, idempotent on re-run', () => {
  const target = tmpDir('gitignore-merge');
  const customRule = '# my custom rule\ndist/\n';
  fs.writeFileSync(path.join(target, '.gitignore'), customRule);

  const first = mergeGitignore(TEMPLATES_ROOT, target);
  assert.equal(first.action, 'appended');
  const afterFirst = fs.readFileSync(path.join(target, '.gitignore'), 'utf8');
  assert.ok(afterFirst.includes('dist/'), 'custom rule preserved');
  assert.ok(afterFirst.includes(GITIGNORE_START), 'boilerplate appended');

  const second = mergeGitignore(TEMPLATES_ROOT, target);
  assert.equal(second.action, 'already-merged');
  const afterSecond = fs.readFileSync(path.join(target, '.gitignore'), 'utf8');
  assert.equal(afterSecond, afterFirst, 'second run is a no-op');

  fs.removeSync(target);
});

test('global install: skips a pre-existing differing file unless --force', () => {
  const fakeHome = tmpDir('fake-home');
  fs.ensureDirSync(path.join(fakeHome, '.claude', 'commands'));
  const existingPath = path.join(fakeHome, '.claude', 'commands', 'scaffold.md');
  fs.writeFileSync(existingPath, 'this is the user own custom scaffold command, do not touch');

  withFakeHome(fakeHome, () => {
    const { installed, skipped } = installGlobal('claude', {
      templatesRoot: TEMPLATES_ROOT,
      force: false,
    });
    assert.ok(skipped.includes(existingPath), 'pre-existing file reported as skipped');
    assert.ok(!installed.includes(existingPath), 'pre-existing file not reported as installed');
  });

  const contentAfter = fs.readFileSync(existingPath, 'utf8');
  assert.equal(contentAfter, 'this is the user own custom scaffold command, do not touch');

  fs.removeSync(fakeHome);
});

test('global install: --force overwrites a pre-existing differing file', () => {
  const fakeHome = tmpDir('fake-home-force');
  fs.ensureDirSync(path.join(fakeHome, '.claude', 'commands'));
  const existingPath = path.join(fakeHome, '.claude', 'commands', 'scaffold.md');
  fs.writeFileSync(existingPath, 'stale content');

  withFakeHome(fakeHome, () => {
    const { installed } = installGlobal('claude', {
      templatesRoot: TEMPLATES_ROOT,
      force: true,
    });
    assert.ok(installed.includes(existingPath));
  });

  const contentAfter = fs.readFileSync(existingPath, 'utf8');
  assert.notEqual(contentAfter, 'stale content');

  fs.removeSync(fakeHome);
});

test('spec/SPEC-VERSION.md is stamped with the tool package version on core copy', () => {
  const target = tmpDir('spec-version-stamp');
  copySelected(['core'], {
    templatesRoot: TEMPLATES_ROOT,
    targetDir: target,
    force: false,
    pkgVersion: PKG_VERSION,
  });
  const content = fs.readFileSync(path.join(target, 'spec', 'SPEC-VERSION.md'), 'utf8');
  assert.ok(content.includes(`current: ${PKG_VERSION}`));

  fs.removeSync(target);
});
