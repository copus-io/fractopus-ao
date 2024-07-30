import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WhitelistMiddleware } from './config/config';
import { AOController } from './controllers/ao.controller';
import { AOService } from './services/ao.service';
import { DripService } from './services/drip.service';

@Module({
  imports: [],
  controllers: [
    AOController
  ],
  providers: [
    DripService,
    AOService
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WhitelistMiddleware)
      .forRoutes('*'); // 应用于所有路由
  }
}
