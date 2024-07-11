import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { CommonController } from './controllers/commonController';
import { AOService } from './services/ao.service';
import { AppService } from './services/app.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    CommonController],
  providers: [
    AppService,
    AOService
  ],
})
export class AppModule {}
