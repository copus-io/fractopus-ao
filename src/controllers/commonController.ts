import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from '../services/app.service';

@ApiTags('test2')
@Controller("api/v1")
export class CommonController {

  constructor(private readonly appService: AppService) {}

  @Get("hello2")
  @ApiOperation({ summary: 'Get hello message', description: 'Returns a greeting message' })
  @ApiResponse({ status: 200, description: 'Successful response', type: String })
  @ApiQuery({ name: 'name', required: false, description: 'Name of the person to greet' })
  getHello(@Query('name') name?: string): string {
    console.log(name);
    return this.appService.getHello(name);
  }
}