import { AxiosInstance } from "axios";

export interface ICameraApiConfig {
  networkInterface: string;
  httpPort: number;
  rtspPort: number;
  checkPortTimeout: number;
}

export interface ICamera {
  ip: string;
  port: number;
  baseURL: string;
  username: string;
  password: string;
  axios: AxiosInstance;

  isOnline(): boolean | Promise<boolean>;
}
