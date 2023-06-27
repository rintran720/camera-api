import loadConfig from "./configs";
global.__config = loadConfig();

export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export * from "./utils/net";
export * from "./services/Camera";
export * from "./services/DahuaCamera";
export * from "./services/HikvisionCamera";
export * from "./services/ScanDevice";
export * from "./types/camera";
