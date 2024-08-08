import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AOService } from 'src/services/ao.service';
import { DripService } from 'src/services/drip.service';
import { FractopusService } from 'src/services/fractopus.service';
import { DripBurn } from 'src/vo/drip.burn';
import { DripMint } from 'src/vo/drip.mint';
import { DripTransfer } from 'src/vo/drip.transfer';
import { FractopusSave } from 'src/vo/fractopus.save';

@ApiTags('ao')
@Controller("api/ao")
export class AOController {

  constructor(
    private readonly aoService: AOService,
    private readonly fractopusService: FractopusService,
    private readonly dripService: DripService) { }

  @Post("transferDrip")
  @ApiOperation({ summary: 'dripTransfer', description: 'Returns dripTransfer msgId' })
  @ApiBody({ type: DripTransfer })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  public async transferDrip(@Body() req: DripTransfer): Promise<string> {
    const resp = await this.dripService.transferDrip(req.sender, req.recipient, req.amount);
    if (resp === null) {
      throw new HttpException('failed', HttpStatus.BAD_REQUEST);
    }
    return resp;
  }

  @Post("mintDrip")
  @ApiOperation({ summary: 'mintDrip', description: 'Returns mintDrip msgId' })
  @ApiBody({ type: DripMint })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  public async mintDrip(@Body() req: DripMint): Promise<string> {
    const resp = await this.dripService.mintDrip(req.recipient, req.amount);
    if (resp === null) {
      throw new HttpException('failed', HttpStatus.BAD_REQUEST);
    }
    return resp;
  }

  @Post("burnDrip")
  @ApiOperation({ summary: 'burnDrip', description: 'Returns burnDrip msgId' })
  @ApiBody({ type: DripBurn })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  public async burnDrip(@Body() req: DripBurn): Promise<string> {
    const resp = await this.dripService.burnDrip(req.targetUser, req.amount);
    if (resp === null) {
      throw new HttpException('failed', HttpStatus.BAD_REQUEST);
    }
    return resp;
  }

  @Get("balanceOfUser")
  @ApiOperation({ summary: 'balanceOfUser', description: 'Returns msg' })
  @ApiQuery({ name: 'userUUID', required: false, description: 'user uuid' })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  public async balanceOfUser(@Query('userUUID') userUUID: string): Promise<string> {
    return this.dripService.balance(userUUID);
  }


  @Post("saveFractopus")
  @ApiOperation({ summary: 'saveFractopus', description: 'Returns saveFractopus msgId' })
  @ApiBody({ type: FractopusSave })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  public async saveFractopus(@Body() req: FractopusSave): Promise<string> {
    if (!req.uri || req.uri.trim() === "") {
      throw new HttpException('wrong uri', HttpStatus.BAD_REQUEST);
    }
    if (req.src) {
      let totalShr = 0;
      req.src.forEach((item, _) => {
        if (!item.shr || item.shr < 0 || item.shr > 1) {
          throw new HttpException('wrong item shr', HttpStatus.BAD_REQUEST);
        }
        if (!item.uri || item.uri.trim() === "") {
          throw new HttpException('wrong item uri', HttpStatus.BAD_REQUEST);
        }
        totalShr += item.shr;
      });
      if (totalShr < 0 || totalShr > 1) {
        throw new HttpException('wrong shrs', HttpStatus.BAD_REQUEST);
      }
    }

    const resp = await this.fractopusService.saveFractopus(req);
    if (resp === null) {
      throw new HttpException('failed', HttpStatus.BAD_REQUEST);
    }
    return resp;
  }

  @Get("getFractopus")
  @ApiOperation({ summary: 'getFractopus', description: 'Returns msg' })
  @ApiQuery({ name: 'uri', required: false, description: 'uri' })
  @ApiResponse({ status: 200, description: 'Successful response', type: Array })
  public async getFractopus(@Query('uri') uri: string): Promise<any> {
    if (uri === null || uri.trim() === "") {
      throw new HttpException('wrong uri', HttpStatus.BAD_REQUEST);
    }
    const src = await this.fractopusService.getFractopus(uri);
    console.info(src);
    if (src === null) {
      throw new HttpException('failed', HttpStatus.BAD_REQUEST);
    }
    return {src:src};
  }



 

}
