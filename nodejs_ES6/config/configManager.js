let configPath;

if (process.env.name) {
  configPath = `./config-${process.env.name}.json`;
} else {
  configPath = './config.json';
}
// eslint-disable-next-line import/no-dynamic-require
const config = require(configPath);

export default config;
