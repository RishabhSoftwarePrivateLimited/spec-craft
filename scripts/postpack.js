#!/usr/bin/env node
'use strict';

// Removes the temporary duplicate created by prepack.js now that
// `npm pack`/`npm publish` has already read the tarball contents — keeps the
// working tree back to just templates/core/.gitignore.

const fs = require('fs');
const path = require('path');

const dest = path.join(__dirname, '..', 'templates', 'core', 'gitignore.template');

fs.rmSync(dest, { force: true });
