import loadConfig from "./configs";
global.__config = loadConfig();

console.log(global);
import { scanDahuaDevice, scanHikvisionDevice } from "./index";

(async () => {
  try {
    console.log(await scanHikvisionDevice("admin", "password", "129.168.5"));
    console.log(await scanDahuaDevice("admin", "password"));
  } catch (error) {
    console.error(error);
  }
})();
