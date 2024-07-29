import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AOService } from 'src/services/ao.service';
import { DripService } from 'src/services/drip.service';

@ApiTags('ao')
@Controller("api/ao")
export class AOController {

  constructor(private readonly aoService: AOService,private readonly dripService: DripService) { }

  @Post("mintDrip")
  @ApiOperation({ summary: 'mintDrip', description: 'Returns mintDrip msgId' })
  @ApiQuery({ name: 'targetUser', required: false, description: 'targetUser' })
  @ApiQuery({ name: 'amount', required: false, description: 'amount' })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  public async mintDrip(@Query('targetUser') targetUser:string,@Query('amount') amount:number): Promise<string> {
    const resp = await this.dripService.mintDrip(targetUser,amount);
    return resp;
  }

  @Post("sendMsg")
  @ApiOperation({ summary: 'sendMsg', description: 'Returns sendMsg' })
  @ApiQuery({ name: 'action', required: false, description: 'action' })
  @ApiQuery({ name: 'data', required: false, description: 'data' })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  public async sendMsg(@Query('action') action:string,@Query('data') data:string): Promise<string> {
    const obj = {
      data: data || "",
    };
    const jsonString = JSON.stringify(obj);
    const tags = [
      { name: "Action", value: action||"hello"},
    ];
    const resp = await this.aoService.sendMsg(tags,jsonString);
    return resp;
  }
  


  @Get("readMsg")
  @ApiOperation({ summary: 'readMsg', description: 'Returns msg' })
  @ApiQuery({ name: 'messageId', required: false, description: 'messageId' })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  public async readMsg(@Query('messageId') messageId:string): Promise<string> {
    const resp = await this.aoService.readMsg(messageId);
    return resp;
  }


  @Get("readMsgByDryrun")
  @ApiOperation({ summary: 'readMsgByDryrun', description: 'Returns msg by dryrun action' })
  @ApiQuery({ name: 'action', required: false, description: 'action' })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  public async readMsgByDryrun(@Query('action') action:string): Promise<string> {
    const resp = await this.aoService.dryrun(action);
    return resp;
  }
}
