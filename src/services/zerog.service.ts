import { Batcher, getFlowContract, StorageNode } from '@0glabs/0g-ts-sdk';
import { Injectable } from "@nestjs/common";
import { ethers } from 'ethers';
import { FractopusSave } from "src/vo/fractopus.save";
import { CommonService } from './common.service';

@Injectable()
export class ZeroGService {

  constructor(private readonly commonService: CommonService) {
  }

  public async sendMsg(req: FractopusSave): Promise<any> {
    const batcher = await this.getBatcher();
    if(batcher==null){
      return {
        code: 0,
        data: "fail to create batcher"
      }
    }
    const key = Uint8Array.from(Buffer.from(req.uri, 'utf-8'));
    const val = Uint8Array.from(Buffer.from(JSON.stringify(req.src), 'utf-8'));
    batcher.streamDataBuilder.set("0x5a7de18fa1863a99ae46d3207ee1e081c889c88100c35a0bad46eb0c72d374f1", key, val);
    var [tx, err] = await batcher.exec();

    if (err === null) {
      console.log("Batcher executed successfully, tx: ", tx);
      return {
        code: 1,
        data: tx
      }
    } else {
      console.log("Error executing batcher: ");
      return {
        code: 0,
        data: err+""
      }
    }
  }


  private batcher: Batcher;
  private async getBatcher(): Promise<Batcher> {
    if (this.batcher != null) {
      return this.batcher;
    }
    const config = await this.commonService.getConfigFromJson();
    const evmRpc = 'https://evmrpc-test-us.0g.ai';
    const privateKey = config.privKeyForZeroG;
    const flowAddr = "0x0460aA47b41a66694c0a73f667a1b795A5ED3556";
    const node = new StorageNode("http://35.84.189.77:5678")
    const provider = new ethers.JsonRpcProvider(evmRpc);
    const signer = new ethers.Wallet(privateKey, provider);
    const flowContract = getFlowContract(flowAddr, signer);
    this.batcher = new Batcher(1, [node], flowContract, evmRpc);
    return this.batcher;
  }

}