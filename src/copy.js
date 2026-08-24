'use strict';

const path = require('path');
const fs = require('fs-extra');
const manifest = require('./manifest');

const GITIGNORE_START = '# --- SDD boilerplate ---';
const GITIGNORE_END = '# --- end SDD boilerplate ---';

class ConflictError extends Error {
  constructor(conflicts) {
    super(
      `Refusing to overwrite existing path(s) without --force:\n` +
        conflicts.map((c) => `  - ${c}`).join('\n')
    );
    this.name = 'ConflictError';
    this.conflicts = conflicts;
  }
}

// Every top-level dir/file this set of groups would write, relative to targetDir.
// Used both for the pre-flight conflict check and for the pre-write confirm summary.
function plannedPaths(selectedKeys) {
  const paths = [];
  for (const key of selectedKeys) {
    const group = manifest[key];
    for (const d of group.dirs || []) paths.push(d);
    for (const f of group.files || []) paths.push(f);
  }
  return paths;
}

// Per-path conflict check inside copySelected — deliberately separate from,
// and not redundant with, prompts.js's whole-directory isNonEmptyDir() check.
// isNonEmptyDir only guards the interactive CLI entry point (resolveTargetDir);
// this check is what makes copySelected() itself safe to call directly, e.g.
// from test/copy.test.js or scripts/build-examples.js, which never go through
// prompts.js at all.
function findConflicts(selectedKeys, targetDir) {
  const conflicts = [];
  for (const rel of plannedPaths(selectedKeys)) {
    // .gitignore is merged, never a conflict
    if (rel === '.gitignore') continue;
    if (fs.existsSync(path.join(targetDir, rel))) conflicts.push(rel);
  }
  return conflicts;
}

// The source of truth is templates/core/.gitignore (readable in the repo as
// a real .gitignore). npm's packlist unconditionally strips any file literally
// named .gitignore from a published tarball, with no config override — so
// `npm pack`/`npm publish` temporarily duplicates it to gitignore.template via
// the prepack/postpack scripts in package.json, and this falls back to that
// name when running from an installed package where only the duplicate shipped.
function resolveGitignoreTemplatePath(templatesRoot) {
  const primary = path.join(templatesRoot, 'core', '.gitignore');
  if (fs.existsSync(primary)) return primary;
  return path.join(templatesRoot, 'core', 'gitignore.template');
}

function mergeGitignore(templatesRoot, targetDir) {
  const templatePath = resolveGitignoreTemplatePath(templatesRoot);
  const targetPath = path.join(targetDir, '.gitignore');
  const templateContent = fs.readFileSync(templatePath, 'utf8');

  if (!fs.existsSync(targetPath)) {
    fs.writeFileSync(targetPath, templateContent);
    return { action: 'created' };
  }

  const existing = fs.readFileSync(targetPath, 'utf8');
  if (existing.includes(GITIGNORE_START) && existing.includes(GITIGNORE_END)) {
    return { action: 'already-merged' };
  }

  const separator = existing.endsWith('\n') ? '\n' : '\n\n';
  fs.writeFileSync(targetPath, existing + separator + templateContent);
  return { action: 'appended' };
}

function stampSpecVersion(targetDir, pkgVersion) {
  const specVersionPath = path.join(targetDir, 'spec', 'SPEC-VERSION.md');
  if (!fs.existsSync(specVersionPath)) return;
  const content = fs.readFileSync(specVersionPath, 'utf8');
  // Matches the whole rest of the line so re-stamping a semver (e.g. "0.1.0")
  // replaces cleanly instead of only the leading digit run.
  const stamped = content.replace(
    /^current:.*$/m,
    `current: ${pkgVersion}`
  );
  fs.writeFileSync(specVersionPath, stamped);
}

function getInstalledSpecVersion(targetDir) {
  const specVersionPath = path.join(targetDir, 'spec', 'SPEC-VERSION.md');
  if (!fs.existsSync(specVersionPath)) return null;
  const content = fs.readFileSync(specVersionPath, 'utf8');
  const match = content.match(/^current:\s*(\S+)/m);
  return match ? match[1] : null;
}

function copySelected(selectedKeys, { templatesRoot, targetDir, force, pkgVersion }) {
  if (!force) {
    const conflicts = findConflicts(selectedKeys, targetDir);
    if (conflicts.length > 0) throw new ConflictError(conflicts);
  }

  const copied = [];
  for (const key of selectedKeys) {
    const group = manifest[key];
    const groupTemplateDir = path.join(templatesRoot, group.templateGroup);

    for (const d of group.dirs || []) {
      fs.copySync(path.join(groupTemplateDir, d), path.join(targetDir, d), {
        overwrite: !!force,
        errorOnExist: false,
      });
      copied.push(d);
    }
    for (const f of group.files || []) {
      fs.copySync(path.join(groupTemplateDir, f), path.join(targetDir, f), {
        overwrite: !!force,
        errorOnExist: false,
      });
      copied.push(f);
    }

    if (group.mergeGitignore) {
      const result = mergeGitignore(templatesRoot, targetDir);
      copied.push(`.gitignore (${result.action})`);
    }
  }

  if (selectedKeys.includes('core') && pkgVersion) {
    stampSpecVersion(targetDir, pkgVersion);
  }

  return copied;
}

module.exports = {
  ConflictError,
  plannedPaths,
  findConflicts,
  mergeGitignore,
  stampSpecVersion,
  getInstalledSpecVersion,
  copySelected,
  GITIGNORE_START,
};
