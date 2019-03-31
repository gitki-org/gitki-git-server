import fs from 'fs';
import simpleGit from 'simple-git/promise';
import path from 'path';

import paths from '@@src/paths';
import * as utils from '@@utils/utils';

async function makeGitRepo(orgName, repoName, repoHash) {
  try {
    const pathToRepo = path.resolve(paths.gitStorage, orgName, repoHash);
    const pathToDoc = path.resolve(pathToRepo, 'doc');
    const isRepo = fs.existsSync(pathToRepo);
    
    if (!isRepo) {
      fs.mkdirSync(pathToDoc, { recursive: true });
      fs.writeFileSync(path.resolve(pathToDoc, 'index.md'), repoName, {
        flag: 'w',
      });

      const git = simpleGit(pathToRepo)
      await git.init()
        .then(() => git.add(pathToRepo))
        .then(() => git.commit('Initial commit'))
        .then((summary) => console.log('Commit is made: %o', summary));

      return 'Git repo is successfully initialized';
    } else {
      console.log('Repo is already intialized');
      return 'Repo is already intialized';
    }
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
