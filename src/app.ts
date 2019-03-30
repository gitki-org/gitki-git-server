import nodegit from 'nodegit';
import path from 'path';

import webserver from './webserver';

const cwd = process.cwd();
let pJson;

try {
  const pJsonPath = path.resolve(cwd, 'package.json');
  pJson = require(pJsonPath);
} catch (err) {
  console.log('package.json is not found. Is current working directory correctly configured?');
  process.exit(1);
}

console.log('App [%s] is starting... version: %s ', pJson.name, pJson.version);

webserver();

// const pathToRepo = path.resolve(CWD, 'git-storage', 'p');
// nodegit.Repository.init(pathToRepo, 0).then(function (repo) {
//   console.log(123, repo);
//   // Inside of this function we have an open repo
// });
