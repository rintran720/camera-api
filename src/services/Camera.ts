import AXIOS, { AxiosInstance } from "axios";
import { checkPort, generateDigestHeader } from "../utils/net";
import { ICamera } from "../types/camera";

export abstract class Camera implements ICamera {
  ip: string;
  port: number;
  baseURL: string;
  username: string;
  password: string;
  axios: AxiosInstance;

  constructor(ip: string, port: number, username: string, password: string) {
    this.ip = ip;
    this.port = port;
    this.baseURL = `http://${ip}:${port}`;
    this.username = username;
    this.password = password;

    this.axios = AXIOS.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });

    this.axios.interceptors.response.use(
      (res) => res,
      async ({ code, response, config }) => {
        // Returns Promise. reject if connection is not established.
        if (code === "ECONNABORTED" || !response) {
          return Promise.reject(new Error("Can not connect this device"));
        }

        // Returns a promise that resolves to the response.
        if (response.status === 401) {
          const originalRequest = { ...config };
          // extract nonce and realm from WWW-Authenticate header
          const authenticateHeader = response.headers["www-authenticate"];
          if (!authenticateHeader) {
            return Promise.reject(new Error("Can not access this device"));
          }
          const match1 = authenticateHeader.match(/realm="(.*?)"/);
          const match2 = authenticateHeader.match(/nonce="(.*?)"/);
          const realm = match1[1];
          const nonce = match2[1];

          // generate digest authorization header
          const path = config.url;
          const method = "GET";
          const digestHeader = generateDigestHeader(
            this.username,
            this.password,
            method,
            path,
            nonce,
            realm
          );
          originalRequest.headers["Authorization"] = digestHeader;

          return this.axios(originalRequest);
          // Promise. resolve rejects if response status is less than 300.
        } else if (response.status > 300) {
          return Promise.reject(new Error("Can not access this device"));
        } else {
          return Promise.resolve(response);
        }
      }
    );
  }

  async isOnline() {
    return checkPort(this.ip, this.port);
  }
}
