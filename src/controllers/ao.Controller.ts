import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AOService } from 'src/services/ao.service';
import { DripService } from 'src/services/drip.service';
import { DripBurn } from 'src/vo/drip.burn';
import { DripMint } from 'src/vo/drip.mint';
import { DripTransfer } from 'src/vo/drip.transfer';

@ApiTags('ao')
@Controller("api/ao")
export class AOController {

  constructor(private readonly aoService: AOService, private readonly dripService: DripService) { }

  @Post("transferDrip")
  @ApiOperation({ summary: 'dripTransfer', description: 'Returns dripTransfer msgId' })
  @ApiBody({ type: DripTransfer })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  public async transferDrip(@Body() req: DripTransfer): Promise<string> {
    const resp = await this.dripService.transferDrip(req.sender, req.recipient, req.amount);
    return resp;
  }

  @Post("mintDrip")
  @ApiOperation({ summary: 'mintDrip', description: 'Returns mintDrip msgId' })
  @ApiBody({ type: DripMint })
  @ApiQuery({ name: 'amount', required: false, description: 'amount' })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  public async mintDrip(@Body() req: DripMint): Promise<string> {
    const resp = await this.dripService.mintDrip(req.recipient, req.amount);
    console.info(resp);
    return resp;
  }

  @Post("burnDrip")
  @ApiOperation({ summary: 'burnDrip', description: 'Returns burnDrip msgId' })
  @ApiBody({ type: DripBurn })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  public async burnDrip(@Body() req: DripBurn): Promise<string> {
    const resp = await this.dripService.burnDrip(req.targetUser, req.amount);
    return resp;
  }


  @Get("readMsg")
  @ApiOperation({ summary: 'readMsg', description: 'Returns msg' })
  @ApiQuery({ name: 'messageId', required: false, description: 'messageId' })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  public async readMsg(@Query('messageId') messageId: string): Promise<string> {
    const resp = await this.aoService.readMsg(messageId);
    return resp;
  }

  @Get("balanceOfUser")
  @ApiOperation({ summary: 'balanceOfUser', description: 'Returns msg' })
  @ApiQuery({ name: 'userUUID', required: false, description: 'user uuid' })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  public async balanceOfUser(@Query('userUUID') userUUID: string): Promise<string> {
    const resp = await this.dripService.balance(userUUID);
    return resp;
  }


  @Get("readMsgByDryRun")
  @ApiOperation({ summary: 'readMsgByDryRun', description: 'Returns msg by dryrun action' })
  @ApiQuery({ name: 'action', required: false, description: 'action' })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  public async readMsgByDryRun(@Query('action') action: string): Promise<string> {
    const resp = await this.aoService.dryRun(action);
    return resp;
  }
}
