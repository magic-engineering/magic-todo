import jest from "jest-mock";
import * as cli from "../cli";

const helpers = new jest.ModuleMocker("yargs/helpers", () => {
  return {
    hideBin: jest.fn(),
  }
});

const yargs = new jest.ModuleMocker("yargs", () => {
  const mockModuleYargs = {
    command: jest.fn(),
  }
  return () => {
    return mockModuleYargs;
  }
});


test("should initialize yargs correctly", () => {
  cli.runCli();
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