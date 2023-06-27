import loadConfig from "./configs";
global.__config = loadConfig();

export function greet(name: string): string {
  return `Hello, ${name}!`;
}
