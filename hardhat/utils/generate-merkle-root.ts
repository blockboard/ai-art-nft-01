import { program } from 'commander'
//import fs from 'fs'
import * as fs from 'fs';
import { parseBalanceMap } from './parse-balance-map'

program
  .version('0.0.0')
  .requiredOption(
    '-i, --input <path>',
    'input JSON file location containing a map of account addresses to string balances'
  )

program.parse(process.argv)

const json = JSON.parse(fs.readFileSync(program.input, { encoding: 'utf8' }))

if (typeof json !== 'object') throw new Error('Invalid JSON')
fs.writeFile("output.json", JSON.stringify(parseBalanceMap(json)), function(err) {
  if(err) {
      return console.log(err);
  }
  console.log("The file was saved!");
});
