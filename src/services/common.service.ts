import { Injectable } from "@nestjs/common";
import { readFile } from "node:fs/promises";

@Injectable()
export class CommonService {

  private config :any| null = null;
  public async getConfigFromJson() {
    if(!this.config){
      try {
        const rawData = await readFile('./config/config.json', 'utf8');
        this.config = JSON.parse(rawData);
      } catch (error) {
        console.error('Error loading config:', error);
        process.exit(1);  
      }
    }
    return this.config;
  }
}
  