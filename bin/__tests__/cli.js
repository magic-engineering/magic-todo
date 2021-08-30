jest.mock("yargs/helpers", () => {
  return {
    hideBin: jest.fn(),
  }
});

jest.mock("yargs", () => {
  const mockModuleYargs = {
    command: jest.fn(),
    argv: 'test',
  }

  mockModuleYargs.command.mockReturnValue(mockModuleYargs);
  return jest.fn()
    .mockReturnValue(mockModuleYargs);
});

jest.mock("../db", () => {
  return {
    JSON: jest.fn(),
    sync: jest.fn(),
  }
});

const cli = require("../cli");
const db = require("../db");
const helpers = require("yargs/helpers");
const yargs = require("yargs");

beforeEach(() => {
  jest.clearAllMocks();
});

test("should initialize yargs correctly", () => {
  process.argv.push(...['todos','ls']);
  
  helpers.hideBin.mockReturnValue([
    "todos",
    "ls",
  ]);

  cli();
  expect(yargs).toHaveBeenCalledWith([
    "todos",
    "ls",
  ]);
  expect(helpers.hideBin).toHaveBeenCalledWith(process.argv);
});

test("should configure yargs correctly", () => {
  const mockYargs = {
    positional: jest.fn(),
  }
  mockYargs.positional.mockReturnValue(mockYargs);

  const config = cli.yargsConfiguration(mockYargs);
  expect(config).toEqual(mockYargs);

  expect(mockYargs.positional).toHaveBeenCalledWith('action', {
    describe: 'action',
    default: 'ls'
  });

  expect(mockYargs.positional).toHaveBeenCalledWith('actionArg', {
    describe: 'action requirement',
    default: ''
  });
});

test("should execute list of todos", async () => {
  const consoleSpy = jest.spyOn(console, "log");
  const todos = [
    "todo1",
    "todo2",
  ]
  db.JSON.mockResolvedValueOnce({ todos });

  await cli.processArgs({ action: "ls" });

  expect(consoleSpy).toHaveBeenCalledWith("0: todo1");
  expect(consoleSpy).toHaveBeenCalledWith("1: todo2");
});

test("should add todo", async () => {
  const todos = [
    "todo a",
  ];
  db.JSON.mockResolvedValueOnce({ todos });

  await cli.processArgs({ action: "add", actionArg: "new todo" });

  expect(db.JSON).toHaveBeenCalledWith({ todos: [
    "todo a",
    "new todo",
  ]});
  expect(db.sync).toHaveBeenCalled();
});