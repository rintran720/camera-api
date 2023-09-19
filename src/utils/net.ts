const net = require("net");
const crypto = require("crypto");
const { checkPortTimeout, httpPort, rtspPort } = global.__config;
const shouldOpenPorts = [httpPort]; // [httpPort, rtspPort]

export function isPortOpen(
  ip: string,
  port: number,
  callback: (Error, any) => any
) {
  const socket = new net.Socket();
  socket.setTimeout(checkPortTimeout);
  socket.on("connect", function () {
    socket.destroy();
    callback(null, true);
  });
  socket.on("timeout", function () {
    socket.destroy();
    callback(new Error("Connection timed out"), false);
  });
  socket.on("error", function (err) {
    socket.destroy();
    callback(err, false);
  });
  socket.connect(port, ip);
}

export function checkPort(host: string, port: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    isPortOpen(host, port, function (err, isOpen) {
      if (err) {
        reject(false);
      } else {
        resolve(isOpen);
      }
    });
  });
}

export async function scanLocalNetwork(ipRange: string): Promise<string[]> {
  console.log(`Scanning local network ${ipRange}.___`);
  const deviceIps = [];
  for (let i = 1; i <= 255; i++) {
    const host = `${ipRange}.${i}`;
    try {
      const data = await Promise.all(
        shouldOpenPorts.map((port) => checkPort(host, port))
      );
      if (data.filter((v) => v === true).length === shouldOpenPorts.length) {
        deviceIps.push(host);
      }
    } catch (error) {}
  }
  return deviceIps;
}

export const generateDigestHeader = (
  username: string,
  password: string,
  method: string,
  path: string,
  nonce: string,
  realm: string
) => {
  const qop = "auth";
  const ha1 = crypto
    .createHash("md5")
    .update(`${username}:${realm}:${password}`)
    .digest("hex");

  const ha2 = crypto
    .createHash("md5")
    .update(`${method}:${path}`)
    .digest("hex");

  const nc = "00000001";
  const cnonce = crypto.randomBytes(8).toString("hex");
  const digest = crypto
    .createHash("md5")
    .update(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`)
    .digest("hex");

  return `Digest username="${username}", realm="${realm}", nonce="${nonce}", uri="${path}", qop="${qop}", nc=${nc}, cnonce="${cnonce}", response="${digest}"`;
};
