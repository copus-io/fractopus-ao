import { Injectable } from "@nestjs/common";
import { connect, createDataItemSigner } from "@permaweb/aoconnect";
import { readFile } from "node:fs/promises";

// https://cookbook_ao.g8way.io/zh/guides/aoconnect/connecting.html
// https://viewblock.io/arweave/gateways
const { result,  message,  dryrun } = connect(
  {
    MU_URL: "https://mu.ao-testnet.xyz",
    CU_URL: "https://cu.ao-testnet.xyz",
    GATEWAY_URL: "https://ar-io.dev",
  },
);

@Injectable()
export class AOService {

  private signer: ReturnType<typeof createDataItemSigner> | null = null;

  private config :any| null = null;

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

  public async getSigner() {
    if (!this.signer) {
      try {
        const config = await this.loadConfig();
        const walletData = await readFile(config.walletPath, 'utf8');
        const wallet = JSON.parse(walletData);
        this.signer = createDataItemSigner(wallet);
      } catch (error) {
        console.error('Error initializing signer:', error);
        process.exit(1);  
      }
    }
    return this.signer;
  }
  
  // https://cookbook_ao.g8way.io/zh/guides/aoconnect/sending-messages.html
  public async sendMsg(tags?:{
    name: string;
    value: any;
}[], params?: string): Promise<string> {

  console.info("sendMsg tags",tags,params);
    try {
      const signer = await this.getSigner();
      const config = await this.loadConfig();
      const resp = await message({
        process: config.process.tokenDrip,
        tags: tags,
        signer: signer,
        data: params || "",
      });
      console.info("sendMsg resp",resp);
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
      console.info("readMsg",messageId,resp);
      return resp;
    } catch (error) {
      console.error('Error read message:', error);
    }
  }


  // https://cookbook_ao.g8way.io/zh/guides/aoconnect/calling-dryrun.html
  public async dryRun(action:string): Promise<any> {
    try {
      const config = await this.loadConfig();
      const resp = await dryrun({
        process: config.process.tokenDrip,
        tags: [
          { name: "Action", value: action},
        ],
      });
      console.info("dryRun",action,resp);
      return resp;
    } catch (error) {
      console.error('Error dryRun message:', error);
    }
  }

  public async dryRunByTags(tags?:{
    name: string;
    value: any;
}[]): Promise<any> {
    try {
      const config = await this.loadConfig();
      const resp = await dryrun({
        process: config.process.tokenDrip,
        tags: tags,
      });
      console.info(tags,resp);;
      return resp
    } catch (error) {
      console.error('Error dryRunByTags message:', error);
    }
  }
}