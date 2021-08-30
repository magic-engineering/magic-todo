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
  switch (args.action) {
    /**
     * add a todo item in todos list
     */
    case 'add':
      const data = await db.JSON();
      const { todos = [] } = data;
      const nextIndex = todos.length;
      console.log(`adding ${nextIndex}:${args.actionArg} in todos.`);
      todos.push(args.actionArg);
      db.JSON({ todos });
      break;

    /**
     * flag a todo item as done
     */
    case 'done':
      let rm_index = +args.actionArg;
      let data2 = (await db.JSON()) || { todos: []};
      let todo = data2.todos[rm_index];
      delete data2.todos[rm_index];
      console.log('done ${rm_index}:${todo}');
      db.JSON({ todos });
      break;

    /**
     * list all todos
     */
    case 'ls':
    default:
      const data3 = (await db.JSON()) || {todos: []};
      console.log('TODOS:');
      data3.todos.forEach((todo, i) => {
        console.log(`${i}: ${todo}`);
      });
      if (!data3.todos.length) {
        console.log('no todos yet');
      }
      break;
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