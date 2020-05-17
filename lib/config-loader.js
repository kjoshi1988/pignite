const env = process.env.NODE_ENV;
const configDir = process.env.NODE_CONFIG_PATH;

if (!configDir) {
  throw new Error('process.env.NODE_CONFIG_PATH is undefined');
}

import path from 'path';
const DEV_CONFIG = require(path.join(configDir, 'config.dev.js'));
const PROD_CONFIG = require(path.join(configDir, 'config.prod.js'));

export function loadConfig() {
  if (env === 'production') {
    return DEV_CONFIG;
  }
  return PROD_CONFIG;
}