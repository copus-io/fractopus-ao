import { Injectable } from "@nestjs/common";
import { createDataItemSigner, message } from "@permaweb/aoconnect";
import { readFile } from "node:fs/promises";

@Injectable()
export class AOService {

  private signer: ReturnType<typeof createDataItemSigner> | null = null;

  private async getSigner() {
    if (!this.signer) {
      try {
        const walletData = await readFile('./aoconfig/wallet.json', 'utf8');
        const wallet = JSON.parse(walletData);
        this.signer = createDataItemSigner(wallet);
      } catch (error) {
        console.error('Error initializing signer:', error);
        throw new Error('Failed to initialize signer');
      }
    }
    return this.signer;
  }

  // https://cookbook_ao.g8way.io/zh/guides/aoconnect/sending-messages.html
  public async sendMsg(params?: string): Promise<string> {
    try {
      const signer = await this.getSigner();
      const resp = await message({
        process: "dw_ydtYImkts_pMP-ZqraOTxJ-RnUd9_-39lYz8OnpY",
        tags: [
          { name: "Action", value: "hello" }
        ],
        signer: signer,
        data: params || "",
      });
      return resp;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }
}