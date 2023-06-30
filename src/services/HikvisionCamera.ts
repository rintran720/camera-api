import { AxiosResponse } from "axios";
import { ICamera } from "../types/camera";
import { Camera } from "./Camera";

const xml2js = require("xml2js");
const parser = new xml2js.Parser();

export class HikvisionCamera extends Camera implements ICamera {
  getDefaultRtspLink() {
    return `rtsp://${this.username}:${this.password}@${this.ip}:554/ISAPI/Streaming/channels/101`;
  }

  authenticate() {
    return this.axios.get("/ISAPI/Security/userCheck?format=json");
  }

  getNetworkConfig() {
    return this.axios.get("/ISAPI/System/Network/interfaces");
  }

  getRtspConfig() {
    return this.axios.get("/ISAPI/Streaming/channels");
  }
}

export function parseHikvisionResponseToObject<T = any>(response) {
  return new Promise<T>((resolve, reject) => {
    try {
      parser.parseString(response, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
}
