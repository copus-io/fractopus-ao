import { Module } from '@nestjs/common';
import { AOController } from './controllers/ao.Controller';
import { AppController } from './controllers/app.controller';
import { AOService } from './services/ao.service';
import { AppService } from './services/app.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    AOController],
  providers: [
    AppService,
    AOService
  ],
})
export class AppModule {}
