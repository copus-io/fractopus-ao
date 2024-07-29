import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AOService } from 'src/services/ao.service';

@ApiTags('ao')
@Controller("api/ao")
export class AOController {

  constructor(private readonly aoService: AOService) { }

  @Post("sendMsg")
  @ApiOperation({ summary: 'sendMsg', description: 'Returns sendMsg' })
  @ApiQuery({ name: 'action', required: false, description: 'action' })
  @ApiQuery({ name: 'data', required: false, description: 'data' })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  async sendMsg(@Query('action') action:string,@Query('data') data:string): Promise<string> {
    const obj = {
      data: data || "",
    };
    const jsonString = JSON.stringify(obj);
    const resp = await this.aoService.sendMsg(action,jsonString);
    return resp;
  }


  @Get("readMsg")
  @ApiOperation({ summary: 'readMsg', description: 'Returns msg' })
  @ApiQuery({ name: 'messageId', required: false, description: 'messageId' })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  async readMsg(@Query('messageId') messageId:string): Promise<string> {
    const resp = await this.aoService.readMsg(messageId);
    return resp;
  }


  @Get("readMsgByDryrun")
  @ApiOperation({ summary: 'readMsgByDryrun', description: 'Returns msg by dryrun action' })
  @ApiQuery({ name: 'action', required: false, description: 'action' })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  async readMsgByDryrun(@Query('action') action:string): Promise<string> {
    const resp = await this.aoService.dryrun(action);
    return resp;
  }
}
