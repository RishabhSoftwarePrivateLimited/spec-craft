#!/usr/bin/env node
'use strict';

const REQUIRED_MAJOR = 18;
const currentMajor = Number(process.versions.node.split('.')[0]);
if (currentMajor < REQUIRED_MAJOR) {
  console.error(
    `speccraft requires Node.js >=${REQUIRED_MAJOR}, but ${process.version} is running. Please upgrade Node and try again.`
  );
  process.exit(1);
}

require('../src/index').run(process.argv).catch((err) => {
  console.error(err);
  process.exit(1);
});
