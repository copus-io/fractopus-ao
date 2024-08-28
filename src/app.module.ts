import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WhitelistMiddleware } from './config/config';
import { AOController } from './controllers/ao.controller';
import { HelloController } from './controllers/hello.controller';
import { AOService } from './services/ao.service';
import { CommonService } from './services/common.service';
import { DripService } from './services/drip.service';
import { FractopusService } from './services/fractopus.service';
import { UrlService } from './services/url.service';

@Module({
  imports: [],
  controllers: [
    AOController,
    HelloController
  ],
  providers: [
    DripService,
    CommonService,
    AOService,
    UrlService,

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
