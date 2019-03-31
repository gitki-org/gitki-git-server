import fs from 'fs';
import simpleGit from 'simple-git/promise';
import path from 'path';

import paths from '@@src/paths';
import * as utils from '@@utils/utils';

async function openIndex(orgName, repoName, repoHash) {
  const pathToIndex = path.resolve(paths.gitStorage, orgName, repoHash, 'doc', 'index.md');

  const data = fs.readFileSync(pathToIndex);
  const fileInString = data.toString();
  console.log('file read at %s', pathToIndex);

  return fileInString;
}

const FileExplorer = {
  openIndex,  
};

export default FileExplorer;
