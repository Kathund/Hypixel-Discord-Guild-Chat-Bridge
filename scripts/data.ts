import DataManager from '../src/Data/DataManager.js';

console.other = console.log;
const args: string[] = process.argv.slice(2);

(async () => {
  if (args.includes('--update')) await DataManager.updateDataFiles();
  DataManager.checkFiles();
})();
