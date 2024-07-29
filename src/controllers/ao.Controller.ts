import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AOService } from 'src/services/ao.service';

@ApiTags('ao')
@Controller("api/ao")
export class AOController {

  constructor(private readonly aoService: AOService) { }

  @Get("sendMsg")
  @ApiOperation({ summary: 'sendMsg', description: 'Returns sendMsg' })
  @ApiQuery({ name: 'data', required: false, description: 'data' })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  async sendMsg(@Query('data') data:string): Promise<string> {
    const obj = {
      data: data || "",
    };
    const jsonString = JSON.stringify(obj);
    const resp = await this.aoService.sendMsg("ping",jsonString);
    return resp;
  }
}
