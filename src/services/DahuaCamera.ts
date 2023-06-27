import { ICamera } from "../types/camera";
import { Camera } from "./Camera";

export class DahuaCamera extends Camera implements ICamera {
  getDefaultRtspLink(): string {
    return `rtsp://${this.username}:${this.password}@${this.ip}:554/cam/realmonitor?channel=1&subtype=0`;
  }

  getConfig(name: string) {
    return this.axios.get(
      `/cgi-bin/configManager.cgi?action=getConfig&name=${name}`
    );
  }

  getNetworkConfig() {
    return this.getConfig("Network");
  }

  getRtspConfig() {
    return this.getConfig("RTSP");
  }

  setEnableRtspConfig(enable, port) {
    return this.axios.get(
      `/cgi-bin/configManager.cgi?action=setConfig&RTSP.Enable=${Boolean(
        enable
      )}&RTSP.Port=${Number(port)}`
    );
  }
}

export function parseDahuaResponseToObject<T = any>(response) {
  const result = response
    ?.trim()
    .split("\n")
    .reduce((acc, curr) => {
      const [key, value] = curr.split("=");

      const path = key.split(".");
      let obj = acc;

      // Create a new path object.
      for (let i = 0; i < path.length; i++) {
        // Add a path to the path array.
        if (!obj[path[i]]) {
          obj[path[i]] = {};
        }
        // Set the value of the path i th path element.
        if (i === path.length - 1) {
          // Set the path property of the object.
          if (value?.includes("[")) {
            const [vKey, vValue] = value.split("=");
            const index = parseInt(vKey.match(/\[(\d+)\]/)[1], 10);
            obj[path[i]][vKey.replace(`[${index}]`, "")] = vValue;
          } else {
            obj[path[i]] = value;
          }
        }
        obj = obj[path[i]];
      }

      return acc as T;
    }, {});

  return result;
}
