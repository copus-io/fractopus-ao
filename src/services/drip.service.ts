import { Injectable } from "@nestjs/common";
import Decimal from 'decimal.js';
import { AOService } from "./ao.service";
@Injectable()
export class DripService {

  private decimal = Math.pow(10,6);

  constructor(private readonly aoService: AOService) { }

  private getFinalAmount(amount:number):string{
    return (new Decimal(amount)).times(this.decimal).toString();
  }

  public async mintDrip(recipient: string, amount: number) {
    const tags = [
      { name: "Action", value: "Mint" },
      { name: "Recipient", value: recipient },
      { name: "Quantity", value: this.getFinalAmount(amount) },
    ];
    return this.aoService.sendMsg(tags)
  }

  public async burnDrip(targetUser: string, amount: number) {
    const tags = [
      { name: "Action", value: "Burn" },
      { name: "TargetUser", value: targetUser.trim()},
      { name: "Quantity", value: this.getFinalAmount(amount) },
    ];
    return this.aoService.sendMsg(tags)
  }

  public async transferDrip(sender: string,recipient: string, amount: number) {
    const tags = [
      { name: "Action", value: "Transfer" },
      { name: "Sender", value: sender },
      { name: "Recipient", value: recipient },
      { name: "Quantity", value: this.getFinalAmount(amount) },
    ];
    return this.aoService.sendMsg(tags)
  }

  public async balance(recipient: string) {
    const tags = [
      { name: "Action", value: "Balance" },
      { name: "Recipient", value: recipient },
    ];
    return this.aoService.dryRunByTags(tags)
  }
}