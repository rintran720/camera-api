import { ICameraApiConfig } from "../types/camera";

const fs = require("fs");
const path = require("path");

const DEFAULT_CONFIG_PATH = path.join(__dirname, "camera-api.config.json");
const USER_CONFIG_PATH = path.join(process.cwd(), "camera-api.config.json");

function loadConfig() {
  let config: ICameraApiConfig;

  try {
    const defaultConfig = fs.readFileSync(DEFAULT_CONFIG_PATH, "utf8");
    config = { ...JSON.parse(defaultConfig) };
  } catch (error) {
    console.log("Load default config error: " + error);
  }

  try {
    const userConfig = fs.readFileSync(USER_CONFIG_PATH, "utf8");
    config = { ...config, ...JSON.parse(userConfig) };
  } catch (error) {
    console.log("Load user config error: " + error);
  }

  return config;
}

export default loadConfig;
