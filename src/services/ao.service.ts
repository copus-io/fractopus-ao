import { Injectable } from "@nestjs/common";
import { connect, createDataItemSigner } from "@permaweb/aoconnect";
import { readFile } from "node:fs/promises";
import { CommonService } from "./common.service";

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


  constructor(private readonly commonService: CommonService) {
  }
  private signer: ReturnType<typeof createDataItemSigner> | null = null;

  public async getSigner() {
    if (!this.signer) {
      try {
        const config = await this.commonService.getConfigFromJson();
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
  public async sendMsg(
    process:string,
    tags?:{
    name: string;
    value: any;
}[], params?: string): Promise<string> {

  console.info("sendMsg tags",tags,params);
    try {
      const signer = await this.getSigner();
      const resp = await message({
        process: process,
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
  public async readMsg(process:string,messageId:string): Promise<any> {
    try {
      const resp = await result({
        process: process,
        message: messageId,
      });
      console.info("readMsg",messageId,resp);
      return resp;
    } catch (error) {
      console.error('Error read message:', error);
    }
  }


  // https://cookbook_ao.g8way.io/zh/guides/aoconnect/calling-dryrun.html
  public async dryRun(process:string,action:string): Promise<any> {
    try {
      const resp = await dryrun({
        process: process,
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

  public async dryRunByTags(
    process:string,
    tags?:{
    name: string;
    value: any;
}[]): Promise<any> {
    try {
      const resp = await dryrun({
        process: process,
        tags: tags,
      });
      console.info(tags,resp);;
      return resp
    } catch (error) {
      console.error('Error dryRunByTags message:', error);
    }
  }
}