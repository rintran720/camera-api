import loadConfig from "./configs";
global.__config = loadConfig();

console.log(global);
export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export {
  isPortOpen,
  checkPort,
  scanLocalNetwork,
  generateDigestHeader,
} from "./utils/net";
export { Camera } from "./services/Camera";
export {
  DahuaCamera,
  parseDahuaResponseToObject,
} from "./services/DahuaCamera";
export {
  HikvisionCamera,
  parseHikvisionResponseToObject,
} from "./services/HikvisionCamera";
export {
  availableIpRange,
  scanDahuaDevice,
  scanHikvisionDevice,
  scanOpeningPortInNetwork,
} from "./services/ScanDevice";
export { ICamera, ICameraApiConfig } from "./types/camera";
