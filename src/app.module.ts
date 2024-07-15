import { Module } from '@nestjs/common';
import { AOController } from './controllers/ao.controller';
import { HelloController } from './controllers/hello.controller';
import { AOService } from './services/ao.service';
import { HelloService } from './services/hello.service';

@Module({
  imports: [],
  controllers: [
    HelloController,
    AOController
  ],
  providers: [
    HelloService,
    AOService
  ],
})
export class AppModule {}
