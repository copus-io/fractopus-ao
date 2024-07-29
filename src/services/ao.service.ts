import { Injectable } from "@nestjs/common";
import { createDataItemSigner, dryrun, message, result } from "@permaweb/aoconnect";
import { readFile } from "node:fs/promises";

@Injectable()
export class AOService {

  private static signer: ReturnType<typeof createDataItemSigner> | null = null;

  private config :any| null = null;

  public static async getSigner() {
    if (!this.signer) {
      try {
        const walletData = await readFile('./aoconfig/wallet.json', 'utf8');
        const wallet = JSON.parse(walletData);
        this.signer = createDataItemSigner(wallet);
      } catch (error) {
        console.error('Error initializing signer:', error);
        process.exit(1);  
      }
    }
    return this.signer;
  }

  private async loadConfig() {
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

  // https://cookbook_ao.g8way.io/zh/guides/aoconnect/sending-messages.html
  public async sendMsg(tags?:{
    name: string;
    value: any;
}[], params?: string): Promise<string> {
    try {
      const signer = await AOService.getSigner();
      const config = await this.loadConfig();
      const resp = await message({
        process: config.process.tokenDrip,
        tags: tags,
        signer: signer,
        data: params || "",
      });
      return resp;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  // https://cookbook_ao.g8way.io/zh/guides/aoconnect/reading-results.html
  public async readMsg(messageId:string): Promise<any> {
    try {
      const config = await this.loadConfig();
      const resp = await result({
        process: config.process.tokenDrip,
        message: messageId,
      });
      return resp
    } catch (error) {
      console.error('Error read message:', error);
    }
  }


  // https://cookbook_ao.g8way.io/zh/guides/aoconnect/calling-dryrun.html
  public async dryrun(action:string): Promise<any> {
    try {
      const config = await this.loadConfig();
      const resp = await dryrun({
        process: config.process.tokenDrip,
        tags: [
          { name: "Action", value: action},
        ],
      });
      return resp
    } catch (error) {
      console.error('Error dryrun message:', error);
    }
  }
}