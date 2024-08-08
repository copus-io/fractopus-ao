import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WhitelistMiddleware } from './config/config';
import { AOController } from './controllers/ao.controller';
import { AOService } from './services/ao.service';
import { CommonService } from './services/common.service';
import { DripService } from './services/drip.service';
import { FractopusService } from './services/fractopus.service';

@Module({
  imports: [],
  controllers: [
    AOController
  ],
  providers: [
    DripService,
    CommonService,
    AOService,
    FractopusService
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WhitelistMiddleware)
      .forRoutes('*'); 
  }
}
