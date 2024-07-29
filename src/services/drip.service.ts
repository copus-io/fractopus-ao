import { Injectable } from "@nestjs/common";
import { AOService } from "./ao.service";

@Injectable()
export class DripService {

  constructor(private readonly aoService: AOService) { }
  public async mintDrip(targetUser :string , amount:number){
    const tags = [
      { name: "Action", value: "Mint"},
      { name: "TargetUser", value: targetUser},
      { name: "Quantity", value: amount},
    ];
    console.info(tags);
    return this.aoService.sendMsg(tags)
  }
}