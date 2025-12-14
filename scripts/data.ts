import zod from 'zod';

import DataManager, { trackedData } from '../src/Data/DataManager.js';
import Translate from '../src/Private/Translate.js';
import { ReplaceVariables } from '../src/Utils/StringUtils.js';
import { format } from 'prettier';
import { readFileSync, writeFileSync } from 'node:fs';

const prettierConfig = JSON.parse(readFileSync('.prettierrc').toString('utf-8'));

console.other = console.log;
const args: string[] = process.argv.slice(2);

(async () => {
  if (args.includes('--gen-schema')) {
    for (const data of trackedData) {
      console.other(ReplaceVariables(Translate('data.schema.create'), { file: data.name }));
      const JSONSchema = zod.toJSONSchema(data.schema);
      const file = `data/${data.name.replaceAll('.json', '.schema.json')}`;
      const formatted = await format(JSON.stringify(JSONSchema), { ...prettierConfig, filepath: file });
      writeFileSync(file, formatted);
      console.other(ReplaceVariables(Translate('data.schema.created'), { file: data.name }));
    }
  }

  if (args.includes('--update')) await DataManager.updateDataFiles();
  DataManager.checkFiles();
})();
