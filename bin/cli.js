import yargs from "yargs";
import * as helpers from "yargs/helpers";

import db from "./db";

export const yargsConfiguration = (yargs) => {
  return yargs
    .positional('action', {
      describe: 'action',
      default: 'ls'
    })
    .positional('actionArg', {
      describe: 'action requirement',
      default: ''
    });
}

const description = `- manage todos`;
export function runCli() {
  yargs(helpers.hideBin(process.argv))
    .command(
      'todos [action] [actionArg]', 
      description, 
      yargsConfiguration, 
      async (args) => {
        await db.read();
        if (args.action == 'add') {
          const nextIndex = db.data.todos.length;
          console.log(`adding ${nextIndex}:${args.actionArg} in todos.`);
          db.data.todos.push(args.actionArg);
          db.write();
        } else {
          console.log('TODOS:');
          db.data.todos.forEach((todo, i) => {
            console.log(`${i}: ${todo}`);
          });
          if (!db.data.todos.length) {
            console.log('no todos yet');
          }
        }
      }
    )
    .argv;
}

export default runCli;
