'use strict';

// Declarative map: answer key -> what gets copied from templates/ into the target.
// index.js always includes `core`; includes agent groups only if selected;
// includes `gitHooks` only if the git-hook prompt was confirmed.
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
    global: {
      templateDir: '.claude/commands',
      targetDir: '.claude/commands',
    },
  },
  gemini: {
    label: 'Gemini',
    templateGroup: 'agent-gemini',
    dirs: ['.gemini'],
    files: ['GEMINI.md'],
    global: {
      templateDir: '.gemini/commands',
      targetDir: '.gemini/commands',
    },
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
  },
  gitHooks: {
    templateGroup: 'git-hooks',
    dirs: ['.githooks'],
    postStep: 'configureHooksPath',
  },
};
