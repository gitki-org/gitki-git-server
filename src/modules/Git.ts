import fs from 'fs';
import simpleGit from 'simple-git/promise';
import path from 'path';

import paths from '@@src/paths';
import * as utils from '@@utils/utils';

async function makeGitRepo(orgName, repoName, repoHash) {
  try {
    const pathToRepo = path.resolve(paths.gitStorage, orgName, repoHash);
    const pathToDoc = path.resolve(pathToRepo, 'doc');

    fs.mkdirSync(pathToDoc, { recursive: true });
    fs.writeFileSync(path.resolve(pathToDoc, 'index.md'), 'Initil commit', {
      flag: 'w',
    });

    const git = simpleGit(pathToRepo)
    git.init()
      .then(() => git.add(pathToRepo))
      .then(() => git.commit('Initial commit'))
      .then((summary) => console.log('Commit is made: %s', summary));

    return 1  ;
  } catch (err) {
    throw err;
  }
}

async function getCommits(orgName, repoName, repoHash) {
  try {
    const pathToRepo = path.resolve(paths.gitStorage, orgName, repoHash);
    
    const log = await simpleGit(pathToRepo)
      .log();

    console.log('Git log: %s', log);

    return log;
  } catch (err) {
    throw err;
  }
}

const Git = {
  getCommits,
  makeGitRepo,
};

export default Git;
