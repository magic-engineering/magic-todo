const yargs = require("yargs");
const helpers = require("yargs/helpers");
const db = require("./db");

const yargsConfiguration = (yargs) => {
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

const processArgs = async (args) => {
  const data = await db.JSON();
  if (args.action == 'add') {
    const { todos = [] } = data;
    const nextIndex = todos.length;
    console.log(`adding ${nextIndex}:${args.actionArg} in todos.`);
    todos.push(args.actionArg);
    db.JSON({ todos });
    await db.sync();
  } else {
    console.log('TODOS:');
    const { todos = [] } = data;
    todos.forEach((todo, i) => {
      console.log(`${i}: ${todo}`);
    });
    if (!todos.length) {
      console.log('no todos yet');
    }
  }
}

const description = `- manage todos`;
function runCli() {
  const cleanArgs = helpers.hideBin(process.argv);
  yargs(cleanArgs)
    .command(
      'todos [action] [actionArg]', 
      description, 
      yargsConfiguration, 
      processArgs
    )
    .argv;
}

module.exports = runCli;
module.exports.yargsConfiguration = yargsConfiguration;
module.exports.processArgs = processArgs;