'use strict';

// Declarative map: answer key -> what gets copied from templates/ into the target.
// index.js always includes `core`; includes agent groups only if selected;
// includes `gitHooks` only if the git-hook prompt was confirmed.
//
// Optional fields on an agent group:
// - sharedFiles: written only if absent; an existing copy is never a conflict
//   (lets two groups — e.g. Gemini CLI and Antigravity — share GEMINI.md).
// - includes: other groups pulled in whenever this one is selected.
// - global: user-level (~/) install entries, used when the install scope is
//   'global' or 'both'. An entry's templateGroup defaults to the group's own.
module.exports = {
  core: {
    templateGroup: 'core',
    dirs: ['spec'],
    files: ['AGENTS.md', 'README.md'],
    mergeGitignore: true,
  },
  claude: {
    label: 'Claude',
    templateGroup: 'agent-claude',
    dirs: ['.claude'],
    files: ['CLAUDE.md'],
    global: [{ templateDir: '.claude/commands', targetDir: '.claude/commands' }],
  },
  gemini: {
    label: 'Gemini CLI',
    templateGroup: 'agent-gemini',
    dirs: ['.gemini'],
    sharedFiles: ['GEMINI.md'],
    global: [{ templateDir: '.gemini/commands', targetDir: '.gemini/commands' }],
  },
  antigravity: {
    label: 'Antigravity (Gemini)',
    templateGroup: 'agent-gemini',
    sharedFiles: ['GEMINI.md'],
    // Antigravity only loads commands from .agents/skills — reuse the
    // agent-agnostic group rather than duplicating its templates.
    includes: ['agentic'],
    global: [{ templateGroup: 'agent-agnostic', templateDir: '.agents/skills', targetDir: '.agents/skills' }],
  },
  copilot: {
    label: 'Copilot',
    templateGroup: 'agent-copilot',
    dirs: ['.github'],
  },
  agentic: {
    label: 'Agent-agnostic',
    templateGroup: 'agent-agnostic',
    dirs: ['.agents'],
    global: [{ templateDir: '.agents/skills', targetDir: '.agents/skills' }],
  },
  gitHooks: {
    templateGroup: 'git-hooks',
    dirs: ['.githooks'],
    postStep: 'configureHooksPath',
  },
};
