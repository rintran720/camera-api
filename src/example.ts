const {
  scanHikvisionDevice,
  scanDahuaDevice,
} = require("../services/ScanDevice.util");

(async () => {
  try {
    console.log(await scanHikvisionDevice("admin", "password", "129.168.5"));
    console.log(await scanDahuaDevice("admin", "password"));
  } catch (error) {
    console.error(error);
  }
})();
