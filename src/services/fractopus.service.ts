import { Injectable } from "@nestjs/common";
import { FractopusSave } from "src/vo/fractopus.save";
import { AOService } from "./ao.service";
import { CommonService } from "./common.service";
import { ZeroGService } from "./zerog.service";
@Injectable()
export class FractopusService  {

  constructor(
    private readonly aoService: AOService,
    private readonly zeroGService: ZeroGService,
    private readonly commonService: CommonService
  ) { }

  private config :any| null = null;

  async onModuleInit() {
    this.config = await this.commonService.getConfigFromJson();
  }

  public async saveFractopus(req: FractopusSave): Promise<string> {
    const src = JSON.stringify(req.src);
    let tags = [
      { name: "Action", value: "Save" },
      { name: "p", value: "fractopus" },
      { name: "uri", value: req.uri },
    ];
    if(src){
      tags.push({ name: "src", value: src });
    }
    const msgId = await this.aoService.sendMsg(this.config.process.fractopus,tags)
    return this.checkMsgId(msgId);
  }

  
  public async saveFractopusTo0G(req: FractopusSave): Promise<any> {
    return  await this.zeroGService.sendMsg(req);
  }

  public async getFractopus(req: string): Promise<string> {
    const tags = [
      { name: "Action", value: "Get" },
      { name: "uri", value: req },
    ];

    const msg = await this.aoService.dryRunByTags(this.config.process.fractopus,tags);

    if (msg === null) {
      return null;
    }

    if (msg.Messages.length === 0) {
      return null;
    }
    const msgTags = msg.Messages[0] as any;

    if(msgTags.Data===undefined){
      return null;
    }
    if(msgTags.Data===""){
      return "";
    }

    return JSON.parse(msgTags.Data);
  }


  private async checkMsgId(msgId: string): Promise<string> {
    const msg = await this.aoService.readMsg(this.config.process.fractopus,msgId);
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
}