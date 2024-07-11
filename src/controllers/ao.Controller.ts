import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AOService } from 'src/services/ao.service';

@ApiTags('ao')
@Controller("api/ao")
export class AOController {

  constructor(private readonly aoService: AOService) { }

  @Get("sendMsg")
  @ApiOperation({ summary: 'sendMsg', description: 'Returns sendMsg' })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  async sendMsg(): Promise<string> {
    const resp = await this.aoService.sendMsg();
    return resp;
  }
}
