import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WhitelistMiddleware } from './config/config';
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

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WhitelistMiddleware)
      .forRoutes('*'); // 应用于所有路由
  }
}
