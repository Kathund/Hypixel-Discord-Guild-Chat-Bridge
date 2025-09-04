import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { sortJSON } from '../src/Utils/JSONUtils';

readdirSync('./data')
  .filter((file) => file.endsWith('.json'))
  .forEach((file) =>
    writeFileSync(
      `./data/${file}`,
      JSON.stringify(sortJSON(JSON.parse(readFileSync(`./data/${file}`).toString('utf8'))), null, 2)
    )
  );
