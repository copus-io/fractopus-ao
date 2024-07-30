import { Injectable } from "@nestjs/common";
import { AOService } from "./ao.service";

@Injectable()
export class DripService {

  constructor(private readonly aoService: AOService) { }
  public async mintDrip(recipient: string, amount: number) {
    const tags = [
      { name: "Action", value: "Mint" },
      { name: "Recipient", value: recipient },
      { name: "Quantity", value: (amount * Math.pow(10, 6)).toString() },
    ];
    console.info(tags);
    return this.aoService.sendMsg(tags)
  }

  public async burnDrip(targetUser: string, amount: number) {
    const tags = [
      { name: "Action", value: "Burn" },
      { name: "TargetUser", value: targetUser.trim()},
      { name: "Quantity", value: (amount * Math.pow(10, 6)).toString() },
    ];
    console.info(tags);
    return this.aoService.sendMsg(tags)
  }

  public async transferDrip(sender: string,recipient: string, amount: number) {
    const tags = [
      { name: "Action", value: "Transfer" },
      { name: "Sender", value: sender },
      { name: "Recipient", value: recipient },
      { name: "Quantity", value: (amount * Math.pow(10, 6)).toString() },
    ];
    return this.aoService.sendMsg(tags)
    // return this.aoService.dryRunByTags(tags)
  }

  public async balance(recipient: string) {
    const tags = [
      { name: "Action", value: "Balance" },
      { name: "Recipient", value: recipient },
    ];
    return this.aoService.dryRunByTags(tags)
  }
}