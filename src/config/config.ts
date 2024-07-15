import { readFile } from "node:fs/promises";


async function loadConfig() {
  try {
    const rawData = await readFile('./config/config.json', 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error loading config:', error);
    process.exit(1);  
  }
}

const globalConfig = loadConfig();

module.exports = globalConfig;