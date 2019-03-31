const path = require('path');

const cwd = process.cwd();
console.info('Paths is being set, cwd: %s', cwd);

module.exports = {
  gitStorage: path.resolve(cwd, 'git-storage'),
  pJson: path.resolve(cwd, 'package.json'),
};
