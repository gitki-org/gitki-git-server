import path from 'path';

import webserver from './webserver';
import paths from './paths';

console.log('App is starting...');

try {
  const pJson = require(paths.pJson);
  console.log('App name: %s, version %s', pJson.name, pJson.version);
} catch (err) {
  console.log('package.json is not found. Is current working directory correctly configured? %s', process.cwd());
  process.exit(1);
}

webserver();
