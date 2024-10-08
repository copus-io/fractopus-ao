import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WhitelistMiddleware } from './config/config';
import { AOController } from './controllers/ao.controller';
import { UrlController } from './controllers/url.controller';
import { ZeroGController } from './controllers/zerog.Controller';
import { AOService } from './services/ao.service';
import { CommonService } from './services/common.service';
import { DripService } from './services/drip.service';
import { FractopusService } from './services/fractopus.service';
import { UrlService } from './services/url.service';
import { ZeroGService } from './services/zerog.service';

@Module({
  imports: [],
  controllers: [
    AOController,
    ZeroGController,
    UrlController
  ],
  providers: [
    DripService,
    CommonService,
    AOService,
    UrlService,
    ZeroGService,
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
