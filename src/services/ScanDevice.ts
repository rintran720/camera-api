import { scanLocalNetwork } from "../utils/net";
import { DahuaCamera, parseDahuaResponseToObject } from "./DahuaCamera";
import {
  HikvisionCamera,
  parseHikvisionResponseToObject,
} from "./HikvisionCamera";

const { networkInterfaces } = require("os");
const { networkInterface, httpPort } = global.__config;

export function availableIpRange(ip_range) {
  return ip_range
    .toString()
    .trim()
    .match(/[1-9]+[0-9]*\.[0-9]+\.[0-9]+/);
}
export function scanOpeningPortInNetwork(ip_range: string) {
  if (availableIpRange(ip_range || "")) {
    return scanLocalNetwork(ip_range);
  }

  const networkInterfaceInfo = networkInterfaces();
  //console.log(networkInterfaceInfo);
  const ipv4Interfaces = networkInterfaceInfo[networkInterface]?.filter(
    ({ family }) => family === "IPv4"
  );
  // above code only works on windows machine change the interface name based on machine.
  if (ipv4Interfaces?.length > 0) {
    const ipv4Address = ipv4Interfaces[0]?.address;
    const ips = ipv4Address?.split(".");
    const ipRange = ips.slice(0, 3)?.join(".");

    return scanLocalNetwork(ipRange);
  } else {
    console.error("No IPv4 network interfaces found.");
  }
}

export async function scanDahuaDevice(
  username: string,
  password: string,
  ip_range: string
) {
  try {
    const devices = await scanOpeningPortInNetwork(ip_range);
    const connectedDevices = [];
    for (const idx in devices) {
      try {
        const cam = new DahuaCamera(devices[idx], httpPort, username, password);
        const net = await cam.getNetworkConfig();
        if (net?.data) {
          const mac = parseDahuaResponseToObject(net?.data)?.table?.Network
            ?.eth0?.PhysicalAddress;
          if (mac)
            connectedDevices.push({
              ip: devices[idx],
              stream_url: cam.getDefaultRtspLink(),
              identifier: mac?.trim()?.replaceAll(":", ""),
              mac,
            });
        }
      } catch (error) {
        // console.error(
        //   `Try to connect ${devices[idx]}, has error:`,
        //   error.message
        // );
      }
    }
    return connectedDevices;
  } catch (error) {
    //console.error(error);
  }
}

export async function scanHikvisionDevice(
  username: string,
  password: string,
  ip_range: string
) {
  try {
    const devices = await scanOpeningPortInNetwork(ip_range);
    console.log("Found IP: ", devices);
    const connectedDevices = [];
    for (const idx in devices) {
      try {
        const cam = new HikvisionCamera(
          devices[idx],
          httpPort,
          username,
          password
        );
        const net = await cam.getNetworkConfig();
        if (net?.data) {
          const mac = (await parseHikvisionResponseToObject(net?.data))
            ?.NetworkInterfaceList?.NetworkInterface[0].Link?.[0]
            ?.MACAddress?.[0];
          if (mac)
            connectedDevices.push({
              ip: devices[idx],
              stream_url: cam.getDefaultRtspLink(),
              identifier: mac?.trim()?.replaceAll(":", ""),
              mac,
            });
        }
      } catch (error) {
        // console.error(
        //   `Try to connect ${devices[idx]}, has error:`,
        //   error.message
        // );
      }
    }
    return connectedDevices;
  } catch (error) {
    //console.error(error);
  }
}
