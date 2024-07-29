import { Module } from '@nestjs/common';
import { AOController } from './controllers/ao.controller';
import { HelloController } from './controllers/hello.controller';
import { AOService } from './services/ao.service';
import { DripService } from './services/drip.service';
import { HelloService } from './services/hello.service';

@Module({
  imports: [],
  controllers: [
    HelloController,
    AOController
  ],
  providers: [
    HelloService,
    DripService,
    AOService
  ],
})
export class AppModule {}
