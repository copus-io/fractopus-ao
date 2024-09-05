import { Injectable } from "@nestjs/common";
import Decimal from 'decimal.js';
import { AOService } from "./ao.service";
import { CommonService } from "./common.service";
@Injectable()
export class DripService {

  private decimal = Math.pow(10, 6);
 
  
  constructor(private readonly aoService: AOService,
    private readonly commonService: CommonService
  ) { }

  private config :any| null = null;
  async onModuleInit() {
    this.config = await this.commonService.getConfigFromJson();
  }
  
  private getFinalAmount(amount: number): string {
    return (new Decimal(amount)).times(this.decimal).toFixed(0).toString();
  }

  public async mintDrip(recipient: string, amount: number) {
    const tags = [
      { name: "Action", value: "Mint" },
      { name: "Recipient", value: recipient },
      { name: "Quantity", value: this.getFinalAmount(amount) },
    ];
    const msgId = await this.aoService.sendMsg(this.config.process.tokenDrip, tags);
    return this.checkMsgId(msgId);
  }

  public async burnDrip(targetUser: string, amount: number) {
    const tags = [
      { name: "Action", value: "Burn" },
      { name: "TargetUser", value: targetUser.trim() },
      { name: "Quantity", value: this.getFinalAmount(amount) },
    ];
    const msgId = await this.aoService.sendMsg(this.config.process.tokenDrip,tags);
    return this.checkMsgId(msgId);
  }

  private async checkMsgId(msgId: string): Promise<string> {
    const msg = await this.aoService.readMsg(this.config.process.tokenDrip,msgId);
    if (msg === null) {
      return null;
    }

    if (msg.Messages.length === 0) {
      return null;
    }

    const msgTags = msg.Messages[0].Tags as Array<any>;

    for (let index = 0; index < msgTags.length; index++) {
      const element = msgTags[index];
      if (element.name === "Error") {
        console.info(element);
        return null;
      }
      if (element.name === "Action" && (element.value as string).indexOf("Error") > 0) {
        console.info(element);
        return null;
      }
    }
    return msgId;
  }

  public async transferDrip(sender: string, recipient: string, amount: number) {
    const tags = [
      { name: "Action", value: "Transfer" },
      { name: "Sender", value: sender },
      { name: "Recipient", value: recipient },
      { name: "Quantity", value: this.getFinalAmount(amount) },
    ];
    const msgId = await this.aoService.sendMsg(this.config.process.tokenDrip,tags);
    return this.checkMsgId(msgId);
  }

  public async balance(recipient: string) {
    const tags = [
      { name: "Action", value: "Balance" },
      { name: "Recipient", value: recipient },
    ];
    return this.aoService.dryRunByTags(this.config.process.tokenDrip,tags)
  }
}