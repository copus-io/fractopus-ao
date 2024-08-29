import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UrlService } from 'src/services/url.service';

@ApiTags('test')
@Controller("api/v1")
export class HelloController {

  constructor(
    private readonly urlService: UrlService
  ){}


  @Get("getUrlHeader")
  @ApiOperation({ summary: 'getUrlHeader', description: 'getUrlHeader' })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  @ApiQuery({ name: 'url', required: false, description: 'url' })
  async getUrlHeader(@Query('url') url?: string):  Promise<Record<string, any>> {
    return await this.urlService.scrapePage(url);
  }
}
