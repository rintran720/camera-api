import loadConfig from "./configs";
global.__config = loadConfig();

const fs = require("fs");

import { HikvisionCamera, scanDahuaDevice, scanHikvisionDevice } from "./index";
import { HikvisionNvr } from "./services/HikvisionNvr";

(async () => {
  try {
    // console.log(await scanHikvisionDevice("admin", "password", "129.168.5"));
    // console.log(await scanDahuaDevice("admin", "password"));
    const nvr = new HikvisionNvr("192.168.92.97", 40100, "admin", "admin");

    const net = await nvr.searchVideo({
      startTime: "2023-09-26T14:19:32.000Z",
      endTime: "2023-09-26T14:19:32.000Z",
      trackID: "301",
    });
    console.log(net);
  } catch (error) {
    console.error(error);
  }
})();
