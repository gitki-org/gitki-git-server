import fs from 'fs';
import path from 'path';

import paths from '@@src/paths';
import * as utils from '@@utils/utils';

async function openIndex(orgName, repoName) {
  const repoHash = utils.hash(`${orgName}-${repoName}`);
  const pathToIndex = path.resolve(paths.gitStorage, orgName, repoHash, 'doc', 'index.md');

  const data = fs.readFileSync(pathToIndex);
  const fileInString = data.toString();
  console.log('file read at %s', pathToIndex);

  return fileInString;
}

async function editIndex({
  contents,
  orgName,
  repoName,
}: any) {
  const repoHash = utils.hash(`${orgName}-${repoName}`);
  const pathToIndex = path.resolve(paths.gitStorage, orgName, repoHash, 'doc', 'index.md');

  const data = fs.writeFileSync(pathToIndex, contents);
  
  return 1;
}

const FileExplorer = {
  editIndex,
  openIndex,  
};

export default FileExplorer;
