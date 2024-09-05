import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FractopusService } from 'src/services/fractopus.service';
import { FractopusSave } from 'src/vo/fractopus.save';

@ApiTags('0g')
@Controller("api/0g")
export class ZeroGController {

  constructor(
    private readonly fractopusService: FractopusService) { }

  @Post("saveFractopus")
  @ApiOperation({ summary: 'saveFractopus', description: 'Returns saveFractopus txId' })
  @ApiBody({ type: FractopusSave })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  public async saveFractopus(@Body() req: FractopusSave): Promise<any> {
    this.checkFractopusData(req);
    const resp = await this.fractopusService.saveFractopusTo0G(req);
    if (resp === null) {
      throw new HttpException('failed', HttpStatus.BAD_REQUEST);
    }
    return resp;
  }

  private checkFractopusData(req: FractopusSave){
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
  }

}
