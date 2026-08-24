#!/usr/bin/env node
'use strict';

// npm's packlist unconditionally strips any file literally named .gitignore
// from a published tarball (no config can override this), which would make
// mergeGitignore() throw ENOENT for anyone installing the package. The
// tracked source of truth stays templates/core/.gitignore for readability;
// this duplicates it under a safe name just for the pack/publish window.
// See postpack.js, which removes the duplicate again afterward, and
// src/copy.js's resolveGitignoreTemplatePath(), which falls back to it.

const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'templates', 'core', '.gitignore');
const dest = path.join(__dirname, '..', 'templates', 'core', 'gitignore.template');

fs.copyFileSync(src, dest);
