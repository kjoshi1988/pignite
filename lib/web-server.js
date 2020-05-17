import {loadConfig} from "./config-loader";

export function startServer() {
  const serverConfig = loadConfig();
  console.log(serverConfig);
}